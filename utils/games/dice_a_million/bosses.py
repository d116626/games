"""Dicas por chefe (wiki Miraheze), escritas à mão e resumidas porque a wiki tem erros de digitação e seções vazias.
Textos, metas e quando cada chefe aparece vêm do jogo (`db.json`)."""

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
