"""Catálogo de dados, anéis, cartas e mãos, lido do HTML da wiki da comunidade (Steam).

No HTML cada item é `<a><img></a>Nome.<tab>Condição<tab>Efeito faces<br>`. Linhas sem imagem continuam a anterior.
"""

import re

from lxml import html as lxml_html

from utils.common.http import fetch_file_if_missing
from utils.common.paths import assets_dir, raw_dir
from utils.games.dice_a_million.constants import GAME, SOURCE_URLS
from utils.games.dice_a_million.guides_md import ACTIONS, clean
from utils.games.dice_a_million.schemas import Catalog, CatalogItem

KINDS = {"Dice": "dice", "Rings": "rings", "Cards": "cards", "Hands": "hands"}
NAME = re.compile(r"^(.+?)\.(?:\s|$)")
FACES = re.compile(r"\s((?:\d+|[A-Za-z])(?:/[\w'!?.]+|(?:\.\.|-)\d+)+|\?)$")
SINGLE_FACE = re.compile(r"(?<=[.)\"])\s(\d{1,3}|\?)$")  # "... itself. 0": face única depois de fim de frase
FIXES = {"J.'s Die": "J's Die", "Matryoshka. Doll": "Matryoshka Doll.", "phone guySome": "phone guy. Some"}


def split_entry(text: str) -> tuple[str, str | None, str, str | None]:
    """Texto bruto -> (nome, condição, efeito, faces)."""
    for wrong, right in FIXES.items():
        text = text.replace(wrong, right)
    match = NAME.match(text.strip())
    if not match:
        raise ValueError(f"item sem nome: {text!r}")
    name, rest = clean(match.group(1)), text.strip()[match.end():]
    pieces = [p.strip() for p in re.split(r"\t+", rest) if p.strip()]
    condition: str | None = None
    lone_faces: str | None = None
    if len(pieces) >= 2 and re.fullmatch(r"\d{1,3}|\?", pieces[-1]):
        lone_faces = pieces.pop()
    if len(pieces) >= 2:
        condition, effect = pieces[0], " ".join(pieces[1:])
    else:
        effect = pieces[0] if pieces else ""
        if effect.startswith(ACTIONS):
            parts = re.split(r"(?<=\.)\s*(?=[A-Z\"])", effect, maxsplit=1)
            if len(parts) == 2:
                condition, effect = parts
    effect = clean(re.sub(r"(?<=[a-z])\.(?=[A-Z])", ". ", effect.replace('"', " ")))
    if condition and '"' in condition:
        condition, _, quoted = condition.partition('"')
        effect = clean(f"{quoted} {effect}")
    faces = lone_faces
    if found := FACES.search(effect) or SINGLE_FACE.search(effect):
        faces, effect = found.group(1), clean(effect[: found.start()])
    return name, condition and clean(condition), effect, faces


def parse_catalog(page: str) -> list[tuple[str, str, str]]:
    """HTML da wiki -> [(tipo, url da imagem, texto bruto)] por item, na ordem da página."""
    doc = lxml_html.fromstring(page)
    out: list[list[str]] = []
    for section in doc.xpath('//div[@class="subSection detailBox"]'):
        kind = KINDS.get(section.xpath('string(.//div[@class="subSectionTitle"])').strip())
        if not kind:
            continue
        body = lxml_html.tostring(section.xpath('.//div[@class="subSectionDesc"]')[0], encoding="unicode")
        for part in re.split(r"<br\s*/?>", body):
            el = lxml_html.fromstring(f"<div>{part}</div>")
            text = el.text_content().strip()
            if src := el.xpath("string(.//img/@src)"):
                out.append([kind, src, text])
            elif text and out:
                out[-1][2] += " " + text
    return [(k, u, t) for k, u, t in out]  # type: ignore[misc]


def build_catalog() -> Catalog:
    page = fetch_file_if_missing(SOURCE_URLS["steam-wiki.md"], raw_dir(GAME) / "steam-wiki.html")
    items: list[CatalogItem] = []
    seen: set[str] = set()
    for kind, url, text in parse_catalog(page.read_text(encoding="utf-8")):
        item_id = url.rstrip("/").rsplit("/", 1)[-1][:16].lower()
        if item_id in seen:
            continue
        seen.add(item_id)
        fetch_file_if_missing(url, assets_dir(GAME) / "items" / f"{item_id}.png")
        name, condition, effect, faces = split_entry(text)
        items.append(
            CatalogItem(
                id=item_id, kind=kind, name=name, condition=condition, effect=effect, faces=faces,  # type: ignore[arg-type]
                icon=f"games/{GAME}/items/{item_id}.png",
            )
        )
    return Catalog(items=items)
