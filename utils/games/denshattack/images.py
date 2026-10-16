"""Imagens dos spots de latas, engrenagens e filmes (as de dares e lojas ficam de fora: o texto basta).
Os originais (2500 px, ~290 KB, com a marca d'água do 100pguides) são baixados para data/raw (não
versionado) e reduzidos para WebP. O total precisa caber em `BUDGET` bytes."""

import hashlib
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image

from utils.common.http import fetch_file_if_missing
from utils.common.paths import assets_dir, raw_dir
from utils.games.denshattack.constants import GAME
from utils.games.denshattack.schemas import Level

WIDTH = 400
QUALITY = 45
BUDGET = 5_000_000  # bytes, todos os arquivos de imagem do jogo (spots, skins e ícones de troféus)


def folder_size() -> int:
    return sum(f.stat().st_size for f in assets_dir(GAME).rglob("*") if f.is_file())


def shrink(src: Path, dest: Path) -> int:
    im = Image.open(src).convert("RGB")
    if im.width > WIDTH:  # nunca amplia
        im = im.resize((WIDTH, round(im.height * WIDTH / im.width)), Image.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "WEBP", quality=QUALITY, method=6)
    return dest.stat().st_size


def build(levels: list[Level], urls: dict[str, list[list[str]]]) -> int:
    """Preenche `spot.images` e grava os WebP em public/games/denshattack/spots. Devolve o total em bytes."""
    cache = raw_dir(GAME) / "images"
    out_dir = assets_dir(GAME) / "spots"
    jobs: list[tuple[str, Path, Path]] = []  # (url, original, destino)
    for level in levels:
        for k, (spot, spot_urls) in enumerate(zip(level.spots, urls[level.code])):
            if all(i.kind == "dare" for i in spot.items):
                continue
            for j, url in enumerate(spot_urls):
                name = f"{level.code}-{k + 1}" + (f"-{j + 1}" if len(spot_urls) > 1 else "") + ".webp"
                jobs.append((url, cache / f"{hashlib.sha1(url.encode()).hexdigest()[:16]}.webp", out_dir / name))
                spot.images.append(f"games/{GAME}/spots/{name}")
    with ThreadPoolExecutor(8) as pool:
        list(pool.map(lambda job: fetch_file_if_missing(job[0], job[1]), jobs))
    total = sum(shrink(src, dest) for _, src, dest in jobs)
    wanted = {dest.name for _, _, dest in jobs}
    for stale in out_dir.glob("*.webp"):  # sobras de execuções anteriores
        if stale.name not in wanted:
            stale.unlink()
    return total
