from pathlib import Path

from utils.common.export import export_dataset
from utils.common.html_md import fetch_full_markdown_if_missing
from utils.common.paths import raw_dir
from utils.common.schemas import GameMeta
from utils.games.grand_theft_auto_vi import chapters, images, missions, story, trophies
from utils.games.grand_theft_auto_vi.constants import GAME, LINKS, NAME, SOURCE_URLS, SOURCES
from utils.games.grand_theft_auto_vi.schemas import StoryDataset


DISCREPANCIES = [
    "Story length: GTABase says about 50 to 80 hours, PowerPyx says 60 to 80.",
    "Mission count: GTABase lists 122 story entries (119 main missions plus a few short story tasks); other outlets count around 91 to 93 main missions. "
    "This guide numbers the 119 main missions in GTABase order. Missions can show up in a slightly different order in your game.",
    "Last chapter: the PowerPyx roadmap says both Top Of The World, Ma and You Gotta Know When to Get Off unlock with Starting From Zero in Chapter 4, "
    "but its own walkthrough (and GTABase) has a Chapter 5 that ends with The End of the Road. The trophy list says Complete Chapter 4 and Complete the final mission, "
    "so this guide ties the second one to the last mission of Chapter 5.",
]


def run() -> list[Path]:
    """fetch (.md -> data/raw) -> process -> JSONs em frontend/public/data/grand-theft-auto-vi."""
    # html_md (e não trafilatura): mantém títulos, tabelas e imagens das páginas.
    for name, url in SOURCE_URLS.items():
        fetch_full_markdown_if_missing(url, raw_dir(GAME) / name)
    print(f"[{GAME}] fontes em {raw_dir(GAME)}")
    for source, not_yet in missions.fetch().items():
        if not_yet:
            print(f"[{GAME}] {source}: missões sem página ainda (404): {', '.join(not_yet)}")

    trophy_data = trophies.dataset(trophies.markdown())
    mission_list, unmatched = story.build()
    if unmatched:
        print(f"[{GAME}] missões do GTABase sem par no PowerPyx: {', '.join(unmatched)}")
    images.characters()
    images.icons()
    return [
        export_dataset(GAME, "meta.json", GameMeta(name=NAME, sources=SOURCES, links=LINKS)),
        export_dataset(GAME, "story.json", StoryDataset(chapters=chapters.build(trophy_data.trophies), missions=mission_list, discrepancies=DISCREPANCIES)),
        export_dataset(GAME, "trophies.json", trophy_data),
    ]
