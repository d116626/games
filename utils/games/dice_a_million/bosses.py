"""Dicas por chefe (wiki Miraheze) e quando cada chefe nunca aparece (notas de patch oficiais da Steam).
Escritos à mão e resumidos, porque a wiki tem erros de digitação e seções vazias."""

TIPS: dict[str, str] = {
    "The Blackout": "Dice are hidden until rolled. Memorise the outlines of your key dice before entering. "
    "Porcelain Figurine, Anchor and Spintop are easy to recognise.",
    "The Capricious": "Dice are disabled until rolled, but clones are not. Save strong dice for one big roll, "
    "or use weak dice so you keep drawing the ones you want.",
    "The Cautious": "Extra value subtracts instead of adding, and every roll adds +1 extra value to your hand. "
    "Avoid Psychodie, Foam Die, Bandage and Fishbone Charm. Sell extra-value rings only if they weigh you down.",
    "The Copycat": "Dice that roll the same face are divided by how many matched. Same-face dice like Iron Die, Golden Die "
    "and Sudoku are weakened. Avoid clone makers and dice with similar faces.",
    "The Dusty": "Rolled dice discard others very close to them. Avoid clone makers (Jacks, Bottle of Caps, Die of Dice) "
    "and area dice. Spring can save nearby dice, but may bounce onto others.",
    "The Envious": "Counters: Reroll Ring, One Ring (most dice roll their lowest face), the Eternal enchantment "
    "and Choose face on dice you want to keep. It hard-counters The Third Eye ring.",
    "The Even": "Invert cards and the Even Die and Even Ring make the doubling work for you. Decimal Die negates it "
    "entirely by making every value a multiple of 10.",
}

BANNED: dict[str, str] = {
    "The Even": "Never appears for Bicolor Hand (patch 1.0.22).",
    "The Odd": "Never appears for Bicolor Hand (patch 1.0.22).",
    "The Capricious": "Never appears for Cyan Hand (patch 1.1.1).",
    "The Glutton": "Never appears for Cyan Hand (patch 1.1.1).",
    "The Frost": "Never appears in the Carlos was here challenge (patch 1.0.25).",
    "The Patient": "Never appears in the Peanuts! challenge (patch 1.0.15).",
    "The Cautious": "Never appears in Dice Rush or Yellow Hand runs (Miraheze wiki).",
}

CURSES: list[tuple[str, str]] = [
    ("Deciduous", "Extra value subtracts instead of adding."),
    ("Explosive", "Discards other VERY nearby dice."),
    ("Fragile", "Destroys itself when rolled."),
    ("Negative", "Its value subtracts instead of adding."),
    ("Parasite", "When rolled adds a Hollow Die to your bag."),
    ("Weak", "Divides in half every multiplier equal to or greater than 2X that it would give or receive."),
]
