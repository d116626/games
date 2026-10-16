from datetime import date
from pathlib import Path

from utils.common.export import export_dataset
from utils.common.html_md import fetch_full_markdown_if_missing
from utils.common.paths import raw_dir
from utils.common.schemas import GameMeta
from utils.games.mewgenics import breeding, classes, route, start, trophies
from utils.games.mewgenics.constants import GAME, LINKS, NAME, SOURCE_URLS, SOURCES


def run() -> list[Path]:
    """fetch (.md -> data/raw) -> process -> JSONs em frontend/public/data/mewgenics."""
    # html_md (e não trafilatura): mantém títulos, tabelas e imagens das páginas da Steam.
    for name, url in SOURCE_URLS.items():
        fetch_full_markdown_if_missing(url, raw_dir(GAME) / name)
    print(f"[{GAME}] fontes em {raw_dir(GAME)}")
    meta = GameMeta(name=NAME, updated=date.today().isoformat(), sources=SOURCES, links=LINKS)
    return [
        export_dataset(GAME, "meta.json", meta),
        export_dataset(GAME, "trophies.json", trophies.build()),
        export_dataset(GAME, "start.json", start.build()),
        export_dataset(GAME, "breeding.json", breeding.build()),
        export_dataset(GAME, "classes.json", classes.build()),
        export_dataset(GAME, "route.json", route.build()),
    ]
