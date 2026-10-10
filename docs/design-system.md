# Design system

Vale para todas as páginas de guia. Mudou aqui, mudou em todos os jogos.

## Princípios
1. **Consulta rápida**: o jogador está no meio da partida, muitas vezes no celular. Escaneável em segundos; mobile primeiro.
2. **Estrutura comum, visual por jogo**: o hub é escuro e editorial; cada guia pode ter uma camada de tema própria.
3. **Informação com origem**: todo guia lista suas fontes (`Source`) e os créditos das imagens.
4. **Todo texto do site em inglês.**

## Fundação (hub e padrão)
- **Cores**: tokens em `app/globals.css` (azul-escuro, oklch). Cada jogo define `accent` em `games/<jogo>/game.ts`;
  o `GameShell` expõe como `--game-accent`. Use `text-(--game-accent)`, `bg-(--game-accent)`.
- **Tipografia**: `font-display` só em títulos; `font-sans` no texto; `font-mono` em rótulos e números (`tabular-nums`).
- **Mobile**: alvos de toque ≥ 44px (`min-h-11`), `scroll-mt` nas seções.

## Tema por jogo
Cada jogo pode sobrescrever tokens do shadcn e fontes com variáveis CSS, sem tocar nos componentes compartilhados:
- `app/guides/<jogo>/layout.tsx` carrega as fontes e envolve a rota em `.theme-<jogo>`.
- `games/<jogo>/theme.css` redefine `--background`, `--card`, `--border`, `--font-*` etc. e define utilitários do jogo.
- Dice A Million (`.theme-dice`): coral + papel creme, contorno de 2-3px preto e sombra dura, como a UI do jogo.
  Fontes Anton (display), Pixelify Sans (mono) e Atkinson Hyperlegible Next (texto).
  Utilitários: `.sticker`, `.sticker-sm`, `.hud-tab`, `.roll-plate`, `.tilt`.

## Estrutura de uma página de jogo
`GameShell` com `sections=[{id,label}]` e `hero` opcional (substitui o cabeçalho padrão): índice com scroll-spy
(chips fixos no mobile, lista lateral no desktop) e seções empilhadas em página única (âncoras `#id`, Ctrl+F funciona,
site estático, sem abas). Os `id` de `sections` devem ser os mesmos dos `<Section id>`, na mesma ordem
(o `index` do `Section` é a posição).

## Componentes compartilhados (`components/game/`)
| Componente | Uso |
|---|---|
| `GameShell` | moldura, índice, acento, rodapé "Sources" |
| `SectionNav` | índice com scroll-spy (usado pelo `GameShell`); `SectionLink.children` vira subitens no desktop, visíveis quando a seção está ativa (o Dice A Million usa nas etapas do roadmap, com `Stage.short` numerado, e nos blocos do índice, `lib/index-links.ts`) |
| `Section` | âncora, número, título e contagem |
| `Callout` | `tip`, `combo` ou `warning` |
| `GameImage` | `<img>` para arquivos de `public/`, aplica o `basePath` |
| `GameCard` | card do hub, com capa (`Game.cover`) |

Imagens do jogo ficam em `public/games/<jogo>/` (baixadas pelo pipeline). Ícones nossos usam lucide, passados como
elemento (`<Skull />`) entre Server e Client Components.

## Componentes do Dice A Million (`games/dice-a-million/components/`)
Ordem da página: `Hero` → `GuideSearch` (busca em tudo, atalho `/`) → `Roadmap` (etapas em ordem, cadeia de mãos, objetivos por mão) → `Strategy` →
`IndexList` (o índice, no fim). Cada bloco do índice é um `IndexGroup` recolhível que abre sozinho quando a URL aponta para ele (`#index-bosses`; a busca usa isso):
dados, anéis, cartas, encantamentos, maldições, chefes (com chefe final e dados inimigos), desafios, Powers, odds (tabelas de raridade, calculadas em `rules.py`) e regras da run (alvos por rodada, packs, paradas do mapa).
O catálogo vem do HTML da wiki da Steam (`catalog.py`, imagens em `public/games/dice-a-million/items/`); `lib/search.ts` monta as entradas da busca.
O roteiro é escrito à mão em `utils/games/dice_a_million/roadmap.py` (com `warning` onde as fontes divergem) e a matriz
sai do texto das conquistas. Sem checklist: o guia é para ler, não para marcar.
Dados em `public/data/dice-a-million/` (`lib/data.ts`).

## Interação
- `HandTracker` (cliente): um card por mão com seus objetivos (sem tabela, sem scroll horizontal), marcação em `localStorage` (`lib/local-store.ts`) e sugestão do próximo objetivo (o de maior % de jogadores).
- `ItemRef`: botão que abre o cartão do item com a Popover API nativa. `RichText` transforma nomes exatos do catálogo (`lib/items.ts`) em `ItemRef`; nomes curtos ou comuns ficam fora (`SKIP`).
- Fichas de mão (`HAND_NOTES` em roadmap.py): dados iniciais e dicas só onde a wiki Miraheze documenta (White, Red, Blue, Black).

- `CatalogGroup`: filtros de raridade, formato e tags em chips (tags: várias ao mesmo tempo, todas valem). Filtros usam a fonte de texto, não a pixelada.
- `GuideSearch`: a busca vive na URL (`?q=&type=`, via `useSyncExternalStore`), então o link copiado reproduz o resultado; filtro por tipo.
- `BackToTop`, rodapé com data dos dados (`meta.updated`, gerada pelo pipeline) e link para reportar erros; `@media print` em `theme.css`.
- Dados escritos à mão com fonte: `bosses.py` (dicas da wiki, chefes que nunca aparecem, maldições), notas de patch oficiais da Steam em `roadmap.py`/`strategy.py`.

## Pendentes
`DetailSheet`. Desafios, Powers e regras da run saem do `db.json` do jogo (`rules.py` -> `rules.json`).
