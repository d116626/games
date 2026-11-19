import { chapterLabel, missions, trophies } from "@/games/grand-theft-auto-vi/lib/data";

/** `where` situa a entrada (ex.: o capítulo da missão) sem multiplicar os tipos do filtro. */
export type SearchEntry = { kind: string; name: string; text: string; href: string; where?: string };

/** Tudo que a busca acha. Cada seção nova do guia acrescenta suas entradas aqui. */
export const SEARCH_ENTRIES: SearchEntry[] = [
  ...missions.map((m) => ({
    kind: m.kind === "main" ? "Mission" : "Optional mission",
    name: m.name,
    where: `${chapterLabel(m.chapter)}${m.n ? ` · #${m.n}` : ""}`,
    text: [m.summary, m.giver, m.arc, m.location, ...m.objectives, ...m.notes, ...m.tags].filter(Boolean).join(" "),
    href: `#mission-${m.id}`,
  })),
  ...trophies.trophies.map((t) => ({
    kind: "Trophy",
    name: t.name,
    where: t.grade,
    text: [t.description, t.psnTier].filter(Boolean).join(" "),
    href: `#trophy-${t.id}`,
  })),
];
