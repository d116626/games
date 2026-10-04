from pathlib import Path

import requests
import trafilatura

# Avisos fixos da Steam que o trafilatura mantém no topo dos guias.
NOISE_PREFIXES = ("This item has been removed", "This item is incompatible")


def html_to_markdown(html: str) -> str:
    md = trafilatura.extract(
        html, output_format="markdown", include_links=True, include_images=True, include_tables=True
    )
    if not md:
        raise ValueError("não foi possível extrair conteúdo da página")
    blocks = [b for b in md.split("\n\n") if not b.startswith(NOISE_PREFIXES)]
    return "\n\n".join(blocks).strip() + "\n"


def fetch_markdown_if_missing(url: str, dest: Path, timeout: int = 60) -> Path:
    """Baixa a página `url`, converte para markdown e salva em `dest` apenas se ainda não existir."""
    if dest.exists():
        return dest
    response = requests.get(url, timeout=timeout)
    response.raise_for_status()
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(html_to_markdown(response.text), encoding="utf-8")
    return dest


def fetch_file_if_missing(url: str, dest: Path, timeout: int = 60) -> Path:
    """Baixa `url` (binário ou texto) para `dest` apenas se ainda não existir."""
    if dest.exists():
        return dest
    response = requests.get(url, timeout=timeout)
    response.raise_for_status()
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(response.content)
    return dest
