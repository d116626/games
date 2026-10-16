"""`100pguides.md` -> níveis com spots (latas, engrenagens, filmes e dares).

A página aparece 3 vezes no .md; só a primeira cópia é lida. Cada nível é `# **<código> <nome>**`, e cada
spot é um parágrafo que começa com um cabeçalho em negrito, tipo `**Spray Can (1/4) & Dare: X (2/2).**`,
seguido de "View fullsize ![](imagem)" (uma ou mais)."""

import re

from utils.games.denshattack.schemas import Item, ItemKind, Level, LevelKind, Spot

HEAD = re.compile(r"^# \*\*(\d)-(\d)-([A-Z0-9]) (.+?)\*\*$", re.M)
SPOT = re.compile(r"^\*\*(.+?)\*\*\s*(.*)$", re.S)
IMG = re.compile(r"View fullsize !\[[^\]]*\]\((https://images\.squarespace-cdn\.com/[^)]+)\)")
# um item do cabeçalho: lata/engrenagem/filme ou "Dare: título", com contagem "(n/m)" ou "(a-b/m)" opcional
TOKEN = re.compile(
    r"(?P<kind>Spray Can|Gear|Film Roll)(?: \((?P<n>\d+)(?:-\d+)?/(?P<of>\d+)\))?"
    r"|Dare: (?P<title>.+?)(?: \((?P<dn>\d+)(?:-\d+)?/(?P<dof>\d+)\))?(?=\.(?:\s|$)| & | and (?:Dare|Spray|Gear|Film)|$)"
)
KINDS: dict[str, ItemKind] = {"Spray Can": "can", "Gear": "gear", "Film Roll": "film"}
LEVEL_KINDS: dict[str, LevelKind] = {"R": "race", "B": "boss", "S": "story", "C": "castle", "F": "fanzine", "O": "onsen"}
EXTRA_NOTE = re.compile(r"^\*\*(?:\(EN\)Zine|Onsen) #\d+\.\*\*\s*", re.S)


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower().replace("’", "").replace("'", "")).strip("-")


def tidy(s: str) -> str:
    return re.sub(r"\s+", " ", s.replace("’", "'").replace("**", "")).strip()


def items_of(code: str, header: str) -> list[Item]:
    out: list[Item] = []
    for m in TOKEN.finditer(header):
        if m["kind"]:
            kind = KINDS[m["kind"]]
            n = int(m["n"]) if m["n"] else None
            out.append(Item(id=f"{code}:{kind}" + (f":{n}" if kind != "film" and n else ""), kind=kind, n=n, of=int(m["of"]) if m["of"] else None))
        else:
            title = tidy(m["title"])
            out.append(Item(id=f"{code}:dare:{slug(title)}", kind="dare", title=title, n=int(m["dn"]) if m["dn"] else None, of=int(m["dof"]) if m["dof"] else None))
    return out


def parse_spots(code: str, body: str, unmatched: list[str]) -> tuple[str | None, list[tuple[Spot, list[str]]]]:
    """-> (nota, [(spot, urls das imagens)]). A nota é o texto de lojas/fanzines/onsens."""
    note: str | None = None
    spots: list[tuple[Spot, list[str]]] = []
    for block in (b.strip() for b in body.split("\n\n")):
        if not block:
            continue
        if m := IMG.search(block):
            if spots:
                spots[-1][1].append(m[1])
            continue
        if block.startswith("No collectibles"):
            continue
        if EXTRA_NOTE.match(block):
            note = tidy(EXTRA_NOTE.sub("", block))
            continue
        m = SPOT.match(block)
        if not m:  # texto solto de introdução ("This is a shop level...", "For this race I recommend...")
            note = tidy(f"{note} {block}" if note else block)
            continue
        items = items_of(code, m[1])
        if not items:
            unmatched.append(f"{code}: cabeçalho {m[1]!r}")
            continue
        spots.append((Spot(text=tidy(m[2]), items=items), []))
    return note, spots


def parse(md: str) -> tuple[list[Level], dict[str, list[list[str]]], list[str]]:
    """-> (níveis na ordem da página, imagens por (nível, índice do spot), avisos)."""
    first = "\n".join(md.split("\n")[:2970])  # 1ª das 3 cópias
    heads = list(HEAD.finditer(first))
    levels: list[Level] = []
    images: dict[str, list[list[str]]] = {}
    unmatched: list[str] = []
    for i, h in enumerate(heads):
        body = first[h.end(): heads[i + 1].start() if i + 1 < len(heads) else len(first)]
        body = re.split(r"^# \*\*CHAPTER|^More Guides", body, flags=re.M | re.I)[0]  # próximo capítulo / rodapé da página
        chapter, code = int(h[1]), f"{h[1]}-{h[2]}-{h[3]}"
        note, spots = parse_spots(code, body, unmatched)
        levels.append(Level(
            code=code, name=tidy(h[4]), chapter=chapter, kind=LEVEL_KINDS.get(h[3], "level"), note=note,
            spots=[s for s, _ in spots],
        ))
        images[code] = [urls for _, urls in spots]
    return levels, images, unmatched
