"use client";

import { Check, ChevronDown, Eye, EyeOff, Lightbulb, Map as MapIcon, NotebookPen, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { GameImage } from "@/components/game/game-image";
import { CrewMenu } from "@/games/return-of-the-obra-dinn/components/crew-menu";
import { Notebook } from "@/games/return-of-the-obra-dinn/components/notebook";
import { Picker } from "@/games/return-of-the-obra-dinn/components/picker";
import { Sketch } from "@/games/return-of-the-obra-dinn/components/sketch";
import { Bar, Chip, Reveal } from "@/games/return-of-the-obra-dinn/components/ui";
import { answerText, isCorrect, isSolved, nameOptions, OPTIONS } from "@/games/return-of-the-obra-dinn/lib/answers";
import { chapters, crew } from "@/games/return-of-the-obra-dinn/lib/data";
import { clearAnswers, exportProgress, importProgress, type Answer, type Column, setAnswer, useAnswers } from "@/games/return-of-the-obra-dinn/lib/progress";
import type { CrewMember } from "@/games/return-of-the-obra-dinn/types";
import { cn } from "@/lib/utils";

/** Ordem fixa e embaralhada (por hash do id): a ordem do manifesto agruparia os cargos e entregaria pistas. */
const hash = (id: string) => [...id].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 100003, 7);
const SHUFFLED = [...crew].sort((a, b) => hash(a.id) - hash(b.id));

const COLUMNS: { id: Column; label: string; placeholder: string }[] = [
  { id: "name", label: "Name", placeholder: "Choose…" },
  { id: "cause", label: "Cause of death", placeholder: "Choose…" },
  { id: "killer", label: "Killer", placeholder: "Choose…" },
];

/** Colunas da linha no desktop: retrato, os três menus e as ações. */
const GRID = "md:grid-cols-[3.5rem_1fr_7.25rem]";

function IconButton({ label, active, dot, onClick, children }: { label: string; active: boolean; dot?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className="icon-btn relative" title={label} aria-label={label} aria-pressed={active} onClick={onClick}>
      {children}
      {dot && <span className="absolute right-0.5 top-0.5 size-2 rounded-full bg-(--blood)" />}
    </button>
  );
}

/** Retrato com o número do manifesto; clicar leva ao rosto no sketch. */
function Portrait({ c, onSketch }: { c: CrewMember; onSketch: (crewId: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSketch(c.id)}
      title="Find this face on the sketch"
      aria-label={`Find portrait ${c.no} on the sketch`}
      className="relative block cursor-pointer self-start outline-offset-2 hover:outline-2 hover:outline-(--blood) focus-visible:outline-2 focus-visible:outline-(--blood)"
    >
      <GameImage src={c.portrait} alt="Unidentified crew portrait" className="pixel block w-14 border-2 border-foreground" />
      <span className="absolute left-0 top-0 bg-foreground px-1 font-display text-sm leading-5 text-background">{c.no}</span>
    </button>
  );
}

function Row({
  c,
  answer,
  nameCounts,
  shown,
  flash,
  onToggle,
  onSketch,
}: {
  c: CrewMember;
  answer: Answer | undefined;
  nameCounts: ReadonlyMap<string, number>;
  shown: ReadonlySet<string>;
  flash: boolean;
  onToggle: (key: string) => void;
  onSketch: (crewId: string) => void;
}) {
  const has = (k: string) => shown.has(`${c.id}:${k}`);
  const toggle = (k: string) => onToggle(`${c.id}:${k}`);
  const solved = isSolved(c, answer);
  const base = cn("scroll-mt-40 border-t border-border transition-colors duration-500", solved && "bg-[rgb(143_240_176/0.07)]", flash && "bg-[rgb(255_122_107/0.18)]");

  // resolvido: encolhe numa linha (clique para abrir de novo e editar)
  if (solved && !has("open")) {
    return (
      <li id={`crew-${c.id}`} className={base}>
        <button type="button" onClick={() => toggle("open")} aria-expanded={false} className="flex w-full cursor-pointer items-center gap-3 py-1.5 text-left">
          <GameImage src={c.portrait} alt="" className="pixel block w-8 shrink-0 border border-foreground" />
          <span className="w-7 shrink-0 font-display text-sm text-foreground/70">{c.no}</span>
          <Check className="size-4 shrink-0 text-(--ok)" />
          <span className="min-w-0 flex-1 truncate text-sm">
            <b className="font-semibold">{c.name}</b> · {answer?.cause} · {answerText(c, "killer")}
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-label="Open" />
        </button>
      </li>
    );
  }

  const filters = [answer?.quality, answer?.origin].filter(Boolean).join(" · ");
  // nomes já escolhidos em outras linhas ficam riscados (eliminação); a escolha desta linha não conta
  const names = nameOptions(answer?.name, (id) => (nameCounts.get(id) ?? 0) - (answer?.name === id ? 1 : 0) > 0, answer?.quality, answer?.origin);
  const hasNotes = !!(answer?.note || filters);

  return (
    <li id={`crew-${c.id}`} className={cn(base, "py-2.5")}>
      <div className={cn("grid grid-cols-[3.5rem_1fr] items-start gap-x-3 gap-y-2", GRID)}>
        <div className="row-span-2 md:row-span-1">
          <Portrait c={c} onSketch={onSketch} />
        </div>
        <div className="grid min-w-0 gap-2 md:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.id} className="min-w-0">
              <span className="label md:hidden">{col.label}</span>
              <Picker
                options={col.id === "name" ? names : OPTIONS[col.id]}
                value={answer?.[col.id]}
                placeholder={col.placeholder}
                label={`${col.label} for portrait ${c.no}`}
                state={!answer?.[col.id] ? "idle" : isCorrect(c, col.id, answer[col.id] ?? "") ? "ok" : "bad"}
                onChange={(v) => setAnswer(c.id, col.id, v)}
              />
              {col.id === "name" && filters && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {names.length} names match: {filters}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          <IconButton label={has("how") ? "Hide how to tell" : "Show how to tell"} active={has("how")} onClick={() => toggle("how")}>
            <Lightbulb className="size-4" />
          </IconButton>
          <IconButton label={has("notes") ? "Hide notes and filters" : "Notes and filters"} active={has("notes")} dot={hasNotes && !has("notes")} onClick={() => toggle("notes")}>
            <NotebookPen className="size-4" />
          </IconButton>
          <IconButton label={has("reveal") ? "Hide the answers" : "Show the answers"} active={has("reveal")} onClick={() => toggle("reveal")}>
            {has("reveal") ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </IconButton>
        </div>
      </div>

      {(has("how") || has("reveal") || has("notes") || solved) && (
        <div className="mt-3 space-y-3 pl-[4.25rem] text-sm">
          {has("reveal") && (
            <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-3">
              {COLUMNS.map((col) => (
                <div key={col.id}>
                  <dt className="label">{col.label}</dt>
                  <dd>{answerText(c, col.id)}</dd>
                </div>
              ))}
            </dl>
          )}
          {has("how") && (
            <p>
              <span className="label">How to tell </span>
              {c.how}
            </p>
          )}
          {has("notes") && <Notebook id={c.id} answer={answer} />}
          {solved && (
            <button type="button" onClick={() => toggle("open")} className="cursor-pointer font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
              Collapse
            </button>
          )}
        </div>
      )}
    </li>
  );
}

/** Os 60 retratos para preencher como no jogo (nome, causa, assassino), com certo/errado na hora, ao lado do sketch. */
export function Crew() {
  const answers = useAnswers();
  const [chapter, setChapter] = useState<number | null>(null);
  const [unsolved, setUnsolved] = useState(false);
  const [shown, setShown] = useState<ReadonlySet<string>>(new Set());
  const [flash, setFlash] = useState<string | null>(null);
  const [face, setFace] = useState<string | null>(null);
  const [sketchOpen, setSketchOpen] = useState(false); // abaixo de xl o sketch é uma tela por cima, aberta sob demanda
  const fileInput = useRef<HTMLInputElement>(null);

  // Vindo do sketch: tira os filtros (a linha poderia estar escondida), fecha a tela do sketch, rola até a linha e a destaca.
  const pick = (id: string) => {
    setChapter(null);
    setUnsolved(false);
    setSketchOpen(false);
    setFlash(id);
  };
  useEffect(() => {
    if (!flash) return;
    document.getElementById(`crew-${flash}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
    const t = setTimeout(() => setFlash(null), 2200);
    return () => clearTimeout(t);
  }, [flash]);

  // Da linha para o sketch: o próprio Sketch rola até o rosto; aqui só dura o destaque.
  useEffect(() => {
    if (!face) return;
    const t = setTimeout(() => setFace(null), 2200);
    return () => clearTimeout(t);
  }, [face]);

  useEffect(() => {
    if (!sketchOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSketchOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sketchOpen]);

  const solvedIds = useMemo(() => new Set(crew.filter((c) => isSolved(c, answers[c.id])).map((c) => c.id)), [answers]);
  const solved = solvedIds.size;
  const nameCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of Object.values(answers)) if (a.name) m.set(a.name, (m.get(a.name) ?? 0) + 1);
    return m;
  }, [answers]);
  const list = SHUFFLED.filter((c) => (chapter === null || c.chapter === chapter) && (!unsolved || !solvedIds.has(c.id)));

  const showFace = (id: string) => {
    if (!window.matchMedia("(min-width: 80rem)").matches) setSketchOpen(true); // em xl o sketch já está à vista
    setFace(id);
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([exportProgress()], { type: "application/json" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "return-of-the-obra-dinn-progress.json" });
    a.click();
    URL.revokeObjectURL(url);
  };
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // permite escolher o mesmo arquivo de novo
    if (!file) return;
    if (Object.keys(answers).length > 0 && !window.confirm("Replace your current answers and notes with this file?")) return;
    if (!importProgress(await file.text())) window.alert("That file is not a valid progress file.");
  };
  const reset = () => {
    if (Object.keys(answers).length === 0 || window.confirm("Clear all your answers and notes?")) clearAnswers();
  };

  const toggle = (key: string) =>
    setShown((prev) => {
      const next = new Set(prev);
      if (!next.delete(key)) next.add(key);
      return next;
    });

  return (
    <div className="xl:grid xl:grid-cols-[20rem_1fr] xl:items-start xl:gap-8">
      {/* xl: coluna fixa ao lado da lista. Abaixo de xl: tela cheia por cima, só quando aberta. */}
      <div
        className={cn(
          "xl:sticky xl:top-4 xl:block",
          sketchOpen ? "fixed inset-0 z-40 block overflow-auto bg-background p-4 xl:z-auto xl:bottom-auto xl:overflow-visible xl:bg-transparent xl:p-0" : "hidden",
        )}
      >
        <div className="mb-3 xl:hidden">
          <button type="button" className="btn btn-ghost" onClick={() => setSketchOpen(false)}>
            <X className="size-4" /> Close sketch
          </button>
        </div>
        <Sketch onPick={pick} highlight={face} solved={solvedIds} />
      </div>

      <div className="min-w-0 space-y-4">
        <Reveal label="How this works">
          <p>
            Fill in the name, cause and killer for each portrait, like in the book. A menu turns green when right and red when
            wrong; a soul counts as solved when all three are right, and its row folds into one line. Names already picked on
            another row are struck through. Click a portrait to find its face on the sketch.
          </p>
          <p>
            The lightbulb shows how to tell who it is, the notebook holds your notes and narrows the name list by a quality or
            origin guess, and the eye shows the answers. Your choices are saved only in this browser; use the menu to export
            or import them. The causes list is built from the sources, not copied from the game.
          </p>
        </Reveal>

        <div className="sticky top-17 z-20 -mx-1 space-y-2 border-b border-border bg-background/95 px-1 pb-2 pt-2 backdrop-blur lg:top-0">
          <div className="flex items-center gap-3">
            <span className="font-display text-3xl leading-none">
              {solved}
              <span className="text-foreground/50"> / {crew.length}</span>
            </span>
            <div className="min-w-12 flex-1">
              <Bar value={solved} max={crew.length} label="Souls solved" />
            </div>
            <Chip active={unsolved} onClick={() => setUnsolved((v) => !v)}>
              <span className="whitespace-nowrap">Unsolved only</span>
            </Chip>
            <div className="xl:hidden">
              <button type="button" className="icon-btn" title="Open the sketch" aria-label="Open the sketch" onClick={() => setSketchOpen(true)}>
                <MapIcon className="size-5" />
              </button>
            </div>
            <CrewMenu onExport={download} onImport={() => fileInput.current?.click()} onReset={reset} />
            <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={upload} />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] *:shrink-0">
            <Chip active={chapter === null} onClick={() => setChapter(null)}>
              All
            </Chip>
            {chapters.chapters.map((ch) => (
              <Chip key={ch.n} active={chapter === ch.n} onClick={() => setChapter(ch.n)}>
                {ch.roman}
              </Chip>
            ))}
          </div>
          <div aria-hidden className={cn("hidden gap-x-3 px-0 md:grid", GRID)}>
            <span />
            <div className="grid grid-cols-3 gap-2">
              {COLUMNS.map((col) => (
                <span key={col.id} className="label">
                  {col.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <ul>
          {list.map((c) => (
            <Row key={c.id} c={c} answer={answers[c.id]} nameCounts={nameCounts} shown={shown} flash={flash === c.id} onToggle={toggle} onSketch={showFace} />
          ))}
        </ul>
        {list.length === 0 && <p className="text-muted-foreground">Nothing here. Change the filters.</p>}
      </div>
    </div>
  );
}
