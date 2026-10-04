# Games Guide

Guias de jogos organizados e visualmente intuitivos. Cada jogo tem uma página própria, montada a partir
de uma **base de conhecimento em `.md`** que serve só de **fonte de leitura**: nada é renderizado direto
do `.md`. Lemos, organizamos e salvamos o que interessa em **JSON** (junto de imagens, links úteis e as
fontes de referência), e o site mostra isso com uma UI feita para cada jogo. Site estático (Next.js) no
GitHub Pages.

## Como funciona

```
links dos .md ──► data/raw/<jogo>/*.md ──► processamento (Python) ──► frontend/public/data/<jogo>/*.json ──► página do guia
  (constants.py)     (fora do git)        utils/games/<jogo>/           (no git)                        /guides/<jogo>
```

1. **Fonte:** as URLs dos `.md` ficam em `utils/games/<jogo>/constants.py` (`SOURCE_URLS`). O pipeline
   baixa para `data/raw/<jogo>/` só o que ainda não existe.
2. **Processamento:** o pacote Python do jogo lê os `.md`, valida com pydantic e exporta JSON em
   camelCase. Todo jogo exporta ao menos `meta.json` (nome, fontes, links, imagens).
3. **Página:** a rota `/guides/<jogo>` lê o JSON e monta a UI do jogo, dentro da moldura `GameShell`
   (voltar, título, conteúdo, seção "Fontes").

## Estrutura

Tudo é por jogo, com o **mesmo id** no frontend, no Python e nos dados (ex.: `hollow-knight`; nos pacotes
Python vira `hollow_knight`).

```
games/
  Justfile                          # atalhos (just --list)
  pyproject.toml                    # deps Python (uv); Python só para dados
  data/
    raw/<jogo>/                     # .md baixados (fora do git)
    process/<jogo>/                 # intermediários e processados (fora do git)
  utils/
    pipeline.py                     # `just pipeline [jogo ...]`
    new_game.py                     # `just new-game <id> "<Nome>"`
    common/                         # paths, schemas (CamelModel, Source, Link, Image, GameMeta), export, http
    games/<jogo_py>/                # um pacote por jogo: constants.py, schemas.py, build.py (`run()`)
  frontend/
    app/
      page.tsx                      # hub com os cards dos jogos
      guides/<jogo>/page.tsx        # uma rota por jogo
    components/
      game/                         # GameShell e GameCard (compartilhados)
      ui/                           # shadcn/ui
    games/
      registry.ts                   # lista de jogos do hub (editada por `new-game`)
      types.ts                      # tipos Game, Source, Link, GameImage, GameMeta
      <jogo>/
        game.ts                     # metadados do card (nome, tagline, cor, tags)
        components/                 # UI própria do jogo
        lib/                        # lógica e utilitários do jogo (funções puras)
    lib/base-path.ts                # withBase(): prefixa o basePath em arquivos de public/
    public/
      data/<jogo>/                  # JSONs finais (no git)
      games/<jogo>/                 # imagens e outros arquivos do jogo (no git)
  docs/<jogo>.md                    # notas: fontes, dados, decisões
  .github/workflows/nextjs.yml      # deploy no GitHub Pages (basePath /games)
```

Regra de ouro: **tudo o que é específico de um jogo fica dentro das pastas dele**
(`games/<jogo>/`, `utils/games/<jogo_py>/`, `data/*/<jogo>/`, `public/data/<jogo>/`,
`public/games/<jogo>/`). O que é compartilhado fica em `components/`, `lib/` e `utils/common/`.

## Adicionando um jogo

```
just new-game hollow-knight "Hollow Knight"
```

Isso cria as pastas, o pacote Python, a rota `/guides/hollow-knight`, `docs/hollow-knight.md` e já registra
o jogo no hub (`frontend/games/registry.ts`). Depois:

1. Coloque as URLs dos `.md` em `utils/games/hollow_knight/constants.py` (`SOURCE_URLS`) e as referências
   em `SOURCES`.
2. Descreva os dados do jogo em `schemas.py` e leia os `.md` em `build.py`; exporte com `export_dataset`.
3. `just pipeline hollow-knight` gera os JSONs em `frontend/public/data/hollow-knight/`.
4. Monte a UI em `frontend/games/hollow-knight/components/` e use na `page.tsx` do jogo.
5. Preencha `game.ts` (tagline, tags, cor) e anote as decisões em `docs/hollow-knight.md`.

O Python do jogo é descoberto sozinho: basta existir o pacote `utils/games/<jogo_py>/` com `run()`.

## Convenções dos dados

- JSON em **camelCase**, validado por pydantic antes de gravar. Cada arquivo em `public/data` tem no
  máximo 1 MB (o `export_dataset` recusa maior).
- Sempre guarde a origem: `Source` (de onde veio), `Link` (links úteis para o jogador) e `Image`
  (arquivo em `public/games/<jogo>/`, com crédito).
- Imagens e outros arquivos de `public/` são referenciados sem `/` inicial e passam por `withBase()`,
  porque o site roda sob o basePath `/games`.
- Ao ler os JSONs no TypeScript, importe-os direto (`import data from "@/public/data/<jogo>/x.json"`):
  a página é estática e o dado entra no build.

## Comandos

```
just new-game <id> "<Nome>"     # cria a estrutura de um jogo
just run-frontend               # servidor de desenvolvimento
just pipeline                   # roda o pipeline de todos os jogos
just pipeline <jogo>            # só um jogo
just typecheck                  # tsc --noEmit
just lint                       # eslint
just py-sync                    # instala deps Python (uv)
```

## Deploy

GitHub Pages via Actions (`.github/workflows/nextjs.yml`): `npm run build` em `frontend/` com
`NEXT_PUBLIC_BASE_PATH=/games`, publicando `frontend/out`. Em Settings → Pages, escolha "GitHub Actions".
Os JSONs de `public/data` precisam estar commitados: o deploy não roda o Python.
