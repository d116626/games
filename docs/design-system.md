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
| `SectionNav` | índice com scroll-spy (usado pelo `GameShell`) |
| `Section` | âncora, número, título e contagem |
| `Callout` | `tip`, `combo` ou `warning` |
| `GameImage` | `<img>` para arquivos de `public/`, aplica o `basePath` |
| `GameCard` | card do hub, com capa (`Game.cover`) |

Imagens do jogo ficam em `public/games/<jogo>/` (baixadas pelo pipeline). Ícones nossos usam lucide, passados como
elemento (`<Skull />`) entre Server e Client Components.

## Componentes do Dice A Million (`games/dice-a-million/components/`)
Ordem da página: `Hero` → `Roadmap` (etapas em ordem, cadeia de mãos, matriz mão x objetivo) → `Strategy` →
`Bestiary` (chefes) → `IndexList` (dados, anéis, cartas, segredos e encantamentos, em blocos recolhíveis, no fim).
O roteiro é escrito à mão em `utils/games/dice_a_million/roadmap.py` (com `warning` onde as fontes divergem) e a matriz
sai do texto das conquistas. Sem checklist: o guia é para ler, não para marcar.
Dados em `public/data/dice-a-million/` (`lib/data.ts`).

## Pendentes
Busca global, índice completo (efeitos de dados, anéis e cartas, vindos da wiki), `Spoiler` para conquistas secretas e `DetailSheet`.
