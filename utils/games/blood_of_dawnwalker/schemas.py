from utils.common.schemas import CamelModel

# Schemas dos dados próprios do jogo (herdam de CamelModel).


class Trophy(CamelModel):
    id: int
    name: str
    description: str
    grade: str  # platinum | gold | silver | bronze
    icon: str  # relativo a public/
    url: str
    psn_rate: float  # % de jogadores (raridade oficial da PSN)
    psn_tier: str
    profiles_rate: float  # % entre usuários do PSNProfiles
    profiles_tier: str
    tags: list[str] = []
    stage: int | None = None
    tip: str | None = None


class TrophyStage(CamelModel):
    id: int
    title: str
    summary: str
    points: list[str] = []


class TrophyDataset(CamelModel):
    difficulty: str
    hours: str
    points: int
    counts: dict[str, int]
    stages: list[TrophyStage]
    trophies: list[Trophy]


class Ending(CamelModel):
    id: str
    name: str
    group: str  # main | secret
    trophy: str | None = None
    frees_family: bool
    summary: str
    steps: list[str]
    warnings: list[str] = []


class EndingsDataset(CamelModel):
    intro: str
    endings: list[Ending]


class CourtMember(CamelModel):
    id: str
    name: str
    level: int  # nível recomendado do jogador (PSNProfiles)
    where: str
    activities: list[str]
    trigger: str
    fight: str
    quests: list[str] = []
    notes: list[str] = []
    trophy: str | None = None


class EdictLevel(CamelModel):
    level: int
    numeral: str
    grade: str
    name: str
    effect: str


class CourtDataset(CamelModel):
    intro: str
    members: list[CourtMember]
    edict_rules: list[str]
    edict: list[EdictLevel]


class Ability(CamelModel):
    id: str
    name: str
    tree: str  # swordmastery | witchcraft | vampirism
    kind: str  # active | passive | utility
    effect: str
    cost: str | None = None


class Perk(CamelModel):
    id: str
    name: str
    tree: str
    effect: str
    ultimate: bool = False


class Tree(CamelModel):
    id: str
    name: str
    time: str  # anytime | day | night
    summary: str
    unlock: str


class SkillsDataset(CamelModel):
    trees: list[Tree]
    rules: list[str]
    abilities: list[Ability]
    perks: list[Perk]


class RouteStep(CamelModel):
    text: str
    note: str | None = None


class RoutePart(CamelModel):
    id: str
    title: str
    focus: str
    steps: list[RouteStep] = []


class BudgetItem(CamelModel):
    id: str
    group: str
    name: str
    segments: int | None = None  # negativo = devolve tempo; None = custo não documentado
    optional: bool = False
    note: str | None = None


class RouteDataset(CamelModel):
    total_segments: int
    note: str
    parts: list[RoutePart]
    budget: list[BudgetItem]


class Fact(CamelModel):
    label: str
    value: str


class TipGroup(CamelModel):
    id: str
    title: str
    tips: list[str]


class Discrepancy(CamelModel):
    topic: str
    detail: str


class TipsDataset(CamelModel):
    facts: list[Fact]
    groups: list[TipGroup]
    discrepancies: list[Discrepancy]
