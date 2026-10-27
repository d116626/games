from utils.common.schemas import Link, Source

GAME = "return-of-the-obra-dinn"
NAME = "Return of the Obra Dinn"

# Base de conhecimento em .md: {nome do arquivo em data/raw/return-of-the-obra-dinn/: url}
SOURCE_URLS: dict[str, str] = {
    "steam-1565813913.md": "https://steamcommunity.com/sharedfiles/filedetails/?id=1565813913",
    "steam-1543209541.md": "https://steamcommunity.com/sharedfiles/filedetails/?id=1543209541",
    "steam-1552463657.md": "https://steamcommunity.com/sharedfiles/filedetails/?id=1552463657",
    "steam-2961173602.md": "https://steamcommunity.com/sharedfiles/filedetails/?id=2961173602",
    "steam-3260005303.md": "https://steamcommunity.com/sharedfiles/filedetails/?id=3260005303",
    "steam-2938626182.md": "https://steamcommunity.com/sharedfiles/filedetails/?id=2938626182",
    "steam-1542348328.md": "https://steamcommunity.com/sharedfiles/filedetails/?id=1542348328",
    "steam-2128620140.md": "https://steamcommunity.com/sharedfiles/filedetails/?id=2128620140",
}

PSN_TROPHIES_MD = "psn-trophies.md"  # convertidos à mão dos HTMLs salvos (o PSNProfiles bloqueia download automático)
PSN_GUIDE_MD = "psn-trophy-guide.md"
PSN_TROPHIES_URL = "https://psnprofiles.com/trophies/9786-return-of-the-obra-dinn"
PSN_GUIDE_URL = "https://psnprofiles.com/guide/15541-return-of-the-obra-dinn-trophy-guide"

STEAM = "https://steamcommunity.com/sharedfiles/filedetails/?id="

# Referências mostradas na seção "Fontes" do guia.
SOURCES: list[Source] = [
    Source(title="The Fate of Every Crewmember (Steam, djsnowboy267)", url=STEAM + "1542348328", note="names, roles, portraits and fates of the 60 crew"),
    Source(title="Hints/Solutions in Chronological Order (Steam, polkadotc)", url=STEAM + "2961173602", note="order of the chapters and parts, and the notes on each death"),
    Source(title="How you're supposed to identify people (Steam)", url=STEAM + "1552463657", note="how to identify each of the 60"),
    Source(title="A Comprehensive Retelling of the Obra Dinn's Tragedy (Steam, mergebox)", url=STEAM + "1543209541", note="chapter summaries"),
    Source(title="Return of the Obra Dinn Trophy Guide (PSNProfiles, Kramers001)", url=PSN_GUIDE_URL, note="game basics, hints, trophy roadmap"),
    Source(title="Return of the Obra Dinn Trophies (PSNProfiles)", url=PSN_TROPHIES_URL, note="trophy list and rarity"),
    Source(title="The Guide to the Obra Dinn (Steam)", url=STEAM + "1565813913", note="general tips"),
]
LINKS: list[Link] = [
    Link(title="Main Game Walkthrough (Steam)", url=STEAM + "2938626182", description="scene-by-scene deductions, with unmarked spoilers"),
    Link(title="The Guide to the Obra Dinn (Steam)", url=STEAM + "1565813913", description="memory-by-memory hints in spoiler tags, from gentle to obscure"),
    Link(title="Obra Dinn - Interactive Notes (Google Sheets)", url="https://docs.google.com/spreadsheets/d/1_W62mOEB_sQFh_eY6WEXL81h62lnR9T2di60FhEUkTs/edit?usp=sharing",
         description="a spreadsheet to note your observations while you play (make a copy)"),
    Link(title="Labeled Image of Each Character (Steam)", url=STEAM + "2128620140", description="the sketch with a letter over each face, for taking notes"),
]
