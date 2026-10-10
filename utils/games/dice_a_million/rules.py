"""Desafios, Powers, alvos por rodada, packs e paradas do mapa, lidos do db.json do jogo."""

import re

from utils.games.dice_a_million.catalog import copy_sprite, item_names, load_db
from utils.games.dice_a_million.roadmap import start_kit
from utils.games.dice_a_million.schemas import Challenge, MapStop, Pack, Power, Rules, Target

ROMAN = ["", "I", "II", "III", "IV", "V", "VI"]
GEMS = ["Amethyst", "Sapphire", "Emerald", "Amber", "Ruby", "Jet"]  # Powers I a VI (dados que o jogo libera ao vencer neles)
UNNAMED_MAP_STOPS = {"none", "ringbooster", "boss", "roundelite", "bossrush", "staticshop"}  # bossrush e staticshop têm texto próprio no roadmap

TARGET_NOTES = [
    "From Power IV, targets grow faster: the second column below. It applies from level 2 on.",
    "Boss rounds multiply the target by the boss's Target chip (The Greedy, empowered, doubles it again).",
    "Rerolling a boss makes every later round target 1.5x higher.",
    "Dice Rush and the Blackjack challenge use a third of the normal target.",
]
PACK_NOTES = [
    "Faces 4 to 6, the phone and skip rewards use the second column.",
    "Special card packs need at least 3 of the 8 special cards unlocked.",
    "Rare dice packs never show up in “I can't believe it's not a D6”, and ring packs never show up in Ringless.",
]


def requirement(req: dict[str, object]) -> str:
    match req["type"]:
        case "power":
            return f"Beat Face 3 on Power {ROMAN[int(req['value'])]} with any hand"  # type: ignore[call-overload]
        case "completion":
            return "Beat Face 6 with any hand"
        case _:
            return str(req["name"])


def build_rules(icons: dict[str, str]) -> Rules:
    """`icons`: nome da conquista -> caminho do ícone (os desafios têm uma conquista cada)."""
    db = load_db()
    names = item_names(db)
    hands = {str(h["id"]): str(h["name"]) for h in db["hands"]}
    bosses = {str(b["id"]): str(b["name"]) for b in db["bosses"]}
    run = db["run"][0]
    gem_sprites = {str(d["name"]): str(d["sprite"]) for d in db["dice"] if d["name"] in GEMS}

    challenges = [
        Challenge(
            name=str(c["name"]),
            icon=icons.get(str(c["name"])),
            rules=[r.strip() for r in re.split(r"(?:^|\s)-\s", str(c["description"])) if r.strip()],
            hand=hands[str(c["char"])],
            kit=start_kit(c, names),  # type: ignore[arg-type]
            final_face=int(c["final_face"]),  # type: ignore[call-overload]
            requires=[requirement(r) for r in c["requires"]],  # type: ignore[attr-defined]
            banned=f"Never appears: {', '.join(bosses[b] for b in c['banned_bosses'])}." if c["banned_bosses"] else None,
        )
        for c in db["challenges"]
    ]
    powers = [
        Power(
            level=ROMAN[int(d["id"])],  # type: ignore[call-overload]
            effect=str(d["description"]),
            alt=d.get("alt_desc"),  # type: ignore[arg-type]
            gem=GEMS[int(d["id"]) - 1],  # type: ignore[call-overload]
            gem_icon=copy_sprite(gem_sprites[GEMS[int(d["id"]) - 1]]),  # type: ignore[call-overload]
        )
        for d in db["difficulties"]
        if d["id"]
    ]
    targets = [
        Target(face=t["face"], round=t["round"], target=t["target"], hard=t["target_hard"], boss=t["boss"])
        for t in run["targets"]
    ]
    early = sum(int(p["weight"]) for p in db["packs"])
    late = sum(int(p["weight_late"]) for p in db["packs"])
    packs = [
        Pack(
            name=str(p["name"]), effect=str(p["description"]),
            early=round(100 * int(p["weight"]) / early), late=round(100 * int(p["weight_late"]) / late),
        )
        for p in db["packs"]
        if p.get("name")
    ]
    stops = [
        MapStop(name=str(m["name"]), effect=str(m["description"]))
        for m in db["map_points"]
        if m.get("name") and m["id"] not in UNNAMED_MAP_STOPS
    ]
    return Rules(
        challenges=challenges, powers=powers, targets=targets, target_notes=TARGET_NOTES,
        packs=packs, pack_notes=PACK_NOTES, map_stops=stops,
    )
