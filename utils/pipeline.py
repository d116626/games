"""Orquestrador do pipeline de dados.

    uv run python -m utils.pipeline                 # todos os jogos
    uv run python -m utils.pipeline hollow-knight   # só um jogo

Fluxo de cada jogo: fetch -> data/raw/<jogo> -> process -> data/process/<jogo>
-> frontend/public/data/<jogo>
"""

import sys

from utils.games import discover


def main(targets: list[str]) -> None:
    games = discover()
    unknown = [t for t in targets if t not in games]
    if unknown:
        raise SystemExit(f"Jogo desconhecido: {', '.join(unknown)}. Disponíveis: {', '.join(games) or '(nenhum)'}")
    for game in targets or list(games):
        for path in games[game]():
            print(f"[{game}] exportado: {path}")
    if not games:
        print("Nenhum jogo ainda. Crie um com: just new-game <id>")


if __name__ == "__main__":
    main(sys.argv[1:])
