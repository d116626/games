"""Habilidades (27) e perks da Fextralife; regras de custo e desbloqueio resumidas à mão."""

import re

from utils.common.paths import raw_dir
from utils.games.blood_of_dawnwalker.constants import GAME
from utils.games.blood_of_dawnwalker.schemas import Ability, Perk, SkillsDataset, Tree

TREES = [
    Tree(
        id="swordmastery",
        name="Swordmastery",
        time="anytime",
        summary="Weapon skills; costs Activation Charges only, never health. Works day and night.",
        unlock="Read the manual (soldier and bandit camps, sword teachers, vendors).",
    ),
    Tree(
        id="witchcraft",
        name="Witchcraft",
        time="day",
        summary="Hexes and utility magic, mostly daytime. Includes Compel Soul to talk to the dead.",
        unlock="Read the tome (haunted sites, ancient circles, witchcraft vendors).",
    ),
    Tree(
        id="vampirism",
        name="Vampirism",
        time="night",
        summary="Claw attacks, shapeshifting and mind control. Night only, abilities cost health.",
        unlock="Raise Corruption by drinking blood (animals, humans, Vrakhiri blood samples).",
    ),
]

RULES = [
    "You get 1 skill point per level-up and per completed activity.",
    "Opening a rank costs 1 skill point, and most perks cost 1-2 time segments too. Maxing an ability takes 4 points and 5 segments; maxing all of Swordmastery is about 90 segments.",
    "Some ranks cost no time: Mercurial Fervour, Astral Communion, Compel Soul and Shapeshift.",
    "There are 2 quick-slot sets (day and night) with 4 active abilities each. Passive abilities only work while equipped in them.",
    "Master Fencer, Forbidden Sigils and Vrakhiri Might add ability slots.",
    "Each tree has 3 Ultimate perks and only 1 can be active. You need 35 points spent in the tree (39 with the perk itself); Vampirism also needs Corruption level 15.",
    "There are not enough skill points for one Ultimate in every tree. For the Ultimate trophies, save before spending and use a separate save per tree.",
]

PERK_FIXES = {
    "Closing Wounds": "Slowly regenerates Vampiric Health.",
    "Mandrake Ward": "When Coen receives a fatal blow, he instantly regains part of his Blood Bar, once per night.",
}

NO_TIME_SUFFIX = re.compile(r"\s*This Ability (works passively|doesn't take up).*$", re.I)


def _slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def _cost(raw: str) -> str | None:
    if raw.strip() in ("", "N/A"):
        return None
    return re.sub(r"(Charges?) (\d+% Health)", r"\1 + \2", raw.strip())


def parse_abilities(md: str) -> list[Ability]:
    abilities = []
    for m in re.finditer(r"^\| \[([^\]]+)\]\([^)]*\) \| (Swordmastery|Witchcraft|Vampirism) \| (.+?) \| (.+?) \|$", md, re.M):
        name, tree, effect, cost = m.groups()
        kind = "passive" if "works passively" in effect else "utility" if "take up a common slot" in effect else "active"
        tree_id = tree.lower()
        abilities.append(
            Ability(
                id=f"{tree_id}-{_slug(name)}",
                name=name,
                tree=tree_id,
                kind=kind,
                effect=NO_TIME_SUFFIX.sub("", effect).strip(),
                cost=_cost(cost),
            )
        )
    return abilities


def parse_perks(md: str) -> list[Perk]:
    perks: list[Perk] = []
    tree: str | None = None
    desc: list[str] = []

    def flush() -> None:
        if perks and tree and desc and not perks[-1].effect:
            text = " ".join(desc)
            perks[-1].effect = PERK_FIXES.get(perks[-1].name, text)

    for raw in md.splitlines():
        line = raw.strip().rstrip("\\").strip()
        if m := re.match(r"### All (\w+) Perks", line):
            flush()
            tree, desc = m.group(1).lower(), []
            continue
        if tree is None or not line or line.startswith("!["):
            continue
        if line.startswith("**Swordmastery Perks**"):
            flush()
            tree = None
            continue
        if m := re.match(r"\[([^\]]+)\]\(https://bloodofdawnwalker[^)]*\)$", line):
            flush()
            perks.append(Perk(id=f"{tree}-{_slug(m.group(1))}", name=m.group(1), tree=tree, effect=""))
            desc = []
        elif line.startswith("**ULTIMATE"):
            perks[-1].ultimate = True
        elif perks:
            desc.append(line)
    flush()
    return perks


def build() -> SkillsDataset:
    abilities = parse_abilities((raw_dir(GAME) / "fx-abilities.md").read_text(encoding="utf-8"))
    perks = parse_perks((raw_dir(GAME) / "fx-perks.md").read_text(encoding="utf-8"))
    if len(abilities) != 27:
        raise ValueError(f"esperado 27 habilidades, veio {len(abilities)}")
    for tree in TREES:
        if sum(p.ultimate for p in perks if p.tree == tree.id) != 3:
            raise ValueError(f"esperado 3 perks Ultimate em {tree.id}")
    return SkillsDataset(trees=TREES, rules=RULES, abilities=abilities, perks=perks)
