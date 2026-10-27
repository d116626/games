"use client";

import { Check, X } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { GameImage } from "@/components/game/game-image";
import { Sketch } from "@/games/return-of-the-obra-dinn/components/sketch";
import { Picker } from "@/games/return-of-the-obra-dinn/components/picker";
import { Bar, Chip } from "@/games/return-of-the-obra-dinn/components/ui";
import { answerText, isCorrect, isSolved, OPTIONS } from "@/games/return-of-the-obra-dinn/lib/answers";
import { chapters, crew } from "@/games/return-of-the-obra-dinn/lib/data";
import { clearAnswers, type Answer, type Column, setAnswer, useAnswers } from "@/games/return-of-the-obra-dinn/lib/progress";
import type { CrewMember } from "@/games/return-of-the-obra-dinn/types";
import { cn } from "@/lib/utils";

/** Ordem fixa e embaralhada (por hash do id): a ordem do manifesto agruparia os cargos e entregaria pistas. */
const hash = (id: string) => [...id].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 100003, 7);
const SHUFFLED = [...crew].sort((a, b) => hash(a.id) - hash(b.id));

const COLUMNS: { id: Column; label: string; placeholder: string }[] = [
  { id: "name", label: "Name", placeholder: "Who is this?" },
  { id: "cause", label: "Cause of death", placeholder: "How did they die?" },
  { id: "killer", label: "Killer", placeholder: "Who killed them?" },
];

/** Uma coluna da linha: menu para preencher como no jogo, estado certo/errado e botão para ver a resposta. */
function Cell({
  c,
  col,
  value,
  shown,
  onToggle,
}: {
  c: CrewMember;
  col: (typeof COLUMNS)[number];
  value: string | undefined;
  shown: boolean;
  onToggle: () => void;
}) {
  const state = !value ? "idle" : isCorrect(c, col.id, value) ? "ok" : "bad";
  return (
    <td className="block px-1 py-2 md:table-cell md:px-3 md:align-top">
      <span className="label md:hidden">{col.label}</span>
      <div className="flex items-center gap-2">
        <Picker
          options={OPTIONS[col.id]}
          value={value}
          placeholder={col.placeholder}
          label={`${col.label} for this portrait`}
          state={state}
          onChange={(v) => setAnswer(c.id, col.id, v)}
        />
        <span className="grid size-5 shrink-0 place-items-center" role="img" aria-label={state === "ok" ? "Correct" : state === "bad" ? "Wrong" : ""}>
          {state === "ok" && <Check className="size-5 text-(--ok)" />}
          {state === "bad" && <X className="size-5 text-(--blood)" />}
        </span>
      </div>
      <div className="mt-1.5 min-h-6 text-sm">
        {shown ? (
          <button type="button" onClick={onToggle} className="cursor-pointer text-left underline decoration-dotted underline-offset-4" aria-label={`Hide ${col.label}`}>
            {answerText(c, col.id)}
          </button>
        ) : (
          <button type="button" onClick={onToggle} className="cursor-pointer font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
            Show
          </button>
        )}
      </div>
    </td>
  );
}

function Row({
  c,
  answer,
  shown,
  flash,
  onToggle,
  onSketch,
}: {
  c: CrewMember;
  answer: Answer | undefined;
  shown: ReadonlySet<string>;
  flash: boolean;
  onToggle: (key: string) => void;
  onSketch: (crewId: string) => void;
}) {
  const bg = cn("transition-colors duration-500", isSolved(c, answer) && "bg-[rgb(143_240_176/0.07)]", flash && "bg-[rgb(255_122_107/0.18)]");
  const link = "cursor-pointer text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground";
  const how = shown.has(`${c.id}:how`);
  return (
    <Fragment>
      <tr id={`crew-${c.id}`} className={cn("block scroll-mt-4 border-t border-border pt-3 md:table-row md:pt-0", bg)}>
        <td rowSpan={2} className="block px-1 py-1 md:table-cell md:px-3 md:py-2 md:align-top">
          <span className="font-display text-2xl leading-none text-foreground/70">{c.no}</span>
        </td>
        <td rowSpan={2} className="block px-1 py-2 md:table-cell md:px-3 md:align-top">
          <GameImage src={c.portrait} alt="Unidentified crew portrait" className="pixel h-32 w-auto max-w-full border-2 border-foreground md:h-auto md:w-24" />
        </td>
        {COLUMNS.map((col) => (
          <Cell key={col.id} c={c} col={col} value={answer?.[col.id]} shown={shown.has(`${c.id}:${col.id}`)} onToggle={() => onToggle(`${c.id}:${col.id}`)} />
        ))}
      </tr>
      <tr className={cn("block pb-3 md:table-row md:pb-0", bg)}>
        <td colSpan={COLUMNS.length} className="block px-1 pb-3 md:table-cell md:px-3">
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <button type="button" onClick={() => onToggle(`${c.id}:how`)} className={link}>
              {how ? "Hide how to tell" : "Show how to tell"}
            </button>
            <button type="button" onClick={() => onSketch(c.id)} className={link}>
              Show on sketch
            </button>
          </div>
          {how && (
            <p className="mt-2 text-sm">
              <span className="label">How to tell </span>
              {c.how}
            </p>
          )}
        </td>
      </tr>
    </Fragment>
  );
}

/** Os 60 retratos numa tabela para preencher como no jogo (nome, causa, assassino), com certo/errado na hora. */
export function Crew() {
  const answers = useAnswers();
  const [chapter, setChapter] = useState<number | null>(null);
  const [unsolved, setUnsolved] = useState(false);
  const [shown, setShown] = useState<ReadonlySet<string>>(new Set());
  const [flash, setFlash] = useState<string | null>(null);
  const [face, setFace] = useState<string | null>(null);

  // Vindo do sketch: tira os filtros (a linha poderia estar escondida), rola até a linha e a destaca por um instante.
  const pick = (id: string) => {
    setChapter(null);
    setUnsolved(false);
    setFlash(id);
  };
  useEffect(() => {
    if (!flash) return;
    document.getElementById(`crew-${flash}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
    const t = setTimeout(() => setFlash(null), 2200);
    return () => clearTimeout(t);
  }, [flash]);

  // Da linha para o sketch: rola até o rosto (dentro da caixa do sketch também) e o destaca por um instante.
  useEffect(() => {
    if (!face) return;
    document.getElementById(`face-${face}`)?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
    const t = setTimeout(() => setFace(null), 2200);
    return () => clearTimeout(t);
  }, [face]);

  const solved = crew.filter((c) => isSolved(c, answers[c.id])).length;
  const list = SHUFFLED.filter((c) => (chapter === null || c.chapter === chapter) && (!unsolved || !isSolved(c, answers[c.id])));

  const toggle = (key: string) =>
    setShown((prev) => {
      const next = new Set(prev);
      if (!next.delete(key)) next.add(key);
      return next;
    });

  return (
    <div className="space-y-6">
      <Sketch onPick={pick} highlight={face} />
      <div>
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <span className="font-display text-5xl leading-none">
            {solved}
            <span className="text-foreground/50"> / {crew.length}</span>
          </span>
          <p className="label pb-1">souls solved</p>
          <button
            type="button"
            className="btn btn-ghost ml-auto"
            onClick={() => {
              if (Object.keys(answers).length === 0 || window.confirm("Clear all your answers?")) clearAnswers();
            }}
          >
            Reset
          </button>
        </div>
        <div className="mt-3">
          <Bar value={solved} max={crew.length} label="Souls solved" />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Fill in the name, cause and killer for each portrait, like in the book. A choice turns green when right and red
          when wrong; a soul counts as solved when all three are right. Press Show to see an answer. Your choices are saved
          only in this browser. The causes list is built from the sources, not copied from the game.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chip active={chapter === null} onClick={() => setChapter(null)}>
          All
        </Chip>
        {chapters.chapters.map((ch) => (
          <Chip key={ch.n} active={chapter === ch.n} onClick={() => setChapter(ch.n)}>
            {ch.roman}
          </Chip>
        ))}
        <span className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <Chip active={unsolved} onClick={() => setUnsolved((v) => !v)}>
          Unsolved only
        </Chip>
      </div>

      <table className="block w-full md:table md:table-fixed">
        <thead className="hidden md:table-header-group">
          <tr className="text-left">
            <th className="label w-12 px-3 pb-2 font-normal">#</th>
            <th className="label w-32 px-3 pb-2 font-normal">Portrait</th>
            {COLUMNS.map((col) => (
              <th key={col.id} className="label px-3 pb-2 font-normal">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {list.map((c) => (
            <Row key={c.id} c={c} answer={answers[c.id]} shown={shown} flash={flash === c.id} onToggle={toggle} onSketch={setFace} />
          ))}
        </tbody>
      </table>
      {list.length === 0 && <p className="text-muted-foreground">Nothing here. Change the filters.</p>}
    </div>
  );
}
