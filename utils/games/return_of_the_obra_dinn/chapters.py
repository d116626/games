"""Capítulos e partes do livro.

Esqueleto (ordem, eventos sem nome, notas): "Hints/Solutions in Chronological Order" (polkadotc).
Local de cada parte e as duas dicas por tripulante: Trophy Guide do PSNProfiles (Kramers001).
"""

import re
from dataclasses import dataclass, field

from utils.games.return_of_the_obra_dinn.crew import Raw, matcher
from utils.games.return_of_the_obra_dinn.schemas import Chapter, FateEntry, Part
from utils.games.return_of_the_obra_dinn.story import SUMMARY

ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]
# O título do capítulo VIII varia entre as fontes ("Bargain", "The Bargain", "Bargaining"); as demais batem.
TITLE_VIII = "Bargain"

CHAPTER = re.compile(r"There are (\d+) fates[^C]*Chapter ([IVX]+): ([^.]+)\.(?: Only (\d+) fates? needs? solving)?")
PART = re.compile(r"^\| ## \*(?:PART (\d+): (?P<loc>.+?)|CONCLUSION: DISAPPEARANCES)\s*\*\s*\|")
TRIPLE = re.compile(r"^\| \*(?P<who>.+?)\* --- --- \| \*(?P<how>.+?)\* --- --- \| \*(?P<by>.+?)\* --- --- \|")
EVENT = re.compile(r"^\| --- \*(?P<text>.+?)\* --- --- \|$")
HINTS = re.compile(r"^\| (?!---|!\[)(?P<a>.+?) \|  \| (?P<b>.+?) \|$")
CLUE_ONLY = re.compile(r"^\| (?P<text>Listen[^|]+?) --- \|$")


@dataclass
class Hint:
    identity: str | None = None
    clue: str | None = None


@dataclass
class Psn:
    counts: dict[int, tuple[int, int]] = field(default_factory=dict)  # capítulo -> (itens, a resolver)
    titles: dict[int, str] = field(default_factory=dict)
    locations: dict[tuple[int, int], str] = field(default_factory=dict)
    hints: dict[str, Hint] = field(default_factory=dict)  # id do tripulante
    event_clues: dict[tuple[int, int], str] = field(default_factory=dict)  # eventos sem nome
    fates: dict[str, str] = field(default_factory=dict)  # id -> "Decapitated by a beast", como o PSNProfiles lista


def parse_psn(md: str, match) -> Psn:
    out = Psn()
    chapter, part, current = 0, None, None  # current: id do tripulante ou ("event", cap, parte) do bloco aberto
    for line in md.splitlines():
        if m := CHAPTER.search(line):
            chapter = ROMAN.index(m[2]) + 1
            solve = int(m[4]) if m[4] else int(m[1])
            out.counts[chapter] = (int(m[1]), solve)
            out.titles[chapter] = m[3].strip()
            part, current = None, None
        elif m := PART.match(line):
            part = int(m[1]) if m[1] else None
            if m[1]:
                out.locations.setdefault((chapter, part), m["loc"].strip().capitalize())
            current = None
        elif chapter and (m := TRIPLE.match(line)):
            current = match(m["who"])
            if current is None:
                raise ValueError(f"nome sem par no PSN: {m['who']}")
            by = {"Red Herring": "", "Beast": " by a beast"}.get(m["by"], f" by {m['by'].removeprefix('Captain ')}")
            out.fates[current] = m["how"] + by
        elif chapter and EVENT.match(line):
            current = ("event", chapter, part)
        elif current and (m := HINTS.match(line)):
            if isinstance(current, str):
                out.hints[current] = Hint(m["a"].strip(), m["b"].strip())
            current = None
        elif chapter and (m := CLUE_ONLY.match(line)) and isinstance(current, tuple):
            out.event_clues[(current[1], current[2])] = m["text"].strip()
            current = None
    return out


def split_entries(body: str) -> list[tuple[str, str]]:
    """(frase do fate, nota) de cada item; os itens são separados por uma linha com dois espaços."""
    entries = []
    for block in re.split(r"\n  \n", body.strip()):
        head, _, note = block.strip().partition("\n")
        if head:
            entries.append((head.strip(" ").rstrip(), note.strip()))
    return entries


def parse_chrono(md: str, crew: list[Raw]) -> list[tuple[int, int | None, str, str]]:
    """[(capítulo, parte ou None, frase, nota)] na ordem do guia."""
    out = []
    for chunk in re.split(r"^## (?=Chapter [IVX]+:)", md, flags=re.M)[1:]:
        title, _, rest = chunk.partition("\n")
        chapter = ROMAN.index(re.match(r"Chapter ([IVX]+):", title)[1]) + 1
        for sec in re.split(r"^## (?=Part \d+|Disappearances)", rest, flags=re.M)[1:]:
            label, _, body = sec.partition("\n")
            n = int(label.split()[1]) if label.startswith("Part") else None
            for head, note in split_entries(body):
                out.append((chapter, n, head, note))
    return out


def names_in(text: str, crew: list[Raw]) -> list[str]:
    """Ids dos tripulantes citados num texto sem formato fixo (ex.: os quatro "alive in Africa")."""
    return [c.id for c in crew if " ".join(c.name.split()[-2:]) in text]


def build(chrono_md: str, psn_md: str, crew: list[Raw]) -> tuple[list[Chapter], dict[str, tuple[int, int | None]], dict[str, str]]:
    match = matcher(crew)
    psn = parse_psn(psn_md, match)
    where: dict[str, tuple[int, int | None]] = {}
    parts: dict[tuple[int, int | None], list[FateEntry]] = {}
    for chapter, n, head, note in parse_chrono(chrono_md, crew):
        who = re.match(r"(?P<name>[A-Z][^()]+?) \(", head) or re.match(r"(?P<name>Captain [A-Za-z ]+?) shot himself", head)
        if "alive in Africa" in head:  # uma frase para os quatro sobreviventes
            ids = names_in(head, crew)
        else:
            ids = [match(who["name"])] if who and match(who["name"]) else []
        entries = parts.setdefault((chapter, n), [])
        if not ids:
            event = head if head.endswith(".") else head + "."
            entries.append(FateEntry(event=event, clue_hint=psn.event_clues.get((chapter, n or 0)), note=note or None))
        for i in ids:
            if i in where:
                raise ValueError(f"{i} aparece duas vezes")
            where[i] = (chapter, n)
            hint = psn.hints.get(i, Hint())
            entries.append(FateEntry(crew=i, identity_hint=hint.identity, clue_hint=hint.clue, note=note or None))
    missing = {c.id for c in crew} - where.keys()
    if missing:
        raise ValueError(f"tripulantes fora dos capítulos: {sorted(missing)}")

    chapters = []
    for number in range(1, 11):
        keys = sorted((k for k in parts if k[0] == number), key=lambda k: (k[1] is None, k[1] or 0))
        total, solve = psn.counts[number]
        if sum(len(parts[k]) for k in keys) != total:
            raise ValueError(f"capítulo {number}: PSN diz {total} itens, achei {sum(len(parts[k]) for k in keys)}")
        chapters.append(Chapter(
            n=number, roman=ROMAN[number - 1], title=TITLE_VIII if number == 8 else psn.titles[number], fate_count=total, solve_count=solve,
            summary=SUMMARY[number],
            parts=[Part(n=k[1], location=psn.locations.get(k), fates=parts[k]) for k in keys],
        ))
    return chapters, where, psn.fates
