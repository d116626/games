"""Cria a estrutura de um jogo novo.

    python3 -m utils.new_game hollow-knight "Hollow Knight"      (ou: just new-game hollow-knight "Hollow Knight")

Só usa a biblioteca padrão, então roda sem instalar nada.
"""

import re
import sys
from pathlib import Path

from utils.common.paths import ROOT_DIR

FRONTEND = ROOT_DIR / "frontend"
REGISTRY = FRONTEND / "games" / "registry.ts"


def camel(game_id: str) -> str:
    head, *rest = game_id.split("-")
    name = head + "".join(p.capitalize() for p in rest)
    return f"_{name}" if name[0].isdigit() else name


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def register(game_id: str) -> None:
    text = REGISTRY.read_text(encoding="utf-8")
    ident = camel(game_id)
    text = text.replace(
        "// @games:imports", f'import {{ game as {ident} }} from "@/games/{game_id}/game";\n// @games:imports'
    )
    text = text.replace("  // @games:list", f"  {ident},\n  // @games:list")
    REGISTRY.write_text(text, encoding="utf-8")


def main(game_id: str, name: str) -> None:
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", game_id):
        raise SystemExit("O id deve ser minúsculo, com hífens (ex.: hollow-knight).")
    py = game_id.replace("-", "_")
    if (FRONTEND / "games" / game_id).exists():
        raise SystemExit(f"{game_id} já existe.")

    for base in ("frontend/public/data", "frontend/public/games"):
        write(ROOT_DIR / base / game_id / ".gitkeep", "")

    write(
        FRONTEND / "games" / game_id / "game.ts",
        f"""import type {{ Game }} from "@/games/types";

export const game: Game = {{
  slug: "{game_id}",
  name: "{name}",
  tagline: "Quick guide to {name}.",
  description: "",
  tags: [],
  accent: "#7aa7ff",
}};
""",
    )
    write(
        FRONTEND / "app" / "guides" / game_id / "page.tsx",
        f"""import {{ GameShell }} from "@/components/game/game-shell";
import {{ game }} from "@/games/{game_id}/game";

export const metadata = {{ title: `${{game.name}} · Games Guide` }};

export default function Page() {{
  return (
    <GameShell game={{game}}>
      <p className="text-muted-foreground">Under construction.</p>
    </GameShell>
  );
}}
""",
    )

    pkg = ROOT_DIR / "utils" / "games" / py
    write(
        pkg / "__init__.py",
        "from utils.games.%s.build import run\n\n__all__ = [\"run\"]\n" % py,
    )
    write(
        pkg / "constants.py",
        f'''from utils.common.schemas import Source

GAME = "{game_id}"
NAME = "{name}"

# Base de conhecimento em .md: {{nome do arquivo em data/raw/{game_id}/: url}}
SOURCE_URLS: dict[str, str] = {{}}

# Referências mostradas na seção "Fontes" do guia.
SOURCES: list[Source] = []
''',
    )
    write(
        pkg / "build.py",
        f'''from pathlib import Path

from utils.common.export import export_dataset
from utils.common.paths import raw_dir
from utils.common.schemas import GameMeta
from utils.common.sources import fetch_sources
from utils.games.{py}.constants import GAME, NAME, SOURCE_URLS, SOURCES


def run() -> list[Path]:
    """fetch (.md -> data/raw) -> process -> JSONs em frontend/public/data/{game_id}."""
    fetch_sources(GAME, SOURCE_URLS)
    print(f"[{{GAME}}] fontes em {{raw_dir(GAME)}}")
    # TODO: ler os .md, montar os schemas do jogo (schemas.py) e exportar com export_dataset.
    return [export_dataset(GAME, "meta.json", GameMeta(name=NAME, sources=SOURCES))]
''',
    )
    write(pkg / "schemas.py", "from utils.common.schemas import CamelModel  # noqa: F401\n\n# Schemas dos dados próprios do jogo (herdam de CamelModel).\n")
    write(
        ROOT_DIR / "docs" / f"{game_id}.md",
        f"""# {name}

## Fontes
- (links dos .md e das referências)

## Dados
- `frontend/public/data/{game_id}/meta.json`: nome, fontes, links e imagens.

## Decisões
- (o que entra no guia, o que ficou de fora e por quê)
""",
    )
    register(game_id)
    print(f"Criado: {game_id}\n  rota /guides/{game_id}\n  próximo: preencher SOURCE_URLS em utils/games/{py}/constants.py")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit('Uso: python3 -m utils.new_game <id> "<Nome do jogo>"')
    main(sys.argv[1], sys.argv[2])
