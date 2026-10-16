"""Itens de quest: resumo à mão da seção 'Quest Items' do guia do Greenside, com os nomes alternativos do guia de
100% (Steam 3674095836) e o Angry Face do guia 'Free Win' (3667334759)."""

from utils.games.mewgenics.biome_images import shrink, source_urls
from utils.common.paths import assets_dir
from utils.games.mewgenics.constants import GAME
from utils.games.mewgenics.schemas import Discrepancy, QuestDataset, QuestItem

Q = QuestItem

# Captura do evento final de uma quest do Act 3 (volcano), no Greenside
IMAGE_URL = "https://images.steamusercontent.com/ugc/14162359901420263609/D6E2B0496C33CAFF9DBC62B1B83EDC0AABF4B11D/"

MAIN_RULES = [
    "Main quest items come from winning a house defence. They follow a general rule: if any cat goes down, it dies instantly, so healing and damage mitigation are worth more than usual.",
    "They take no storage space and can only be assigned at the start of an adventure.",
    "They cannot be lost or broken, so if you fail you can try again.",
]

MAIN_ITEMS = [
    Q(
        id="gristle-cube",
        name="Gristle Cube",
        aka="Throbbing Gristle (100% guide)",
        unlock="Beat Guillotina 1, then complete the Caves.",
        text="A weapon that deals 8 damage. The guide calls it pretty valuable.",
        tips=["The Guillotina section calls the first-round reward a Meat Cube. The guides never say whether it is the same item."],
    ),
    Q(
        id="putrid-leech",
        name="Putrid Leech",
        unlock="Beat Guillotina 2, then complete the Boneyard.",
        text="The cat wearing it cannot level up, but gets lifesteal on its basic attack. It is cursed, so it cannot be swapped between cats.",
    ),
    Q(
        id="tinas-head",
        name="Tina's head",
        aka="Guillotina's Head (100% guide)",
        unlock="Beat Guillotina 3, complete the Boneyard or Caves, then go to the altar in the Throbbing Domain.",
        text="The wearer gets fear on contact damage. Every enemy targets that cat, and every fight becomes its hard-path version. The cat must be sacrificed at the end of the run, which gives a chance to fight the Throbbing King.",
    ),
    Q(
        id="cryogenic-time-chamber",
        name="Cryogenic Time Chamber",
        unlock="Complete the first chapter of Act 3, then beat the Throbbing King.",
        text="Also called the cooler. Any corpse left at the end of a round resurrects as an enemy with 30% of its HP, including corpses made by a necromancer.",
        tips=["Spammable ranged attacks and abilities that wipe out corpses are a lifesaver."],
    ),
    Q(
        id="flaming-orb",
        name="Flaming Orb",
        aka="Scalding Orb (100% guide)",
        unlock="Beat Pyrophina. Take it to the Moon boss.",
        text="Gives its wearer burn stacks and +2 speed every turn.",
        tips=[
            "Wet or debuff-cleansing powers are doubly valuable. Contact damage (melee or knockback) spreads the fire to other mobs.",
            "A burning cat walking into brambles ignites them, which blocks infested kittens and bramble babies from those tiles.",
            "No sacrifice needed: the cat holding the orb only has to stand in front of the Man in the Moon to be eaten and spat back out, which kills him instantly.",
        ],
    ),
    Q(
        id="black-shard",
        name="Black Shard",
        unlock="Beat Zartana. Take it to the Core.",
        text="Deals 1 damage that ignores shields, once per battle. If it kills an enemy it destroys the corpse and gains +1 damage permanently. At 20 damage (19 kills) it becomes the Glowing Black Shard, with lifesteal and burn 5, and kills the Coven in one hit.",
        tips=[
            "Summoned familiars (flies, maggots, leeches) are valid targets for charging it.",
            "If its owner is mind-controlled, it will kill your own cats. Use it as soon as possible against Marshmallow, Morana and Johnny.",
            "Its stat gains persist across adventures. One run is not enough at once-per-battle, so either spread the 19 kills over several runs or lift the restriction with Lil Battery, the Unrestricted passive or the Second Wind spell.",
            "Tinkerer's Robot Arms passive and the Multiplier trinket do not lift the restriction.",
        ],
    ),
    Q(
        id="duel-collar",
        name="Zartana / Pyrophina's collar",
        unlock="Win the Pyrophina vs Zartana duel. Deliver the winner to one of the obelisks in the Act 2 chapter 3 biome.",
        text="The one you helped joins your house, takes a trinket slot and fights with you, but is largely useless: it mostly moves and may do an AOE that hurts both sides. It will not retaliate if you attack it, and enemies prefer your cats as targets.",
        tips=[
            "Both have 100 mana, so mana steals like Borrow Mana are useful. Hitting them charges bonuses like Vein Hat's speed or the Thief's coins on crits.",
            "Taking Zartana to the Core: your tank can Eat Rock on her for armour. Taking Pyrophina: bring something that extinguishes allies she sets on fire.",
            "If either is hit by an instant kill (Death Worm, Carnibulb, Feast) the item breaks and the quest fails at once. This matters most for keeping Zartana alive in the Coven fight. End the adventure and try another day.",
        ],
    ),
]

MAIN_TIPS = [
    "Put Putrid Leech and Tina's head on the same cat and do both quests in one run. On a high-HP tank with a cleric, you get a lifesteal punching bag that never levels up, which keeps your other cats at levels 6-8 for the level 4 biome and its boss after the bag is sacrificed.",
    "Act 3 boss quests unlock The Infinite: the 100% guide lists the Receiver Antenna, Transmitter Antenna and Signal Amplifier. The Greenside guide does not cover them.",
]

SIDE_RULES = [
    "Side quest items come from sending mutated, deformed, diseased or disordered cats to Dr. Beanies. Each carries a stat penalty or debuff.",
    "Completing one unlocks a rare or legendary item in your inventory. Beanies sends you to the latest biome you can do on hard mode.",
    "If you fail, you send 5 more cats to Beanies to restock the item (not the Persuasion Device). You can hold at most 5 side quest items.",
    "Like main quest items, they take no storage and are assigned at the start of an adventure.",
]

SIDE_ITEMS = [
    Q(
        id="persuasion-device",
        name="Persuasion Device",
        text="Quest: recruit an enemy to your team. The item permanently charms a non-boss enemy, once per battle, and can break when you return home. Avoid 2x2 enemies: they walk over your cats and trample. Tank and ranged enemies are good picks, since they take or draw fire.",
        tips=["If you fail it, you never get another Persuasion Device. You need a new save to try again.", "The 'Free Win' guide says you keep it after the quest and can use it to charm your Angry Face cat back on the first mission."],
    ),
    Q(
        id="angry-face",
        name="Angry Face",
        text="Only listed in the 'Free Win' guide. The equipped cat becomes an enemy that you must down to win each battle, and it can still level up. Collarless cats cannot wear it, and it is cursed. You lose a unit and the enemy uses that cat against you in every fight, though you can equip items on the enemy team. On the guide's save it goes to the Boneyard; destinations are randomized.",
        tips=["The Free Win technique in the Advanced section pairs it with The Loner."],
    ),
    Q(
        id="the-loner",
        name="The Loner",
        text="Only listed in the 'Free Win' guide. It kills all of your allies at the start of each battle, so a normal run is solo. On the guide's save it goes to the Caves. The Mystical Blindfold (physical attacks and abilities always miss) makes its shots miss, but the Peace Symbol Face Paint does not stop it.",
        tips=["On an Angry Face cat, its 'allies' are the enemy team. See the Free Win technique in the Advanced section."],
    ),
    Q(
        id="spider-injector",
        name="Spider Injector",
        text="Infected 4 on all allies at the start of the battle, so cats that go down die instantly.",
        tips=["A healer or a status cleanse on the team is doubly valuable."],
    ),
    Q(
        id="ultra-vision",
        name="Ultra Vision 3000",
        text="Triples the number of events and skill checks in a run, with -2 to every skill check. You need cats with high base stats, and should ignore every event you can.",
        tips=[
            "Helps toward the Bionic set bonus: stack with Happy Helmet or Skull Plating, plus Robot Arm, Radar Dish or Frank Bolts.",
            "Do not pair it with the Magic Mirror.",
        ],
    ),
    Q(
        id="air-horn",
        name="Air Horn",
        text="Enemies get an extra turn at the start of a battle. Hard paths, bosses and champions are especially dangerous, since they act several times before your cats can.",
    ),
    Q(
        id="experimental-treatment",
        name="Experimental Treatment",
        text="You gain disorders instead of passive abilities when you level up. Levels 3 and 7 hit you, so reach level 3 quickly and stay below level 7.",
        tips=["Cheese: spread a mostly harmless contagious disorder like Pox among your cats, so at level 7 you can take a stat up instead of a new disorder. Jesters can re-roll the disorders offered."],
    ),
    Q(
        id="chaos-device",
        name="Chaos Device",
        text="Random spells and abilities on level up: every cat plays like a Jester. Among the easiest side quests, especially with items or mutations that re-roll level ups.",
    ),
    Q(
        id="stopwatch",
        name="Stopwatch",
        text="Gives all your cats the ADHD debuff. Among the more manageable ones, but wait until you are comfortable with turn planning.",
        tips=["Think about the next cat's turn while you play the current one."],
    ),
    Q(
        id="magic-mirror",
        name="Magic Mirror",
        text="Forces every event to fail or critically fail. It comes down to memorizing which options have the worst outcomes, such as taking damage versus gaining a disorder.",
    ),
    Q(
        id="bubble-boy",
        name="Bubble Boy",
        text="Effectively no melee: any melee damage dealt or taken counts as contact and bounces units around, including corpses. In narrow spaces, melee on high-HP enemies like bosses will kill your cat. Focus on ranged cats.",
        tips=[
            "There is a limit on rebounds. Obstacles count for rebounds but the map border does not, so the border is safer.",
            "Melee in open spaces is safe, and handles Daddy Shark and Carnibulb.",
            "The Fish Hook from the Caves gives melee attacks +5 damage instead of knockback. A Leather Jacket lets a melee cat one-shot bosses in narrow spaces.",
            "High-HP tanks with thorns outlast most enemies, which also makes thorned Junkyard enemies dangerous in melee. Druid crows can be sacrificed to make 2+ high-HP enemies bounce into each other.",
            "Do not pair it with Glass Cannon.",
        ],
    ),
    Q(
        id="unidentified-pills",
        name="Unidentified Pills",
        text="Sets the game to a higher difficulty. On impossible mode it gives excellent item luck. Otherwise it is good practice for harder modes, and the guide finds it more useful than its reward.",
    ),
    Q(
        id="mysterious-dice",
        name="Mysterious Dice",
        text="Destroys the level-up schema: abilities and passives upgrade immediately, at the cost of randomness. Good if your cats were born with good spells or passives, and for house defence prep.",
    ),
    Q(
        id="redacted",
        name="Redacted",
        text="Hides health and status effects mid-fight. You can still read posture and animations: the Man in the Moon's mouth is closed when he is stunned.",
    ),
    Q(
        id="glass-cannon",
        name="Glass Cannon",
        text="At the start of each fight every regular tile becomes glass, which punishes high-speed cats. Being attacked on glass adds 1 bleed per attack, so do not let enemies pile on one cat.",
        tips=[
            "Mutations that change basic movement (Mole mouth, Spring legs) and items or sets that give flight cheese it.",
            "Butchers, psychics, tanks and hunters do not need much movement. Terrain spells (druid) give a safe area, shield armour helps cats that need movement, and the plan is to make enemies come to you.",
            "Do not pair it with Bubble Boy.",
        ],
    ),
]

DISCREPANCIES = [
    Discrepancy(
        topic="Which option ends the quest?",
        sides=[
            "Greenside's text says never to select the option that bites or touches the resource and uses your quest item by accident, because you cannot go back and must redo the quest.",
            "The screenshot right under that text is captioned as an example where picking the other options fails the quest.",
        ],
        verdict="The two statements point in opposite directions. Read each option carefully before you choose at the end of a quest.",
    ),
    Discrepancy(
        topic="Item names",
        sides=[
            "Greenside: Gristle Cube, Flaming Orb, Tina's head.",
            "100% guide: Throbbing Gristle, Scalding Orb, Guillotina's Head.",
        ],
        verdict="Probably the same items under different names; the guides do not say so.",
    ),
]


# id do item -> índice da carta em `steam-3667334759` (o guia Free Win mostra as cartas no jogo)
CARDS = {"persuasion-device": 3, "angry-face": 0, "the-loner": 1}


def build() -> QuestDataset:
    urls = source_urls("steam-3667334759")
    for q in SIDE_ITEMS:
        if q.id in CARDS:
            q.image = shrink(urls[CARDS[q.id]], assets_dir(GAME) / "quests" / f"{q.id}.jpg")
    return QuestDataset(
        main_rules=MAIN_RULES,
        main_items=MAIN_ITEMS,
        main_tips=MAIN_TIPS,
        side_rules=SIDE_RULES,
        side_items=SIDE_ITEMS,
        image=shrink(IMAGE_URL, assets_dir(GAME) / "quests" / "event.jpg"),
        image_caption="End of an Act 3 quest: one option uses the quest item, the others do not.",
        discrepancies=DISCREPANCIES,
    )
