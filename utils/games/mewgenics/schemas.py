from typing import Literal

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
    source: str | None = None  # rótulo mostrado ao lado do título
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


class Foe(CamelModel):
    name: str
    text: str
    priority: bool = False  # inimigo que o guia manda matar primeiro
    image: str | None = None  # tela "X vs Chefe" (só chefes)


class Biome(CamelModel):
    id: str  # igual ao id da área em route
    summary: str
    leans: str | None = None  # o que o bioma favorece
    image: str | None = None  # tela-título do bioma
    hazards: list[str]
    enemies: list[Foe]
    bosses: list[Foe]
    tips: list[str] = []


class HouseBoss(CamelModel):
    id: str
    name: str
    text: str
    tips: list[str]


class BiomeDataset(CamelModel):
    biomes: list[Biome]
    house_setup: list[str]
    house_bosses: list[HouseBoss]
    act3_tips: list[str]


class Debuff(CamelModel):
    id: str
    name: str
    kind: Literal["damage", "control", "modifier"]
    rating: Literal["top", "weak"] | None = None  # só quando o Greenside classifica explicitamente
    what: str
    use: str
    watch: str | None = None  # cuidado ao ter o status nos seus gatos


class DebuffDataset(CamelModel):
    debuffs: list[Debuff]


class QuestItem(CamelModel):
    id: str
    name: str
    aka: str | None = None  # outro nome usado por outra fonte
    unlock: str | None = None  # de onde vem e para onde levar (itens principais)
    text: str
    tips: list[str] = []
    image: str | None = None  # carta do item no jogo, relativa a public/


class QuestDataset(CamelModel):
    main_rules: list[str]
    main_items: list[QuestItem]
    main_tips: list[str]
    side_rules: list[str]
    side_items: list[QuestItem]
    image: str  # captura do evento final de uma quest
    image_caption: str
    discrepancies: list[Discrepancy]


class CombatTopic(CamelModel):
    id: str
    title: str
    text: str
    tips: list[str] = []
    images: list[str] = []  # relativos a public/
    caption: str | None = None


class LevelBudget(CamelModel):
    what: str
    levels: str


class LevelReward(CamelModel):
    level: str  # ex.: "1 → 2"
    title: str
    text: str


class LevelGuide(CamelModel):
    sources: str
    budget: list[LevelBudget]
    total: str
    scenarios: list[str]
    rewards: list[LevelReward]
    mnemonic: list[str]
    tips: list[str]


class CombatDataset(CamelModel):
    golden_rule: str
    topics: list[CombatTopic]
    levels: LevelGuide


class GameEvent(CamelModel):
    id: str
    name: str
    text: str
    flag: str | None = None  # etiqueta curta de conselho do guia (ex.: "Always sleep")
    tone: Literal["good", "bad"] | None = None
    image: str | None = None  # relativo a public/


class EventGroup(CamelModel):
    id: str
    title: str
    intro: str | None = None
    events: list[GameEvent]


class Tragedy(CamelModel):
    text: str
    harmless: list[str]
    image: str | None = None


class EventDataset(CamelModel):
    intro: str
    outcomes: list[str]
    rules: list[str]
    groups: list[EventGroup]
    tragedy: Tragedy


class Pic(CamelModel):
    src: str  # relativo a public/
    caption: str
    width: int
    height: int


class TechStep(CamelModel):
    title: str
    text: str
    images: list[Pic] = []


class Technique(CamelModel):
    id: str
    title: str
    summary: str
    needs: list[str] = []
    items: list[Pic] = []  # cartas de itens do jogo
    steps: list[TechStep] = []
    tips: list[str] = []
    caveats: list[str] = []


class AdvancedDataset(CamelModel):
    intro: str
    techniques: list[Technique]


class HiddenTip(CamelModel):
    id: str
    title: str
    text: str
    status: Literal["confirmed", "disputed"] | None = None  # só o que o próprio post marca
    note: str | None = None  # confirmação nos comentários ou cruzamento com o Greenside


class HiddenGroup(CamelModel):
    id: str
    title: str
    tips: list[HiddenTip]


class HiddenDataset(CamelModel):
    intro: str
    groups: list[HiddenGroup]
