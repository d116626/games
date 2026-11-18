from pathlib import Path

from utils.common.export import export_dataset
from utils.common.html_md import fetch_full_markdown_if_missing
from utils.common.paths import raw_dir
from utils.common.schemas import GameMeta
from utils.games.grand_theft_auto_vi import trophies
from utils.games.grand_theft_auto_vi.constants import GAME, LINKS, NAME, SOURCE_URLS, SOURCES


def run() -> list[Path]:
    """fetch (.md -> data/raw) -> process -> JSONs em frontend/public/data/grand-theft-auto-vi."""
    # html_md (e não trafilatura): mantém títulos, tabelas e imagens das páginas.
    for name, url in SOURCE_URLS.items():
        fetch_full_markdown_if_missing(url, raw_dir(GAME) / name)
    print(f"[{GAME}] fontes em {raw_dir(GAME)}")

    return [
        export_dataset(GAME, "meta.json", GameMeta(name=NAME, sources=SOURCES, links=LINKS)),
        export_dataset(GAME, "trophies.json", trophies.dataset(trophies.markdown())),
    ]
