from utils.games.dice_a_million.schemas import Strategy, TipGroup

NEON = "Neon Lights Media"
COMBOS = "Steam: combos and strategies"
PATCH = "Official patch notes (Steam)"

STRATEGY = Strategy(
    groups=[
        TipGroup(
            title="The run loop",
            source=COMBOS,
            tips=[
                "Pick a hand. Each one changes your hand size and number of rolls.",
                "Reach the pip goal in the dice arena. Leftover pips are your currency for the shop.",
                "Pick a reward, or skip it. Skipping is sometimes best: every die you add makes the others harder to draw.",
                "In the shop, rerolling and removing dice get expensive fast. The stock refreshes at the next stop.",
                "On the world map you can spend pips to roll for rewards. Skip it if the odds are poor (3 sixes with only 3 dice that can roll a 6).",
                "Each face ends with a boss that has a gimmick. Repeat until the end of the game.",
            ],
        ),
        TipGroup(
            title="Starting a run",
            source=NEON,
            tips=[
                "The game offers a card, a stamp, a dice booster pack or a mystery bag. If it has no solid passive ring or top-tier die, restart.",
                "Hold R to restart quickly and reroll the starting items.",
                "You can save-scum some shops (such as bags of rings).",
            ],
        ),
        TipGroup(
            title="Dice combos",
            source=COMBOS,
            tips=[
                "8-Ball + Sudoku: 8-Ball makes every face at least 8, and Sudoku gives x5 to dice with the same face.",
                "E.T. Die + Paper Die or Spintop: copies pile up into huge bonuses. Add the Echo enchantment and E.T. triggers every roll.",
                "Tesseract + E.T. Die: infinite dice from it copying itself.",
                "Shirt Button + any die: nearby dice stay on the table until the end of the round, so you effectively roll all of them.",
            ],
        ),
        TipGroup(
            title="Dice worth drafting",
            source=f"{NEON} and {COMBOS}",
            tips=[
                "Electric Die: arguably the best die for stacking multipliers. Draft it immediately.",
                "Translucid dice flood your hand with multiplier potential.",
                "Mirror Die gets powerful once the deck is trimmed. Keep a Paper Die for bosses that punish multiplier builds.",
                "Shirt Button, Paper Die, Sudoku (x5), Double Dice (removing it gives a Minidie), Minidie, Spintop, E.T. Die, Tesseract, Jet and Incubus Die are all strong picks.",
                "Raw scoring dice such as D100 or D666 are fine, but don't bloat the hand: a thick deck never draws its winning combo.",
                "Forget odd/even gimmick decks. You need high numbers and, more importantly, big multipliers.",
            ],
        ),
        TipGroup(
            title="Dice to avoid",
            source=COMBOS,
            tips=[
                "Marble (unless doing a marble run), Time Bomb, Atom Die, Odd/Even of Dice.",
                "Lucky 7! (33% chance to discard every die), Fire Die (the fire ruins your other dice) and Wind-Up Die (can roll either of those).",
                "Pandora's Box: 8 turns to charge, then deletes every die on the board for a x100 bonus that regular dice beat anyway.",
            ],
        ),
        TipGroup(
            title="Enchantments and rings",
            source=NEON,
            tips=[
                "Put Laconism on everything you can afford. The only other enchant that matters is Eternal on a Piñata.",
                "'Destroy after roll' can't be saved by a return-to-hand chance: it needs Eternal.",
                "Aura Ring is top tier for increasing area of effect. Prioritize rings that let you draw more dice, or spawn cards and Pyramids.",
                "Rings to skip: Wedding, Consolation Prize, Equity (niche), Spring, Hero's Mark, Parity Interchanger, Lithium/Electric Ring and Mini-AWP.",
            ],
        ),
        TipGroup(
            title="Economy and math quirks",
            source=NEON,
            tips=[
                "Shop prices, rarity and enchantments are random, and rarity barely shows in the price. Put your money into the meta picks.",
                "Cleaning your deck is dangerous until your win conditions are secured.",
                "Effects read the physical face of a die, not its modified value: a ring that turns a 1 into a 10 won't trigger a prime-number ring.",
                "Boss debuffs like The Heretic apply before your multipliers. If your base hits zero, multipliers multiply zero.",
            ],
        ),
        TipGroup(
            title="Controls and boss reroll",
            source=PATCH,
            tips=[
                "Hold R to reset, even while looking at menus.",
                "ALT triggers Auto-Select while that setting is active. Auto-Select now also takes multipliers into account.",
                "Space confirms the roll when 'Manually confirm score' is on.",
                "Click the Power Level dots to select a power quickly, like you do with hands.",
                "Boss reroll: with a boss round next on the map, you can banish that boss for the run. The first reroll in a run is free, every one after that permanently costs 2 max ring slots.",
            ],
        ),
        TipGroup(
            title="Small tricks",
            source=COMBOS,
            tips=[
                "You can use a Reroll card on rewards such as rings or boss shop rewards.",
                "Skip a stage with the 'choose 2' option, take one item, then reroll the rewards: you can choose 2 more, 3 in total.",
                "The Water Ring puts out any fires on the map.",
            ],
        ),
    ]
)
