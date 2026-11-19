"""Missões da história: o GTABase é a fonte principal (122 entradas, numeradas, uma frase cada) e o PowerPyx complementa
(heist, só Jason/só Lucia, onde começa, requisito, recompensa, objetivos e dicas) onde tem página."""

import re
from pathlib import Path

from lxml import html as lxml_html

from utils.common.paths import raw_dir
from utils.games.grand_theft_auto_vi.constants import GAME, GTABASE_MISSIONS_HTML
from utils.games.grand_theft_auto_vi.missions import PYX_INDEX, powerpyx_urls
from utils.games.grand_theft_auto_vi.schemas import Mission

WHO = {"Jason Duval": "jason", "Lucia Caminos": "lucia"}
KIND = {"Mandatory Mission": "main", "Optional (Side Mission)": "optional", "Optional (Missable)": "missable"}
TAGS = {"jason only": "Jason only", "lucia only": "Lucia only", "solo only": "Solo only", "time-sensitive": "Time-sensitive", "missable": "Missable"}
NOTE_WORDS = re.compile(r"missable|secret|easter egg|time-sensitive|only be completed|only available|miss out", re.I)
NOTE_SKIP = re.compile(r"Grand Theft Auto VI|Prev|Next »|Starting Location|^[-•] |^\d+\. |walkthrough is coming soon", re.I)


def clean(text: str) -> str:
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    return re.sub(r"\s+", " ", text.replace("*", "")).strip()


def norm(name: str) -> str:
    name = re.sub(r"\(.*?\)", "", name)
    return re.sub(r"[^a-z0-9]", "", name.lower().replace("&", "and"))


def sentences(body: str) -> list[str]:
    out = []
    for line in body.split("\n"):
        line = clean(line)
        if line.startswith(("Tip", "Note")) or len(line) > 60:
            out += [s.strip() for s in re.split(r"(?<=[.!?]) (?=[A-Z])", line)]
    return out


def notes_of(body: str) -> list[str]:
    seen, out = set(), []
    for s in sentences(body):
        s = re.sub(r"^(Tip|Note)[^:]*: ?", "", s)
        if 25 <= len(s) <= 260 and NOTE_WORDS.search(s) and s not in seen and not NOTE_SKIP.search(s):
            seen.add(s)
            out.append(s)
    return out[:2]


def gtabase_items() -> list[dict]:
    doc = lxml_html.fromstring((raw_dir(GAME) / GTABASE_MISSIONS_HTML).read_text(encoding="utf-8"))
    out, chapter = [], 0
    for el in doc.xpath('//h2[normalize-space()="Prologue" or starts-with(normalize-space(),"Chapter ")] | //a[contains(@class,"items-row")]'):
        if el.tag == "h2":
            text = el.text_content().strip()
            chapter = 0 if text == "Prologue" else int(text.split()[1])
            continue
        title = el.xpath(".//h3")[0]
        badges = el.xpath('.//span[contains(@class,"gtm-badge")]/text()')
        out.append({
            "id": el.get("href").rstrip("/").rsplit("/", 1)[-1],
            "chapter": chapter,
            "name": (title.xpath('.//span[@class="gtm-title"]/text()') or [re.sub(r"^\s*\d+\.\s*", "", title.text_content()).strip()])[0].strip(),
            "who": [WHO[w] for w in el.xpath('.//div[@class="protagonist-icons"]/img/@alt') if w in WHO],
            "badges": badges,
            "summary": el.xpath('.//div[contains(@class,"mission-description")]')[0].text_content().strip(),
        })
    return out


def gtabase_page(slug: str) -> dict:
    path = raw_dir(GAME) / "gtabase" / "missions" / f"{slug}.md"
    text = path.read_text(encoding="utf-8") if path.exists() else ""
    info = {k: clean(v) for k, v in re.findall(r"^- (Mission Type|Mission Giver|Protagonist \(Playable\)|Required for 100%|Rewards)(.*)$", text, re.M)}
    walk = text.split("## Mission Walkthrough", 1)[-1].split("## Mission Completed", 1)[0] if "## Mission Walkthrough" in text else ""
    objectives = []
    if "## Mission Objectives" in walk:
        block = walk.split("## Mission Objectives", 1)[1].split("\n###", 1)[0]
        objectives = [clean(re.sub(r"^\d+\. ", "", l)) for l in block.split("\n") if re.match(r"^\d+\. ", l)]
    body = walk.split("\n###", 1)[1] if "\n###" in walk else ""
    return {"info": info, "objectives": objectives, "notes": notes_of(body), "coming_soon": "coming soon" in walk}


def powerpyx_index() -> list[dict]:
    md = (raw_dir(GAME) / PYX_INDEX).read_text(encoding="utf-8")
    start = md.index("## Prologue")
    end = md.find("## Prologue", start + 1)
    out, chapter = [], 0
    for line in md[start : end if end > 0 else None].split("\n"):
        if line.startswith("## "):
            title = line[3:].strip()
            chapter = 0 if title == "Prologue" else int(title.split()[1]) if title.startswith("Chapter") else -1
            continue
        m = re.match(r"^\d+\. (.*)$", line)
        if not m or chapter < 0:
            continue
        raw = m[1]
        link = re.search(r"\]\(https://www\.powerpyx\.com/(gta-6-[^/)]+)/\)", raw)
        slug = link[1].removeprefix("gta-6-").removesuffix("-walkthrough") if link else None
        text = clean(raw)
        tags = [TAGS[t.strip().lower()] for g in re.findall(r"\(([A-Za-z -]*?(?:ONLY|Time-Sensitive|Missable)[A-Za-z ,-]*)\)", text, re.I) for t in g.split(",") if t.strip().lower() in TAGS]
        text = re.sub(r"\((?:[^()]*?(?:ONLY|Time-Sensitive|Missable)[^()]*)\)", "", text, flags=re.I)
        arc = re.match(r"^\[+([^\]]+)\]+\s*(.*)$", text)
        if arc:
            text = arc[2]
        paren = re.findall(r"\(([^()]+)\)", text)
        out.append({"chapter": chapter, "slug": slug, "arc": arc[1] if arc else None, "optional": text.startswith("Optional"),
                    "name": norm(re.sub(r"^Optional\s*[–-]\s*", "", text)), "alt": [norm(x) for x in paren], "text": text, "tags": tags})
    return out


def powerpyx_page(slug: str) -> dict:
    path = raw_dir(GAME) / "powerpyx" / "missions" / f"{slug}.md"
    if not path.exists():
        return {}
    text = path.read_text(encoding="utf-8")
    fields = {k: clean(v) for k, v in re.findall(r"^- \*\*([A-Za-z ]+):\*\*(.*)$", text, re.M)}
    obj_block = text.split("**Objectives:**", 1)[1].split("\n## ", 1)[0] if "**Objectives:**" in text else ""
    objectives = [clean(re.sub(r"^\d+\. ", "", l)) for l in obj_block.split("\n") if re.match(r"^\d+\. ", l)]
    body = text.split("**Objectives:**", 1)[-1].split("\n## ", 1)[-1]
    return {"fields": fields, "objectives": objectives, "notes": notes_of(body)}


def find_powerpyx(item: dict, index: list[dict]) -> dict | None:
    key = norm(item["name"])
    same_chapter = [p for p in index if p["chapter"] in (item["chapter"], item["chapter"] - 1, item["chapter"] + 1)]
    for p in same_chapter:
        if p["name"] == key or key in p["alt"]:
            return p
    for p in same_chapter:
        if p["slug"] and (p["slug"].replace("-", "") .startswith(key) or p["name"].startswith(key) or key.startswith(p["name"])) and len(key) > 6:
            return p
    return None


def build() -> tuple[list[Mission], list[str]]:
    index = powerpyx_index()
    urls = powerpyx_urls((raw_dir(GAME) / PYX_INDEX).read_text(encoding="utf-8"))
    missions, unmatched, n = [], [], 0
    used: set[str] = set()
    for it in gtabase_items():
        page = gtabase_page(it["id"])
        info = page["info"]
        kind = KIND.get(info.get("Mission Type", ""), "main" if not it["badges"] else "missable" if "MISSABLE" in it["badges"] else "optional")
        p = find_powerpyx(it, index)
        if p:
            used.add(p["text"])
        elif kind == "main":
            unmatched.append(it["name"])
        pp = powerpyx_page(p["slug"]) if p and p["slug"] and p["slug"] in urls else {}
        fields = pp.get("fields", {})
        who = sorted(it["who"], key=("jason", "lucia").index)
        if not who and fields.get("Can Be Started By"):
            who = [w for w in ("jason", "lucia") if w in fields["Can Be Started By"].lower()]
        tags = list(p["tags"]) if p else []
        if "MISSABLE" in it["badges"] and "Missable" not in tags:
            tags.append("Missable")
        reward = fields.get("Reward")
        objectives = page["objectives"] or pp.get("objectives", [])
        if kind == "main":
            n += 1
        missions.append(Mission(
            id=it["id"], n=n if kind == "main" else None, name=it["name"], chapter=it["chapter"], kind=kind, who=who, summary=it["summary"],
            giver=info.get("Mission Giver") or fields.get("Quest Giver"), location=fields.get("Starting Location"),
            requirement=re.sub(r"[“”]+", "\"", fields["Requirement"]) if p and fields.get("Requirement") else None, reward=None if not reward or reward.lower() == "none" else reward,
            objectives=objectives, notes=page["notes"] or pp.get("notes", []), arc=p["arc"] if p else None, tags=tags,
            sources=["gtabase"] + (["powerpyx"] if pp else []), url=f"https://www.gtabase.com/gta-6/missions/{it['id']}" if it["id"] != "prologue" else "https://www.gtabase.com/missions/gta-6/prologue",
            powerpyx_url=urls.get(p["slug"]) if p and p["slug"] else None, detailed=bool(objectives),
        ))
    return missions, unmatched
