"""Troféus (PS5): lista e raridade vêm do PSNProfiles; agrupamento e dicas escritos à mão a partir dos guias."""

import re

from utils.common.http import fetch_file_if_missing
from utils.common.paths import assets_dir, raw_dir
from utils.games.mewgenics.constants import GAME, PSN_TROPHIES_MD
from utils.games.mewgenics.schemas import Trophy, TrophyDataset, TrophyGroup

POINTS = {"platinum": 300, "gold": 90, "silver": 30, "bronze": 15}

ROW = re.compile(
    r"^\| !\[\]\((?P<icon>https://img\.psnprofiles\.com/trophy/s/42741/[^)]+)\) \| "
    r"\[(?P<name>[^\]]+)\]\((?P<url>[^)]*?/(?P<id>\d+)-[^/)]*)\) (?P<desc>.*?) \|  \| "
    r"!\[\]\([^)]*spacer\.png\)(?P<psn>[\d.]+)% (?P<psn_tier>[A-Za-z ]+?) \| "
    r"(?P<pp>[\d.]+)% (?P<pp_tier>[A-Za-z ]+?) \| "
    r"!\[\]\([^)]*/icons/40-(?P<grade>platinum|gold|silver|bronze)\.png\) \|",
    re.M,
)

GROUPS = [
    TrophyGroup(id="big", title="The big ones", summary="Every class on every difficulty, the final quest and the Creator on Impossible."),
    TrophyGroup(id="areas", title="Areas", summary="One per area, in the order you open them. The secret areas open with quest items."),
    TrophyGroup(id="classes", title="Classes", summary="Finish every area with one class. Fourteen runs through the map, so pick the class before you leave."),
    TrophyGroup(id="bosses", title="Quest items and bosses", summary="Each house boss gives a quest item. Helping Pyrophina or Zaratana needs two saves."),
    TrophyGroup(id="house", title="House and neighbours", summary="Send cats to your neighbours. These are slow, so give them every cat you do not need."),
]

# id do troféu -> grupo
GROUP_OF: dict[int, str] = {
    **{n: "big" for n in (1, 2, 3, 4, 5, 39, 51)},
    **{n: "classes" for n in range(6, 20)},
    **{n: "areas" for n in (20, *range(23, 39))},
    **{n: "bosses" for n in range(41, 51)},
    **{n: "house" for n in (21, 22, 40, 52, 53, 54)},
}

# Dicas curtas, só com o que está escrito nos guias.
TIPS: dict[str, str] = {
    "The Box": "Needs all 14 classes unlocked (Jester needs the Rift). The next difficulty unlocks by re-fighting the 3 house bosses of an act on the current one.",
    "Skill Split": "Collarless is the weakest class by design. It can still pick skills from other classes on level-up, so bring a cat with good stats and a base attack.",
    "Joker Card": "Jester opens with the Rift, so this class run comes late. It has no stat bonus and gets 1 extra reroll on level-ups.",
    "Tiny Cage": "Druid opens after the Crater. Its crow shares the druid's stats and comes back with full health every fight.",
    "Prayer Card": "Cleric opens when you reach the Sewers for the first time (one guide says complete the Alley).",
    "House upgrade 4": "Frank takes any retired cat. About 25 cats get you the attic and two rooms; this last tier needs 100 more.",
    "Jack's shack upgrade 4": "Jack takes injured cats. His furniture stock resets every Sunday.",
    "Mystery man upgrade 7": "He takes dead cats: ones that die on a run or at home. Sacrificing a stray with a Neverstone farms them (see the QOL guide).",
    "Tink reward 7": "Tink takes kittens. Give him any kitten with poor stats. Each batch of 10 unlocks more information on your cats.",
    "Mysterious Idol unlock 7": "Tracy takes cats that are at least 5 days old, so hold on to the ones you do not need.",
    "Storage upgrade 7": "Butch wants retired cats that adventured. Cats from the Sewers or Junkyard work well early.",
    "Pyrophinas Collar": "Exclusive with Zaratana's Collar: in the duel boss fight you choose who wins, so you need a second save for the other one.",
    "Zaratanas Collar": "Exclusive with Pyrophina's Collar. Help Zaratana in one save and Pyrophina in another.",
    "Black Shard": "Quest item from beating Zaratana. It deals 1 damage that ignores shields, once per battle, and gains 1 damage for each kill.",
    "Scalding Orb": "Quest item from beating Pyrophina. The cat holding it only has to stand in front of the Man in the Moon, with no sacrifice.",
    "Throbbing Gristle": "First Guillotina quest item (the Gristle Cube). Complete the Caves with it.",
    "Putrid Leech": "Second Guillotina item. The wearer cannot level up and has lifesteal; it is cursed, so it stays on that cat.",
    "Guillotinas Head": "Third Guillotina item. The wearer draws every enemy and all fights become their hard-path versions. The cat has to be sacrificed at the end.",
    "The Throbbing Domain": "Opens after the three Guillotina item quests.",
    "The Rift": "Opens after the Black Shard, Scalding Orb and collar quests.",
    "The Infinite": "Opens after the three Act 3 boss item quests.",
}


def download_icons(md: str) -> None:
    for m in ROW.finditer(md):
        fetch_file_if_missing(m["icon"], assets_dir(GAME) / "trophies" / f"{int(m['id']):02d}.png")


def parse_trophies(md: str) -> list[Trophy]:
    trophies = []
    for m in ROW.finditer(md):
        n = int(m["id"])
        name = m["name"].strip()
        desc = m["desc"].strip()
        if m["grade"] == "platinum":
            desc = "Earn all the other trophies."
        # nomes iguais com caixa diferente ("The Box", "The bOx") ficam como o site mostra
        trophies.append(
            Trophy(
                id=n,
                name=name,
                description=desc,
                grade=m["grade"],
                group=GROUP_OF[n],
                icon=f"games/{GAME}/trophies/{n:02d}.png",
                url=m["url"],
                psn_rate=float(m["psn"]),
                psn_tier=m["psn_tier"],
                profiles_rate=float(m["pp"]),
                profiles_tier=m["pp_tier"],
                tip=TIPS.get(name),
            )
        )
    unknown = set(TIPS) - {t.name for t in trophies}
    if unknown:
        raise ValueError(f"dicas para troféus inexistentes: {unknown}")
    missing = set(GROUP_OF) - {t.id for t in trophies}
    if missing:
        raise ValueError(f"troféus fora da lista: {missing}")
    return trophies


def build() -> TrophyDataset:
    md = (raw_dir(GAME) / PSN_TROPHIES_MD).read_text(encoding="utf-8")
    download_icons(md)
    trophies = parse_trophies(md)
    counts = {g: sum(t.grade == g for t in trophies) for g in POINTS}
    return TrophyDataset(
        points=sum(POINTS[t.grade] for t in trophies),
        counts=counts,
        groups=GROUPS,
        trophies=trophies,
    )
