"use client";

import { useRef, useState } from "react";
import { ORIGINS, QUALITIES } from "@/games/return-of-the-obra-dinn/lib/answers";
import { type Answer, setAnswer } from "@/games/return-of-the-obra-dinn/lib/progress";

/** Anotações de um retrato: texto livre e palpites de quality/origin, que só filtram a lista de nomes da linha. */
export function Notebook({ id, answer }: { id: string; answer: Answer | undefined }) {
  // o texto fica local enquanto se digita e é salvo depois de uma pausa: não regrava (nem refaz as 60 linhas) a cada tecla
  const [draft, setDraft] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const save = (text: string) => {
    clearTimeout(timer.current);
    setAnswer(id, "note", text);
    setDraft(null);
  };

  return (
    <div className="mt-2 grid gap-3 sm:grid-cols-2">
      <label className="block sm:col-span-2">
        <span className="label">Notes</span>
        <textarea
          rows={2}
          maxLength={500}
          value={draft ?? answer?.note ?? ""}
          placeholder="Your clues for this portrait"
          className="field mt-1 block w-full resize-y py-2"
          onChange={(e) => {
            const text = e.target.value;
            setDraft(text);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => save(text), 500);
          }}
          onBlur={(e) => draft !== null && save(e.target.value)}
        />
      </label>
      <label className="block">
        <span className="label">Quality guess (narrows the name list)</span>
        <select className="field mt-1 block w-full" value={answer?.quality ?? ""} onChange={(e) => setAnswer(id, "quality", e.target.value)}>
          <option value="">Any quality</option>
          {QUALITIES.map((q) => (
            <option key={q}>{q}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="label">Origin guess (narrows the name list)</span>
        <select className="field mt-1 block w-full" value={answer?.origin ?? ""} onChange={(e) => setAnswer(id, "origin", e.target.value)}>
          <option value="">Any origin</option>
          {ORIGINS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
