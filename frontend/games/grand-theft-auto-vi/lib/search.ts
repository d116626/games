import { trophies } from "@/games/grand-theft-auto-vi/lib/data";

/** `where` situa a entrada (ex.: o nível do troféu) sem multiplicar os tipos do filtro. */
export type SearchEntry = { kind: string; name: string; text: string; href: string; where?: string };

/** Tudo que a busca acha. Cada seção nova do guia acrescenta suas entradas aqui. */
export const SEARCH_ENTRIES: SearchEntry[] = [
  ...trophies.trophies.map((t) => ({
    kind: "Trophy",
    name: t.name,
    where: t.grade,
    text: [t.description, t.psnTier].filter(Boolean).join(" "),
    href: `#trophy-${t.id}`,
  })),
];
