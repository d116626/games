"""Visão geral, dicas e discrepâncias entre fontes. Texto escrito à mão."""

from utils.games.blood_of_dawnwalker.schemas import Discrepancy, Fact, TipGroup, TipsDataset

FACTS = [
    Fact(label="Time limit", value="30 days = 480 time segments"),
    Fact(label="One day", value="16 segments (8 day + 8 night)"),
    Fact(label="Skill trees", value="3 (27 abilities, 64 perks)"),
    Fact(label="Endings", value="7 (4 main, 3 secret)"),
    Fact(label="Court", value="3 boyars, then Brencis"),
    Fact(label="Towers", value="11, night only"),
    Fact(label="Level cap", value="50"),
    Fact(label="Trophies (PS5)", value="47, 1 platinum, about 40 hours"),
]

GROUPS = [
    TipGroup(
        id="time",
        title="Time and saves",
        tips=[
            "Time only passes with actions that show an hourglass: quests, camps, ruins, spending skill points. Walking, fighting and fast travel are free.",
            "Make a manual save before Lacra's sixth quest, Crake's ninth quest and the Brencis meeting. Each starts a 1-2 hour sequence with no autosave before it.",
            "Waiting at a shrine wastes segments. Spending skill points is a better way to pass time when you must.",
            "Free ranks: Mercurial Fervour, Astral Communion, Compel Soul and Shapeshift cost no time.",
            "Digging a treasure map costs 1-2 segments: save first, check the loot and reload if it is poor.",
            "A few brews last in segments instead of seconds (for example Potent Revitalizing Tonic, 3 segments). Only one of that type can be active.",
        ],
    ),
    TipGroup(
        id="combat",
        title="Combat",
        tips=[
            "Holding block stops any basic attack and gives you a window to heal or use an ability.",
            "If blocking feels hard there is an auto-block option in the gameplay settings (Omniblock rank 4 does something similar).",
            "Enemies with a red skull are tough but can be defeated.",
            "Burning Blood does not stop Dirty Trick: burn a target, blind it and it is stunned while the damage ticks.",
            "Shadowstep also teleports you behind a foe and slows time for a moment. It costs stamina.",
            "Weapon and Claw Arts use a cooldown instead of charges and give invincibility frames, useful against unblockable attacks.",
        ],
    ),
    TipGroup(
        id="gear",
        title="Gear and money",
        tips=[
            "Upgrades: the Armourer in Maragir, the Blacksmith in Parlita (also sells the Growing Momentum manual) and Vera the witch (swamp west of Maragir Wealds; also manuals, recipes and ingredients).",
            "Upgrade levels raise damage or armour; every 10th level boosts the item's bonuses. Jewellery is only worth upgrading past level 20-30. Upgrades are expensive.",
            "'Sell junk' only sells grey goods. Check the trade goods tab for gold and silver.",
            "Shrines work as storage (36 slots, expandable). Fast travel and Wait are the other functions.",
            "Stealing adds Infamy in small steps with no time cost. Save first, or fight or pay if caught.",
            "Never sell legendary items: most exist once, and Gear of the Gods needs them.",
        ],
    ),
    TipGroup(
        id="vampire",
        title="Corruption and blood",
        tips=[
            "Drinking blood raises Corruption, which gates Vampirism abilities and perks. Shapeshift opens at low Corruption (level 2 per PSNProfiles) and costs no time.",
            "Vampirism needs Corruption 15 for its Ultimate perks.",
            "Staying at very low health at night can make Coen lose control in dialogue (the Feral Hunger trophy).",
            "Compel Soul works by day only, but a body with red moths found at night can be compelled the next day to raise your cooldown bonus.",
        ],
    ),
]

DISCREPANCIES = [
    Discrepancy(
        topic="Segments per day",
        detail="Fextralife describes 8 bars. Steam and PSNProfiles say a full day is 16 segments. Both fit: day and night phases are 8 each.",
    ),
    Discrepancy(
        topic="Ultimate perk cost",
        detail="Fextralife says 35 skill points; Steam says 39 (35 in the tree plus 4 for the perk). Treated as the same rule.",
    ),
    Discrepancy(
        topic="Which perks are Ultimate",
        detail="Fextralife marks each Ultimate with a label under the perk's own entry. Names were read that way; verify in game.",
    ),
    Discrepancy(
        topic="Court order",
        detail="Fextralife suggests Ambrus, Bakir, then Xanthe. PSNProfiles boss levels are Ambrus 25, Xanthe 28, Bakir 30, which would put Xanthe before Bakir.",
    ),
    Discrepancy(
        topic="Together Forever loops",
        detail="Steam and Fextralife: 4 full loops, choice on the 5th. PSNProfiles: 5 rescues, trapped on the 6th entry.",
    ),
    Discrepancy(
        topic="Perk lists",
        detail="Some Fextralife perk icons do not match their names, and Fate's Favour and Nourishing Blood appear in two trees.",
    ),
]


def build() -> TipsDataset:
    return TipsDataset(facts=FACTS, groups=GROUPS, discrepancies=DISCREPANCIES)
