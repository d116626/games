from pathlib import Path

from utils.common.http import fetch_markdown_if_missing
from utils.common.paths import raw_dir


def fetch_sources(game: str, urls: dict[str, str]) -> list[Path]:
    """Baixa as páginas da base de conhecimento (`{nome_do_arquivo.md: url}`), converte para markdown
    e salva em data/raw/<jogo>. Idempotente: arquivos que já existem não são baixados de novo."""
    return [fetch_markdown_if_missing(url, raw_dir(game) / name) for name, url in urls.items()]
