import { achievements, catalog } from "@/games/dice-a-million/lib/data";
import type { ItemInfo } from "@/games/dice-a-million/types";

const norm = (s: string) => s.normalize("NFD").replace(/[^a-z0-9]/gi, "").toLowerCase();

const byName = new Map<string, ItemInfo>();
for (const a of achievements) {
  byName.set(norm(a.name), { name: a.name, icon: a.icon, condition: a.how, text: a.tip ?? "" });
}
for (const i of catalog) {
  byName.set(norm(i.name), {
    name: i.name,
    icon: i.icon,
    faces: i.faces,
    sides: i.sides,
    rarity: i.rarity,
    condition: i.condition,
    text: i.effect,
  });
}

/** Item do catálogo (preferido) ou conquista com esse nome. */
export const itemInfo = (name: string) => byName.get(norm(name));

const SKIP = new Set(["Charge", "Clone", "Draw", "Enchant", "Fire", "Invert", "Jet", "Multiply", "Reroll", "Skip", "Spring"]);
const linkable = catalog
  .map((i) => i.name)
  .filter((n) => n.length >= 5 && !SKIP.has(n) && !/^[D_?]/.test(n))
  .sort((a, b) => b.length - a.length);
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pattern = new RegExp(`(?<!\\w)(${linkable.map(escape).join("|")})s?(?!\\w)`, "g");

/** Divide o texto em trechos simples e nomes de itens conhecidos (nome exato, com maiúsculas). */
export function splitItems(text: string): { text: string; item?: ItemInfo }[] {
  const out: { text: string; item?: ItemInfo }[] = [];
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push({ text: m[0], item: itemInfo(m[1]) });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}
