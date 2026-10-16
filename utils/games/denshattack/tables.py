"""Tabelas de duas guias do Steam em que cada célula virou uma linha do .md:
medalhas de platina (`steam-3791059639.md`: código, nome, pontuação) e músicas (`steam-3768739875.md`:
código, nome, música, artista, prefeitura)."""

import re

from utils.common.schemas import CamelModel
from utils.games.denshattack.schemas import Track

MEDAL = re.compile(r"^(\d-\d-[A-Z0-9])\n\n(.+)\n\n([\d,]+|N/A)$", re.M)
SONG = re.compile(r"^\*\*(\d-\d-[A-Z0-9])\*\*\n\n(.+)\n\n\*(.+)\*\n\n(.+)\n\n(.+)$", re.M)
REGION = re.compile(r"^## (.+)$", re.M)
# a lista de músicas chama de 9-1-2 e 9-1-3 os dois chefes finais (9-1-B e 9-2-B no 100pguides):
# "10 Second to Revolution" e "To the Moon"
MUSIC_ALIAS = {"9-1-2": "9-1-B", "9-1-3": "9-2-B"}
REGIONS = ["Kyushu", "Chugoku 1", "Shikoku", "Chugoku 2", "Kansai", "Chubu", "Kanto", "Tohoku", "Hokkaido"]  # capítulos 1..9


class Song(CamelModel):
    song: str
    artist: str
    prefecture: str


def parse_medals(md: str) -> dict[str, int | None]:
    """código -> pontuação da medalha de platina (None = "N/A")."""
    body = md.partition("## Tips")[0]
    return {m[1]: int(m[3].replace(",", "")) if m[3] != "N/A" else None for m in MEDAL.finditer(body)}


def parse_tips(md: str) -> list[str]:
    section = md.partition("## Tips")[2].partition("## Train Choice")[0]
    return [re.sub(r"\s+", " ", ln.strip().lstrip("•").strip()) for ln in section.split("\n") if ln.strip().startswith("•")]


def parse_music(md: str) -> tuple[dict[str, Song], list[Track], list[str]]:
    """-> (código -> música, faixas fora das fases, regiões lidas)."""
    main, _, extra = md.partition("## Additional Tracks")
    songs: dict[str, Song] = {}
    for m in SONG.finditer(main):
        code = MUSIC_ALIAS.get(m[1], m[1])
        songs[code] = Song(song=m[3].strip(), artist=m[4].strip(), prefecture=re.sub(r" Prefecture$", "", m[5].strip()))
    tracks = [Track(where=m[1].strip(), song=m[2].strip(), artist=m[3].strip())
              for m in re.finditer(r"^\*\*(.+)\*\*\n\n\*(.+)\*\n\n(.+)$", extra, re.M)]
    regions = [r for r in REGION.findall(main) if r in REGIONS]
    return songs, tracks, regions
