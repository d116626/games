from utils.common.schemas import CamelModel

# Schemas dos dados próprios do jogo (herdam de CamelModel).


class Trophy(CamelModel):
    id: int
    name: str
    description: str
    grade: str  # platinum | gold | silver | bronze
    group: str
    icon: str  # relativo a public/
    url: str
    psn_rate: float  # % de jogadores (raridade oficial da PSN)
    psn_tier: str
    profiles_rate: float  # % entre usuários do PSNProfiles
    profiles_tier: str
    tip: str | None = None


class TrophyGroup(CamelModel):
    id: str
    title: str
    summary: str


class TrophyDataset(CamelModel):
    points: int
    counts: dict[str, int]
    groups: list[TrophyGroup]
    trophies: list[Trophy]


class Step(CamelModel):
    title: str
    text: str


class Npc(CamelModel):
    id: str
    name: str
    role: str
    takes: str  # o que ele quer receber
    gives: list[str]
    tip: str
    priority: int  # 1 = mais cedo
    trophy: str | None = None


class StartDataset(CamelModel):
    steps: list[Step]
    npcs: list[Npc]
    note: str


class HouseStat(CamelModel):
    id: str
    name: str
    effect: str
    target: str


class Room(CamelModel):
    name: str
    stats: str
    use: str


class RoomPlan(CamelModel):
    id: str
    title: str
    source: str
    summary: str
    rooms: list[Room]
    notes: list[str] = []


class Phase(CamelModel):
    name: str
    aim: str


class OrientationRow(CamelModel):
    pair: str
    result: str
    kittens: str  # yes | no | rare


class Discrepancy(CamelModel):
    topic: str
    sides: list[str]
    verdict: str | None = None


class Odds(CamelModel):
    what: str
    base: str
    boost: str


class BreedingDataset(CamelModel):
    house_stats: list[HouseStat]
    inherits: list[str]
    odds: list[Odds]
    room_rules: list[str]
    plans: list[RoomPlan]
    phases: list[Phase]
    orientation: list[OrientationRow]
    orientation_notes: list[str]
    inbreeding: list[str]
    furniture: list[str]
    discrepancies: list[Discrepancy]


class CatClass(CamelModel):
    id: str
    name: str
    roles: list[str]
    mods: list[str]
    special: str | None = None
    unlock: str
    family: str  # melee | ranged | hybrid | mind | any
    prefer: list[str]
    tier: str | None = None
    summary: str
    pick: str | None = None
    conflict: str | None = None
    trophy: str | None = None  # nome do troféu "Complete all areas with ..."


class StatRule(CamelModel):
    stat: str
    rule: str


class RangedAttack(CamelModel):
    name: str
    damage: float  # dano base; o ataque do Monk só ganha metade do bônus de DEX
    half_scaling: bool = False


class ClassDataset(CamelModel):
    intro: str
    stat_rules: list[StatRule]
    ranged: list[RangedAttack]
    classes: list[CatClass]
    discrepancies: list[Discrepancy]


class Area(CamelModel):
    id: str
    act: int  # 0 = secretas
    name: str
    requires: str
    unlocks: str | None = None
    trophy: str | None = None
    note: str | None = None
    needs: list[str] | None = None  # ids das áreas exigidas; None = as fontes não dizem
    path: str | None = None  # "A" ou "B": trilhas paralelas dentro do ato


class Milestone(CamelModel):
    id: str
    at: str  # "start", "act1".."act3" (bloco do ato) ou o id de uma área
    kind: str  # home | breeding | event
    title: str
    when: str  # a condição real: o que você precisa ter feito/ter em mãos
    text: str
    npcs: list[str] = []


class Act(CamelModel):
    id: int
    title: str
    summary: str


class RouteDataset(CamelModel):
    acts: list[Act]
    areas: list[Area]
    milestones: list[Milestone]
    notes: list[str]
    discrepancies: list[Discrepancy]
