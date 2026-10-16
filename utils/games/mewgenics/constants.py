from utils.common.schemas import Link, Source

GAME = "mewgenics"
NAME = "Mewgenics"

PSN_TROPHIES_URL = "https://psnprofiles.com/trophies/42741-mewgenics"
WIKI = "https://mewgenics.wiki.gg"


def steam(guide_id: str) -> str:
    return f"https://steamcommunity.com/sharedfiles/filedetails/?id={guide_id}"


# Base de conhecimento em .md: {nome do arquivo em data/raw/mewgenics/: url}
SOURCE_URLS: dict[str, str] = {
    "steam-3665699703.md": steam("3665699703"),  # Getting Started (Greenside)
    "steam-3673398086.md": steam("3673398086"),  # Early Game Tips
    "steam-3664011595.md": steam("3664011595"),  # Breeding Basics (Sebadam)
    "steam-3672568623.md": steam("3672568623"),  # Meta Breeding Guide
    "steam-3667744126.md": steam("3667744126"),  # Rough guide on deterministic breeding
    "steam-3664177473.md": steam("3664177473"),  # How to Unlock all Classes
    "steam-3667357026.md": steam("3667357026"),  # A Crap Guide To Classes
    "steam-3685978478.md": steam("3685978478"),  # 3 QOL Tool Tips
    "steam-3674095836.md": steam("3674095836"),  # 100% Achievement Guide
}

# PSNProfiles fica atrás do Cloudflare: `psn-trophies.md` foi gerado do HTML salvo à mão
# (utils.common.html_md.html_to_markdown_full) e não é baixado pelo pipeline. Os textos do Reddit também foram colados à mão.
PSN_TROPHIES_MD = "psn-trophies.md"

SOURCES: list[Source] = [
    Source(title="Trophy list (PSNProfiles)", url=PSN_TROPHIES_URL, note="names, descriptions, grades and rarity (PS5)"),
    Source(title="Getting Started Guide (Steam)", url=SOURCE_URLS["steam-3665699703.md"], note="by Greenside; stats, classes, house upgrades, level-ups"),
    Source(title="Early Game Tips (Steam)", url=SOURCE_URLS["steam-3673398086.md"], note="house, NPCs and combat basics"),
    Source(title="Breeding Basics (Steam)", url=SOURCE_URLS["steam-3664011595.md"], note="house stats, Tink, inbreeding, orientation"),
    Source(title="Meta Breeding Guide (Steam)", url=SOURCE_URLS["steam-3672568623.md"], note="early/mid/late breeding plan"),
    Source(title="Rough guide on deterministic breeding (Steam)", url=SOURCE_URLS["steam-3667744126.md"], note="3-room setup and stat targets"),
    Source(title="How to Unlock all Classes (Steam)", url=SOURCE_URLS["steam-3664177473.md"], note="unlock conditions and stat modifiers"),
    Source(title="A Crap Guide To Classes (Steam)", url=SOURCE_URLS["steam-3667357026.md"], note="roles and attributes of each class"),
    Source(title="3 QOL Tool Tips (Steam)", url=SOURCE_URLS["steam-3685978478.md"], note="storage, poop, Neverstone levelling"),
    Source(title="100% Achievement Guide (Steam)", url=SOURCE_URLS["steam-3674095836.md"], note="area requirements and neighbour upgrades"),
    Source(title="r/mewgenics: tips on fights, progress and breeding", url="https://www.reddit.com/r/mewgenics/", note="long post kept up to date by its author"),
    Source(
        title="r/mewgenics: hidden interactions thread",
        url="https://www.reddit.com/r/mewgenics/comments/1r2wb4k/collection_thread_of_interactionshidden/",
    ),
]

LINKS: list[Link] = [
    Link(title="Mewgenics wiki", url=WIKI, description="full wiki: classes, abilities, items, enemies"),
    Link(title="Difficulty (wiki)", url=f"{WIKI}/wiki/Difficulty", description="Normal, Hard, Crazy and Impossible"),
    Link(title="Quest items (wiki)", url=f"{WIKI}/wiki/Category:Quest_Items", description="every main quest item"),
    Link(title="Dr. Beanies side quests (wiki)", url=f"{WIKI}/wiki/Dr._Beanies#Side_Quests_&_Rewards", description="side quests and rewards"),
]
