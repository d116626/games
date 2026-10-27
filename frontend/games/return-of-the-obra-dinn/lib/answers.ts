import { crew, crewById } from "@/games/return-of-the-obra-dinn/lib/data";
import type { Answer, Column } from "@/games/return-of-the-obra-dinn/lib/progress";
import type { CrewMember } from "@/games/return-of-the-obra-dinn/types";

/** Valores especiais do menu de assassino; os demais são ids de tripulantes. */
export const NONE = "none";
export const BEAST = "beast";

/** `muted`: o nome já foi escolhido em outra linha (riscado, mas ainda selecionável). */
export type Option = { value: string; label: string; muted?: boolean };

const norm = (s: string) => s.trim().toLowerCase();
const byName = new Map(crew.map((c) => [norm(c.name), c.id]));

/** "Torn Apart by a beast" -> causa e assassino. O PSNProfiles escreve o fate inteiro numa frase só. */
function parseListed(text: string): { cause: string; killer: string } {
  const i = text.lastIndexOf(" by ");
  if (i < 0) return { cause: text, killer: NONE };
  const who = norm(text.slice(i + 4));
  return { cause: text.slice(0, i), killer: who === "a beast" ? BEAST : (byName.get(who) ?? NONE) };
}

/** Respostas aceitas por tripulante: a do guia principal e a do PSNProfiles, quando diferem. */
const ACCEPTED = new Map(
  crew.map((c) => {
    const main = { cause: c.fate.cause, killer: c.fate.killer ?? (c.fate.byBeast ? BEAST : NONE) };
    const listed = c.alsoListed ? parseListed(c.alsoListed) : undefined;
    const all = listed ? [main, listed] : [main];
    return [c.id, { causes: new Set(all.map((a) => norm(a.cause))), killers: new Set(all.map((a) => a.killer)) }];
  }),
);

/** Em ordem alfabética: na ordem do manifesto, a posição do retrato entregaria o nome. */
export const NAME_OPTIONS: Option[] = [...crew]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((c) => ({ value: c.id, label: `${c.name} · ${c.role}` }));
const BY_NAME = [...crew].sort((a, b) => a.name.localeCompare(b.name));
export const QUALITIES = [...new Set(crew.map((c) => c.role))].sort((a, b) => a.localeCompare(b));
export const ORIGINS = [...new Set(crew.map((c) => c.origin))].sort((a, b) => a.localeCompare(b));

/**
 * Lista de nomes de uma linha: filtra pelos palpites de quality e origin do jogador e risca os nomes já usados
 * em outras linhas (eliminação). A escolha atual nunca sai da lista.
 */
export function nameOptions(selected: string | undefined, usedElsewhere: (id: string) => boolean, quality?: string, origin?: string): Option[] {
  return BY_NAME.filter((c) => c.id === selected || ((!quality || c.role === quality) && (!origin || c.origin === origin))).map((c) => ({
    value: c.id,
    label: `${c.name} · ${c.role}`,
    muted: c.id !== selected && usedElsewhere(c.id),
  }));
}

export const KILLER_OPTIONS: Option[] = [
  { value: NONE, label: "No one" },
  { value: BEAST, label: "A beast" },
  ...NAME_OPTIONS,
];

/** Todas as causas que as fontes usam, sem repetir (ignora maiúsculas), em ordem alfabética. */
export const CAUSE_OPTIONS: Option[] = (() => {
  const seen = new Map<string, string>();
  for (const c of crew) {
    const names = [c.fate.cause, ...(c.alsoListed ? [parseListed(c.alsoListed).cause] : [])];
    for (const n of names) if (!seen.has(norm(n))) seen.set(norm(n), n);
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b)).map((n) => ({ value: n, label: n }));
})();

export const OPTIONS: Record<Column, Option[]> = { name: NAME_OPTIONS, cause: CAUSE_OPTIONS, killer: KILLER_OPTIONS };

/** Confere a escolha de uma coluna contra a resposta (ou respostas aceitas). */
export function isCorrect(c: CrewMember, col: Column, value: string): boolean {
  const ok = ACCEPTED.get(c.id);
  if (col === "name") return value === c.id;
  if (col === "cause") return ok?.causes.has(norm(value)) ?? false;
  return ok?.killers.has(value) ?? false;
}

/** Texto mostrado ao apertar "Show" numa coluna. */
export function answerText(c: CrewMember, col: Column): string {
  if (col === "name") return `${c.name} · ${c.role}`;
  if (col === "cause") return c.alsoListed ? `${c.fate.cause} (PSNProfiles: ${c.alsoListed})` : c.fate.cause;
  if (c.fate.killer) return crewById(c.fate.killer).name;
  return c.fate.byBeast ? "A beast" : "No one";
}

const COLUMNS: Column[] = ["name", "cause", "killer"];

/** O tripulante está resolvido quando as três colunas estão certas. */
export function isSolved(c: CrewMember, a: Answer | undefined): boolean {
  return !!a && COLUMNS.every((col) => !!a[col] && isCorrect(c, col, a[col]));
}
