from typing import Literal

from utils.common.schemas import CamelModel

# Schemas dos dados próprios do jogo (herdam de CamelModel).

ItemKind = Literal["can", "gear", "film", "dare"]
LevelKind = Literal["level", "race", "boss", "story", "castle", "fanzine", "onsen"]


class Item(CamelModel):
    """Algo marcável como feito. Um mesmo `id` pode aparecer em vários spots (dares em partes: "(1/2)", "(2/2)")."""

    id: str  # "1-2-1:can:1", "1-2-1:film", "1-2-1:dare:smash-2-wooden-bridges"
    kind: ItemKind
    title: str | None = None  # só dares
    n: int | None = None  # posição (lata/engrenagem) ou parte do dare
    of: int | None = None


class Spot(CamelModel):
    """Um parágrafo do guia: onde fica o(s) item(ns) e como chegar."""

    text: str
    items: list[Item]
    images: list[str] = []  # relativos a public/; só spots com lata, engrenagem ou filme


class Level(CamelModel):
    code: str  # "1-2-1"
    name: str
    chapter: int
    kind: LevelKind
    prefecture: str | None = None
    song: str | None = None
    artist: str | None = None
    platinum: int | None = None  # pontuação da medalha de platina
    note: str | None = None  # texto de lojas, fanzines e onsens
    spots: list[Spot] = []


class Trophy(CamelModel):
    id: int
    name: str
    description: str
    grade: str  # platinum | gold | silver | bronze
    group: str = ""
    icon: str  # relativo a public/
    url: str
    goal: int | None = None  # total da barra de progresso ("0/134")
    psn_rate: float  # % de jogadores (raridade oficial da PSN)
    psn_tier: str
    profiles_rate: float  # % entre usuários do PSNProfiles
    profiles_tier: str


class Skin(CamelModel):
    name: str
    includes: str  # "Skin", "Skin + Voicepack"
    code: str  # U/D/L/R, digitado no castelo
    url: str | None = None  # canal do criador
    image: str | None = None  # relativo a public/; criadores que dividem a skin dividem a imagem
    older_code: str | None = None  # código diferente no guia mais antigo


class Chapter(CamelModel):
    n: int
    title: str
    region: str


class Discrepancy(CamelModel):
    """Onde as fontes não batem entre si ou com o jogo."""

    topic: str
    text: str


class Collectible(CamelModel):
    id: str  # can | film | gear | zine | train | sticker | onsen | dare
    name: str
    stated: int  # total segundo o 100pguides (e o troféu)
    found: int | None = None  # quantos o parser achou (None = não listados um a um)
    how: str
    spend: str | None = None
    trophy: str


class LevelsDataset(CamelModel):
    chapters: list[Chapter]
    levels: list[Level]
    medal_tips: list[str]
    discrepancies: list[Discrepancy]


class TrophyGroup(CamelModel):
    id: str
    title: str


class TrophyDataset(CamelModel):
    points: int
    counts: dict[str, int]
    groups: list[TrophyGroup]
    trophies: list[Trophy]


class Track(CamelModel):
    where: str
    song: str
    artist: str


class ExtrasDataset(CamelModel):
    skin_how: list[str]
    skins: list[Skin]
    skin_notes: list[Discrepancy]
    tracks: list[Track]
    reward: list[str]


class GuideDataset(CamelModel):
    collectibles: list[Collectible]
    facts: list[str]
