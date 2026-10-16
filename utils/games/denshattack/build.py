import re
from pathlib import Path

from utils.common.export import export_dataset
from utils.common.html_md import fetch_full_markdown_if_missing
from utils.common.paths import raw_dir
from utils.common.schemas import GameMeta
from utils.games.denshattack import guide, images, levels, skins, tables, trophies
from utils.games.denshattack.constants import GAME, NAME, PSN_TROPHIES_MD, SOURCE_URLS, SOURCES
from utils.games.denshattack.schemas import Chapter, Discrepancy, ExtrasDataset, LevelsDataset


def norm(name: str) -> str:
    return re.sub(r"[^a-z0-9]", "", name.lower())


def read(name: str) -> str:
    return (raw_dir(GAME) / name).read_text(encoding="utf-8")


def discrepancies(lv: list[levels.Level]) -> list[Discrepancy]:
    per_level = {l.code: len({i.id for s in l.spots for i in s.items if i.kind == "dare"}) for l in lv}
    listed = sum(per_level.values())
    short = [c for c, n in per_level.items() if 0 < n < 5]
    return [
        Discrepancy(
            topic="Dares",
            text=f"The guide and the trophy (Ultimate Challenger, 0/325) say 325 dares, 5 in each of the 65 levels, but the guide lists only {listed}: "
            f"levels {', '.join(short)} have 4 each.",
        ),
        Discrepancy(
            topic="Dares per level",
            text="The results screens in the Steam artwork 'Levels overview 1.0' show 7/7 dares for 1-2-1 and 1-3-1, and 8/8 for 3-2-2, "
            "while the guide lists 5 in each. The guide says some dares are about collecting the other items, which may explain the gap.",
        ),
    ]


def run() -> list[Path]:
    """fetch (.md -> data/raw) -> process -> JSONs em frontend/public/data/denshattack."""
    # html_md (e não trafilatura): mantém títulos, tabelas e imagens das páginas.
    for name, url in SOURCE_URLS.items():
        fetch_full_markdown_if_missing(url, raw_dir(GAME) / name)
    print(f"[{GAME}] fontes em {raw_dir(GAME)}")

    lv, urls, unmatched = levels.parse(read("100pguides.md"))
    if unmatched:
        raise ValueError(f"trechos sem cabeçalho reconhecido: {unmatched}")
    medals = tables.parse_medals(read("steam-3791059639.md"))
    songs, tracks, regions = tables.parse_music(read("steam-3768739875.md"))
    by_code = {l.code: l for l in lv}
    for code in (*medals, *songs):
        if code not in by_code:
            raise ValueError(f"nível {code} não existe no 100pguides")
    for code, medal in medals.items():
        by_code[code].platinum = medal
    for code, song in songs.items():
        level = by_code[code]
        level.song, level.artist, level.prefecture = song.song, song.artist, song.prefecture
    trophy_md = read(PSN_TROPHIES_MD)
    trophies.download_icons(trophy_md)
    trophy_data = trophies.dataset(trophy_md)
    titles = {int(m[1]): t.name for t in trophy_data.trophies if (m := re.fullmatch(r"Complete Chapter (\d)", t.description))}
    chapters = [Chapter(n=n, title=titles[n], region=tables.REGIONS[n - 1]) for n in range(1, 10)]
    if regions != tables.REGIONS:
        raise ValueError(f"regiões do guia de músicas: {regions}")

    images.build(lv, urls)
    skin_list, skin_notes, _ = skins.build(read("steam-3765467114.md"), read("steam-3765448136.md"))
    found = {k: len({i.id for l in lv for s in l.spots for i in s.items if i.kind == k}) for k in ("can", "gear", "film", "dare")}
    found["zine"] = sum(l.kind == "fanzine" for l in lv)
    found["onsen"] = sum(l.kind == "onsen" for l in lv)
    for c in guide.build(found).collectibles:
        if c.found is not None and c.found != c.stated:
            print(f"[{GAME}] {c.name}: guia diz {c.stated}, parser achou {c.found}")
    size = images.folder_size()
    if size > images.BUDGET:
        raise ValueError(f"imagens somam {size} bytes (limite {images.BUDGET})")
    print(f"[{GAME}] imagens: {size / 1e6:.2f} MB")

    return [
        export_dataset(GAME, "meta.json", GameMeta(name=NAME, sources=SOURCES)),
        export_dataset(GAME, "guide.json", guide.build(found)),
        export_dataset(GAME, "levels.json", LevelsDataset(
            chapters=chapters, levels=lv, medal_tips=tables.parse_tips(read("steam-3791059639.md")), discrepancies=discrepancies(lv),
        )),
        export_dataset(GAME, "trophies.json", trophy_data),
        export_dataset(GAME, "extras.json", ExtrasDataset(skin_how=guide.SKIN_HOW, skins=skin_list, skin_notes=[Discrepancy(topic="Skin codes", text=t) for t in skin_notes], tracks=tracks, reward=guide.REWARD)),
    ]
