"""Imagens dos biomas e chefes. O Greenside (`steam-3665699703.md`) põe uma tela-título no começo de cada
Biome Breakdown e, na seção Bosses, telas "X vs Chefe" misturadas com capturas de jogo. A posição da imagem
no texto não segue o chefe (muitas vezes é a do chefe seguinte), então `BOSS_SHOTS` diz, por conferência
visual, qual imagem da seção é de qual chefe. Baixa os originais (não versionados) e reduz com Pillow."""

import re
from pathlib import Path

from PIL import Image

from utils.common.http import fetch_file_if_missing
from utils.common.paths import assets_dir, process_dir, raw_dir
from utils.games.mewgenics.constants import GAME
from utils.games.mewgenics.schemas import Biome

SOURCE = "steam-3665699703.md"
# título do Biome Breakdown -> id do bioma (o "(additional)" do Desert cai no mesmo id)
HEADINGS = {
    "The Alley": "alley", "The Sewers": "sewers", "The Caves": "caves", "The Junkyard": "junkyard",
    "The Boneyard": "boneyard", "The Desert": "desert", "The Desert (additional)": "desert", "The Bunker": "bunker",
    "The Core": "core", "The Crater": "crater", "The Moon": "moon",
}
# (bioma, chefe) -> índice da imagem na seção Bosses. Sem entrada = a fonte não tem a tela do chefe
# (Maise, Flushmaster, Can Creeper, Gein, Lenny) ou só tem captura de jogo.
BOSS_SHOTS = {
    ("alley", "Fenrir"): 0, ("alley", "Magnus"): 1, ("alley", "Lucy"): 2, ("alley", "Queen Hippo"): 4,
    ("alley", "Radical Rat"): 5,
    ("sewers", "Rat King"): 0, ("sewers", "Boris"): 1,
    ("caves", "Big Slime"): 0, ("caves", "Baby Spider / Spinerette"): 1,
    ("junkyard", "Trampy"): 0, ("junkyard", "Chubs n' Nubs"): 1,
    ("boneyard", "Dybbuk"): 0,
    ("desert", "Marshmallow"): 0, ("desert", "Morana"): 1, ("desert", "Zodiac"): 3, ("desert", "Gambit"): 4,
    ("desert", "Dack (mini-boss)"): 5,
    ("bunker", "Bumblefoot"): 0, ("bunker", "Johnny"): 1,
    ("core", "The Coven"): 1,
    ("crater", "Infested Pair"): 0, ("crater", "Crater Maker"): 1,
    ("moon", "The Man in the Moon"): 0,
}
IMG = re.compile(r"!\[\]\((https://images\.steamusercontent\.com/[^)]+)\)")
WIDTH = 720
PAPER = (251, 244, 228, 255)  # --card do tema


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", re.sub(r"\(.*?\)", "", s.lower()))


def parse(md: str) -> dict[str, tuple[str | None, list[str]]]:
    """id do bioma -> (url da tela-título, urls das imagens da seção Bosses, em ordem)."""
    out: dict[str, tuple[str | None, list[str]]] = {}
    for block in re.split(r"^## Biome Breakdown: ", md, flags=re.M)[1:]:
        head, _, body = block.partition("\n")
        biome = HEADINGS.get(head.strip())
        if not biome:
            continue
        banner, shots = out.get(biome, (None, []))
        pre, sep, rest = body.partition("### Bosses")
        if not banner and (m := IMG.search(pre.partition("### Biome Map")[0])):
            banner = m[1]
        # o "(additional)" do Desert não tem "### Bosses": as imagens dele (Dack) vêm no corpo todo
        shots += IMG.findall((rest if sep else body).split("\n## ")[0])
        out[biome] = (banner, shots)
    return out


def shrink(url: str, dest: Path) -> str:
    """Baixa o original para `data/process`, reduz para `dest` e devolve o caminho relativo a `public/`."""
    original = fetch_file_if_missing(url, process_dir(GAME) / "img" / f"{slug(url)[-24:]}.img")
    if not dest.exists():
        dest.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(original) as src:
            # PNGs com transparência (cartas de itens) vão sobre o fundo de papel do tema, não sobre preto
            img = Image.alpha_composite(Image.new("RGBA", src.size, PAPER), src.convert("RGBA")).convert("RGB")
        if img.width > WIDTH:  # nunca amplia: as cartas de itens são pequenas
            img = img.resize((WIDTH, round(img.height * WIDTH / img.width)), Image.Resampling.LANCZOS)
        img.save(dest, "JPEG", quality=70, optimize=True)
    return dest.relative_to(assets_dir(GAME).parents[1]).as_posix()


def source_urls(name: str) -> list[str]:
    """Imagens únicas de uma fonte (`data/raw`), na ordem em que aparecem; o índice é o que `advanced`/`quests` usam."""
    return list(dict.fromkeys(IMG.findall((raw_dir(GAME) / f"{name}.md").read_text(encoding="utf-8"))))


def size(rel: str) -> tuple[int, int]:
    """Largura e altura de uma imagem já reduzida (caminho relativo a `public/`)."""
    with Image.open(assets_dir(GAME).parents[1] / rel) as img:
        return img.size


def attach(biomes: list[Biome]) -> None:
    parsed = parse((raw_dir(GAME) / SOURCE).read_text(encoding="utf-8"))
    for b in biomes:
        banner, shots = parsed.get(b.id, (None, []))
        if banner:
            b.image = shrink(banner, assets_dir(GAME) / "biomes" / f"{b.id}.jpg")
        for foe in b.bosses:
            if (i := BOSS_SHOTS.get((b.id, foe.name))) is not None:
                foe.image = shrink(shots[i], assets_dir(GAME) / "bosses" / f"{slug(foe.name)}.jpg")
