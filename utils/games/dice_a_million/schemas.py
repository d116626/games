from typing import Literal

from utils.common.schemas import CamelModel

Category = Literal["dice", "rings", "hands", "cards", "challenges", "vortex", "secrets"]


class Achievement(CamelModel):
    """Uma conquista da Steam. Dados, anéis, mãos e cartas são desbloqueados por conquistas,
    então o ícone da conquista é o ícone do item."""

    id: str  # hash do ícone (único)
    name: str
    category: Category
    how: str | None = None  # como obter (Steam, guia da comunidade ou wiki)
    tip: str | None = None  # dica extra do guia da comunidade
    rarity: float  # % global de jogadores que têm
    icon: str  # relativo a public/


class Achievements(CamelModel):
    items: list[Achievement]


class Boss(CamelModel):
    name: str
    effect: str
    empowered: str | None = None


class EnemyDie(CamelModel):
    name: str
    effect: str


class Enchantment(CamelModel):
    name: str
    effect: str
    applies_to: Literal["die", "ring"] = "die"


class Bestiary(CamelModel):
    bosses: list[Boss]
    enemy_dice: list[EnemyDie]
    enchantments: list[Enchantment]


class Step(CamelModel):
    title: str
    body: str
    unlocks: list[str] = []  # ids de conquistas desbloqueadas neste passo
    warning: str | None = None  # incerteza ou fontes divergentes


class Stage(CamelModel):
    id: str
    title: str
    goal: str
    steps: list[Step]


class HandUnlock(CamelModel):
    name: str
    icon: str | None = None  # id da conquista da mão (a Branca e a Hollow não têm)
    requirement: str
    after: str | None = None  # mão usada para cumprir o requisito, quando importa


class HandGoal(CamelModel):
    """Uma linha da matriz de mestria: a conquista (id) de cada objetivo por mão, ou None."""

    hand: str
    icon: str | None = None
    face3: str | None = None
    million: str | None = None
    rush: str | None = None
    promotion: str | None = None
    power6: str | None = None


class Roadmap(CamelModel):
    stages: list[Stage]
    hands: list[HandUnlock]
    goals: list[HandGoal]


class TipGroup(CamelModel):
    title: str
    tips: list[str]
    source: str


class Strategy(CamelModel):
    groups: list[TipGroup]
