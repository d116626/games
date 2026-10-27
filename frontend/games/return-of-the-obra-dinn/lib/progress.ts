import { useSyncExternalStore } from "react";

/** Respostas do jogador, salvas no navegador: por tripulante, o nome, a causa e o assassino escolhidos, mais as anotações. */
export type Column = "name" | "cause" | "killer";
/** `quality` e `origin` são palpites que só filtram a lista de nomes; `note` é texto livre. */
export type Field = Column | "quality" | "origin" | "note";
export type Answer = Partial<Record<Field, string>>;
export type Answers = Readonly<Record<string, Answer>>;

const KEY = "return-of-the-obra-dinn-answers-v1";
const EMPTY: Answers = {};
const FIELDS: Field[] = ["name", "cause", "killer", "quality", "origin", "note"];

const listeners = new Set<() => void>();
let cache: { raw: string; value: Answers } = { raw: "", value: EMPTY };

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

function parse(raw: string): Answers {
  if (!raw) return EMPTY;
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null || Array.isArray(data)) return EMPTY;
    const out: Record<string, Answer> = {};
    for (const [id, a] of Object.entries(data)) {
      if (typeof a !== "object" || a === null) continue;
      const answer: Answer = {};
      for (const f of FIELDS) {
        const v: unknown = (a as Record<string, unknown>)[f];
        if (typeof v === "string" && v) answer[f] = v;
      }
      out[id] = answer;
    }
    return out;
  } catch {
    return EMPTY; // conteúdo inválido: começa vazio
  }
}

function snapshot(): Answers {
  const raw = read();
  if (raw !== cache.raw) cache = { raw, value: parse(raw) };
  return cache.value;
}

function write(value: Answers) {
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* navegador sem armazenamento: não salva */
  }
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Grava (ou, com valor vazio, apaga) um campo do tripulante. */
export function setAnswer(id: string, field: Field, value: string) {
  const current = snapshot();
  const answer = { ...current[id], [field]: value || undefined };
  write({ ...current, [id]: answer });
}

export function clearAnswers() {
  write({});
}

/** Tudo o que o jogador salvou, em JSON, para levar a outro navegador. */
export function exportProgress(): string {
  return JSON.stringify({ version: 1, answers: snapshot() }, null, 2);
}

/** Substitui o que está salvo pelo conteúdo de um arquivo exportado. Devolve false se o arquivo não for válido. */
export function importProgress(text: string): boolean {
  try {
    const data: unknown = JSON.parse(text);
    if (typeof data !== "object" || data === null || (data as { version?: unknown }).version !== 1) return false;
    const answers: unknown = (data as { answers?: unknown }).answers;
    if (typeof answers !== "object" || answers === null) return false;
    write(parse(JSON.stringify(answers)));
    return true;
  } catch {
    return false;
  }
}

/** Respostas salvas. No servidor e na hidratação é vazio, para o HTML estático bater com o cliente. */
export function useAnswers(): Answers {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}
