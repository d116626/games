"""HTML -> markdown completo (links, imagens e tabelas), só com lxml.

O trafilatura (`http.html_to_markdown`) descarta galerias e listas de links como ruído. Aqui o conteúdo principal
da página é convertido por inteiro; só menus, anúncios e scripts ficam de fora.
"""

import re
from pathlib import Path
from urllib.parse import parse_qs, urljoin, urlparse

import requests
from lxml import html as lxml_html
from lxml.html import HtmlElement

HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0 Safari/537.36"}

# host -> xpath do conteúdo principal (sem ele, usa <main>, <article> ou <body>)
MAIN_XPATH = {
    "steamcommunity.com": '//div[@class="workshopItemTitle"] | //div[contains(@class,"guideTopDescription")] | //div[contains(@class,"subSections")]',
    "www.ign.com": '(//div[contains(@class,"wiki-page")])[last()]',
    "psnprofiles.com": '//div[@id="content"]',
    "bloodofdawnwalker.wiki.fextralife.com": '//div[@id="mw-content-text"]',
}

SKIP_TAGS = {"script", "style", "noscript", "nav", "footer", "form", "button", "iframe", "svg", "template", "select"}
SKIP_CLASSES = {"tabber__header", "mw-editsection", "catlinks", "navbox", "noprint", "adsbygoogle", "toc", "printfooter"}
BLOCK_TAGS = {"p", "div", "section", "article", "ul", "ol", "li", "table", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "hr", "pre", "figure", "center", "dl", "dt", "dd"}
HEADING_CLASSES = {"subSectionTitle": 2, "bb_h1": 2, "bb_h2": 3, "bb_h3": 4}  # títulos da Steam são <div>
BREAK = "\x00"


def _skip(el: HtmlElement) -> bool:
    return not isinstance(el.tag, str) or el.tag in SKIP_TAGS or bool(SKIP_CLASSES & set((el.get("class") or "").split()))


def _norm(text: str) -> str:
    text = re.sub(r"\s+", " ", text.replace("\xa0", " "))
    text = re.sub(rf" ?{BREAK} ?", "  \n", text)
    return text.strip()


def _image(el: HtmlElement, base: str) -> str:
    src = next((s for a in ("data-src", "data-lazy-src", "src") if (s := el.get(a)) and not s.startswith("data:")), None)
    return f"![{_norm(el.get('alt') or '')}]({urljoin(base, src)})" if src else ""


def _link(href: str, base: str) -> str | None:
    if not href or href.startswith(("#", "javascript:", "mailto:")):
        return None
    url = urljoin(base, href)
    if urlparse(url).path.endswith("/linkfilter/"):  # a Steam embrulha links externos
        url = parse_qs(urlparse(url).query).get("u", [url])[0]
    return url


def _inline(el: HtmlElement, base: str) -> str:
    """Conteúdo de `el` como texto corrido (a tag em si não entra)."""
    parts = [el.text or ""]
    for child in el:
        if not _skip(child):
            parts.append(_inline_tag(child, base))
        parts.append(child.tail or "")
    return "".join(parts)


def _inline_tag(el: HtmlElement, base: str) -> str:
    tag = el.tag
    if tag == "br":
        return BREAK
    if tag == "img":
        return _image(el, base)
    inner = _inline(el, base)
    if tag in BLOCK_TAGS:  # bloco dentro de texto corrido (ex.: <li><div>..): vira trecho separado
        return f" {inner} "
    if tag == "a":
        url = _link(el.get("href", ""), base)
        if "![" in inner or not url or not inner.strip():  # imagem em link: só a imagem (evita o link da página do arquivo)
            return inner
        return f"[{inner.strip()}]({url})"
    if tag in ("b", "strong") and inner.strip():
        return f"**{inner.strip()}**"
    if tag in ("i", "em") and inner.strip():
        return f"*{inner.strip()}*"
    return inner


def _blocks(el: HtmlElement, base: str) -> list[str]:
    out: list[str] = []
    buf: list[str] = [el.text or ""]

    def flush() -> None:
        if text := _norm("".join(buf)):
            out.append(text)
        buf.clear()

    for child in el:
        if not _skip(child):
            if child.tag in BLOCK_TAGS:
                flush()
                out.extend(_block(child, base))
            else:
                buf.append(_inline_tag(child, base))
        buf.append(child.tail or "")
    flush()
    return out


def _table(el: HtmlElement, base: str) -> list[str]:
    rows = [[_norm(" ".join(_blocks(c, base))).replace("|", "\\|") for c in tr if c.tag in ("td", "th")] for tr in el.iter("tr")]
    rows = [r for r in rows if any(r)]
    if not rows:
        return []
    width = max(map(len, rows))
    rows = [r + [""] * (width - len(r)) for r in rows]
    lines = ["| " + " | ".join(r) + " |" for r in rows]
    return ["\n".join([lines[0], "|" + "---|" * width, *lines[1:]])]


def _list(el: HtmlElement, base: str) -> list[str]:
    lines = []
    for number, li in enumerate((c for c in el if c.tag == "li" and not _skip(c)), 1):
        body = "\n".join(_blocks(li, base)).replace("\n", "\n  ")
        if body:
            lines.append(f"{number}. {body}" if el.tag == "ol" else f"- {body}")
    return ["\n".join(lines)] if lines else []


def _block(el: HtmlElement, base: str) -> list[str]:
    tag = el.tag
    level = int(tag[1]) if re.fullmatch(r"h[1-6]", tag) else next((n for c, n in HEADING_CLASSES.items() if c in (el.get("class") or "").split()), 0)
    if level:
        text = _norm(_inline(el, base))
        return [f"{'#' * level} {text}"] if text else []
    if tag == "table":
        return _table(el, base)
    if tag in ("ul", "ol"):
        return _list(el, base)
    if tag == "hr":
        return ["---"]
    if tag == "pre":
        return [f"```\n{el.text_content().strip()}\n```"]
    inner = _blocks(el, base)
    if tag == "blockquote":
        return ["\n".join("> " + line for line in "\n\n".join(inner).splitlines())]
    return inner


def html_to_markdown_full(html: str, url: str) -> str:
    doc = lxml_html.fromstring(html)
    xpath = MAIN_XPATH.get(urlparse(url).netloc)
    roots = (doc.xpath(xpath) if xpath else []) or doc.xpath("//main | //article") or [doc.body]
    blocks = [b for root in roots for b in _blocks(root, url)]
    return "\n\n".join(blocks).strip() + "\n"


def fetch_full_markdown_if_missing(url: str, dest: Path, timeout: int = 60) -> Path:
    """Baixa `url` e salva o markdown completo em `dest` apenas se ainda não existir."""
    if dest.exists():
        return dest
    response = requests.get(url, headers=HEADERS, timeout=timeout)
    response.raise_for_status()
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(html_to_markdown_full(response.text, url), encoding="utf-8")
    return dest
