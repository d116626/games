"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
const cache = new Map<string, { raw: string | null; set: ReadonlySet<string> }>();
const EMPTY: ReadonlySet<string> = new Set();

function read(key: string): ReadonlySet<string> {
  const raw = localStorage.getItem(key);
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.set;
  let set: ReadonlySet<string> = EMPTY;
  try {
    if (raw) set = new Set<string>(JSON.parse(raw));
  } catch {}
  cache.set(key, { raw, set });
  return set;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

/** Conjunto de strings salvo no navegador, sincronizado entre componentes e abas. */
export function useLocalSet(key: string) {
  const set = useSyncExternalStore(subscribe, () => read(key), () => EMPTY);
  const write = useCallback(
    (next: Set<string>) => {
      localStorage.setItem(key, JSON.stringify([...next]));
      listeners.forEach((l) => l());
    },
    [key],
  );
  const toggle = useCallback(
    (id: string) => {
      const next = new Set(read(key));
      if (!next.delete(id)) next.add(id);
      write(next);
    },
    [key, write],
  );
  const reset = useCallback(() => write(new Set()), [write]);
  return { set, toggle, reset };
}
