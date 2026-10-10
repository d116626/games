import { bestiary, catalog, roadmap, rules, strategy } from "@/games/dice-a-million/lib/data";
import type { SearchEntry } from "@/games/dice-a-million/types";

const KIND_LABEL = { dice: "Die", rings: "Ring", cards: "Card", hands: "Hand" } as const;

/** Tudo o que a busca encontra, montado no servidor. */
export const searchEntries: SearchEntry[] = [
  ...catalog.map((i) => ({
    id: `item-${i.id}`,
    kind: KIND_LABEL[i.kind],
    name: i.name,
    text: i.effect,
    condition: i.condition,
    faces: i.faces,
    sides: i.sides,
    rarity: i.rarity,
    icon: i.icon,
  })),
  ...bestiary.bosses.map((b) => ({
    id: `boss-${b.name}`,
    kind: "Boss",
    name: b.name,
    text: [b.effect, b.tips && `Tip: ${b.tips}`, b.empowered && `Empowered: ${b.empowered}`].filter(Boolean).join(" "),
    href: "#index-bosses",
  })),
  ...bestiary.enemyDice.map((d) => ({ id: `enemy-${d.name}`, kind: "Enemy die", name: d.name, text: d.effect, href: "#index-bosses" })),
  ...bestiary.curses.map((c) => ({ id: `curse-${c.name}`, kind: "Curse", name: c.name, text: c.effect, href: "#index-curses" })),
  ...bestiary.enchantments.map((e) => ({ id: `ench-${e.name}`, kind: "Enchantment", name: e.name, text: e.effect, href: "#index-enchantments" })),
  ...rules.challenges.map((c) => ({
    id: `challenge-${c.name}`,
    kind: "Challenge",
    name: c.name,
    text: [...c.rules, c.kit && `Starts with: ${c.kit}`].filter(Boolean).join(" "),
    icon: c.icon,
    href: "#index-challenges",
  })),
  ...rules.powers.map((p) => ({
    id: `power-${p.level}`,
    kind: "Power",
    name: `Power ${p.level}`,
    text: [p.effect, p.alt, `Unlocks the ${p.gem} Die.`].filter(Boolean).join(" "),
    icon: p.gemIcon,
    href: "#index-powers",
  })),
  ...strategy.flatMap((g) =>
    g.tips.map((t, i) => ({ id: `tip-${g.title}-${i}`, kind: "Strategy", name: g.title, text: t, href: "#strategy" })),
  ),
  ...roadmap.stages.flatMap((s) =>
    s.steps.map((st) => ({
      id: `step-${s.id}-${st.title}`,
      kind: "Roadmap",
      name: st.title,
      text: st.body,
      href: `#stage-${s.id}`,
    })),
  ),
];
