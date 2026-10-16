"""Combate e níveis: resumo à mão das seções 'Combat!' e 'Leveling!' do guia do Greenside (só uma fonte).
As capturas do combate seguem o texto na fonte (ao contrário das dos chefes): `SHOTS` diz qual vai em qual tópico."""


from utils.common.paths import assets_dir, raw_dir
from utils.games.mewgenics.biome_images import IMG, SOURCE, shrink
from utils.games.mewgenics.constants import GAME
from utils.games.mewgenics.schemas import CombatDataset, CombatTopic, LevelBudget, LevelGuide, LevelReward

T = CombatTopic

# tópico -> índices das imagens da seção Combat! (a de índice 4, da vista tática, não mostra a vista simplificada)
SHOTS = {"facing": [0, 1], "range": [2, 3], "multi-turn": [5]}

GOLDEN_RULE = "Deal damage to the enemies before they deal damage to you."

TOPICS = [
    T(
        id="facing",
        title="Where are you facing?",
        text="At the end of your turn you can click a square to make your cat face it. Changing facing costs 0 action points. Being attacked from behind does 25% more damage, so keep your back to a wall.",
        tips=[
            "Enemies always go for a backstab if they can.",
            "Equip a Frying Pan and deliberately turn your cat away from an enemy, and you guarantee a counter attack.",
        ],
        caption="Facing is chosen by clicking a square at the end of the turn.",
    ),
    T(
        id="range",
        title="Are you in enemy range?",
        text="Hold the right mouse button on a mob to see its movement and ability range. As long as you stay off the blue and red squares, that enemy cannot hit you.",
        tips=[
            "Do not rush in on turn 1. Stay at the edge of an enemy's range, let it come to you, then strike.",
            "Cover blocks all dash attacks and most ranged attacks, and limits the tiles melee enemies can attack you from.",
            "A tanky cat left in range baits the whole enemy squad to rush it, so only one cat takes damage.",
        ],
        caption="Holding the right mouse button on a mob shows where it can move and hit.",
    ),
    T(
        id="vision",
        title="Can you see?",
        text="If decorations and foreground clutter the screen, hold Control for a simplified tactical view of where the enemies are in relation to you.",
    ),
    T(
        id="multi-turn",
        title="Enemies that cheat",
        text="Bosses, mini-bosses, certain enemies and champions take multiple turns in a round. The guide's example is the Albino Tom Toms in the Caves, which get 2 turns per round.",
        tips=[
            "Mentally multiply an enemy's attack range by its turns. Two tiles from Queen Hippo is not safe: her second turn lets her hit that cat quite badly.",
            "Poison and burn are incredible against multi-turn enemies, since their damage lands at the start of each turn. 10 poison and 10 burn do 20 damage per round to a regular enemy but 39 to an elite that acts twice (burn drops 1 per turn). The guide aims this at Queen Hippo, who takes many turns.",
        ],
        images=[],
        caption="Albino Tom Toms in the Caves get 2 turns per round.",
    ),
    T(
        id="rocks",
        title="Rocks and boulders",
        text="Both take only 1 damage per attack unless an ability says otherwise. Enemies use them against your cats, especially psychic enemies that knock boulders around, and so can your own Psychics.",
        tips=[
            "A rock slides in the direction it is hit, for infinite distance, from any knockback or physical damage. A diagonal physical hit (Butcher and Psychic basic attacks) makes it slide diagonally.",
            "A sliding rock deals 5 damage to whatever it hits plus 1 from knockback, 6 in total. Rocks block movement, so one can wall off a dangerous enemy.",
            "Boulders are knocked back only 1 tile, have more HP and deal 9 damage. Crater amoebas pick them up to deal 9 per turn, and high-knockback enemies like the Bunker's Robo-Tom-Toms use them too.",
        ],
    ),
    T(
        id="corpses",
        title="Corpses",
        text="Medium and large enemies leave a corpse when they die. Small mobs (flies, maggots, birds including the Druid Crow familiar) shatter instead.",
        tips=[
            "A corpse is an obstacle and blocks line of sight and rocks. You can walk through it but not stop on it.",
            "Corpses can be destroyed at once by certain abilities, notably the necromancer's and the 'consume' ability of zombified cats.",
            "Use enemy bodies to block each other. A chokepoint concentrates the damage on one tanky cat while lob attackers (Hunter, Necromancer, Monk) hit from behind.",
            "Enemies attack corpses that obstruct them, which wastes their turn.",
        ],
    ),
    T(
        id="priority",
        title="Target priority",
        text="Which enemy you remove first decides fights. The guide's counter example is a champion Carnibulb in the Crater: a player sent the fighter to one-shot a Tremblo, which stun-locked the fighter while the Carnibulb ate two teammates, and the loss wiped the team against the Crater Maker.",
        tips=[
            "Tremblos have only 2 movement and start at the back of the map. The champion Carnibulb's 5 HP Alien Bulbs and its 3 turns give it +3 movement per round, so by round 3 there is no escape from its instant kill.",
            "Killing the Alien Bulbs first would have cut its movement, then the whole team could deal 30 damage to the Carnibulb quickly while the Tremblos slowly marched in.",
        ],
    ),
]

LEVELS = LevelGuide(
    sources="Levels come from going on an adventure, winning combat and rare candies. All cats start at level 0, and the game splits levels evenly: the lowest-level cat gets the next one.",
    budget=[
        LevelBudget(what="1 level per cat at the start of the adventure", levels="4"),
        LevelBudget(what="The extremely rare '4 rare candies' event", levels="4"),
        LevelBudget(what="6 levels per biome on the hard paths (3 biomes)", levels="18"),
        LevelBudget(what="Rare candies sold in shops (1 per biome)", levels="3"),
        LevelBudget(what="Completing a chapter 4 / tier 4 biome (Throbbing Domain, The Rift, ...)", levels="3"),
    ],
    total="32 level ups for a team of 4: every cat reaches level 8 and is guaranteed level 7.",
    scenarios=[
        "3 cats, or 4 cats with one holding a neverstone (it stops that cat from getting levels, so they go to the others): up to level 10, guaranteed level 9.",
        "3 cats skipping the hard paths: level 8 if you complete the tier 4 biome, 7 if not, plus one cat at level 9 for each hard path you complete.",
        "2 cats to a tier 3 biome, no hard paths and no tier 4: both reach level 9. Two runs like that give a team of four level 9 cats, very valuable for home defence.",
        "All 3 acts and all difficulties have the same number of level ups, so a 3-cat run on Act 1 gives the same home defenders as on Act 3. Solo-running Act 3 only gives bragging rights.",
    ],
    rewards=[
        LevelReward(level="0 → 1", title="First spells", text="One active and one passive spell tied to your class. Free once you pick the collars (or none) for the team."),
        LevelReward(level="1 → 2", title="Spell", text="A choice of 3 spells from your class plus 1 collarless spell. With multi-class abilities (mutations, soul passives), the last two options come from those classes."),
        LevelReward(level="2 → 3", title="Passive", text="A choice of 3 passives from your class plus 1 collarless passive. If the cat was born with a passive, you can replace it or take +1 to a random stat."),
        LevelReward(level="3 → 4", title="Full heal and stat up", text="A full heal and 4 options of +2 to a stat of your choice. Plan 2 stats that help your build, for example Intellect or Charisma for an expensive spell."),
        LevelReward(level="4 → 5", title="Final spell", text="Choose your last spell. With 4 spells already, replace one or take +1 to a random stat and a full heal."),
        LevelReward(level="5 → 6", title="Spell upgrade", text="Upgrade one of your spells. Not every spell has an upgrade, but most do, so upgrade the one you use the most. Rerolling replaces all options with +1 to a stat of your choice."),
        LevelReward(level="6 → 7", title="Passive upgrade", text="Upgrade one of your passives or take a replacement passive. The non-upgrade options follow your class or multi-class abilities."),
        LevelReward(level="7 → 8", title="Full heal and stat up", text="Same as 3 → 4."),
        LevelReward(level="8 → 9", title="Passive upgrade", text="Same as 6 → 7."),
        LevelReward(level="10+", title="Stat", text="+1 to a stat of your choice from 4 options, instead of +1 based on your class."),
    ],
    mnemonic=[
        "Levels 2, 5 and 6 offer spells.",
        "Levels 3, 7 and 9 offer passive bonuses.",
        "Levels 4 and 8 offer full heals and stat ups.",
    ],
    tips=[
        "Every level from 2 to 9 also gives +1 to a stat based on your class.",
        "Levels 7-9 are the biggest power jump (improved spells and passives). Getting cats to level 6 before the 3rd biome makes them extremely strong, which is why 3-cat runs and neverstones are valuable.",
        "Hard paths are not required. You still get levels if you skip them, and losing 2-3 levels will not end a run the way champions with 3 turns per round will. If you are not confident in your team, skip them.",
        "A cat that inherits two spells and a passive from its parents effectively starts at level 3, so you can put a neverstone on it and keep its value.",
        "A 'pity cat' after losing a cat: letting it reach level 1 gives it a spell and a passive, so you trade one level to make it more effective.",
    ],
)


def attach(topics: list[CombatTopic]) -> None:
    md = (raw_dir(GAME) / SOURCE).read_text(encoding="utf-8")
    urls = IMG.findall(md.split("## Combat!")[1].split("## Leveling!")[0])
    for t in topics:
        t.images = [
            shrink(urls[i], assets_dir(GAME) / "combat" / f"{t.id}-{n}.jpg") for n, i in enumerate(SHOTS.get(t.id, []))
        ]


def build() -> CombatDataset:
    attach(TOPICS)
    return CombatDataset(golden_rule=GOLDEN_RULE, topics=TOPICS, levels=LEVELS)
