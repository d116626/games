"""Lê o guia de 100% da comunidade (.md baixado). Os textos de itens, chefes e desbloqueios vêm do jogo (`db.json`)."""

import re

from utils.common.paths import raw_dir
from utils.games.dice_a_million.constants import GAME


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
