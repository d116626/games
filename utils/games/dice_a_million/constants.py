from utils.common.schemas import Source

GAME = "dice-a-million"
APP_ID = 3430340
NAME = "Dice A Million"

# Base de conhecimento em .md: {nome do arquivo em data/raw/dice-a-million/: url}
SOURCE_URLS: dict[str, str] = {
    "steam-combos-strategies.md": "https://steamcommunity.com/sharedfiles/filedetails/?id=3708947050",
    "steam-wiki.md": "https://steamcommunity.com/sharedfiles/filedetails/?id=3706141055",
    "steam-achievements.md": "https://steamcommunity.com/sharedfiles/filedetails/?id=3687261600",
    "neonlights-beginners.md": "https://www.neonlightsmedia.com/blog/dice-a-million-beginners-guide-tips",
}

# Referências mostradas na seção "Fontes" do guia.
SOURCES: list[Source] = [
    Source(title="Combos and strategies (Steam)", url=SOURCE_URLS["steam-combos-strategies.md"]),
    Source(title="Community wiki (Steam)", url=SOURCE_URLS["steam-wiki.md"]),
    Source(title="100% achievements guide (Steam)", url=SOURCE_URLS["steam-achievements.md"], note="by silver"),
    Source(title="Steam achievements and store page", url=f"https://steamcommunity.com/stats/{APP_ID}/achievements", note="official list, icons and artwork"),
    Source(title="Hidden unlocks discussion (Steam)", url="https://steamcommunity.com/app/3430340/discussions/0/802341195824084015/", note="Hollow Hand, Static shop, Black Hand"),
    Source(
        title="Cyan Hand unlock thread (Steam)",
        url="https://steamcommunity.com/app/3430340/discussions/0/592940620292582648/",
        note="player confirms same number of sides",
    ),
    Source(title="Cyan Hand achievement (TrueAchievements)", url="https://www.trueachievements.com/a661524/cyan-hand-achievement", note="unlock text"),
    Source(title="Cyan Hand achievement (TrophiesHunter)", url="https://trophieshunter.com/games/dice-a-million-pc/achievements/cyan-hand", note="valid bag examples"),
    Source(title="Dice A Million wiki (Miraheze)", url="https://diceamillion.miraheze.org/wiki/Shattered_Die", note="shattered die, Powers, Hollow Ring, Black Hand"),
    Source(
        title="Official patch notes and dev posts (Steam news)",
        url="https://store.steampowered.com/news/app/3430340",
        note="Power levels, boss reroll, Cyan Hand, controls, banned bosses, planned ending",
    ),
    Source(title="Achievements guide (GamerBlurb)", url="https://gamerblurb.com/articles/dice-a-million-achievements-guide"),
    Source(
        title="Dice A Million Beginners Guide",
        url=SOURCE_URLS["neonlights-beginners.md"],
        note="Neon Lights Media",
    ),
]
