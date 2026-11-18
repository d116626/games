# Grand Theft Auto VI

Guia em `/guides/grand-theft-auto-vi`. Por enquanto só a lista de troféus da PS5, com checklist; o resto (missões, mapa, colecionáveis, guia) entra quando houver fonte. Pipeline: `just pipeline grand-theft-auto-vi`.

## Fontes
- [Grand Theft Auto VI Trophies (PSNProfiles)](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi): `data/raw/grand-theft-auto-vi/psn-trophies.html`, salvo à mão do navegador no dia do lançamento (o PSNProfiles bloqueia download automático). Na primeira execução o pipeline converte o HTML em `psn-trophies.md` (`html_to_markdown_full`); para atualizar, salve o HTML de novo, apague o `.md` e rode o pipeline. `data/raw` não é versionado, então o HTML precisa ser salvo de novo em outra máquina.

## Dados
- `frontend/public/data/grand-theft-auto-vi/meta.json`: nome, fontes e links.
- `trophies.json` (`trophies.py`): 55 troféus (1 platina, 2 ouro, 6 prata, 46 bronze; 1.350 pontos), com nome, descrição, nível, ícone e link do PSNProfiles. O id é a posição na lista da PSN (1 = platina). O pipeline falha se a página não tiver 55 linhas, para avisar que o layout mudou.
- Ícones em `frontend/public/games/grand-theft-auto-vi/trophies/<id>.png` (56x56, 0,37 MB no total) e capa do hub `cover.svg` (desenhada à mão: pôr do sol e palmeiras, sem logo oficial).

## Decisões
- **Raridade só quando for real.** No lançamento a PSN mostra 0,0% "Ultra Rare" para todos os troféus, o que não é raridade. Quando todas as taxas são 0, `hasRarity` fica `false` e `psnRate`/`psnTier` não são exportados; o site mostra "Rarity will show once the PSN has real numbers". Basta salvar o HTML de novo mais tarde (apagando o `.md`) para a raridade aparecer sozinha. Só a taxa da PSN é usada; a do PSNProfiles não.
- **Sem dicas ainda.** A página não traz roteiro, então não há `note` nem marcação de "missable": nada foi escrito à mão. O campo `note` já existe no schema (`schemas.Trophy`) e no tipo (`Trophy`), e o componente já o mostra. Os nomes e as descrições são os do jogo, como estão na fonte (inclusive "T\*\*s Ass Drug Money", censurado lá).
- **Checklist** (`components/trophies.tsx`): marcar o que já tem (salvo no `localStorage`, chave `grand-theft-auto-vi:trophies`, via `useLocalSet`), pontos ganhos, filtro por nível e "Hide done". Vir da busca (`#trophy-<id>`) limpa os filtros e destaca a linha.
- **Busca** (`components/guide-search.tsx`, `lib/search.ts`): mesma da Denshattack (campo no topo, botão flutuante, tecla `/`, `?q=&type=`). Hoje só acha troféus; os chips de tipo só aparecem quando houver mais de um tipo.
- **Tema** (`theme.css`, classe `theme-vice`): roxo-noite, rosa neon e laranja de pôr do sol, fontes Bowlby One (títulos) e DM Sans, cantos arredondados.

## Como acrescentar conteúdo (o que vem a seguir)
1. Fonte nova em `SOURCE_URLS` (`constants.py`) ou HTML salvo em `data/raw/grand-theft-auto-vi/`; módulo novo em `utils/games/grand_theft_auto_vi/` com os schemas em `schemas.py`; `export_dataset` no `build.py`.
2. Tipos em `frontend/games/grand-theft-auto-vi/types.ts`, leitura em `lib/data.ts`, componente em `components/`.
3. Seção em `frontend/app/guides/grand-theft-auto-vi/page.tsx`: um item em `SECTIONS` e um `<Section>`. O índice lateral só aparece com mais de uma seção.
4. Entradas da busca em `lib/search.ts`.
5. Atualizar este documento.
