"""Lê os .md baixados (guia de conquistas e wiki da comunidade) e extrai texto estruturado."""

import re

from utils.common.paths import raw_dir
from utils.games.dice_a_million.constants import GAME

WIKI_SECTIONS = ("Dice", "Rings", "Cards", "Hands")
BOSS_NAMES = [
    "Starving", "Odd", "Even", "Modest", "Greedy", "Capricious", "Pyro", "Frost", "Envious", "Heretic",
    "Sloth", "Hollow", "Hermit", "Negative", "Blackout", "Glutton", "Cautious", "Serpentine", "Witch",
    "Dusty", "Sixth", "Patient", "Copycat", "Boss",
]
ENEMY_DICE = [
    "Alpha", "Beta", "Gamma", "Delta", "Theta", "Lambda", "Xi", "Iota", "Omega", "Epsilon", "Tau", "Omicron", "Psi", "Rho",
]
ACTIONS = ("Get", "Beat", "Have", "Roll", "Remove", "Flick", "Pay", "Lose", "Spend", "Draw", "Make", "Pass", "Take", "Break", "Remind", "Fully", "Use", "Stay", "Find", "Manually")


def clean(text: str) -> str:
    return text.replace("\\_", "_").replace("\\[", "[").replace("\\]", "]").strip().strip('"').strip()


def read(name: str) -> str:
    return (raw_dir(GAME) / name).read_text(encoding="utf-8")


def parse_community_achievements() -> dict[str, tuple[str, str, str]]:
    """{nome: (seção, descrição, detalhe)} do guia de 100% da comunidade."""
    blocks = [b.strip() for b in read("steam-achievements.md").split("\n\n")]
    out: dict[str, tuple[str, str, str]] = {}
    section = ""
    name: str | None = None
    for block in blocks:
        if block.startswith("Afterword"):
            break
        if block.startswith("Section "):
            section, name = block.split(":", 1)[-1].strip().lower(), None
        elif "|" in block and name:
            parts = [p.strip() for p in block.split("|")]
            detail = " ".join(p for p in parts[1:] if p and set(p) - {"?"})
            out[name] = (section, parts[0], detail)
            name = None
        elif block and "|" not in block and section:
            name = clean(block)
    return out


def wiki_sections() -> dict[str, str]:
    """Texto da wiki agrupado pelos títulos Dice/Rings/Cards/Hands (uma entrada por seção)."""
    sections: dict[str, list[str]] = {}
    current = ""
    for line in read("steam-wiki.md").splitlines():
        line = line.strip()
        if line in WIKI_SECTIONS:
            current = line.lower()
        elif line == "Other achievements":
            break
        elif line and current:
            sections.setdefault(current, []).append(line)
    return {k: " ".join(v) for k, v in sections.items()}


def wiki_condition(name: str, wiki: dict[str, str]) -> str | None:
    """Primeira frase depois de `Nome.` quando ela descreve como desbloquear (verbo de ação)."""
    for text in wiki.values():
        match = re.search(rf"(?<![\w']){re.escape(name)}\. ([^.]*\.)", text)
        if match:
            sentence = match.group(1).strip()
            return sentence if sentence.startswith(ACTIONS) else None
    return None


def wiki_category(name: str, wiki: dict[str, str]) -> str | None:
    for category, text in wiki.items():
        if re.search(rf"(?<![\w']){re.escape(name)}\. ", text):
            return category
    return None


def _split_sequence(text: str, names: list[str], prefix: str) -> dict[str, str]:
    """Divide um texto corrido em entradas `{prefix}{Nome}. efeito`, na ordem de `names`."""
    marks = [(n, m.start(), m.end()) for n in names if (m := re.search(rf"{prefix}{n}\. ", text))]
    marks.sort(key=lambda x: x[1])
    return {
        n: clean(text[end : marks[i + 1][1] if i + 1 < len(marks) else len(text)])
        for i, (n, _, end) in enumerate(marks)
    }


def _wiki_block(start: str, end: str) -> list[str]:
    lines = [ln.strip() for ln in read("steam-wiki.md").splitlines()]
    i, j = lines.index(start), lines.index(end, lines.index(start) + 1)
    return [ln for ln in lines[i + 1 : j] if ln]


def parse_bestiary() -> tuple[dict[str, str], dict[str, str], dict[str, str], list[tuple[str, str, str]]]:
    """(chefes, chefes reforçados, dados inimigos, encantamentos[(nome, efeito, alvo)])."""
    base = _wiki_block("Bosses + enemy dice", "Enemy dice")
    bosses = _split_sequence(" ".join(base), BOSS_NAMES, "The ")
    enemy = _split_sequence(" ".join(_wiki_block("Enemy dice", "Enchantments + bosses versions")), ENEMY_DICE, "")

    empowered: dict[str, str] = {}
    for line in _wiki_block("Empowered Bosses", "We're waiting"):
        if m := re.match(r"The ([A-Za-z]+)(?: Draw)?\s*\.\s*(.*)", line):
            empowered[m.group(1)] = clean(m.group(2))

    enchants: list[tuple[str, str, str]] = []
    target = "die"
    for line in _wiki_block("Enchantments + bosses versions", "Empowered Bosses"):
        if line in ("Dice", "Rings"):
            target = "die" if line == "Dice" else "ring"
        elif m := re.match(r"([A-Za-z]+)\. (.*)", line):
            enchants.append((m.group(1), clean(m.group(2)), target))
    return bosses, empowered, enemy, enchants
