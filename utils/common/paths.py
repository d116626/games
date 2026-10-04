"""Caminhos do repositório. Tudo é organizado por jogo, sempre com o mesmo id usado no frontend
(ex.: `hollow-knight`; nos pacotes Python vira `hollow_knight`).
"""

from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT_DIR / "data"
FRONTEND_PUBLIC_DIR = ROOT_DIR / "frontend" / "public"


def raw_dir(game: str) -> Path:
    """Fontes brutas do jogo (.md baixados). Não versionado."""
    return DATA_DIR / "raw" / game


def process_dir(game: str) -> Path:
    """Intermediários e processados do jogo. Não versionado."""
    return DATA_DIR / "process" / game


def public_dir(game: str) -> Path:
    """JSONs finais do jogo, lidos pelo site. Versionado."""
    return FRONTEND_PUBLIC_DIR / "data" / game


def assets_dir(game: str) -> Path:
    """Imagens e outros arquivos do jogo servidos pelo site. Versionado."""
    return FRONTEND_PUBLIC_DIR / "games" / game
