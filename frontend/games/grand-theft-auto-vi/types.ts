export type Grade = "platinum" | "gold" | "silver" | "bronze";

export type Trophy = {
  id: number;
  name: string;
  description: string;
  grade: Grade;
  icon: string;
  url: string;
  /** Só existe quando a PSN já tem taxas reais (`TrophyDataset.hasRarity`). */
  psnRate?: number;
  psnTier?: string;
  note?: string;
};

export type TrophyDataset = {
  points: number;
  counts: Record<Grade, number>;
  hasRarity: boolean;
  trophies: Trophy[];
};

export type Who = "jason" | "lucia";

export type Mission = {
  id: string;
  /** Posição entre as missões principais (1 = Prólogo); opcionais não têm número. */
  n?: number;
  name: string;
  /** 0 = Prólogo. */
  chapter: number;
  kind: "main" | "optional" | "missable";
  who: Who[];
  summary: string;
  giver?: string;
  location?: string;
  requirement?: string;
  reward?: string;
  objectives: string[];
  notes: string[];
  arc?: string;
  tags: string[];
  sources: ("gtabase" | "powerpyx")[];
  url: string;
  powerpyxUrl?: string;
  detailed: boolean;
};

export type Chapter = {
  n: number;
  summary: string;
  goal: string;
  /** Rótulos curtos do que abre; os detalhes ficam em `opens`. */
  unlocks?: string[];
  /** Histórias paralelas que começam no capítulo. */
  side?: string[];
  /** Id do troféu que conclui o capítulo. */
  trophy?: number;
  opens: { text: string; mission?: string }[];
};

export type StoryDataset = {
  chapters: Chapter[];
  missions: Mission[];
  discrepancies: string[];
};
