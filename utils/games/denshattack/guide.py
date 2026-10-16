"""Texto escrito à mão a partir do 100pguides (visão geral) e do guia da recompensa secreta."""

from utils.games.denshattack.schemas import Collectible, GuideDataset

# `stated` = números do 100pguides; todos batem com a barra de progresso dos troféus no PSNProfiles.
COLLECTIBLES = [
    ("can", "Spray Can", 134, "Found across the 65 main levels.", "Sticker sets at castle shops.", "Jet Setter"),
    ("film", "Film Roll", 65, "One in each of the 65 main levels.", "Filling in the comics at Fanzine H.Q. levels.", "Total Toritetsu"),
    ("gear", "Gear", 110, "Found across the 65 main levels.", "New trains at castle shops.", "All Geared Up"),
    ("zine", "(EN)Zine", 8, "Not in the levels: you fill in a comic at a Fanzine H.Q. with film rolls.", None, "Fandom Royalty"),
    ("train", "Train", 31, "Bought at castle shops.", "Gears.", "True Densha Collector"),
    ("sticker", "Sticker set", 40, "Bought at castle shops.", "Spray cans.", "Full Set"),
    ("onsen", "Onsen", 7, "Secret levels, unlocked by finding an alternate exit in certain levels. Just dialogue and lore.", None, "Sento Master"),
    ("dare", "Dare", 325, "Challenges in each of the 65 main levels, from 'get X score' to 'hit X thing'. Some are about collecting the other items.", None, "Ultimate Challenger"),
]

FACTS = [
    "Nothing is missable. You can go back to any level at any point, and everything can be done after finishing the game.",
    "A Fanzine H.Q. cannot be completed on your first visit, because you need film rolls from later levels. Come back after collecting every film roll in the chapter.",
    "An onsen only unlocks if you find the alternate exit in its level (for example 1-6-1 for 1-6-O, and the end of 3-1-2 for 3-1-O).",
]

# De steam-3765467114.md ("To use the skin, you will exit the shop, and then go to your garage...").
SKIN_HOW = [
    "Enter the code with the D-pad (or WASD) in a castle shop. U = Up, D = Down, L = Left, R = Right.",
    "The first castle you can reach is 1-4-C Kumamoto Castle.",
    "To use a skin, leave the shop and open your garage. To use a voice pack, open the settings and scroll until you find the creator.",
]

REWARD = [
    "Gold medals (score, time and dares) on every track give you a secret train, the MORZILLA SKATER.",
    "Completing all 8 (EN)Zines (the Fandom Royalty trophy) plays a bonus music track in the Stage Selector.",
]


def build(found: dict[str, int]) -> GuideDataset:
    return GuideDataset(
        collectibles=[Collectible(id=i, name=n, stated=t, found=found.get(i), how=h, spend=s, trophy=tr) for i, n, t, h, s, tr in COLLECTIBLES],
        facts=FACTS,
    )
