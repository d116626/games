/** Mesmo formato dos JSONs exportados por `utils/games/blood_of_dawnwalker/schemas.py`. */
export type Grade = "platinum" | "gold" | "silver" | "bronze";

export type Trophy = {
  id: number;
  name: string;
  description: string;
  grade: Grade;
  icon: string;
  url: string;
  psnRate: number;
  psnTier: string;
  profilesRate: number;
  profilesTier: string;
  tags: string[];
  stage?: number;
  tip?: string;
};
export type TrophyStage = { id: number; title: string; summary: string; points: string[] };
export type TrophyDataset = {
  difficulty: string;
  hours: string;
  points: number;
  counts: Record<Grade, number>;
  stages: TrophyStage[];
  trophies: Trophy[];
};

export type Ending = {
  id: string;
  name: string;
  group: "main" | "secret";
  trophy?: string;
  freesFamily: boolean;
  summary: string;
  steps: string[];
  warnings: string[];
};
export type EndingsDataset = { intro: string; endings: Ending[] };

export type CourtMember = {
  id: string;
  name: string;
  level: number;
  where: string;
  activities: string[];
  trigger: string;
  fight: string;
  quests: string[];
  notes: string[];
  trophy?: string;
};
export type EdictLevel = { level: number; numeral: string; grade: string; name: string; effect: string };
export type CourtDataset = { intro: string; members: CourtMember[]; edictRules: string[]; edict: EdictLevel[] };

export type TreeId = "swordmastery" | "witchcraft" | "vampirism";
export type Tree = { id: TreeId; name: string; time: "anytime" | "day" | "night"; summary: string; unlock: string };
export type Ability = { id: string; name: string; tree: TreeId; kind: "active" | "passive" | "utility"; effect: string; cost?: string };
export type Perk = { id: string; name: string; tree: TreeId; effect: string; ultimate: boolean };
export type SkillsDataset = { trees: Tree[]; rules: string[]; abilities: Ability[]; perks: Perk[] };

export type RouteStep = { text: string; note?: string };
export type RoutePart = { id: string; title: string; focus: string; steps: RouteStep[] };
export type BudgetItem = { id: string; group: string; name: string; segments?: number; optional: boolean; note?: string };
export type RouteDataset = { totalSegments: number; note: string; parts: RoutePart[]; budget: BudgetItem[] };

export type TipsDataset = {
  facts: { label: string; value: string }[];
  groups: { id: string; title: string; tips: string[] }[];
  discrepancies: { topic: string; detail: string }[];
};
