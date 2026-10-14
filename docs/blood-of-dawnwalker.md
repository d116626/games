# The Blood of Dawnwalker

Guia focado em PS5 (troféus), com orçamento de tempo, finais, Corte/Edict, habilidades e dicas.

## Fontes
- Baixadas por `SOURCE_URLS` (`constants.py`) para `data/raw/blood-of-dawnwalker/` (fora do git): 3 guias da Steam, Fextralife (perks, abilities, endings, court, upgrades, new player help), IGN.
- **PSNProfiles (`psn-trophies.md`, `psn-guide.md`) e o texto do KillerKitten foram salvos à mão**: Cloudflare bloqueia o download. Não estão em `SOURCE_URLS`; sem esses arquivos, `trophies.py` falha.
- `utils/common/html_md.py` converte o HTML salvo em `.md`.

## Dados (`frontend/public/data/blood-of-dawnwalker/`)
- `meta.json`: nome, fontes, links.
- `trophies.json` (47 troféus, ícones em `public/games/blood-of-dawnwalker/trophies/`), `endings.json`, `court.json`, `skills.json` (27 habilidades, 64 perks), `route.json`, `tips.json`.
- Troféus, habilidades e perks saem do parse dos `.md`; finais, Corte, rota e dicas são escritos à mão em `endings.py`, `court.py`, `route.py`, `tips.py`.
- `just pipeline blood-of-dawnwalker` refaz tudo.

## Decisões
- Tema padrão do hub com acento carmim; sem tema próprio.
- Sem botão de spoiler nos finais.
- Rota: só o esboço de 10 partes e os custos em segmentos que as fontes citam. O texto completo do KillerKitten (custos por quest) não está no disco; para completar, salve-o em `data/raw/blood-of-dawnwalker/killerkitten-walkthrough.md`.
- Divergências entre fontes ficam em `tips.json` (`discrepancies`) e aparecem no guia (segmentos por dia, custo do Ultimate, ordem da Corte, Together Forever).
- Fora do v1: quests, regiões, chefes, itens/crafting.
- O visual não foi verificado em navegador.
