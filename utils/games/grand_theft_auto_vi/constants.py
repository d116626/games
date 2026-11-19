from utils.common.schemas import Link, Source

GAME = "grand-theft-auto-vi"
NAME = "Grand Theft Auto VI"

# Base de conhecimento em .md: {nome do arquivo em data/raw/grand-theft-auto-vi/: url}
# Vazio por enquanto: o PSNProfiles bloqueia download automático, então a lista de troféus vem de um HTML salvo à mão.
PYX = "https://www.powerpyx.com/"
GTABASE = "https://www.gtabase.com/"
SOURCE_URLS: dict[str, str] = {
    # PowerPyx: o roadmap de troféus primeiro, depois as páginas-índice e os "como fazer" que ele linka
    "powerpyx/roadmap.md": PYX + "gta-6-grand-theft-auto-vi-trophy-guide-roadmap/",
    "powerpyx/wiki.md": PYX + "gta-6-grand-theft-auto-vi-wiki-strategy-guide/",
    "powerpyx/100-checklist.md": PYX + "gta-6-100-completion-checklist-guide/",
    "powerpyx/challenges.md": PYX + "gta-6-all-challenges-guide/",
    "powerpyx/walkthrough.md": PYX + "gta-6-full-walkthrough-all-missions/",
    "powerpyx/strangers-freaks.md": PYX + "gta-6-all-strangers-freaks-side-missions/",
    "powerpyx/collectibles.md": PYX + "gta-6-collectible-guide-progress-database/",
    "powerpyx/map.md": PYX + "gta-6-full-world-map-revealed/",
    "powerpyx/criminal-profile.md": PYX + "gta-6-criminal-profile-explained/",
    "powerpyx/money.md": PYX + "gta-6-money-guide-how-to-get-money-fast/",
    "powerpyx/cheats.md": PYX + "gta-6-all-cheats/",
    "powerpyx/fast-travel.md": PYX + "gta-6-how-to-fast-travel/",
    "powerpyx/switch-characters.md": PYX + "gta-6-how-to-switch-between-playing-as-lucia-jason/",
    "powerpyx/fences.md": PYX + "gta-6-all-fence-locations-how-to-fence-stolen-goods/",
    "powerpyx/character-stats.md": PYX + "gta-6-how-to-increase-character-stats-health-cardio-focus/",
    "powerpyx/unfog-map.md": PYX + "gta-6-how-to-unfog-the-map-fast-best-plane/",
    "powerpyx/ultimate-edition.md": PYX + "gta-6-how-to-get-ultimate-edition-rewards/",
    "powerpyx/personal-car.md": PYX + "gta-6-how-to-get-new-personal-car/",
    "powerpyx/summon-vehicles.md": PYX + "gta-6-how-to-summon-vehicles/",
    # GTABase
    "gtabase/trophies.md": GTABASE + "articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series",
    "gtabase/100-checklist.md": GTABASE + "articles/gta-6/gta-6-100-completion-guide-interactive-checklist",
    "gtabase/controls.md": GTABASE + "articles/gta-6/gta-6-controls-guide-ps5-xbox-button-layout",
    "gtabase/cheats-ps5.md": GTABASE + "gta-6/gta-6-cheats-ps5-cheat-codes",
    "gtabase/hub.md": GTABASE + "gta-6/",
    "gtabase/strangers-missions.md": GTABASE + "gta-6/strangers-missions/",
    "gtabase/side-missions.md": GTABASE + "gta-6/side-missions/",
    "gtabase/gangs.md": GTABASE + "gta-6/gangs/",
    "gtabase/animals.md": GTABASE + "gta-6/animals/",
    "gtabase/vehicles.md": GTABASE + "gta-6/vehicles/",
    "gtabase/properties.md": GTABASE + "gta-6/properties/",
    "gtabase/map.md": GTABASE + "gta-6/map/",
}

# O índice de missões do GTABase só se lê direito no HTML (número, nome, personagem e texto são elementos separados)
GTABASE_MISSIONS_HTML = "gtabase/missions.html"
GTABASE_MISSIONS_URL = GTABASE + "gta-6/missions/"

PSN_TROPHIES_HTML = "psnprofiles/trophies.html"  # salvo do navegador; vira o .md abaixo na primeira execução
PSN_TROPHIES_MD = "psnprofiles/trophies.md"
PSN_TROPHIES_URL = "https://psnprofiles.com/trophies/43531-grand-theft-auto-vi"

# Referências mostradas na seção "Fontes" do guia.
SOURCES: list[Source] = [
    Source(title="GTA 6 Story Missions Guide & Walkthrough (GTABase)", url=GTABASE_MISSIONS_URL, note="main source: the 122 story entries in order, with a line, the protagonist and the walkthroughs"),
    Source(title="GTA 6 Full Walkthrough - All Missions (PowerPyx)", url=PYX + "gta-6-full-walkthrough-all-missions/", note="heists, Jason-only and Lucia-only missions, start locations, requirements, rewards"),
    Source(title="GTA 6 Trophy Guide & Roadmap (PowerPyx)", url=PYX + "gta-6-grand-theft-auto-vi-trophy-guide-roadmap/", note="game facts, trophy roadmap, what unlocks when"),
    Source(title="GTA 6 Money Guide, Fast Travel and Switch Characters (PowerPyx)", url=PYX + "gta-6-money-guide-how-to-get-money-fast/", note="what each chapter opens"),
    Source(title="Grand Theft Auto VI Trophies (PSNProfiles)", url=PSN_TROPHIES_URL, note="trophy list, grades and rarity"),
    Source(title="GTA 6 Trophy Guide & Achievements List (GTABase)", url=GTABASE + "articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series", note="hidden trophies and unlock tips"),
]
LINKS: list[Link] = []
