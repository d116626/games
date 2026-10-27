/** Mesmo formato dos JSONs exportados pelo Python (`utils/games/return_of_the_obra_dinn/schemas.py`). */
export type Fate = { cause: string; killer?: string; byBeast: boolean };

export type CrewMember = {
  id: string;
  no: number;
  name: string;
  role: string;
  portrait: string;
  chapter: number;
  /** Ausente = seção "Disappearances" do capítulo. */
  part?: number;
  fate: Fate;
  /** Como o PSNProfiles escreve o fate, quando difere do guia principal. */
  alsoListed?: string;
  how: string;
};

export type FateEntry = {
  /** Id do tripulante; ausente = evento sem nome. */
  crew?: string;
  event?: string;
  identityHint?: string;
  clueHint?: string;
  note?: string;
};

export type Part = { n?: number; location?: string; fates: FateEntry[] };

export type Chapter = {
  n: number;
  roman: string;
  title: string;
  fateCount: number;
  solveCount: number;
  summary: string;
  parts: Part[];
};

export type Discrepancy = { topic: string; text: string };
export type ChaptersDataset = { chapters: Chapter[]; discrepancies: Discrepancy[] };
export type CrewDataset = { crew: CrewMember[] };

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
  missable: boolean;
  note?: string;
};
export type TrophyDataset = { points: number; counts: Record<Grade, number>; trophies: Trophy[] };

export type Topic = { title: string; items: string[] };
export type Sketch = { src: string; width: number; height: number; alt: string; credit: string };
export type GuideDataset = { basics: Topic[]; deduction: Topic[]; causes: Topic[]; sketch: Sketch };
