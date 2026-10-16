import { useSyncExternalStore } from "react";

/** Progresso do jogador, salvo no navegador: ids dos itens marcados (`1-2-1:can:1`). */
const KEY = "denshattack-progress-v1";
const EMPTY: ReadonlySet<string> = new Set();

const listeners = new Set<() => void>();
let cache: { raw: string; set: ReadonlySet<string> } = { raw: "", set: EMPTY };

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

function snapshot(): ReadonlySet<string> {
  const raw = read();
  if (raw !== cache.raw) {
    let ids: string[] = [];
    try {
      const parsed: unknown = JSON.parse(raw || "[]");
      if (Array.isArray(parsed)) ids = parsed.filter((x): x is string => typeof x === "string");
    } catch {
      /* conteúdo inválido: começa vazio */
    }
    cache = { raw, set: new Set(ids) };
  }
  return cache.set;
}

function write(ids: Iterable<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...ids]));
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

export function toggleItem(id: string) {
  const next = new Set(snapshot());
  if (!next.delete(id)) next.add(id);
  write(next);
}

export function clearProgress() {
  write([]);
}

/** Ids marcados. No servidor e na hidratação é vazio, para o HTML estático bater com o cliente. */
export function useProgress(): ReadonlySet<string> {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}
