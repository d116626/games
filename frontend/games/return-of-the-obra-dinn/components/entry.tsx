"use client";

import { useState } from "react";
import { GameImage } from "@/components/game/game-image";
import { crewById, fateText } from "@/games/return-of-the-obra-dinn/lib/data";
import type { FateEntry } from "@/games/return-of-the-obra-dinn/types";
import { cn } from "@/lib/utils";

type Step = "clue" | "who" | "answer";

/** Uma entrada do livro, em camadas: onde olhar, quem é e a resposta. Só um painel aberto por vez. */
export function Entry({ entry }: { entry: FateEntry }) {
  const [step, setStep] = useState<Step | null>(null);
  const who = entry.crew ? crewById(entry.crew) : undefined;

  const buttons: { id: Step; label: string; show: boolean }[] = [
    { id: "clue", label: "Hint: where to look", show: !!entry.clueHint },
    { id: "who", label: "Hint: who is it", show: !!entry.identityHint },
    { id: "answer", label: who ? "Answer" : "What happens", show: true },
  ];

  return (
    <li className="space-y-3 py-4">
      <div className="flex flex-wrap gap-2">
        {buttons
          .filter((b) => b.show)
          .map((b) => (
            <button
              key={b.id}
              type="button"
              aria-expanded={step === b.id}
              onClick={() => setStep(step === b.id ? null : b.id)}
              className={cn("btn min-h-10 px-3 text-sm", step !== b.id && "btn-ghost")}
            >
              {b.label}
            </button>
          ))}
      </div>

      {step === "clue" && <p className="border-l-[3px] border-foreground pl-3">{entry.clueHint}</p>}
      {step === "who" && <p className="border-l-[3px] border-foreground pl-3">{entry.identityHint}</p>}
      {step === "answer" && (
        <div className="space-y-3 border-l-[3px] border-foreground pl-3">
          {who ? (
            <>
              <div className="flex gap-4">
                <GameImage
                  src={who.portrait}
                  alt={`Portrait of ${who.name}`}
                  className="pixel h-28 w-auto shrink-0 border-2 border-foreground"
                />
                <div className="min-w-0 space-y-1">
                  <p className="font-display text-xl leading-tight">
                    {who.name} <span className="text-muted-foreground">· {who.role}</span>
                  </p>
                  <p>{fateText(who.fate)}</p>
                  {who.alsoListed && <p className="text-sm text-muted-foreground">PSNProfiles lists: {who.alsoListed}</p>}
                </div>
              </div>
              <p>
                <span className="label">How to tell </span>
                {who.how}
              </p>
            </>
          ) : (
            <p>{entry.event}</p>
          )}
          {entry.note && <p className="text-muted-foreground">{entry.note}</p>}
        </div>
      )}
    </li>
  );
}
