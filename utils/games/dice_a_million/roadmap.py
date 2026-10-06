"""Roteiro de alto nível para completar o jogo (e chegar à promoção final), escrito à mão.

Fontes: guia de conquistas e wiki da Steam, wiki Miraheze (Shattered Die, Powers, Hollow Ring, Black Hand)
e o tópico "Guide to unlock hidden things". Nomes de conquistas em `unlocks` viram ids no `build_roadmap`.
Onde as fontes divergem ou não dizem nada, o passo leva um `warning`.
"""

import re

from utils.games.dice_a_million.schemas import Achievement, CatalogItem, HandGoal, HandUnlock, Roadmap, Stage, Step

# (nome da mão, nome da conquista com o ícone | None, regex que a identifica no texto das conquistas)
HANDS: list[tuple[str, str | None, str]] = [
    ("White Hand", None, r"white"),
    ("Red Hand", "Red Hand", r"red"),
    ("Green Hand", "Green Hand", r"green"),
    ("Purple Hand", "Purple Hand", r"purple"),
    ("Blue Hand", "Blue Hand", r"blue"),
    ("Yellow Hand", "Yellow Hand", r"yellow"),
    ("Pale Hand", "Pale Hand", r"pale"),
    ("Bicolor Hand", "Bicolor Hand", r"bicolor|binary"),
    ("Static Hand", "Static Hand", r"static"),
    ("Black Hand", "Black Hand", r"black"),
    ("Hollow Hand", None, r"hollow|hidden|\?\?\?"),
    ("Cyan Hand", "Cyan Hand", r"cyan"),
]

GOALS = {
    "face3": r"beat (?:face 3|the game) as (.+?)\.?$",
    "million": r"million pips as (.+?)\.?$",
    "rush": r"beat dice ?rush as (.+?)\.?$",
    "promotion": r"promoted as (.+?)\.?$",
    "power6": r"power vi as (.+?)\.?$",
}

HAND_UNLOCKS: list[tuple[str, str, str | None]] = [
    ("White Hand", "Unlocked from the start. Begins with a Reroll card.", None),
    ("Red Hand", "Beat Face 1. White is your only hand at first, so you do it with White.", "White Hand"),
    ("Green Hand", "Have at least 25 dice in your bag while playing Red Hand.", "Red Hand"),
    ("Blue Hand", "Beat the Face 1 boss without taking any ring. Might take a few attempts.", None),
    ("Purple Hand", "Have at least 5 enchanted dice in your bag (shops, Enchant cards or enchantment rooms).", None),
    ("Yellow Hand", "Get a single die to 1000 extra value. D7, D8, D10, D12, Psychodie and Exodie stack it.", None),
    ("Pale Hand", "Get every stamp multiplier to at least 1.5X.", None),
    ("Bicolor Hand", "Defeat The Even and The Odd bosses 5 times each. Bicolor itself never meets them, so use another hand.", None),
    ("Static Hand", "Reach the secret Static shop (see Dice Rush) and empty it.", None),
    ("Hollow Hand", "Win a round with an empty bag, then show the Hollow Ring to the Phone Guy after the Face 3 boss.", None),
    ("Black Hand", "Get the last promotion: promote on Power VI with any hand.", None),
    ("Cyan Hand", "Not documented. A patch note mentions fixing 'the new hand not unlocking when going to The Vortex', so entering The Vortex is the likely unlock.", None),
]

# Dados iniciais e dicas, só onde a wiki Miraheze documenta a mão.
HAND_NOTES: dict[str, tuple[str, list[str]]] = {
    "White Hand": ("8 D3 and 5 D4", ["No special rule, so there are no hand-specific synergies."]),
    "Red Hand": ("8 Bottle Caps", ["Works well with a small-hand combo."]),
    "Blue Hand": (
        "10 D3, 1 D6 and 1 D10",
        [
            "Extra ring slots let you hoard rings for future synergies and discard the weak ones more freely.",
            "Rare rings show up more often, so _r1ng and Fractal Ring are likelier.",
        ],
    ),
    "Bicolor Hand": (
        "",
        ["Has 6 hand size and 6 dice per turn. Every roll must be all odd or all even, or every die is discarded.", "The Even and The Odd never appear when you play it."],
    ),
    "Cyan Hand": (
        "",
        ["Added in patch 1.1 with its own combo mechanic and a special Power V modifier. No source describes the rules yet.", "The Capricious and The Glutton never appear when you play it."],
    ),
    "Black Hand": (
        "10 D6 and 5 random occult dice (never Psi or Epsilon)",
        [
            "The early game is tough because you start at 0.2 power. Roll occult dice early to raise it.",
            "Keep about 4 occult dice in the bag at once, more will clog it.",
            "Scales well with high-value dice like Pinata or D666 once your power is up.",
            "J's Die and Shattered Die are occult dice with no downside, but they are removed after Face 3 if you go for a promotion.",
        ],
    ),
}

FACES_WARNING = (
    "Sources disagree on the piece prices: the Miraheze wiki says 500 / 5,000 / 50,000 pips, "
    "the Steam wiki says 500 / 50k / 1M. Bring plenty of pips."
)

STAGES: list[Stage] = [
    Stage(
        id="first-wins",
        title="Learn the loop, beat Face 1",
        goal="Win your first Face. This unlocks the Red Hand and starts the whole unlock chain.",
        steps=[
            Step(
                title="Pay your first debt",
                body="Every round asks for a pip target. Reach it with your rolls, then spend what is left in the shop.",
                unlocks=["Sudoku"],
            ),
            Step(
                title="Restart bad starts",
                body="If the starting offer has no solid passive ring or strong die, hold R and restart. A weak start rarely survives the first Face.",
            ),
            Step(
                title="Beat any boss, then Face 1",
                body="Each Face ends with a boss that has a gimmick. Beating Face 1 unlocks the Red Hand.",
                unlocks=["Star Ring", "Time Bomb", "Red Hand"],
            ),
            Step(
                title="Lose on purpose when you are stuck",
                body="Losing a run and losing to a boss each unlock something. Cheap to farm when a run is already dead.",
                unlocks=["Consolation Prize", "Last Breath"],
            ),
        ],
    ),
    Stage(
        id="beat-the-game",
        title="Finish the game once",
        goal="Beat Face 3. It opens challenges, Vortex and the shattered die that leads to Faces 4 to 6.",
        steps=[
            Step(title="Beat Face 2", body="Beating Face 2 gives you the Mimic Die.", unlocks=["Mimic Die"]),
            Step(
                title="Beat Face 3",
                body="Winning Face 3 counts as beating the game. It unlocks Challenges and the transition to Vortex, "
                "and the first shattered die piece starts appearing in the Face 1 shop.",
                unlocks=["Mahjong Tile"],
            ),
            Step(
                title="Reroll a boss that wrecks your build",
                body="On the map, before a boss round, you can banish that boss for the rest of the run. "
                "The first reroll in a run is free, every one after that permanently costs 2 max ring slots (patch 1.0.25).",
            ),
            Step(
                title="Check the Strategy and Bosses sections",
                body="Combos, build priorities and every boss gimmick are below. Most failed Face 3 runs die to a boss you did not plan for.",
            ),
        ],
    ),
    Stage(
        id="hands",
        title="Unlock every hand",
        goal="Each hand changes hand size, rolls and rules, and most goals later are per hand.",
        steps=[
            Step(
                title="Follow the unlock chain",
                body="Red comes from Face 1, Green needs Red, and the rest have their own conditions. See the chain right below.",
                unlocks=["Red Hand", "Green Hand", "Blue Hand", "Purple Hand", "Yellow Hand", "Pale Hand", "Bicolor Hand"],
            ),
            Step(
                title="Blue Hand is the odd one",
                body="Do not take rings in Face 1 and beat its boss. Do it early, it is the only hand locked behind a handicap.",
            ),
            Step(
                title="Save Static, Hollow and Black for later",
                body="They need the secret Static shop, an empty bag and a promotion respectively. Each has its own stage below.",
            ),
        ],
    ),
    Stage(
        id="powers",
        title="Climb the Power ladder",
        goal="Powers I to VI make the game harder. Each hand climbs on its own.",
        steps=[
            Step(
                title="Unlock Power N+1 per hand",
                body="Beat Face 3 on Power N with a hand to unlock Power N+1 for that hand only. Challenges always play on Power 0.",
            ),
            Step(
                title="Collect the Power gems",
                body="Beating the game on Power I to VI gives one gem die each, Amethyst up to Jet.",
                unlocks=["Amethyst", "Sapphire", "Emerald", "Amber", "Ruby", "Jet"],
            ),
            Step(
                title="Expect curses from Power III",
                body="From Power III every die has a 6% chance of being cursed. Magic Sponge removes curses.",
            ),
            Step(
                title="Power IV raises later rounds",
                body="The developer compares the boss reroll penalty to what Power IV does: it raises the value of every later round.",
                warning="Each level adds one stacking rule and some add exclusive mechanics, but no source lists every level. "
                "Cyan Hand also has a special Power V modifier. Only curses (Power III) and this Power IV effect are documented.",
            ),
            Step(
                title="Power VI per hand is the long grind",
                body="Each hand has its own Power VI reward (matrix below). It is the hardest repeatable goal of the game.",
            ),
        ],
    ),
    Stage(
        id="mastery",
        title="Master each hand",
        goal="Every hand has up to five goals. Each gives a die, ring or card.",
        steps=[
            Step(
                title="Work through the matrix hand by hand",
                body="Beat Face 3, reach 1M pips, beat Dice Rush, get promoted and beat Power VI. Pick the hand that fits your best build.",
            ),
            Step(
                title="Weak hands first on Power 0",
                body="Do Face 3 and 1M pips on easy settings, and push Power VI only with a build that already snowballs.",
            ),
        ],
    ),
    Stage(
        id="dice-rush",
        title="Open Dice Rush and the Static shop",
        goal="Dice Rush is a separate mode unlocked mid-run. Clearing it with each hand gives a card.",
        steps=[
            Step(
                title="Donate stars",
                body="After a boss, donate stars at the shop until the message 'something changes in Face X' appears.",
            ),
            Step(
                title="Go to the black cube",
                body="A new node shows up on the map (a glitched spot). You need 25k pips to enter.",
            ),
            Step(
                title="Static shop and Static Hand",
                body="Inside, the Static shop lets you pay to unlock secrets. Sacrifice one die of each rarity "
                "(common, uncommon, rare, legendary) and a chest with the Static Hand appears.",
                unlocks=["Static Hand"],
                warning="One source also says to reroll everything, buy every die and buy the gilded ring. "
                "Both may be parts of the same shop.",
            ),
            Step(
                title="Beat Dice Rush with every hand",
                body="Each hand has a card as the reward, and Power VI has its own.",
                unlocks=["Resurrect", "Ace of Stars"],
            ),
        ],
    ),
    Stage(
        id="promotion",
        title="Promotion: Faces 4 to 6",
        goal="The deepest content documented. Collect all three shattered die pieces, then beat Face 6.",
        steps=[
            Step(
                title="Run 1: beat Face 3 (any hand)",
                body="Nothing to buy yet. Winning Face 3 for the first time makes the first shattered die piece appear in future Face 1 shops.",
            ),
            Step(
                title="Run 2: buy piece 1, beat Face 3 with it",
                body="Buy piece 1 in the Face 1 shop and keep it in your bag. After the Face 3 boss, show it to the Phone Guy at the end of the run. "
                "That unlocks piece 2 for Face 2 shops.",
                unlocks=["First Piece"],
                warning=FACES_WARNING,
            ),
            Step(
                title="Run 3: buy pieces 1 and 2, beat Face 3",
                body="Piece 1 in Face 1, piece 2 in Face 2. Beat Face 3 holding both and show them to the Phone Guy. That unlocks piece 3 for the Face 3 shop. "
                "A piece only appears if you owned the previous one when you beat Face 3.",
                unlocks=["Second Piece"],
            ),
            Step(
                title="Run 4: buy all three, beat Face 3, show them",
                body="Buy piece 1, 2 and 3 (the last one in the Face 3 shop). Beat Face 3 holding all three and show them to the Phone Guy. "
                "That rebuilds J's Die (the strange die, achievement 'Rebuild a strange die') and Face 4 opens.",
                unlocks=["J's Die"],
                warning="Pay for each piece only in its own Face, so save pips for it. Buying it right before the boss is fine. "
                "The Steam guides say to show the pieces to the Phone Guy after the Face 3 boss, the wiki only says to beat Face 3 holding them. Do both to be safe.",
            ),
            Step(
                title="Faces 4 to 6, then beat Face 6 to get promoted",
                body="With Face 4 open, push on to Face 6. Getting promoted gives each hand a die, so do it once per hand.",
                warning="The game ends with a video and nothing is documented past promotion. The developer plans a new ending for a later update, so there is no true ending to unlock yet.",
            ),
            Step(
                title="Black Hand: promote on Power VI",
                body="The last promotion unlocks the Black Hand. Any hand works.",
                unlocks=["Black Hand"],
            ),
        ],
    ),
    Stage(
        id="hollow",
        title="Hollow Hand and the Phone Guy",
        goal="The trickiest secret. It needs an empty bag.",
        steps=[
            Step(
                title="Empty your bag and win a round",
                body="Remove every die (the last one cannot be sold). Keep a die that destroys itself, like Pinata or Porcelain Figurine, "
                "and roll it. Exhausting does not count, they must be removed. Win the round anyway and you are offered the Hollow Ring.",
                warning="Safest to do it right before the Face 3 boss with a lot of pips saved, to rebuy dice after.",
            ),
            Step(
                title="Show a Hollow die or the ring to the Phone Guy",
                body="After the Face 3 boss, show it to the phone guy. Hollow dice come from the Mega Die, the Hollow boss or the ring.",
                unlocks=["Evil Eye"],
            ),
            Step(
                title="Play the Hollow Hand to the phone",
                body="Pick up the phone as Hollow Hand after Face 3 before rolling (take the arrow to the left). "
                "Promote as Hollow Hand and answer the call afterwards.",
                unlocks=["This number doesn't exist", "Message from the past", "Mystery Gift"],
            ),
        ],
    ),
    Stage(
        id="vortex",
        title="Vortex",
        goal="An endless mode after Face 3. It gives no important unlocks, so play it when you like your build.",
        steps=[
            Step(
                title="Reach the exit",
                body="You enter it after Face 3. There are 13 levels in total. Reach the exit, level 4, 7 and 10 for the four achievements.",
                unlocks=["The Vortex", "Vortex Apprentice", "Vortex Local", "Vortex Master"],
            ),
            Step(
                title="Level 13 needs NaN",
                body="Beating level 13 means reaching a number the game cannot represent. Don't rush it. A build you enjoy gets there on its own.",
            ),
        ],
    ),
    Stage(
        id="challenges",
        title="Challenges",
        goal="Unlocked after beating the game once. They only give background visuals.",
        steps=[
            Step(title="Do them last", body="Challenges only unlock backgrounds, so move on to them once you are an experienced player."),
            Step(title="Easy ones", body="I can't believe it's not a D6 and Natural 6 are regular runs. Ringless needs a strong early combo.", unlocks=["I can't believe it's not a D6", "Natural 6", "Ringless"]),
            Step(title="Carlos was here", body="Roll packs until you find the Equity Ring.", unlocks=["Carlos was here"]),
            Step(title="Peanuts!", body="Chase 666s with +6 stamps and multiplying dice.", unlocks=["Peanuts!"]),
            Step(title="Glass Devourer", body="Enchant a Mega Die with Eternal (Enchant cards), then roll it once for infinite Hollow dice.", unlocks=["Glass Devourer"]),
            Step(title="Blackjack", body="Look for Sapphire or Bomb plus multipliers and put every point into +6. Use a calculator.", unlocks=["Blackjack"]),
            Step(title="Cursed! and ULTRAHARD", body="Easier than Power VI runs. Aim for multipliers.", unlocks=["Cursed!", "ULTRAHARD"]),
        ],
    ),
    Stage(
        id="cleanup",
        title="Cleanup: odd secrets",
        goal="Small unlocks that do not fit anywhere else.",
        steps=[
            Step(title="Echo Cube", body="Flick the falling dice in the main menu background. Pure luck and patience.", unlocks=["Echo Cube"]),
            Step(title="Minidie", body="Manually remove a Double Dice (the die inside a die) in the shop.", unlocks=["Minidie"]),
            Step(title="Dicecoin", body="Pass a round without rolling a single die.", unlocks=["Dicecoin"]),
            Step(title="Pandora's Box and the rest", body="Everything else unlocks by playing. Look it up in the Index at the end.", unlocks=["Pandora's Box"]),
        ],
    ),
]


def match_hand(text: str) -> str | None:
    for name, _icon, pattern in HANDS:
        if re.search(pattern, text, re.I):
            return name
    return None


def build_roadmap(achievements: list[Achievement], catalog: list[CatalogItem]) -> Roadmap:
    by_name = {a.name: a.id for a in achievements}
    hand_effects = {i.name: i.effect for i in catalog if i.kind == "hands"}

    def resolve(names: list[str]) -> list[str]:
        missing = [n for n in names if n not in by_name]
        assert not missing, f"unknown achievements in roadmap: {missing}"
        return [by_name[n] for n in names]

    stages = [
        stage.model_copy(
            update={"steps": [s.model_copy(update={"unlocks": resolve(s.unlocks)}) for s in stage.steps]}
        )
        for stage in STAGES
    ]
    icons = {name: by_name[icon] if icon else None for name, icon, _ in HANDS}
    hands = [
        HandUnlock(
            name=n, icon=icons[n], requirement=req, after=after, effect=hand_effects.get(n),
            starter=HAND_NOTES.get(n, ("", []))[0] or None, tips=HAND_NOTES.get(n, ("", []))[1],
        )
        for n, req, after in HAND_UNLOCKS
    ]
    rows = {name: HandGoal(hand=name, icon=icons[name]) for name, _icon, _p in HANDS}
    for a in achievements:
        for goal, pattern in GOALS.items():
            m = re.search(pattern, a.how or "", re.I)
            if m and (hand := match_hand(m.group(1))):
                setattr(rows[hand], goal, a.id)
    return Roadmap(stages=stages, hands=hands, goals=list(rows.values()))
