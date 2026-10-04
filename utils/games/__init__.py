"""Um pacote por jogo (`utils/games/<jogo_com_underscore>/`). Cada pacote expõe `run() -> list[Path]`,
que baixa as fontes, processa e exporta os JSONs. O registro é automático: criar o pacote basta.
"""

import importlib
import pkgutil
from collections.abc import Callable
from pathlib import Path


def discover() -> dict[str, Callable[[], list[Path]]]:
    """`{id-do-jogo: run}`, com o id no formato do frontend (hollow_knight -> hollow-knight)."""
    games: dict[str, Callable[[], list[Path]]] = {}
    for module in pkgutil.iter_modules(__path__):
        if module.ispkg:
            games[module.name.replace("_", "-")] = importlib.import_module(f"{__name__}.{module.name}").run
    return dict(sorted(games.items()))
