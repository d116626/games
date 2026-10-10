from typing import Literal

from utils.common.schemas import CamelModel

Rarity = Literal["common", "uncommon", "rare", "legendary", "occult"]
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
    icon: str
    effect: str
    empowered: str | None = None
    target_mod: float | None = None  # multiplica a meta da rodada do chefe (None = 1x)
    tips: str | None = None  # como contornar (wiki da comunidade)
    banned: str | None = None  # quando o chefe nunca aparece (regras do jogo)


class EnemyDie(CamelModel):
    name: str
    effect: str
    icon: str | None = None  # só os dados do chefe final têm sprite; as maldições não


class Enchantment(CamelModel):
    name: str
    effect: str
    applies_to: Literal["die", "ring"] = "die"


class FinalBossAttack(CamelModel):
    chance: int  # % de sair nesta rodada (peso / soma dos pesos)
    dice: list[str]  # ex. "3 Alpha"


class FinalBoss(CamelModel):
    """O chefe da Face 6: rola dados próprios; com pouca vida entra um chefe da 2ª fase."""

    name: str
    icon: str
    effect: str
    hp: int
    phase_two_hp: int
    phase_two_bosses: list[str]
    attacks: list[FinalBossAttack]  # combinações de dados que ele rola, com a chance de cada uma


class Bestiary(CamelModel):
    bosses: list[Boss]
    final_boss: FinalBoss
    enemy_dice: list[EnemyDie]
    enchantments: list[Enchantment]
    curses: list[EnemyDie]


class Challenge(CamelModel):
    name: str
    icon: str | None = None
    rules: list[str]
    hand: str
    kit: str | None = None
    final_face: int
    requires: list[str]
    banned: str | None = None


class Power(CamelModel):
    level: str  # numeral romano
    effect: str
    alt: str | None = None  # versão exclusiva de uma mão
    gem: str  # dado desbloqueado ao vencer neste Power ou acima
    gem_icon: str


class Target(CamelModel):
    face: int
    round: int
    target: int
    hard: int  # Power IV ou mais
    boss: bool


class Pack(CamelModel):
    name: str
    effect: str
    early: int  # % de chance nas Faces 1 a 3
    late: int  # % de chance nas Faces 4 a 6


class MapStop(CamelModel):
    name: str
    effect: str


class Rules(CamelModel):
    challenges: list[Challenge]
    powers: list[Power]
    targets: list[Target]
    target_notes: list[str]
    packs: list[Pack]
    pack_notes: list[str]
    map_stops: list[MapStop]


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
    effect: str | None = None  # regras da mão (wiki da comunidade)
    starter: str | None = None  # dados, anéis e cartas iniciais (do jogo)
    stats: str | None = None  # rolls, hand size, dice per turn e charisma (do jogo)
    tips: list[str] = []


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


class CatalogItem(CamelModel):
    """Dado, anel, carta ou mão do jogo (textos e sprite oficiais)."""

    id: str  # `<tipo>-<id no jogo>` (único)
    kind: Literal["dice", "rings", "cards", "hands"]
    name: str
    condition: str | None = None  # como desbloquear; None = disponível desde o início
    effect: str
    faces: str | None = None  # faces do dado, quando multivalorado (ex.: 1/2/3, 1..6)
    sides: int | None = None  # formato do dado no jogo: 1 a 6 pontos, 7 = cruz (7 lados ou mais)
    rarity: Rarity | None = None
    hidden: bool | None = None  # não aparece em runs normais (ex.: Hollow Ring, Shattered Die)
    traits: list[str] | None = None  # ids de `Catalog.traits`, usados nos filtros
    icon: str  # sprite oficial, relativo a public/


class Trait(CamelModel):
    """Palavra-chave do jogo ou característica (tag) usada como filtro no índice."""

    id: str
    label: str
    description: str


class Catalog(CamelModel):
    items: list[CatalogItem]
    traits: list[Trait]


class TipGroup(CamelModel):
    title: str
    tips: list[str]
    source: str


class Strategy(CamelModel):
    groups: list[TipGroup]
