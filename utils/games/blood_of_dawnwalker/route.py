"""Rota e orçamento de tempo (480 segmentos). Custos só entram quando uma fonte os cita."""

from utils.games.blood_of_dawnwalker.schemas import BudgetItem, RouteDataset, RoutePart, RouteStep

NOTE = (
    "Outline of the 10-part order from the KillerKitten walkthrough. "
    "Segment costs are only listed where a source states them; everything else is shown as unknown."
)

PARTS = [
    RoutePart(
        id="prologue",
        title="Prologue",
        focus="About 24 segments. Save your mother before sunset and finish 'Smoke and Ashes'.",
        steps=[
            RouteStep(text="Take Anca's medicine and answer 'I really have to go' (1 segment instead of 2)."),
            RouteStep(text="With Pieter agree to be home before dusk (1 segment instead of 3)."),
            RouteStep(text="Active side quests fail when sundown arrives, so do the quick ones before it."),
        ],
    ),
    RoutePart(id="part-1", title="Part 1 - Ambrus", focus="Laslea Glen and Briar Sloughs. Ruin Ambrus's activities and prepare the duel."),
    RoutePart(
        id="part-2",
        title="Part 2 - Crake",
        focus="Svartrau Outskirts. Start Crake's line and the Sanzhani chain.",
        steps=[
            RouteStep(text="Save Sara within 32 segments."),
            RouteStep(text="Finish the Sanzhani chain: it returns a full day.", note="Good Home unlocks the other four quests."),
        ],
    ),
    RoutePart(id="part-3", title="Part 3 - Bakir", focus="Svartrau City. Ruin Bakir's activities and reach the Lunar Game."),
    RoutePart(id="part-4", title="Part 4 - Northern areas", focus="Clear the northern areas."),
    RoutePart(id="part-5", title="Part 5 - Lacra", focus="Lacra's questline (22 segments)."),
    RoutePart(id="part-6", title="Part 6 - Anca and St. Mihai", focus="Anca's chain (22 segments) and the St. Mihai sword."),
    RoutePart(
        id="part-7",
        title="Part 7 - Xanthe",
        focus="Xanthe's side of the Court.",
        steps=[RouteStep(text="Shortcut: at night drop into the cathedral from the roof.")],
    ),
    RoutePart(id="part-8", title="Part 8 - Boar's Back and Tantari", focus="Remaining regions."),
    RoutePart(id="part-9", title="Part 9 - Finish Xanthe", focus="Finish Xanthe's quests."),
    RoutePart(
        id="part-10",
        title="Part 10 - Crake",
        focus="Close Crake's line and the story.",
        steps=[RouteStep(text="Manual save before the final quest ('A Deal with the Devil').")],
    ),
]

BUDGET = [
    BudgetItem(id="prologue", group="Fixed", name="Prologue", segments=24, note="Counted as spent from the start."),
    BudgetItem(id="sanzhani", group="Questlines", name="Sanzhani chain (Good Home + 4 quests)", segments=-16, optional=True, note="Gives back an extra full day. Trophy: The Tsarina's Favourite Human."),
    BudgetItem(id="anca", group="Questlines", name="Anca: Font of Life (4 quests)", segments=22, optional=True, note="8 + 4 + 4 + 6. 1800 XP, 4 skill points. Trophy: Sins of the Past."),
    BudgetItem(id="lacra", group="Questlines", name="Lacra (6 quests)", segments=22, optional=True, note="3 + 4 + 4 + 4 + 7, then Midnight Reckoning. Trophies: Misery Loves Company, The Patricide."),
    BudgetItem(id="crake", group="Questlines", name="Crake (10 quests)", segments=40, optional=True, note="4, ?, 5, 8, 6, 7, 3, 1, 3, 3 (Shadows in the Woods is not listed). Trophies: The Manumit, The Knyazmaker."),
    BudgetItem(id="ambrus-acts", group="Court", name="Ambrus: activities", note="Most cost 3 segments, cellars 1."),
    BudgetItem(id="bakir-acts", group="Court", name="Bakir: activities and Lunar Game"),
    BudgetItem(id="xanthe-acts", group="Court", name="Xanthe: activities and mansion"),
    BudgetItem(id="banners", group="Extras", name="Tear down 5 banners in Svartrau City", segments=5, optional=True, note="1 segment each, 100 XP each. Trophy: Capture the Flag."),
    BudgetItem(id="max-ability", group="Extras", name="Fully upgrade one ability", segments=5, optional=True, note="4 skill points. Trophy: Mastery."),
    BudgetItem(id="max-sword", group="Extras", name="Max all of Swordmastery", segments=90, optional=True, note="Rough figure from the Steam tips guide."),
    BudgetItem(id="silts-tower", group="Extras", name="Home Sweet Home (Silts tower)", segments=6, optional=True, note="To enter. Needed for Together Forever and the Arbiter's armour."),
]


def build() -> RouteDataset:
    return RouteDataset(total_segments=480, note=NOTE, parts=PARTS, budget=BUDGET)
