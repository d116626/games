"""Os 60 tripulantes: nome, função, retrato e fate, do guia "The Fate of Every Crewmember" (djsnowboy267)."""

import difflib
import re
from dataclasses import dataclass

from utils.games.return_of_the_obra_dinn.schemas import Fate

SECTION = re.compile(r"^## (?P<name>.+?), (?P<role>[^,\n]+)\n\n!\[\]\((?P<url>[^)]+)\)\s*\n(?P<fate>.+?)\n", re.M)


@dataclass
class Raw:
    id: str
    no: int
    name: str
    role: str
    portrait_url: str
    fate_text: str


def norm(name: str) -> str:
    return re.sub(r"[^a-z]", "", name.lower())


def slug(name: str) -> str:
    return re.sub(r"[^a-z]+", "-", name.lower()).strip("-")


def parse(md: str) -> list[Raw]:
    raw = [
        Raw(slug(m["name"]), i, m["name"].strip(), m["role"].strip(), m["url"], m["fate"].strip())
        for i, m in enumerate(SECTION.finditer(md), 1)
    ]
    if len(raw) != 60:
        raise ValueError(f"esperava 60 tripulantes, achei {len(raw)}")
    return raw


def matcher(crew: list[Raw]):
    """Casa um nome de outra fonte (com erros de digitação: "Lan", "Anderson", "Wiatrr") com um tripulante."""
    names = {norm(c.name): c.id for c in crew}

    def match(name: str) -> str | None:
        key = norm(name.removeprefix("Captain "))
        found = difflib.get_close_matches(key, names, n=1, cutoff=0.82)
        return names[found[0]] if found else None

    return match


def fate(raw: Raw, by_id: dict[str, Raw]) -> Fate:
    cause, _, who = raw.fate_text.rpartition(" by ")
    who = who.strip()
    killer = next((c.id for c in by_id.values() if c.name == who), None)
    if killer is None and who.lower() != "a beast":  # "Crushed by rigging": o "by" faz parte da causa
        cause, who = raw.fate_text, ""
    cause = (cause[0].upper() + cause[1:]).replace("Apart", "apart")
    # "Spiked" sozinho: o jogo já completa com "by a beast"
    return Fate(cause=cause, killer=killer, by_beast=bool(who) and killer is None or cause == "Spiked")


def same_fate(a: str, b: str) -> bool:
    """Compara duas redações de um fate ignorando artigos, "by"/"with" e "beast" (que o jogo completa sozinho)."""
    def key(text: str) -> str:
        return re.sub(r"\b(a|by|with|beast)\b", "", text.lower()).replace(" ", "").replace("-", "")
    return key(a) == key(b)
