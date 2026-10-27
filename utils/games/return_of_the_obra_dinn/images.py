"""Retratos dos 60 tripulantes, o sketch em alta e os ícones de troféus.
Os retratos da Steam (~200x270, JPEG com ruído) são redesenhados em 2 cores (a arte original é 1-bit) e salvos em WebP sem perdas;
o sketch (`sketch-hq.png`, enviado pelo usuário em data/raw) só muda de formato. O total precisa caber em `BUDGET` bytes."""

from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image

from utils.common.http import fetch_file_if_missing
from utils.common.paths import assets_dir, raw_dir
from utils.games.return_of_the_obra_dinn.constants import GAME
from utils.games.return_of_the_obra_dinn.crew import Raw

BUDGET = 500_000  # bytes, todas as imagens do jogo
SKETCH_SRC = "sketch-hq.png"
SKETCH = "sketch.webp"
DARK, LIGHT = (51, 51, 25), (229, 255, 254)  # as duas cores da arte do jogo


def folder_size() -> int:
    return sum(f.stat().st_size for f in assets_dir(GAME).rglob("*") if f.is_file())


def two_colors(src: Path, dest: Path) -> None:
    gray = Image.open(src).convert("L")
    out = Image.new("RGB", gray.size, LIGHT)
    out.paste(Image.new("RGB", gray.size, DARK), mask=gray.point(lambda v: 255 if v < 128 else 0))
    dest.parent.mkdir(parents=True, exist_ok=True)
    out.save(dest, "WEBP", lossless=True, method=6)


def portraits(crew: list[Raw]) -> dict[str, str]:
    """Baixa os retratos (cache em data/raw) e devolve id -> caminho relativo a public/."""
    cache = raw_dir(GAME) / "images"
    out_dir = assets_dir(GAME) / "crew"
    with ThreadPoolExecutor(8) as pool:
        list(pool.map(lambda c: fetch_file_if_missing(c.portrait_url, cache / f"{c.id}.jpg"), crew))
    for c in crew:
        two_colors(cache / f"{c.id}.jpg", out_dir / f"{c.id}.webp")
    return {c.id: f"games/{GAME}/crew/{c.id}.webp" for c in crew}


def sketch() -> tuple[str, int, int]:
    """Converte o sketch para WebP sem perdas (3 cores, cerca de 60 KB). Devolve (caminho, largura, altura)."""
    src = Image.open(raw_dir(GAME) / SKETCH_SRC).convert("RGB")
    dest = assets_dir(GAME) / SKETCH
    dest.parent.mkdir(parents=True, exist_ok=True)
    src.save(dest, "WEBP", lossless=True, method=6)
    return f"games/{GAME}/{SKETCH}", src.width, src.height
