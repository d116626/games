# Mewgenics

Guia de PS5 em `/guides/mewgenics`: Guide (primeiros passos + atos com áreas e marcos de casa), Breeding, Cat lab (calculadora) e Index (coleiras, vizinhos, troféus, orientação, regras de stats), com busca global.

## Fontes
- Guias da Steam (lista em `utils/games/mewgenics/constants.py`, `SOURCE_URLS`), baixados para `data/raw/mewgenics/` (fora do git) com `utils/common/html_md.py`. A Steam devolve 429 se for chamada muitas vezes.
- Dois textos do Reddit colados à mão em `data/raw/mewgenics/`.
- PSNProfiles (HTML + `psn-trophies.md`): lista de troféus, raridade e ícones.
- Removidos a pedido: `mewgenics.space`, o guia "Butch is Hitler 2" e o de modding (GPAK).

## Dados
- `frontend/public/data/mewgenics/`: `meta`, `trophies` (54, por grupo), `start` (passos e vizinhos), `breeding`, `classes` (14 coleiras, regras de stats, ataques à distância), `route` (atos, áreas com `needs`/`path` e `milestones`).
- `trophies.py` faz o parse do PSNProfiles e baixa os ícones para `public/games/mewgenics/trophies/`. O resto é escrito à mão nos módulos Python, com `discrepancies` onde as fontes divergem.

## Decisões
- O Guide é uma linha do tempo: "Before your first run" (6 passos), depois os atos. Cada área tem `needs` (ids das áreas exigidas; ausente quando as fontes não dizem) e, no Act 1 e no Act 2, `path` A/B para as trilhas paralelas (colunas lado a lado). O visitante marca as áreas concluídas (localStorage, `mewgenics:route-done`) e o guia mostra "Next". Áreas sem `needs` nunca ficam esmaecidas nem como "Next".
- Marcos de casa (`milestones`) não prendem vizinhos a datas inventadas: cada um tem uma condição (`when`), e só ficam presos a uma área onde as fontes dizem (Butch no Sewers, Guillotina no Boneyard, Dr. Beanies no Lab, Steven no Ice Age). Os demais ficam no bloco do ato. Os objetivos de criação seguem as fases do guia de breeding, por ato e de forma aproximada (as fontes não os ligam a atos).
- As imagens de coleiras, vizinhos e áreas são os ícones dos troféus ligados a cada um (`trophyIcon`); as fontes não têm retratos. Dr. Beanies e The Alley ficam sem imagem.
- Só a v1. Fica para a v2: itens de quest, combate e níveis, avançado (clone, Soul Jar, duplicar), biomas e chefes, interações escondidas.
- Fórmulas do Cat lab (Greenside): HP = 4 por CON, mana máxima = 3 por CHA, mana por turno = INT, crítico = 2% por LCK, dano à distância = base + (DEX - 5) / 2. O guia não diz como arredondar valores ímpares; arredondamos para baixo.
- A sugestão de coleira usa os cortes 7+, diferença de 2 e 5 ou menos: é leitura nossa dos "alto/baixo" do Greenside.
- Só stats base são herdados; bônus de coleira entram apenas no total mostrado.
- O guia de conquistas da Steam (`3674095836`) só tem ícones, sem nomes: a lista da PSN é a fonte dos troféus.
- O guia de desbloqueio de classes tem erros (Hunter/Fighter trocados, Cleric copiado do Tank): só as condições de desbloqueio e os modificadores foram usados.
- Identificar o Mystery Man como o Organ Grinder é inferência.
