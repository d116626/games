/** Mesmo formato dos JSONs exportados por `utils/games/mewgenics/schemas.py`. */
export type Grade = "platinum" | "gold" | "silver" | "bronze";

export type Trophy = {
  id: number;
  name: string;
  description: string;
  grade: Grade;
  group: string;
  icon: string;
  url: string;
  psnRate: number;
  psnTier: string;
  profilesRate: number;
  profilesTier: string;
  tip?: string;
};
export type TrophyGroup = { id: string; title: string; summary: string };
export type TrophyDataset = {
  points: number;
  counts: Record<Grade, number>;
  groups: TrophyGroup[];
  trophies: Trophy[];
};

export type Step = { title: string; text: string; items: { name: string; text: string }[] };
export type Npc = {
  id: string;
  name: string;
  role: string;
  takes: string;
  gives: string[];
  tip: string;
  priority: number;
  trophy?: string;
};
export type StartDataset = { steps: Step[]; npcs: Npc[]; note: string };

export type HouseStat = { id: string; name: string; effect: string; target: string };
export type Room = { name: string; stats: string; use: string };
export type RoomPlan = { id: string; title: string; source: string; summary: string; rooms: Room[]; notes: string[] };
export type Phase = { name: string; aim: string };
export type OrientationRow = { pair: string; result: string; kittens: "yes" | "no" | "rare" };
export type Discrepancy = { topic: string; sides: string[]; verdict?: string };
export type Odds = { what: string; base: string; boost: string };
export type BreedingDataset = {
  houseStats: HouseStat[];
  inherits: string[];
  odds: Odds[];
  roomRules: string[];
  plans: RoomPlan[];
  phases: Phase[];
  orientation: OrientationRow[];
  orientationNotes: string[];
  inbreeding: string[];
  furniture: string[];
  discrepancies: Discrepancy[];
};

export type Family = "melee" | "ranged" | "hybrid" | "mind" | "any";
export type CatClass = {
  id: string;
  name: string;
  roles: string[];
  mods: string[];
  special?: string;
  unlock: string;
  family: Family;
  prefer: string[];
  tier?: string;
  summary: string;
  pick?: string;
  conflict?: string;
  trophy?: string;
};
export type StatRule = { stat: string; rule: string };
export type RangedAttack = { name: string; damage: number; halfScaling: boolean };
export type ClassDataset = {
  intro: string;
  statRules: StatRule[];
  ranged: RangedAttack[];
  classes: CatClass[];
  discrepancies: Discrepancy[];
};

export type Area = {
  id: string;
  act: number;
  name: string;
  requires: string;
  unlocks?: string;
  trophy?: string;
  note?: string;
  /** Ids das áreas exigidas; ausente quando as fontes não dizem. */
  needs?: string[];
  /** Trilhas paralelas dentro do ato. */
  path?: "A" | "B";
};
export type Milestone = {
  id: string;
  /** "start", "act1".."act3" (bloco do ato) ou o id de uma área. */
  at: string;
  kind: "home" | "breeding" | "event";
  title: string;
  when: string;
  text: string;
  npcs: string[];
};
export type Act = { id: number; title: string; summary: string };
export type RouteDataset = { acts: Act[]; areas: Area[]; milestones: Milestone[]; notes: string[]; discrepancies: Discrepancy[] };

export type Foe = { name: string; text: string; priority: boolean; image?: string };
export type Biome = {
  /** Igual ao id da área em `route`. */
  id: string;
  summary: string;
  leans?: string;
  image?: string;
  hazards: string[];
  enemies: Foe[];
  bosses: Foe[];
  tips: string[];
};
export type HouseBoss = { id: string; name: string; text: string; tips: string[] };
export type BiomeDataset = { biomes: Biome[]; houseSetup: string[]; houseBosses: HouseBoss[]; act3Tips: string[] };

export type Debuff = {
  id: string;
  name: string;
  kind: "damage" | "control" | "modifier";
  rating?: "top" | "weak";
  what: string;
  use: string;
  watch?: string;
};
export type DebuffDataset = { debuffs: Debuff[] };

export type QuestItem = { id: string; name: string; aka?: string; unlock?: string; text: string; tips: string[]; image?: string };
export type QuestDataset = {
  mainRules: string[];
  mainItems: QuestItem[];
  mainTips: string[];
  sideRules: string[];
  sideItems: QuestItem[];
  image: string;
  imageCaption: string;
  discrepancies: Discrepancy[];
};

export type CombatTopic = { id: string; title: string; text: string; tips: string[]; images: string[]; caption?: string };
export type LevelGuide = {
  sources: string;
  budget: { what: string; levels: string }[];
  total: string;
  scenarios: string[];
  rewards: { level: string; title: string; text: string }[];
  mnemonic: string[];
  tips: string[];
};
export type CombatDataset = { goldenRule: string; topics: CombatTopic[]; levels: LevelGuide };

export type GameEvent = { id: string; name: string; text: string; flag?: string; tone?: "good" | "bad"; image?: string };
export type EventGroup = { id: string; title: string; intro?: string; events: GameEvent[] };
export type EventDataset = {
  intro: string;
  outcomes: string[];
  rules: string[];
  groups: EventGroup[];
  tragedy: { text: string; harmless: string[]; image?: string };
};

export type Pic = { src: string; caption: string; width: number; height: number };
export type TechStep = { title: string; text: string; images: Pic[] };
export type Technique = {
  id: string;
  title: string;
  summary: string;
  needs: string[];
  items: Pic[];
  steps: TechStep[];
  tips: string[];
  caveats: string[];
};
export type AdvancedDataset = { intro: string; techniques: Technique[] };

export type HiddenTip = { id: string; title: string; text: string; status?: "confirmed" | "disputed"; note?: string };
export type HiddenGroup = { id: string; title: string; tips: HiddenTip[] };
export type HiddenDataset = { intro: string; groups: HiddenGroup[] };
