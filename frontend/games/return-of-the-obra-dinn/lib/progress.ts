import { useSyncExternalStore } from "react";

/** Respostas do jogador, salvas no navegador: por tripulante, o nome, a causa e o assassino escolhidos. */
export type Column = "name" | "cause" | "killer";
export type Answer = Partial<Record<Column, string>>;
export type Answers = Readonly<Record<string, Answer>>;

const KEY = "return-of-the-obra-dinn-answers-v1";
const EMPTY: Answers = {};
const COLUMNS: Column[] = ["name", "cause", "killer"];

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
      for (const col of COLUMNS) {
        const v: unknown = (a as Record<string, unknown>)[col];
        if (typeof v === "string" && v) answer[col] = v;
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

/** Grava (ou, com valor vazio, apaga) a escolha de uma coluna. */
export function setAnswer(id: string, col: Column, value: string) {
  const current = snapshot();
  const answer = { ...current[id], [col]: value || undefined };
  write({ ...current, [id]: answer });
}

export function clearAnswers() {
  write({});
}

/** Respostas salvas. No servidor e na hidratação é vazio, para o HTML estático bater com o cliente. */
export function useAnswers(): Answers {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}
