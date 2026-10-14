from datetime import date
from pathlib import Path

from utils.common.export import export_dataset
from utils.common.paths import raw_dir
from utils.common.schemas import GameMeta
from utils.common.sources import fetch_sources
from utils.games.blood_of_dawnwalker import court, endings, route, skills, tips, trophies
from utils.games.blood_of_dawnwalker.constants import GAME, LINKS, NAME, SOURCE_URLS, SOURCES


def run() -> list[Path]:
    """fetch (.md -> data/raw) -> process -> JSONs em frontend/public/data/blood-of-dawnwalker."""
    fetch_sources(GAME, SOURCE_URLS)
    print(f"[{GAME}] fontes em {raw_dir(GAME)}")
    meta = GameMeta(name=NAME, updated=date.today().isoformat(), sources=SOURCES, links=LINKS)
    return [
        export_dataset(GAME, "meta.json", meta),
        export_dataset(GAME, "trophies.json", trophies.build()),
        export_dataset(GAME, "endings.json", endings.build()),
        export_dataset(GAME, "court.json", court.build()),
        export_dataset(GAME, "skills.json", skills.build()),
        export_dataset(GAME, "route.json", route.build()),
        export_dataset(GAME, "tips.json", tips.build()),
    ]
