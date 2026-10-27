from typing import Literal

from utils.common.schemas import CamelModel

# Schemas dos dados próprios do jogo (herdam de CamelModel).


class Fate(CamelModel):
    """Solução de um tripé do livro: quem morreu (o `CrewMember`), como e por quem."""

    cause: str  # "Shot with a gun", "Spiked", "Alive in Africa"
    killer: str | None = None  # id de um tripulante
    by_beast: bool = False  # "by a beast"


class CrewMember(CamelModel):
    id: str  # slug do nome
    no: int  # nº 1-60 da lista das fontes (a mesma ordem do manifesto, segundo o projeto obra-dinn-interactive-crew-list)
    name: str
    role: str  # "quality" no jogo
    origin: str  # "origin" no manifesto do jogo; ver origins.py
    portrait: str  # relativo a public/
    chapter: int
    part: int | None  # None = seção "Disappearances" do capítulo
    fate: Fate
    also_listed: str | None = None  # como o PSNProfiles escreve o fate, quando difere do guia principal
    how: str  # como identificar o rosto, passo a passo


class FateEntry(CamelModel):
    """Um item de uma parte do livro: um tripulante ou um evento sem nome (estivador, vaca, monstro)."""

    crew: str | None = None  # id do tripulante; None = evento sem nome
    event: str | None = None  # texto do evento sem nome
    identity_hint: str | None = None  # dica de quem é (sem entregar o nome)
    clue_hint: str | None = None  # dica de onde procurar pistas
    note: str | None = None  # o que acontece na memória e variações aceitas pelo jogo


class Part(CamelModel):
    n: int | None  # None = "Disappearances"
    location: str | None = None  # "On the gun deck"
    fates: list[FateEntry]


class Chapter(CamelModel):
    n: int
    roman: str
    title: str
    fate_count: int  # itens do livro no capítulo
    solve_count: int  # quantos precisam ser resolvidos (os outros são automáticos)
    summary: str  # resumo do que acontece (spoiler)
    parts: list[Part]


class Discrepancy(CamelModel):
    topic: str
    text: str


class ChaptersDataset(CamelModel):
    chapters: list[Chapter]
    discrepancies: list[Discrepancy] = []


class CrewDataset(CamelModel):
    crew: list[CrewMember]


class Trophy(CamelModel):
    id: int
    name: str
    description: str
    grade: Literal["platinum", "gold", "silver", "bronze"]
    icon: str  # relativo a public/
    url: str
    psn_rate: float
    psn_tier: str
    profiles_rate: float
    profiles_tier: str
    missable: bool = False
    note: str | None = None  # dica do roteiro


class TrophyDataset(CamelModel):
    points: int
    counts: dict[str, int]
    trophies: list[Trophy]


class Topic(CamelModel):
    title: str
    items: list[str]


class Face(CamelModel):
    """Retângulo de um rosto no sketch, em pixels da imagem original (width x height do `Sketch`)."""

    crew_id: str
    x: int
    y: int
    w: int
    h: int


class Sketch(CamelModel):
    """O sketch "Life at Sea" (três desenhos numa imagem só) e onde fica o rosto de cada tripulante."""

    src: str  # relativo a public/
    width: int
    height: int
    alt: str
    credit: str
    faces: list[Face]


class GuideDataset(CamelModel):
    """Texto de apoio sem spoilers de fates: como o jogo funciona, como deduzir e como marcar a causa."""

    basics: list[Topic]
    deduction: list[Topic]
    causes: list[Topic]
    sketch: Sketch
