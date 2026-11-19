"""Páginas de missão. PowerPyx: o índice (`powerpyx/walkthrough.md`) lista as missões por capítulo, cada uma com a sua página.
GTABase: o índice (`gtabase/missions.html`) tem as 122 missões da história, numeradas e com uma frase cada; as páginas individuais seguem o link."""

import re
import time
from pathlib import Path
from urllib.parse import urljoin

import requests
from lxml import html as lxml_html

from utils.common.html_md import download, fetch_full_markdown_if_missing
from utils.common.paths import raw_dir
from utils.games.grand_theft_auto_vi.constants import GAME, GTABASE_MISSIONS_HTML, GTABASE_MISSIONS_URL

PYX_INDEX = "powerpyx/walkthrough.md"
PYX_LINK = re.compile(r"^\d+\. .*?\]\((https://www\.powerpyx\.com/(gta-6-[^/)]+)/)\)", re.M)


def powerpyx_urls(index_md: str) -> dict[str, str]:
    """{slug: url} das missões linkadas nas listas de capítulo (a página repete o texto inteiro: só vale a primeira cópia)."""
    start = index_md.index("## Prologue")
    end = index_md.find("## Prologue", start + 1)
    block = index_md[start : end if end > 0 else None]
    return {m[2].removeprefix("gta-6-").removesuffix("-walkthrough"): m[1] for m in PYX_LINK.finditer(block)}


def gtabase_index() -> str:
    """HTML do índice de missões do GTABase (guardado em data/raw na primeira vez; apague para baixar de novo)."""
    path = raw_dir(GAME) / GTABASE_MISSIONS_HTML
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(download(GTABASE_MISSIONS_URL), encoding="utf-8")
    return path.read_text(encoding="utf-8")


def gtabase_urls(index_html: str) -> dict[str, str]:
    doc = lxml_html.fromstring(index_html)
    hrefs = doc.xpath('//a[contains(@class,"items-row")]/@href')  # o Prólogo tem outro caminho (/missions/gta-6/prologue)
    return {h.rstrip("/").rsplit("/", 1)[-1]: urljoin(GTABASE_MISSIONS_URL, h) for h in hrefs}


def fetch_pages(pages: dict[str, str], out_dir: Path) -> list[str]:
    """Baixa o que falta em `out_dir` (1 s entre páginas). Devolve os slugs que deram 404 (ainda não publicados)."""
    missing = []
    for slug, url in pages.items():
        for wait in (5, 20, 60, None):  # o GTABase às vezes derruba a conexão no meio da lista: espera e tenta de novo
            try:
                fetch_full_markdown_if_missing(url, out_dir / f"{slug}.md")
                break
            except requests.HTTPError as e:
                if e.response is None or e.response.status_code != 404:
                    raise
                missing.append(slug)
                time.sleep(1)
                break
            except requests.ConnectionError:
                if wait is None:
                    raise
                time.sleep(wait)
    return missing


def fetch() -> dict[str, list[str]]:
    """Baixa as páginas de missão das duas fontes. Devolve, por fonte, as que deram 404."""
    base = raw_dir(GAME)
    return {
        "powerpyx": fetch_pages(powerpyx_urls((base / PYX_INDEX).read_text(encoding="utf-8")), base / "powerpyx" / "missions"),
        "gtabase": fetch_pages(gtabase_urls(gtabase_index()), base / "gtabase" / "missions"),
    }
