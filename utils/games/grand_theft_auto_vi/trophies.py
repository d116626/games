"""Troféus (PS5): lista, nível e raridade vêm do PSNProfiles (HTML salvo à mão -> .md -> JSON)."""

import re

from utils.common.html_md import html_to_markdown_full
from utils.common.http import fetch_file_if_missing
from utils.common.paths import assets_dir, raw_dir
from utils.games.grand_theft_auto_vi.constants import GAME, PSN_TROPHIES_HTML, PSN_TROPHIES_MD, PSN_TROPHIES_URL
from utils.games.grand_theft_auto_vi.schemas import Trophy, TrophyDataset

ROW = re.compile(
    r"^\| !\[\]\((?P<icon>https://img\.psnprofiles\.com/trophy/s/\d+/[^)]+)\) \| "
    r"\[(?P<name>[^\]]+)\]\((?P<url>[^)]*?/(?P<id>\d+)-[^/)]*)\) (?P<desc>.*?) \| [^|]*\| "
    r"!\[\]\([^)]*spacer\.png\)(?P<psn>[\d.]+)% (?P<psn_tier>[A-Za-z ]+?) \| "
    r"(?P<pp>[\d.]+)% [A-Za-z ]+? \| "
    r"!\[\]\([^)]*/icons/40-(?P<grade>platinum|gold|silver|bronze)\.png\) \|",
    re.M,
)
POINTS = {"platinum": 300, "gold": 90, "silver": 30, "bronze": 15}
EXPECTED = 55  # a página do PSNProfiles no lançamento: 1 platina, 2 ouro, 6 prata, 46 bronze


def markdown() -> str:
    """O .md da lista (gerado do HTML salvo na primeira vez; apague o .md para refazer depois de salvar o HTML de novo)."""
    md = raw_dir(GAME) / PSN_TROPHIES_MD
    if not md.exists():
        html = (raw_dir(GAME) / PSN_TROPHIES_HTML).read_text(encoding="utf-8")
        md.write_text(html_to_markdown_full(html, PSN_TROPHIES_URL), encoding="utf-8")
    return md.read_text(encoding="utf-8")


def dataset(md: str) -> TrophyDataset:
    rows = list(ROW.finditer(md))
    if len(rows) != EXPECTED:
        raise ValueError(f"esperava {EXPECTED} troféus, achei {len(rows)}: o layout do PSNProfiles mudou?")
    has_rarity = any(float(m["psn"]) > 0 for m in rows)
    out = []
    for m in rows:
        n = int(m["id"])
        icon = assets_dir(GAME) / "trophies" / f"{n:02d}.png"
        fetch_file_if_missing(m["icon"], icon)
        out.append(Trophy(
            id=n, name=m["name"].strip(), description=m["desc"].strip(), grade=m["grade"], icon=f"games/{GAME}/trophies/{n:02d}.png",
            url=m["url"], psn_rate=float(m["psn"]) if has_rarity else None, psn_tier=m["psn_tier"].strip() if has_rarity else None,
        ))
    counts = {g: sum(t.grade == g for t in out) for g in POINTS}
    return TrophyDataset(points=sum(POINTS[t.grade] for t in out), counts=counts, has_rarity=has_rarity, trophies=out)
