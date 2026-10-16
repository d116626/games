"""Troféus (PS5): lista, progresso e raridade vêm do PSNProfiles."""

import re

from utils.common.http import fetch_file_if_missing
from utils.common.paths import assets_dir
from utils.games.denshattack.constants import GAME
from utils.games.denshattack.schemas import Trophy, TrophyDataset, TrophyGroup

ROW = re.compile(
    r"^\| !\[\]\((?P<icon>https://img\.psnprofiles\.com/trophy/s/42281/[^)]+)\) \| "
    r"\[(?P<name>[^\]]+)\]\((?P<url>[^)]*?/(?P<id>\d+)-[^/)]*)\) (?P<desc>.*?) \| (?P<goal>[^|]*?) \| "
    r"!\[\]\([^)]*spacer\.png\)(?P<psn>[\d.]+)% (?P<psn_tier>[A-Za-z ]+?) \| "
    r"(?P<pp>[\d.]+)% (?P<pp_tier>[A-Za-z ]+?) \| "
    r"!\[\]\([^)]*/icons/40-(?P<grade>platinum|gold|silver|bronze)\.png\) \|",
    re.M,
)
POINTS = {"platinum": 300, "gold": 90, "silver": 30, "bronze": 15}


GROUPS = [
    TrophyGroup(id="story", title="Story and bosses"),
    TrophyGroup(id="medals", title="Medals and races"),
    TrophyGroup(id="collect", title="Collectibles"),
    TrophyGroup(id="tricks", title="Tricks"),
    TrophyGroup(id="dares", title="Dares"),
]
# id do troféu -> grupo
GROUP_OF = {**{n: "story" for n in range(1, 12)}, **{n: "medals" for n in range(12, 17)},
            **{n: "collect" for n in range(17, 31)}, **{n: "tricks" for n in range(31, 37)}, **{n: "dares" for n in range(37, 40)}}


def download_icons(md: str) -> None:
    for m in ROW.finditer(md):
        fetch_file_if_missing(m["icon"], assets_dir(GAME) / "trophies" / f"{int(m['id']):02d}.png")


def parse_trophies(md: str) -> list[Trophy]:
    out = []
    for m in ROW.finditer(md):
        n = int(m["id"])
        goal = re.fullmatch(r"\d+/(\d+)", m["goal"].strip())
        out.append(Trophy(
            id=n, group=GROUP_OF[n], name=m["name"].strip().replace("’", "'"), description=m["desc"].strip(), grade=m["grade"],
            icon=f"games/{GAME}/trophies/{n:02d}.png", url=m["url"], goal=int(goal[1]) if goal else None,
            psn_rate=float(m["psn"]), psn_tier=m["psn_tier"], profiles_rate=float(m["pp"]), profiles_tier=m["pp_tier"],
        ))
    return out


def dataset(md: str) -> TrophyDataset:
    trophies = parse_trophies(md)
    counts = {g: sum(t.grade == g for t in trophies) for g in POINTS}
    return TrophyDataset(points=sum(POINTS[t.grade] for t in trophies), counts=counts, groups=GROUPS, trophies=trophies)
