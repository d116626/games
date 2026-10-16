import { breeding, classes, route, start, trophies } from "@/games/mewgenics/lib/data";

export type SearchEntry = { kind: string; name: string; text: string; href: string };

/** Tudo que a busca acha. Cada entrada leva ao item (classes, vizinhos, áreas, troféus) ou à seção. */
export const SEARCH_ENTRIES: SearchEntry[] = [
  ...classes.classes.map((c) => ({
    kind: "Collar",
    name: c.name,
    text: [c.summary, c.pick, c.unlock, c.mods.join(" "), c.roles.join(" ")].filter(Boolean).join(" "),
    href: `#class-${c.id}`,
  })),
  ...start.npcs.map((n) => ({
    kind: "Neighbour",
    name: n.name,
    text: [n.role, n.takes, n.gives.join(" "), n.tip].join(" "),
    href: `#npc-${n.id}`,
  })),
  ...route.areas.map((a) => ({
    kind: "Area",
    name: a.name,
    text: [a.requires, a.unlocks, a.note].filter(Boolean).join(" "),
    href: `#area-${a.id}`,
  })),
  ...breeding.houseStats.map((s) => ({ kind: "House stat", name: s.name, text: `${s.effect} ${s.target}`, href: "#breeding" })),
  ...breeding.odds.map((o) => ({ kind: "Odds", name: o.what, text: `${o.base} ${o.boost}`, href: "#breeding" })),
  ...classes.statRules.map((r) => ({ kind: "Stat rule", name: r.stat, text: r.rule, href: "#index-stats" })),
  ...trophies.trophies.map((t) => ({
    kind: "Trophy",
    name: t.name,
    text: `${t.description} ${t.tip ?? ""} ${t.grade}`,
    href: `#trophy-${t.id}`,
  })),
];
