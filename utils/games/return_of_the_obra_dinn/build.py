from pathlib import Path

from utils.common.export import export_dataset
from utils.common.html_md import fetch_full_markdown_if_missing
from utils.common.paths import raw_dir
from utils.common.schemas import GameMeta
from utils.games.return_of_the_obra_dinn import chapters, crew, guide, images, trophies
from utils.games.return_of_the_obra_dinn.constants import GAME, LINKS, NAME, PSN_GUIDE_MD, PSN_TROPHIES_MD, SOURCE_URLS, SOURCES
from utils.games.return_of_the_obra_dinn.identify import HOW
from utils.games.return_of_the_obra_dinn.origins import ORIGINS
from utils.games.return_of_the_obra_dinn.schemas import ChaptersDataset, CrewDataset, CrewMember, Discrepancy

DISCREPANCIES = [
    Discrepancy(
        topic="Spelling of names",
        text="The guides spell some names differently: Soloman/Solomon Syed, Fillip/Filip Dahl, Hok-Seng Lau/Lan, Roderick Andersen/Anderson, "
        "Olus Wiater/Wiatrr, Nicholas Botterill/Boterill, Timothy Butement/Buteman. One guide also writes the East Asian names family name first "
        "(Li Huang, Zhang Jie, Hong Li, Lee Wei). This guide uses the spelling of the crew list guide.",
    ),
    Discrepancy(topic="Chapter VIII title", text='It is "Bargain" in the Steam guides, "The Bargain" at PSNProfiles and "Bargaining" in the chronological guide.'),
    Discrepancy(
        topic="Wording of fates",
        text="The game accepts more than one answer for several deaths, and the guides do not always pick the same one. Where PSNProfiles differs, "
        "it is shown next to the main answer as \"also listed\": John Naples (killed with a sword), James Wallace and Jie Zhang (decapitated), "
        "Abigail (clubbed by a beast), Fillip Dahl (poisoned), Omid Gul (fell overboard), Charles Miner (torn apart) and William Wasim "
        "(fell down stairs).",
    ),
]


def read(name: str) -> str:
    return (raw_dir(GAME) / name).read_text(encoding="utf-8")


def run() -> list[Path]:
    """fetch (.md -> data/raw) -> process -> JSONs em frontend/public/data/return-of-the-obra-dinn."""
    # html_md (e não trafilatura): mantém títulos, tabelas e imagens dos guias da Steam.
    for name, url in SOURCE_URLS.items():
        fetch_full_markdown_if_missing(url, raw_dir(GAME) / name)
    print(f"[{GAME}] fontes em {raw_dir(GAME)}")

    raw = crew.parse(read("steam-1542348328.md"))
    by_id = {c.id: c for c in raw}
    chapter_list, where, psn_fates = chapters.build(read("steam-2961173602.md"), read(PSN_GUIDE_MD), raw)
    if HOW.keys() != by_id.keys():
        raise ValueError(f"identify.py não bate com a lista de tripulantes: {HOW.keys() ^ by_id.keys()}")

    portrait = images.portraits(raw)
    members = [
        CrewMember(
            id=c.id, no=c.no, name=c.name, role=c.role, origin=ORIGINS[c.id], portrait=portrait[c.id], chapter=where[c.id][0], part=where[c.id][1],
            fate=crew.fate(c, by_id), also_listed=None if crew.same_fate(c.fate_text, psn_fates[c.id]) else psn_fates[c.id],
            how=HOW[c.id],
        )
        for c in raw
    ]
    trophy_md = read(PSN_TROPHIES_MD)
    trophies.download_icons(trophy_md)
    sketch = images.sketch()
    size = images.folder_size()
    if size > images.BUDGET:
        raise ValueError(f"imagens somam {size} bytes (limite {images.BUDGET})")
    print(f"[{GAME}] imagens: {size / 1e6:.2f} MB")

    return [
        export_dataset(GAME, "meta.json", GameMeta(name=NAME, sources=SOURCES, links=LINKS)),
        export_dataset(GAME, "guide.json", guide.build(sketch)),
        export_dataset(GAME, "crew.json", CrewDataset(crew=members)),
        export_dataset(GAME, "chapters.json", ChaptersDataset(chapters=chapter_list, discrepancies=DISCREPANCIES)),
        export_dataset(GAME, "trophies.json", trophies.dataset(trophy_md)),
    ]
