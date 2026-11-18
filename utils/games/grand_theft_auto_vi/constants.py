from utils.common.schemas import Link, Source

GAME = "grand-theft-auto-vi"
NAME = "Grand Theft Auto VI"

# Base de conhecimento em .md: {nome do arquivo em data/raw/grand-theft-auto-vi/: url}
# Vazio por enquanto: o PSNProfiles bloqueia download automático, então a lista de troféus vem de um HTML salvo à mão.
SOURCE_URLS: dict[str, str] = {}

PSN_TROPHIES_HTML = "psn-trophies.html"  # salvo do navegador; vira o .md abaixo na primeira execução
PSN_TROPHIES_MD = "psn-trophies.md"
PSN_TROPHIES_URL = "https://psnprofiles.com/trophies/43531-grand-theft-auto-vi"

# Referências mostradas na seção "Fontes" do guia.
SOURCES: list[Source] = [
    Source(title="Grand Theft Auto VI Trophies (PSNProfiles)", url=PSN_TROPHIES_URL, note="trophy list, grades and rarity"),
]
LINKS: list[Link] = []
