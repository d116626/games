"""Troféus (PS4/PS5): lista, raridade e dicas de roteiro vêm do PSNProfiles."""

import re

from utils.common.http import fetch_file_if_missing
from utils.common.paths import assets_dir
from utils.games.return_of_the_obra_dinn.constants import GAME
from utils.games.return_of_the_obra_dinn.schemas import Trophy, TrophyDataset

ROW = re.compile(
    r"^\| !\[\]\((?P<icon>https://img\.psnprofiles\.com/trophy/s/9786/[^)]+)\) \| "
    r"\[(?P<name>[^\]]+)\]\((?P<url>[^)]*?/(?P<id>\d+)-[^/)]*)\) (?P<desc>.*?) \| (?P<goal>[^|]*?) \| "
    r"!\[\]\([^)]*spacer\.png\)(?P<psn>[\d.]+)% (?P<psn_tier>[A-Za-z ]+?) \| "
    r"(?P<pp>[\d.]+)% (?P<pp_tier>[A-Za-z ]+?) \| "
    r"!\[\]\([^)]*/icons/40-(?P<grade>platinum|gold|silver|bronze)\.png\) \|",
    re.M,
)
POINTS = {"platinum": 300, "gold": 90, "silver": 30, "bronze": 15}

MISSABLE = {"Captain Did It", "Abandon Ship"}
# Dicas do roteiro do PSNProfiles (Kramers001), resumidas.
NOTES = {
    "Obra Done": "Needs all 60 fates. Chapter VIII only opens after 58 of them are solved: leave the ship and a package with a monkey's paw "
    "arrives at your house. The last two fates are in that chapter.",
    "Captain Did It": "Blame every fate except the two in chapter VIII on the Captain, and list his own death as a gun suicide, "
    "not \"shot by Captain Witterel\". Picking \"Axed\" for everyone is quickest, since it is the first cause on the list. "
    "Shortcut: do it first, with no fates validated yet, then rewind the save from the menu and solve the book properly.",
    "Abandon Ship": "Leave the ship in the boat before solving 58 fates (it rains once every available chapter is documented). "
    "Captain Did It also unlocks it. You can rewind the save afterwards.",
    "Platinum": "The only missables are Captain Did It and Abandon Ship; the rest unlock as you solve the book.",
}


def download_icons(md: str) -> None:
    for m in ROW.finditer(md):
        fetch_file_if_missing(m["icon"], assets_dir(GAME) / "trophies" / f"{int(m['id']):02d}.png")


def dataset(md: str) -> TrophyDataset:
    out = []
    for m in ROW.finditer(md):
        n, name = int(m["id"]), m["name"].strip()
        out.append(Trophy(
            id=n, name=name, description=m["desc"].strip(), grade=m["grade"], icon=f"games/{GAME}/trophies/{n:02d}.png", url=m["url"],
            psn_rate=float(m["psn"]), psn_tier=m["psn_tier"], profiles_rate=float(m["pp"]), profiles_tier=m["pp_tier"],
            missable=name in MISSABLE, note=NOTES.get(name),
        ))
    counts = {g: sum(t.grade == g for t in out) for g in POINTS}
    return TrophyDataset(points=sum(POINTS[t.grade] for t in out), counts=counts, trophies=out)
