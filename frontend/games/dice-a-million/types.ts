export type Category =
  | "dice"
  | "rings"
  | "hands"
  | "cards"
  | "challenges"
  | "vortex"
  | "secrets";

/** Formatos dos JSONs de `public/data/dice-a-million` (ver `utils/games/dice_a_million/schemas.py`). */
export type Achievement = {
  id: string;
  name: string;
  category: Category;
  how?: string;
  tip?: string;
  rarity: number;
  icon: string;
};

export type Step = { title: string; body: string; unlocks: string[]; warning?: string };
export type Stage = { id: string; title: string; goal: string; steps: Step[] };
export type HandUnlock = {
  name: string;
  icon?: string;
  requirement: string;
  after?: string;
  effect?: string;
  starter?: string;
  stats?: string;
  tips?: string[];
};
export type HandGoal = {
  hand: string;
  icon?: string;
  face3?: string;
  million?: string;
  rush?: string;
  promotion?: string;
  power6?: string;
};

export type Rarity = "common" | "uncommon" | "rare" | "legendary" | "occult";

/** Raridade dos itens (oficial), da mais comum à mais rara, com a cor da etiqueta. */
export const RARITIES: { id: Rarity; label: string; color: string }[] = [
  { id: "common", label: "Common", color: "#9aa4ad" },
  { id: "uncommon", label: "Uncommon", color: "#4caf50" },
  { id: "rare", label: "Rare", color: "#3b82f6" },
  { id: "legendary", label: "Legendary", color: "#f6a21e" },
  { id: "occult", label: "Occult", color: "#9b3fd1" },
];

export type Trait = { id: string; label: string; description: string };

export type CatalogItem = {
  id: string;
  kind: "dice" | "rings" | "cards" | "hands";
  name: string;
  condition?: string;
  effect: string;
  faces?: string;
  sides?: number;
  rarity?: Rarity;
  hidden?: boolean;
  traits?: string[];
  icon: string;
};

/** Dados mínimos para mostrar um item ou conquista num cartão. */
export type ItemInfo = {
  name: string;
  icon?: string;
  faces?: string;
  sides?: number;
  rarity?: Rarity;
  condition?: string;
  text: string;
};

/** Entrada da busca: item, chefe, encantamento, dica ou passo do roteiro. */
export type SearchEntry = {
  id: string;
  kind: string;
  name: string;
  text: string;
  condition?: string;
  faces?: string;
  sides?: number;
  rarity?: Rarity;
  icon?: string;
  href?: string;
};

export type Boss = { name: string; icon: string; effect: string; empowered?: string; targetMod?: number; tips?: string; banned?: string };
export type FinalBossAttack = { chance: number; dice: string[] };
export type FinalBoss = {
  name: string;
  icon: string;
  effect: string;
  hp: number;
  phaseTwoHp: number;
  phaseTwoBosses: string[];
  attacks: FinalBossAttack[];
};
export type EnemyDie = { name: string; effect: string; icon?: string };
export type Enchantment = { name: string; effect: string; appliesTo: "die" | "ring" };
export type Challenge = {
  name: string;
  icon?: string;
  rules: string[];
  hand: string;
  kit?: string;
  finalFace: number;
  requires: string[];
  banned?: string;
};
export type Power = { level: string; effect: string; alt?: string; gem: string; gemIcon: string };
export type Target = { face: number; round: number; target: number; hard: number; boss: boolean };
export type Pack = { name: string; effect: string; early: number; late: number };
export type MapStop = { name: string; effect: string };
export type Rules = {
  challenges: Challenge[];
  powers: Power[];
  targets: Target[];
  targetNotes: string[];
  packs: Pack[];
  packNotes: string[];
  mapStops: MapStop[];
};
export type TipGroup = { title: string; tips: string[]; source: string };

/** Faixa de raridade pela % global de jogadores que têm a conquista. */
export function rarityTier(percent: number) {
  if (percent >= 50) return { label: "Common", color: "#2ec4a6" };
  if (percent >= 20) return { label: "Uncommon", color: "#74c04a" };
  if (percent >= 5) return { label: "Rare", color: "#f6a21e" };
  return { label: "Ultra rare", color: "#e0457b" };
}
