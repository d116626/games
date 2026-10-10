import re
from datetime import date
from pathlib import Path

from utils.common.export import export_dataset
from utils.common.paths import raw_dir
from utils.common.schemas import GameMeta
from utils.common.sources import fetch_sources
from utils.games.dice_a_million.bosses import TIPS
from utils.games.dice_a_million.catalog import build_catalog, copy_sprite, load_db, unlock_text
from utils.games.dice_a_million.constants import GAME, NAME, SOURCE_URLS, SOURCES
from utils.games.dice_a_million.guides_md import parse_community_achievements
from utils.games.dice_a_million.roadmap import build_roadmap
from utils.games.dice_a_million.rules import build_rules
from utils.games.dice_a_million.schemas import (
    Achievement,
    Achievements,
    Bestiary,
    Boss,
    Category,
    Enchantment,
    EnemyDie,
    FinalBoss,
    FinalBossAttack,
)
from utils.games.dice_a_million.steam import download_icons, download_images, fetch_achievements
from utils.games.dice_a_million.strategy import STRATEGY

RING_WORDS = ("Ring", "Charm", "Stone", "Amulet", "Chain", "Band", "Watch", "Jewel", "Wrap", "Sticker", "Medal", "Mark")
MD_SECTIONS = {"dice": "dice", "rings": "rings", "hands": "hands", "cards": "cards"}


def categorize(name: str, how: str | None, md_section: str) -> Category:
    if name.endswith("Hand"):
        return "hands"
    if how and how.startswith("Complete the challenge"):
        return "challenges"
    if "Vortex" in name:
        return "vortex"
    for key, value in MD_SECTIONS.items():
        if key in md_section:
            return value  # type: ignore[return-value]
    if name.endswith("Card") or (how and how.startswith("Beat Dice Rush")):
        return "cards"
    if name.endswith(RING_WORDS):
        return "rings"
    return "secrets" if not how else "dice"


# Conquistas sem item no jogo (`misc_*` no db, só com o texto de como obter) -> nome na Steam. O jogo não liga os dois:
# o par vem do código (quando dispara) e do sentido do texto. `misc_jdie` não entra: o J's Die já tem texto próprio.
MISC_NAMES: dict[str, tuple[str, Category]] = {
    "misc_vortex": ("The Vortex", "vortex"),
    "misc_vortex1": ("Vortex Apprentice", "vortex"),
    "misc_vortex2": ("Vortex Local", "vortex"),
    "misc_vortex3": ("Vortex Master", "vortex"),
    "misc_piece1": ("First Piece", "secrets"),
    "misc_piece2": ("Second Piece", "secrets"),
    "misc_final": ("All You Can Dice", "secrets"),
    "misc_hollownumber": ("This number doesn't exist", "secrets"),
    "misc_hollowcall": ("Message from the past", "secrets"),
}


# Nomes que não casam com nada no jogo, escritos à mão: "???" é o desafio oculto "??????????" (exige o Static Die) e
# "IKH)(&$%" é a Hollow Hand, cujo texto de desbloqueio no jogo é "???".
MANUAL: dict[str, tuple[Category, str]] = {
    "???": ("challenges", "Win the “??????????” challenge (it unlocks with the Static Die)."),
    "IKH)(&$%": ("hands", "Unlock the Hollow Hand: win a round with an empty bag, then show a Hollow die to the Phone Guy."),
}


def norm(name: str) -> str:
    return re.sub(r"[^a-z0-9]", "", name.lower())


def game_unlocks() -> dict[str, tuple[Category, str]]:
    """{nome normalizado: (categoria, como desbloquear)} dos itens e desafios que dão conquista, direto do jogo."""
    db = load_db()
    found: dict[str, tuple[Category, str]] = {}
    for key, category in (
        ("dice", "dice"), ("dice_hidden", "dice"), ("rings", "rings"), ("rings_hidden", "rings"),
        ("cards", "cards"), ("cards_hidden", "cards"), ("hands", "hands"), ("challenges", "challenges"),
    ):
        for entry in db[key]:
            text = unlock_text(entry)
            if entry.get("achievement") and text and norm(str(entry["name"])) and re.search(r"[A-Za-z]", str(text).replace("?", "")):
                found[norm(str(entry["name"]))] = (category, text)  # type: ignore[assignment]
    for entry in db["achievements"]:
        if (misc := MISC_NAMES.get(str(entry["id"]))) and entry.get("how"):
            found[norm(misc[0])] = (misc[1], str(entry["how"]))
    return found


def build_achievements() -> list[Achievement]:
    steam = fetch_achievements()
    game = game_unlocks()
    download_icons(steam)
    community = parse_community_achievements()
    items: list[Achievement] = []
    for s in steam:
        md_section, md_desc, md_detail = community.get(s.name, ("", "", ""))
        hidden_in_md = md_desc.startswith("Hidden achievement")
        how = s.description or (md_detail if hidden_in_md else md_desc) or None
        tip = md_detail if md_detail and md_detail != how and (s.description or not hidden_in_md) else None
        category = categorize(s.name, how, md_section)
        if official := MANUAL.get(s.name) or game.get(norm(s.name)):  # o jogo manda: categoria do item e texto de desbloqueio sem erros de digitação
            category, text = official
            if how and how != text and how.lower().startswith(text.lower().rstrip(".")):
                extra = how[len(text.rstrip(".")) :].lstrip("!. ")  # explicação a mais que a conquista já trazia
                tip = tip or extra or None
            how = text
        items.append(
            Achievement(
                id=s.id, name=s.name, category=category, how=how, tip=tip,
                rarity=s.rarity, icon=f"games/{GAME}/achievements/{s.id}.jpg",
            )
        )
    return items


def boss_bans(db: dict[str, list[dict[str, object]]]) -> dict[str, list[str]]:
    """{id do chefe: onde ele nunca aparece}: Dice Rush (tag norush), mãos e desafios com `banned_bosses`."""
    bans: dict[str, list[str]] = {}
    for boss in db["bosses"]:
        if "norush" in (boss.get("tags") or []):  # type: ignore[operator]
            bans.setdefault(str(boss["id"]), []).append("Dice Rush")
    for hand in db["hands"]:
        for boss in hand.get("banned_bosses", []):  # type: ignore[attr-defined]
            bans.setdefault(boss, []).append(f"{hand['name']} runs")
    for challenge in db["challenges"]:
        for boss in challenge.get("banned_bosses", []):  # type: ignore[attr-defined]
            bans.setdefault(boss, []).append(f"the “{challenge['name']}” challenge")
    return bans


def final_boss_attacks(final: dict[str, object], dice: dict[str, str]) -> list[FinalBossAttack]:
    attacks: list[dict[str, object]] = final["attacks"]  # type: ignore[assignment]
    total = sum(int(a["weight"]) for a in attacks)  # type: ignore[call-overload]
    return [
        FinalBossAttack(
            chance=round(100 * int(a["weight"]) / total),  # type: ignore[call-overload]
            dice=[
                f"{d['quantity']} {dice[str(d['id'])]}" + (f" ({str(d['enchant']).title()})" if d.get("enchant") else "")
                for d in a["dice"]  # type: ignore[attr-defined]
            ],
        )
        for a in attacks
    ]


def build_bestiary() -> Bestiary:
    db = load_db()
    bans = boss_bans(db)
    final = db["final_boss"][0]
    boss_names = {str(b["id"]): str(b["name"]) for b in db["bosses"]}
    dice_names = {str(d["id"]): str(d["name"]) for k in ("dice", "dice_hidden") for d in db[k] if "name" in d}
    boss = db["bosses_hidden"][-1]
    return Bestiary(
        bosses=[
            Boss(
                name=(name := str(b["name"])), icon=copy_sprite(str(b["sprite"])), effect=str(b["description"]),
                empowered=str(b["plus_description"]),
                target_mod=mod if (mod := b.get("target_mod")) != 1 else None,  # type: ignore[arg-type]
                tips=TIPS.get(name), banned=f"Never appears in: {', '.join(bans[str(b['id'])])}." if str(b["id"]) in bans else None,
            )
            for b in db["bosses"]
        ],
        final_boss=FinalBoss(
            name=str(boss["name"]), icon=copy_sprite(str(boss["sprite"])), effect=str(boss["description"]),
            hp=int(final["hp"]), phase_two_hp=int(final["phase_two_hp"]),  # type: ignore[call-overload]
            phase_two_bosses=[boss_names[str(i)] for i in final["phase_two_bosses"]],  # type: ignore[attr-defined]
            attacks=final_boss_attacks(final, dice_names),
        ),
        enemy_dice=[
            EnemyDie(name=str(d["name"]), effect=str(d["description"]), icon=copy_sprite(str(d["sprite"])))
            for d in db["dice_hidden"]
            if "boss" in (d.get("tags") or [])  # type: ignore[operator]
        ],
        enchantments=[
            Enchantment(name=str(e["name"]), effect=str(e["description"]), applies_to=kind)  # type: ignore[arg-type]
            for kind, key in (("die", "enchants"), ("ring", "ring_enchants"))
            for e in db[key]
            if e["name"] != "???"
        ],
        curses=[EnemyDie(name=str(c["name"]), effect=str(c["description"])) for c in db["curses"]],
    )


def run() -> list[Path]:
    """fetch (.md -> data/raw) -> process -> JSONs em frontend/public/data/dice-a-million."""
    fetch_sources(GAME, SOURCE_URLS)
    print(f"[{GAME}] sources in {raw_dir(GAME)}")
    achievements = build_achievements()
    images = download_images()
    catalog = build_catalog()
    icons = {a.name: a.icon for a in achievements} | {"??????????": next(a.icon for a in achievements if a.name == "???")}
    return [
        export_dataset(GAME, "meta.json", GameMeta(name=NAME, updated=date.today().isoformat(), sources=SOURCES, images=images)),
        export_dataset(GAME, "achievements.json", Achievements(items=achievements)),
        export_dataset(GAME, "catalog.json", catalog),
        export_dataset(GAME, "roadmap.json", build_roadmap(achievements, catalog.items)),
        export_dataset(GAME, "bestiary.json", build_bestiary()),
        export_dataset(GAME, "strategy.json", STRATEGY),
        export_dataset(GAME, "rules.json", build_rules(icons)),
    ]
