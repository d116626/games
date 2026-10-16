"""Primeira hora e vizinhos: escrito à mão a partir do Getting Started, Early Game Tips e do post do Reddit."""

from utils.games.mewgenics.schemas import Npc, StartDataset, Step, StepItem

STEPS = [
    Step(
        title="Collect strays, not perfection",
        text="Early on you have few rooms and little furniture, so breeding is slow. Take every stray out on adventures and keep them unless you run out of space; the game is about numbers at this stage. Strays left outside the house are not fed.",
    ),
    Step(
        title="Check the kittens every morning",
        text="Look over the night's kittens. Poor stats, a bad mutation or a disorder that will hurt: send them to Tink. Ten kittens unlock the first details on your cats, and his first two upgrades show base stats and inbreeding.",
    ),
    Step(
        title="Feed Butch first",
        text="Send him cats that have been to the Sewers or Junkyard. Storage is the first real bottleneck, because the Boneyard and Junkyard drop very good items.",
    ),
    Step(
        title="Then Tracy, Frank and Jack",
        text="Tracy gives food storage, totems and blank collars. Frank gives rooms. Jack sells furniture. The basic upgrades of these vendors cost about 45 cats in total. Storage upgrades only work once you place them in the house like furniture.",
    ),
    Step(
        title="Buy stimulation and appeal",
        text="Furniture with Stimulation improves the stats and abilities that kittens inherit; Appeal brings better strays. Stock refreshes every Sunday, so buy food only in a way that lets you refresh the shop.",
    ),
    Step(
        title="Read the enemies, take the hard path when sure",
        text="Right-click an enemy to see its movement and attack range. The hard path adds one fight and so one level-up, but skipping it is fine if your team is not ready.",
    ),
    Step(
        title="Know who takes which cats",
        text="Do not wait for an old cat to die: donate it to the right neighbour first. Who takes what:",
        items=[
            StepItem(name="Butch", text="cats that have adventured (Sewers or Junkyard first)."),
            StepItem(name="Frank", text="any retired cat."),
            StepItem(name="Tracy", text="cats that are 5+ days old."),
            StepItem(name="Jack", text="injured cats."),
            StepItem(name="Tink", text="kittens."),
            StepItem(name="Dr. Beanies", text="mutated, deformed, diseased or disordered cats, 5 per quest item."),
            StepItem(name="Mystery Man", text="cats that died, on a run or at home."),
        ],
    ),
]

NPCS = [
    Npc(
        id="butch",
        name="Butch",
        priority=1,
        role="Storage and classes",
        takes="Retired cats that have adventured (Sewers or Junkyard first)",
        gives=["Storage upgrades (more item space)", "Unlocks a class each time you finish a zone and talk to him", "Combat tips"],
        tip="Use the storage filters before you throw anything away; items thrown in the trash by mistake are gone.",
        trophy="Storage upgrade 7",
    ),
    Npc(
        id="tracy",
        name="Tracy",
        priority=2,
        role="Food, totems and blank collars",
        takes="Cats at least 5 days old",
        gives=["Food storage", "Totems (+5 to a random house stat, with special effects)", "Blank collars (up to 3, duplicate a random class)", "Sells furniture"],
        tip="Upgrades only work once you physically place the storage in the house. The class of each blank collar shows on the box before a run.",
        trophy="Mysterious Idol unlock 7",
    ),
    Npc(
        id="frank",
        name="Frank",
        priority=3,
        role="Rooms",
        takes="Any retired cat",
        gives=["More rooms and the attic", "Each room holds 4-5 cats before comfort goes negative"],
        tip="Until he has 25 cats you are limited to about 8 good cats at a time. Aim for the attic and two rooms.",
        trophy="House upgrade 4",
    ),
    Npc(
        id="jack",
        name="Baby Jack",
        priority=4,
        role="Furniture shop",
        takes="Injured cats",
        gives=["Furniture with Appeal and Stimulation", "Shack upgrades"],
        tip="His stock resets every Sunday, so check the calendar in the top left.",
        trophy="Jack's shack upgrade 4",
    ),
    Npc(
        id="tink",
        name="Tink",
        priority=5,
        role="Breeding information",
        takes="Kittens (10 per batch)",
        gives=["Cat icons, libido, aggression", "Inbreeding level and orientation", "Base stats and family tree", "Breeding tips"],
        tip="Take at least the first two upgrades. Without them you cannot see a cat's base stats or whether it is inbred. Do not level him past that.",
        trophy="Tink reward 7",
    ),
    Npc(
        id="beanies",
        name="Dr. Beanies",
        priority=6,
        role="Side quests",
        takes="Mutated, deformed, diseased or disordered cats (5 per quest item)",
        gives=["Side quest items with a penalty, then a rare or legendary reward", "Up to 200 gold per quest"],
        tip="Last NPC you unlock. Do the house boss quest items first; the side quests can wait.",
    ),
    Npc(
        id="mystery",
        name="Mystery Man",
        priority=7,
        role="Dead cats",
        takes="Cats that die on a run or at home",
        gives=["Upgrades for each batch of dead cats"],
        tip="Early Game Tips calls the NPC who takes dead cats the Organ Grinder; the trophy list calls him Mystery Man. It is probably the same one.",
        trophy="Mystery man upgrade 7",
    ),
]

NOTE = (
    "Order and numbers come from Greenside's Getting Started guide, Early Game Tips and the Steam 100% achievement guide. "
    "Which NPC to level first is an opinion: all three guides put Butch first."
)


def build() -> StartDataset:
    return StartDataset(steps=STEPS, npcs=NPCS, note=NOTE)
