"""Rota das áreas: requisitos da lista de troféus (PSNProfiles) e do 100% achievement guide (Steam);
classes liberadas do 'How to Unlock all Classes'."""

from utils.games.mewgenics.breeding import PHASES
from utils.games.mewgenics.schemas import Act, Area, Discrepancy, Milestone, RouteDataset

ACTS = [
    Act(id=1, title="Act 1", summary="Alley first, then Sewers and Caves or Junkyard and Boneyard. House boss: Guillotina."),
    Act(id=2, title="Act 2", summary="Desert opens after Caves and Boneyard. House bosses: Pyrophina and Zaratana."),
    Act(id=3, title="Act 3", summary="Opens after the Core and the Moon. Past (Ice Age, Jurassic) or Future biomes."),
    Act(id=0, title="Secret areas", summary="Each one opens by finishing the quest items of an act's house bosses."),
]

A = Area

# needs: ids exigidos (vazio = disponível desde o início; None = as fontes não dizem). path: trilhas paralelas.
AREAS = [
    A(id="alley", act=1, name="The Alley", requires="Start", needs=[], note="Beginner-friendly. Weather: rain, wind and snow. Good for trying classes."),
    A(id="sewers", act=1, name="The Sewers", requires="Complete the Alley", needs=["alley"], path="A", unlocks="Cleric (on reach), Thief (on complete)", trophy="The Sewers"),
    A(id="caves", act=1, name="The Caves", requires="Complete the Sewers", needs=["sewers"], path="A", trophy="The Caves", note="Beating them with a Fighter alive in the party unlocks the Paw Breaker active."),
    A(id="junkyard", act=1, name="The Junkyard", requires="Complete the hard path in the Alley", needs=["alley"], path="B", trophy="The Junkyard", note="Very good items drop here; the hard path gives valuable furniture."),
    A(id="boneyard", act=1, name="The Boneyard", requires="Complete the Junkyard", needs=["junkyard"], path="B", unlocks="Necromancer", trophy="The Boneyard", note="Wind can be a map event here."),
    A(id="desert", act=2, name="The Desert", requires="Complete the Caves and the Boneyard", needs=["caves", "boneyard"], trophy="The Desert", note="A cactus gives water."),
    A(id="bunker", act=2, name="The Bunker", requires="Complete the Desert", needs=["desert"], path="A", unlocks="Tinkerer", trophy="The Bunker"),
    A(id="core", act=2, name="The Core", requires="Complete the Bunker", needs=["bunker"], path="A", unlocks="Butcher", trophy="The Core"),
    A(id="crater", act=2, name="The Crater", requires="Complete the Desert", needs=["desert"], path="B", unlocks="Druid", trophy="The Crater", note="Pick the shimmer weather effect when offered: it gives mutations."),
    A(id="moon", act=2, name="The Moon", requires="Complete the Crater", needs=["crater"], path="B", unlocks="Psychic", trophy="The Moon", note="Final fight is against the Man in the Moon."),
    A(id="lab", act=3, name="The Lab", requires="Complete the Core and the Moon", needs=["core", "moon"], unlocks="Monk", trophy="The Lab"),
    A(id="iceage", act=3, name="The Ice Age", requires="Fix the time machine", needs=["lab"], trophy="The Iceage"),
    A(id="jurassic", act=3, name="The Jurassic", requires="Complete the Ice Age", needs=["iceage"], trophy="The Jurassic"),
    A(id="future", act=3, name="The Future", requires="Complete the Jurassic", needs=["jurassic"], trophy="The Future", note="Hard path gives a guaranteed rare furniture piece."),
    A(id="end", act=3, name="The End", requires="Complete the Future", needs=["future"], trophy="The End"),
    A(
        id="throbbing", act=0, name="The Throbbing Domain", requires="Finish the three Guillotina item quests", needs=["caves", "boneyard"],
        trophy="The Throbbing Domain", note="Gristle Cube (complete the Caves), Putrid Leech (complete the Boneyard) and Guillotina's Head (the altar here).",
    ),
    A(
        id="rift", act=0, name="The Rift", requires="Finish the Pyrophina and Zaratana item quests", unlocks="Jester", trophy="The Rift",
        note="Black Shard, Scalding Orb and one of the collars.",
    ),
    A(id="infinite", act=0, name="The Infinite", requires="Finish the Act 3 boss item quests", trophy="The Infinite", note="Receiver Antenna, Transmitter Antenna and Signal Amplifier."),
]

# Marcos de casa: ligados a uma condição (a coluna `when`), não a uma data. Só ficam presos a uma área onde as fontes dizem.
# Os objetivos de criação seguem as fases do guia de breeding, por ato, de forma aproximada.
MILESTONES = [
    Milestone(
        id="butch", at="sewers", kind="home", title="Feed Butch", npcs=["butch"],
        when="A cat has been through the Sewers or the Junkyard",
        text="Retire it and send it to Butch. Storage is the first real bottleneck, and each zone you finish and tell him about unlocks a class.",
    ),
    Milestone(
        id="vendors", at="act1", kind="home", title="Tracy, Frank and Baby Jack", npcs=["tracy", "frank", "jack"],
        when="Butch has his first upgrades",
        text="Tracy takes cats 5+ days old (food storage, totems, blank collars), Frank takes any retired cat (rooms), Jack takes injured cats (furniture). The basic upgrades cost about 45 cats in all. Buy furniture with Stimulation and Appeal.",
    ),
    Milestone(
        id="tink", at="act1", kind="home", title="Take kittens to Tink", npcs=["tink"],
        when="You have 10 kittens to spare",
        text="Take at least his first two upgrades: without them you cannot see base stats or how inbred a cat is.",
    ),
    Milestone(
        id="mystery", at="act1", kind="home", title="Mystery Man", npcs=["mystery"],
        when="A cat dies on a run or at home",
        text="He takes dead cats and upgrades for each batch. No need to rush it.",
    ),
    Milestone(
        id="aim-1", at="act1", kind="breeding", title="Breeding aim: early",
        when="Roughly through Act 1",
        text=f"{PHASES[0].aim} Then: {PHASES[1].aim}",
    ),
    Milestone(
        id="guillotina", at="boneyard", kind="event", title="Guillotina attacks the house",
        when="You have beaten both the Caves and the Boneyard once",
        text="Sending one weak cat to fight resets the time between attacks.",
    ),
    Milestone(
        id="aim-2", at="act2", kind="breeding", title="Breeding aim: mid",
        when="Roughly through Act 2",
        text=f"{PHASES[2].aim} Then: {PHASES[3].aim}",
    ),
    Milestone(
        id="beanies", at="lab", kind="home", title="Dr. Beanies", npcs=["beanies"],
        when="You have beaten the Lab",
        text="He can hand out a special quest that brings Steven and the difficulty tiers. He also takes mutated or diseased cats for side quests. The house boss quest items come first.",
    ),
    Milestone(
        id="steven", at="iceage", kind="event", title="Steven and the difficulty tiers",
        when="You have completed the Ice Age",
        text="Greenside puts the difficulty screen here; the 100% guide puts it after the Lab quest. See the disagreement below.",
    ),
    Milestone(
        id="aim-3", at="act3", kind="breeding", title="Breeding aim: late",
        when="Roughly through Act 3",
        text=PHASES[4].aim,
    ),
]

NOTES = [
    "Each cat starts at level 0 and the lowest-level cat gets the next level. A 4-cat run can reach level 8; a 3-cat run (or a Neverstone on one cat) can reach level 10.",
    "Hard path: one extra fight and so one extra level-up. Hard mode is a separate thing: a difficulty tier chosen on the map (Normal, Hard, Crazy, Impossible).",
    "You do not redo the main quests on a higher difficulty. You unlock the next tier by re-fighting the 3 house bosses of that act.",
    "Quest items cannot be moved between cats once assigned, and they do not take storage space. If a cat holding a main quest item goes down, it dies instantly.",
]

DISCREPANCIES = [
    Discrepancy(
        topic="When do the difficulty tiers unlock?",
        sides=[
            "100% Achievement Guide: after you beat the Lab, Dr. Beanies gives a special quest. Completing it makes Steven appear on the map.",
            "Greenside: after completing the Ice Age, you get a talk from Steven and the difficulty interface.",
        ],
        verdict="Both describe Steven's arrival around the end of Act 3's opening biomes. Expect it after the Lab and the Ice Age.",
    ),
    Discrepancy(
        topic="The Crater",
        sides=[
            "PSN trophy list: Complete the Desert (same as the Bunker).",
            "How to Unlock all Classes: Druid unlocks when you complete the Crater.",
        ],
    ),
]


def build() -> RouteDataset:
    return RouteDataset(acts=ACTS, areas=AREAS, milestones=MILESTONES, notes=NOTES, discrepancies=DISCREPANCIES)
