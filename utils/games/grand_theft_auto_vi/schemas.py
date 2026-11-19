from typing import Literal

from utils.common.schemas import CamelModel


class Trophy(CamelModel):
    id: int  # posição na lista da PSN (1 = platina)
    name: str
    description: str
    grade: Literal["platinum", "gold", "silver", "bronze"]
    icon: str  # relativo a public/
    url: str
    psn_rate: float | None = None  # só depois que há dados de raridade (ver TrophyDataset.has_rarity)
    psn_tier: str | None = None
    note: str | None = None  # dica própria (ainda não temos nenhuma)


class TrophyDataset(CamelModel):
    points: int
    counts: dict[str, int]
    # No lançamento a PSN mostra 0,0% "Ultra Rare" para tudo: isso não é raridade. Fica False até o HTML ser salvo de novo com taxas reais.
    has_rarity: bool
    trophies: list[Trophy]


class Opens(CamelModel):
    text: str
    mission: str | None = None  # id da missão que libera (âncora no guia)


class Mission(CamelModel):
    id: str  # slug do GTABase
    n: int | None = None  # posição entre as missões principais (1 = Prólogo); opcionais não têm número
    name: str
    chapter: int  # 0 = Prólogo
    kind: Literal["main", "optional", "missable"]
    who: list[Literal["jason", "lucia"]] = []
    summary: str
    giver: str | None = None
    location: str | None = None
    requirement: str | None = None
    reward: str | None = None
    objectives: list[str] = []
    notes: list[str] = []  # trechos das fontes sobre opcionais, perdíveis e segredos
    arc: str | None = None  # heist ao qual a missão pertence
    tags: list[str] = []  # só Jason, só Lucia, só à noite, prazo...
    sources: list[Literal["gtabase", "powerpyx"]]
    url: str
    powerpyx_url: str | None = None
    detailed: bool = False  # tem objetivos de alguma fonte


class Chapter(CamelModel):
    n: int
    summary: str  # o que acontece
    goal: str
    unlocks: list[str] = []  # rótulos curtos do que abre (a visão geral); os detalhes ficam em `opens`
    side: list[str] = []  # histórias paralelas (Strangers & Freaks) que começam no capítulo
    trophy: int | None = None  # id do troféu que conclui o capítulo
    opens: list[Opens] = []


class StoryDataset(CamelModel):
    chapters: list[Chapter]
    missions: list[Mission]
    discrepancies: list[str] = []
