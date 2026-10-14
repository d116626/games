from utils.common.schemas import Link, Source

GAME = "blood-of-dawnwalker"
NAME = "The Blood of Dawnwalker"

FX = "https://bloodofdawnwalker.wiki.fextralife.com"
PSN_TROPHIES_URL = "https://psnprofiles.com/trophies/42703-the-blood-of-dawnwalker"
PSN_GUIDE_URL = "https://psnprofiles.com/guide/26021-the-blood-of-dawnwalker-trophy-guide"

# Base de conhecimento em .md: {nome do arquivo em data/raw/blood-of-dawnwalker/: url}
SOURCE_URLS: dict[str, str] = {
    "steam-3794732578.md": "https://steamcommunity.com/sharedfiles/filedetails/?id=3794732578",
    "steam-3798263044.md": "https://steamcommunity.com/sharedfiles/filedetails/?id=3798263044",
    "fx-perks.md": f"{FX}/Perks",
    "fx-abilities.md": f"{FX}/Abilities",
    "fx-endings-guide.md": f"{FX}/Endings_Guide",
    "fx-court-activities-walkthrough.md": f"{FX}/Court_Activities_Walkthrough",
    "fx-upgrades-guide.md": f"{FX}/Upgrades_Guide",
    "fx-new-player-help.md": f"{FX}/New_Player_Help",
}

# PSNProfiles fica atrás do Cloudflare: `psn-trophies.md` e `psn-guide.md` foram salvos à mão
# (página salva no navegador -> utils.common.html_md.html_to_markdown_full) e não são baixados pelo pipeline.
PSN_TROPHIES_MD = "psn-trophies.md"
PSN_GUIDE_MD = "psn-guide.md"

SOURCES: list[Source] = [
    Source(title="Trophy list (PSNProfiles)", url=PSN_TROPHIES_URL, note="names, descriptions, grades and rarity (PS5)"),
    Source(title="Trophy guide (PSNProfiles)", url=PSN_GUIDE_URL, note="by boomber85851; roadmap, tags and trophy notes"),
    Source(title="Achievements and roadmap 100% guide (Steam)", url=SOURCE_URLS["steam-3794732578.md"], note="cross-check of unlock conditions"),
    Source(title="10+ Tips and Tricks (Steam)", url=SOURCE_URLS["steam-3798263044.md"], note="time segments, consumables, stealing"),
    Source(title="Perks (Fextralife)", url=SOURCE_URLS["fx-perks.md"]),
    Source(title="Abilities (Fextralife)", url=SOURCE_URLS["fx-abilities.md"]),
    Source(title="Endings Guide (Fextralife)", url=SOURCE_URLS["fx-endings-guide.md"]),
    Source(title="Court Activities Walkthrough (Fextralife)", url=SOURCE_URLS["fx-court-activities-walkthrough.md"]),
    Source(title="Upgrades Guide (Fextralife)", url=SOURCE_URLS["fx-upgrades-guide.md"]),
    Source(title="New Player Help (Fextralife)", url=SOURCE_URLS["fx-new-player-help.md"]),
]

LINKS: list[Link] = [
    Link(title="Fextralife wiki", url=f"{FX}/Blood_of_Dawnwalker_Wiki", description="full wiki: quests, regions, bosses, items"),
    Link(title="Interactive map and database (GamerGuides)", url="https://www.gamerguides.com/the-blood-of-dawnwalker/maps/vale-sangora", description="every marker, quest outcome and unique item"),
    Link(title="IGN walkthrough", url="https://www.ign.com/wikis/the-blood-of-dawnwalker", description="day-by-day walkthrough"),
]
