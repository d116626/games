from pathlib import Path

from utils.common.export import export_dataset
from utils.common.paths import raw_dir
from utils.common.schemas import GameMeta
from utils.common.sources import fetch_sources
from utils.games.dice_a_million.catalog import build_catalog
from utils.games.dice_a_million.constants import GAME, NAME, SOURCE_URLS, SOURCES
from utils.games.dice_a_million.guides_md import (
    parse_bestiary,
    parse_community_achievements,
    wiki_category,
    wiki_condition,
    wiki_sections,
)
from utils.games.dice_a_million.roadmap import build_roadmap
from utils.games.dice_a_million.schemas import (
    Achievement,
    Achievements,
    Bestiary,
    Boss,
    Category,
    Enchantment,
    EnemyDie,
)
from utils.games.dice_a_million.steam import download_icons, download_images, fetch_achievements
from utils.games.dice_a_million.strategy import STRATEGY

RING_WORDS = ("Ring", "Charm", "Stone", "Amulet", "Chain", "Band", "Watch", "Jewel", "Wrap", "Sticker", "Medal", "Mark")
MD_SECTIONS = {"dice": "dice", "rings": "rings", "hands": "hands", "cards": "cards"}


def categorize(name: str, how: str | None, md_section: str, wiki: dict[str, str]) -> Category:
    if name.endswith("Hand"):
        return "hands"
    if how and how.startswith("Complete the challenge"):
        return "challenges"
    if "Vortex" in name:
        return "vortex"
    if found := wiki_category(name, wiki):
        return found  # type: ignore[return-value]
    for key, value in MD_SECTIONS.items():
        if key in md_section:
            return value  # type: ignore[return-value]
    if name.endswith("Card") or (how and how.startswith("Beat Dice Rush")):
        return "cards"
    if name.endswith(RING_WORDS):
        return "rings"
    return "secrets" if not how else "dice"


def build_achievements() -> list[Achievement]:
    steam = fetch_achievements()
    download_icons(steam)
    community = parse_community_achievements()
    wiki = wiki_sections()
    items: list[Achievement] = []
    for s in steam:
        md_section, md_desc, md_detail = community.get(s.name, ("", "", ""))
        hidden_in_md = md_desc.startswith("Hidden achievement")
        how = s.description or (md_detail if hidden_in_md else md_desc) or wiki_condition(s.name, wiki) or None
        tip = md_detail if md_detail and md_detail != how and (s.description or not hidden_in_md) else None
        category = categorize(s.name, how, md_section, wiki)
        items.append(
            Achievement(
                id=s.id, name=s.name, category=category, how=how, tip=tip,
                rarity=s.rarity, icon=f"games/{GAME}/achievements/{s.id}.jpg",
            )
        )
    return items


def build_bestiary() -> Bestiary:
    bosses, empowered, enemy, enchants = parse_bestiary()
    return Bestiary(
        bosses=[Boss(name=f"The {n}", effect=e, empowered=empowered.get(n)) for n, e in bosses.items()],
        enemy_dice=[EnemyDie(name=n, effect=e) for n, e in enemy.items()],
        enchantments=[Enchantment(name=n, effect=e, applies_to=t) for n, e, t in enchants],  # type: ignore[arg-type]
    )


def run() -> list[Path]:
    """fetch (.md -> data/raw) -> process -> JSONs em frontend/public/data/dice-a-million."""
    fetch_sources(GAME, SOURCE_URLS)
    print(f"[{GAME}] sources in {raw_dir(GAME)}")
    achievements = build_achievements()
    images = download_images()
    return [
        export_dataset(GAME, "meta.json", GameMeta(name=NAME, sources=SOURCES, images=images)),
        export_dataset(GAME, "achievements.json", Achievements(items=achievements)),
        export_dataset(GAME, "catalog.json", build_catalog()),
        export_dataset(GAME, "roadmap.json", build_roadmap(achievements)),
        export_dataset(GAME, "bestiary.json", build_bestiary()),
        export_dataset(GAME, "strategy.json", STRATEGY),
    ]
