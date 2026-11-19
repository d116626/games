"""Imagens do guia: retratos dos protagonistas (GTABase) e os ícones do mapa (folha do r/GTA6, cortada em 49 arquivos)."""

from PIL import Image, ImageChops, ImageDraw

from utils.common.http import fetch_file_if_missing
from utils.common.paths import assets_dir, raw_dir
from utils.games.grand_theft_auto_vi.constants import GAME

CHARACTERS = {
    "jason": "https://www.gtabase.com/images/gta-6/characters/protagonists/resized/jason_60x78.jpg",
    "lucia": "https://www.gtabase.com/images/gta-6/characters/protagonists/resized/lucia_60x78.jpg",
}


def characters() -> dict[str, str]:
    """Baixa os dois retratos (60x78) e devolve id -> caminho relativo a public/."""
    for name, url in CHARACTERS.items():
        fetch_file_if_missing(url, assets_dir(GAME) / "characters" / f"{name}.jpg")
    return {name: f"games/{GAME}/characters/{name}.jpg" for name in CHARACTERS}


ICON_SHEET = "reddit/gta6_icons.jpeg"
ICON_SIZE = 96
# Limites das 7 colunas e 7 linhas da folha (876x878), medidos pelo contorno de cada ícone.
ICON_COLS = [(25, 131), (141, 249), (260, 363), (378, 481), (495, 598), (612, 716), (725, 832)]
ICON_ROWS = [(35, 136), (152, 253), (269, 371), (385, 491), (503, 609), (623, 724), (739, 845)]
SHEET_BG = (232, 232, 232)


def icons() -> list[str]:
    """Corta a folha em `icons/01.webp`..`49.webp` (da esquerda para a direita, de cima para baixo), 96x96 com fundo transparente.
    As 6 primeiras linhas são ladrilhos de cantos arredondados; a última são silhuetas soltas, sem moldura."""
    sheet = Image.open(raw_dir(GAME) / ICON_SHEET).convert("RGB")
    out_dir = assets_dir(GAME) / "icons"
    out_dir.mkdir(parents=True, exist_ok=True)
    paths = []
    for r, (y0, y1) in enumerate(ICON_ROWS):
        for c, (x0, x1) in enumerate(ICON_COLS):
            cx, cy, half = (x0 + x1) // 2, (y0 + y1) // 2, 55
            cell = sheet.crop((cx - half, cy - half, cx + half, cy + half)).convert("RGBA")
            # o fundo da folha é um cinza liso: pinta de magenta o que está ligado às bordas e vira transparente
            flood = cell.convert("RGB")
            for seed in [(0, 0), (2 * half - 1, 0), (0, 2 * half - 1), (2 * half - 1, 2 * half - 1)]:
                ImageDraw.floodfill(flood, seed, (255, 0, 255), thresh=34)
            background = ImageChops.difference(flood, cell.convert("RGB")).convert("L").point(lambda v: 255 if v > 0 else 0)
            alpha = ImageChops.invert(background)
            alpha = alpha.filter(__import__("PIL.ImageFilter", fromlist=["ImageFilter"]).GaussianBlur(0.6))
            cell.putalpha(alpha)
            n = r * 7 + c + 1
            cell = cell.crop(cell.getbbox() or (0, 0, 2 * half, 2 * half)) if r == 6 else cell
            canvas = Image.new("RGBA", (ICON_SIZE, ICON_SIZE), (0, 0, 0, 0))
            cell.thumbnail((ICON_SIZE, ICON_SIZE), Image.Resampling.LANCZOS)
            canvas.paste(cell, ((ICON_SIZE - cell.width) // 2, (ICON_SIZE - cell.height) // 2), cell)
            canvas.save(out_dir / f"{n:02d}.webp", "WEBP", quality=88, method=6)
            paths.append(f"games/{GAME}/icons/{n:02d}.webp")
    return paths
