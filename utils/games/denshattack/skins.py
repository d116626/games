"""Códigos de skin (estilo Konami, digitados nos castelos). Duas guias do Steam:
`steam-3765467114.md` (a completa, com criador, link e imagem) e `steam-3765448136.md` (mais antiga).
O mesmo código com nomes diferentes (EricDud/EricRod, Mixtape/Kid Katana Records) é a mesma skin;
só vira discrepância o código que o guia antigo dá diferente."""

import re

from utils.common.http import fetch_file_if_missing
from utils.common.paths import assets_dir, raw_dir
from utils.games.denshattack.constants import GAME
from utils.games.denshattack.images import shrink
from utils.games.denshattack.schemas import Skin

CODE = re.compile(r"^([UDLR]{8,10})\s*$", re.M)
LABEL = re.compile(r"^(.+?): (Skin[^\n]*?)\s*$", re.M)
IMG = re.compile(r"!\[\]\((https://images\.steamusercontent\.com/[^)]+)\)")
LINK = re.compile(r"\[(https?://[^\]]+)\]")


def parse_current(md: str) -> list[tuple[Skin, str | None]]:
    """-> [(skin, url da imagem)] na ordem do guia. Seções com vários criadores repartem a imagem."""
    out: list[tuple[Skin, str | None]] = []
    for sec in re.split(r"^## ", md, flags=re.M)[1:]:
        if not CODE.search(sec):
            continue
        image = IMG.search(sec)
        # cada criador: rótulo "Nome: Skin + ...", código, link (opcional)
        for m in re.finditer(r"^(?P<name>.+?): (?P<inc>Skin[^\n]*?)\s*\n(?P<code>[UDLR]{8,10})\s*\n(?:\[(?P<url>https?://[^\]]+)\])?", sec, re.M):
            inc = "Skin + Voicepack" if re.search(r"voice", m["inc"], re.I) else "Skin"
            out.append((Skin(name=m["name"].strip().replace("Newletter", "Newsletter"), includes=inc, code=m["code"], url=m["url"]), image[1] if image else None))
        if not LABEL.search(sec):  # seção sem rótulo ("Tokyo Game Show Event Skin" tem; cobre sobras)
            raise ValueError(f"seção sem criador: {sec[:40]!r}")
    return out


def parse_older(md: str) -> dict[str, str]:
    """nome da seção -> código, no guia antigo."""
    return {m[1].strip(): m[2] for m in re.finditer(r"^## (.+)\n\n([UDLR]{8,10})\s*$", md, re.M)}


def build(current_md: str, older_md: str) -> tuple[list[Skin], list[str], int]:
    """-> (skins com imagem reduzida, avisos de discrepância, bytes das imagens)."""
    pairs = parse_current(current_md)
    older = parse_older(older_md)
    codes = {s.code for s, _ in pairs}
    notes = [f"The older guide lists {name} as {code}; the newer one has a different code." for name, code in older.items() if code not in codes]
    only_new = [s.name for s, _ in pairs if s.code not in older.values() and s.name.lower() not in {n.lower() for n in older}]
    notes.append(f"The newer guide has {len(only_new)} codes the older one lacks: {', '.join(only_new)}.")
    files: dict[str, str] = {}  # url da imagem -> arquivo (criadores que dividem a skin dividem a imagem)
    total = 0
    for skin, url in pairs:
        if not url:
            continue
        if url not in files:
            name = re.sub(r"[^a-z0-9]+", "-", skin.name.lower()).strip("-")
            src = raw_dir(GAME) / "images" / f"skin-{name}.webp"
            fetch_file_if_missing(url, src)
            total += shrink(src, assets_dir(GAME) / "skins" / f"{name}.webp")
            files[url] = f"games/{GAME}/skins/{name}.webp"
        skin.image = files[url]
    return [s for s, _ in pairs], notes, total
