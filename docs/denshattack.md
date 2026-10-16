# Denshattack!

Guia de coletáveis, dares, medalhas e extras em `/guides/denshattack`. **Em construção:** a etapa de dados está pronta (`just pipeline denshattack`) e a página tem as seções Guide e Levels. Faltam Shops, Medals, Extras, Trophies e a busca.

## Fontes
- 100pguides, "All Collectible & Dare Locations" (`100pguides.md`): fonte principal. 96 seções de nível (65 com coletáveis), 637 capturas de tela. O HTML vem com o texto repetido 3 vezes; só a primeira cópia vale (as outras só diferem no rodapé).
- Steam (guias em `data/raw/denshattack/steam-<id>.md`): medalhas de platina (3791059639), nomes das músicas (3768739875), códigos de skin (3765467114 e 3765448136, listas parcialmente diferentes), recompensa secreta (3772076361). O 3765426968 ("Achievements, Ranks & Collectibles [WiP]") está quase vazio e não é usado nem listado.
- PSNProfiles (`psn-trophies.md`): troféus, metas de progresso e raridade. O site bloqueia download automático; o `.md` foi convertido à mão do HTML salvo.
- Steam 3765430125 ("Levels overview 1.0"): é só uma folha de capturas de tela, sem texto. Não é baixada; foi usada para conferir a contagem de dares (ver Divergências).
- As tabelas do Steam saem do conversor com uma célula por linha; o parser agrupa de 3 em 3 (medalhas) e de 5 em 5 (músicas).
- O texto usa nomes de botão do PlayStation (R2, L2, R3), então o guia é de PS5.

## Dados (`utils/games/denshattack/`)
- `levels.py`: 100pguides -> níveis e spots. Cada parágrafo com cabeçalho em negrito é um spot; o cabeçalho pode juntar itens (`Spray Can (1/4) & Dare: X (2/2)`, também com `and`). Dares em partes viram o mesmo item (id pelo título), com `n`/`of`.
- `tables.py`: medalhas e músicas, juntadas ao nível pelo código. Os códigos `9-1-2` e `9-1-3` da lista de músicas são os chefes `9-1-B` e `9-2-B` do 100pguides (`MUSIC_ALIAS`). Os 67 níveis jogáveis batem nas três fontes (os nomes só diferem por artigo, como "The").
- `trophies.py`, `skins.py`, `guide.py` (texto à mão), `images.py`.
- JSONs: `meta`, `guide` (colecionáveis e fatos), `levels` (~340 KB), `trophies`, `extras` (skins, faixas fora das fases, recompensa).
- Imagens: só spots com lata, engrenagem ou filme (355 imagens, WebP 400 px q45), as skins (20) e os ícones dos troféus. Total **4,7 MB** de um limite de 5 MB (`images.BUDGET`; o build falha se passar). Dares e lojas ficam sem imagem. As capturas têm a marca d'água do 100pguides.
- Conferência de totais: 134 latas, 110 engrenagens, 65 filmes, 8 fanzines e 7 onsens batem com o guia. Trens (31) e adesivos (40) não são listados um a um.

## Divergências
- Dares: o guia e o troféu Ultimate Challenger dizem 325, mas o guia lista 321 (4 níveis com 4 dares: 2-3-B, 5-4-1, 8-1-1, 9-2-B).
- As telas de resultado do artwork do Steam mostram 7/7 dares em 1-2-1 e 1-3-1 e 8/8 em 3-2-2, e o guia lista 5 em cada. O guia diz que alguns dares são de coletar os outros itens, o que pode explicar a diferença (não verificado).
- Skins: o guia antigo dá `UDLRUDLRUD` para a IRyS e o novo `UDLRUDLR`; não sei qual vale. O novo tem 6 códigos que o antigo não tem.
- O guia de skins diz que a loja é "1-4-1 ou Kumamoto Castle"; no 100pguides o castelo é 1-4-C.

## Decisões
- Nome com exclamação ("Denshattack!"), como nas fontes.
- Cor de destaque provisória (`#f5b700`, amarelo de trem; a música do menu se chama "Black & Yellow").
- Só imagens úteis (colecionáveis); dares só com texto. Progresso por item, salvo no navegador (a fazer na UI).
- Não incluído: a escolha de trem da guia de medalhas (só tem imagens, os trens não são nomeados no texto).
- O sufixo do código do nível (R corrida, B chefe, S história, C castelo, F fanzine, O onsen) é dedução pelos nomes e textos, não está escrito nas fontes.

## Página (`frontend/games/denshattack/`)
- Tema `.theme-train` (`theme.css`, fontes Anton e Barlow no `layout.tsx`): preto de trilho, amarelo de faixa de segurança, letreiro do jogo no hero, faixa diagonal sob o título das seções. A cor de destaque continua provisória.
- `lib/data.ts` lê os JSONs; `lib/progress.ts` guarda os ids marcados no `localStorage` (`denshattack-progress-v1`) com `useSyncExternalStore`. No servidor o progresso é vazio, para o HTML estático bater com o cliente.
- Guide (`components/guide.tsx`): progresso total e por tipo, os 8 colecionáveis, fatos e divergências.
- Levels (`components/levels.tsx`, `level-card.tsx`): 9 capítulos recolhíveis; o conteúdo só monta na primeira abertura. `#chapter-N` e `#level-N-N-N` abrem o capítulo e levam ao nível. Filtros por tipo e "só o que falta". Dares em partes compartilham o id: marcar uma parte marca todas, e o rótulo não mostra "(1/2)" porque o parser descarta o fim de intervalos como "2-6/15".
- Marcáveis: latas, engrenagens, filmes e dares (630 itens). Trens, adesivos, zines e onsens não são listados um a um.
- Shops (`shops.tsx`): castelos, fanzines e onsens vindos de `levels.json`, com a nota de cada um. Trens só aparecem a partir de 3-2-C (os cinco primeiros) e 5-1-C (mais cinco), segundo as notas.
- Medals (`medals.tsx`): dicas e a pontuação de platina por nível jogável (67). 1-1-1 e 1-1-2 aparecem como "No medal".
- Extras (`extras.tsx`): códigos de skin (setas e letras, com as divergências em `skinNotes` e o como usar em `skinHow`), trilha sonora por capítulo e recompensas secretas.
- Trophies (`trophies.tsx`): 39 troféus por grupo, com a raridade oficial da PSN e atalhos para as seções relacionadas.
- `Group` (`group.tsx`) é o bloco recolhível comum; abre sozinho quando a URL aponta para algo dentro dele (`#shops-castles`, `#medals-tips`).
- As notas de nível agora saem sem os `**` do markdown original (`tidy` em `levels.py`).
- Busca (`guide-search.tsx`, `lib/search.ts`): campo no hero, botão flutuante e tecla `/` fora dele; estado na URL (`?q=&type=`). Tipos: Level, Spray Can, Gear, Film Roll, Dare, Skin code, Song, Trophy. Itens e dares levam ao ponto exato (`#spot-<nível>-<índice>`, id em cada spot do `level-card.tsx`); skins, músicas e troféus têm id próprio (`#skin-<código>`, `#song-<nível>`, `#track-<i>`, `#trophy-<id>`). Mostra os 100 primeiros resultados. O capítulo abre sozinho para `#spot-...` (regex em `levels.tsx`).
- Com filtro ativo em Levels o índice do spot continua sendo o original, então o id não muda.
