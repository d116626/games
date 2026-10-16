from utils.common.schemas import Source

GAME = "denshattack"
NAME = "Denshattack!"


def steam(guide_id: str) -> str:
    return f"https://steamcommunity.com/sharedfiles/filedetails/?id={guide_id}"


# Base de conhecimento em .md: {nome do arquivo em data/raw/denshattack/: url}
SOURCE_URLS: dict[str, str] = {
    "steam-3772076361.md": steam("3772076361"),
    "steam-3765448136.md": steam("3765448136"),
    "steam-3765467114.md": steam("3765467114"),
    "steam-3768739875.md": steam("3768739875"),
    "steam-3765426968.md": steam("3765426968"),
    "steam-3791059639.md": steam("3791059639"),
    "100pguides.md": "https://www.100pguides.com/guides/denshattack-all-collectibles-and-dares",
}

PSN_TROPHIES_URL = "https://psnprofiles.com/trophies/42281-denshattack"
PSN_TROPHIES_MD = "psn-trophies.md"  # convertido à mão do HTML salvo da página (o site bloqueia download automático)
OVERVIEW_URL = steam("3765430125")  # "Levels overview 1.0": só capturas de tela, sem texto; não baixado

# Referências mostradas na seção "Fontes" do guia. O guia "Achievements, Ranks & Collectibles [WiP]" (3765426968)
# está quase vazio e não é usado nem listado.
SOURCES: list[Source] = [
    Source(
        title="All Collectible & Dare Locations (100pguides)",
        url=SOURCE_URLS["100pguides.md"],
        note="spray cans, gears, film rolls, dares, shops, fanzines and onsens, level by level",
    ),
    Source(title="All Platinum Medal Scores (Steam)", url=SOURCE_URLS["steam-3791059639.md"], note="score target per level and tips"),
    Source(title="All Level Music Names (Steam)", url=SOURCE_URLS["steam-3768739875.md"], note="song, artist and prefecture per stage"),
    Source(title="Every Creator Skin and code skin (Steam)", url=SOURCE_URLS["steam-3765467114.md"], note="skin codes, voice packs and creators"),
    Source(title="Secret Skin Codes (Steam)", url=SOURCE_URLS["steam-3765448136.md"], note="earlier, partial list of the same codes"),
    Source(title="Denshattack's Secret Reward (Steam)", url=SOURCE_URLS["steam-3772076361.md"], note="Morzilla Skater and the bonus track"),
    Source(title="Denshattack! Trophies (PSNProfiles)", url=PSN_TROPHIES_URL, note="trophy list, progress goals and rarity"),
    Source(title="Levels overview 1.0 (Steam)", url=OVERVIEW_URL, note="in-game results screens, used only to check the dare count"),
]
