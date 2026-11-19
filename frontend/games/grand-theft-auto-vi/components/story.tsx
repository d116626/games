"use client";

import { ArrowDown, Check, ChevronDown, ExternalLink } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { GameImage } from "@/components/game/game-image";
import { Bar, Chip, Tag, Who } from "@/games/grand-theft-auto-vi/components/ui";
import { chapterLabel, MAIN_COUNT, missionById, missions, story, trophyById } from "@/games/grand-theft-auto-vi/lib/data";
import type { Chapter, Mission, Who as WhoId } from "@/games/grand-theft-auto-vi/types";
import { useLocalSet } from "@/lib/local-store";
import { cn } from "@/lib/utils";

const mains = missions.filter((m) => m.kind === "main");
const hasDetails = (m: Mission) => m.detailed || m.notes.length > 0 || !!(m.giver || m.location || m.requirement || m.reward);

function Check_({ done, name, onToggle }: { done: boolean; name: string; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-label={`Mark ${name} as done`}
      onClick={onToggle}
      className={cn(
        "mt-0.5 grid size-7 shrink-0 cursor-pointer place-items-center rounded-full border-2 transition-colors",
        done ? "border-(--pink) bg-(--pink) text-black" : "border-foreground/40 hover:border-(--pink)",
      )}
    >
      {done && <Check className="size-4" />}
    </button>
  );
}

function Details({ m }: { m: Mission }) {
  const facts = [
    ["Given by", m.giver],
    ["Starts at", m.location],
    ["Needs", m.requirement],
    ["Reward", m.reward],
  ].filter((f): f is [string, string] => !!f[1]);
  return (
    <div className="space-y-3 pb-4 pl-10 text-sm sm:pl-[4.25rem]">
      {facts.length > 0 && (
        <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt className="label">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )}
      {m.objectives.length > 0 && (
        <div>
          <p className="label">Objectives</p>
          <ol className="mt-1 list-decimal space-y-0.5 pl-5 marker:text-muted-foreground">
            {m.objectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ol>
        </div>
      )}
      {m.notes.length > 0 && (
        <ul className="space-y-1.5 border-l-2 border-(--orange) pl-3">
          {m.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
      <p className="flex flex-wrap gap-x-4 gap-y-1">
        <a href={m.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-(--pink)">
          GTABase <ExternalLink className="size-3" />
        </a>
        {m.powerpyxUrl && (
          <a href={m.powerpyxUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-(--pink)">
            PowerPyx <ExternalLink className="size-3" />
          </a>
        )}
      </p>
    </div>
  );
}

function Row({
  m,
  done,
  open,
  flash,
  onDone,
  onOpen,
}: {
  m: Mission;
  done: boolean;
  open: boolean;
  flash: boolean;
  onDone: () => void;
  onOpen: () => void;
}) {
  const main = m.kind === "main";
  const expandable = hasDetails(m);
  // "Jason only"/"Lucia only" já aparece nos retratos
  const tags = [...(m.kind === "missable" && !m.tags.includes("Missable") ? ["Missable"] : []), ...m.tags].filter((t) => t !== "Jason only" && t !== "Lucia only");
  return (
    <li id={`mission-${m.id}`} className={cn("scroll-mt-40 border-t border-border transition-colors duration-500 first:border-t-0", flash && "bg-(--pink)/20", !main && "bg-foreground/[0.03]")}>
      <div className={cn("flex items-start gap-3 py-3", done && "opacity-55", !main && "pl-3 sm:pl-6")}>
        <Check_ done={done} name={m.name} onToggle={onDone} />
        <span className={cn("w-9 shrink-0 text-right font-display leading-7", main ? "text-xl text-foreground/60" : "text-xs uppercase tracking-wider text-muted-foreground")}>{main ? m.n : "opt"}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {expandable ? (
              <button type="button" aria-expanded={open} onClick={onOpen} className={cn("cursor-pointer text-left font-display leading-tight hover:text-(--pink)", main ? "text-xl" : "text-lg", done && "line-through")}>
                {m.name}
              </button>
            ) : (
              <h4 className={cn("font-display leading-tight", main ? "text-xl" : "text-lg", done && "line-through")}>{m.name}</h4>
            )}
            {tags.map((t) => (
              <Tag key={t} tone={t === "Missable" || t === "Time-sensitive" ? "orange" : "dim"}>
                {t}
              </Tag>
            ))}
          </div>
          <p className="mt-0.5 text-[0.95rem] text-muted-foreground">{m.summary}</p>
        </div>
        <Who who={m.who} />
        {expandable && (
          <button type="button" aria-label={open ? `Hide details of ${m.name}` : `Show details of ${m.name}`} aria-expanded={open} onClick={onOpen} className="mt-0.5 grid size-7 shrink-0 cursor-pointer place-items-center text-muted-foreground hover:text-foreground">
            <ChevronDown className={cn("size-5 transition-transform", open && "rotate-180")} />
          </button>
        )}
      </div>
      {open && expandable && <Details m={m} />}
    </li>
  );
}

function ChapterBlock({
  ch,
  rows,
  open,
  onToggle,
  done,
  openM,
  flash,
  onDone,
  onOpenM,
}: {
  ch: Chapter;
  rows: Mission[];
  open: boolean;
  onToggle: () => void;
  done: ReadonlySet<string>;
  openM: ReadonlySet<string>;
  flash: string | null;
  onDone: (id: string) => void;
  onOpenM: (id: string) => void;
}) {
  const own = mains.filter((m) => m.chapter === ch.n);
  const doneCount = own.filter((m) => done.has(m.id)).length;
  const trophy = ch.trophy ? trophyById(ch.trophy) : undefined;
  const first = own[0]?.n;
  const last = own.at(-1)?.n;
  // missões do mesmo heist em sequência ficam sob um cabeçalho
  const groups = rows.reduce<{ arc?: string; rows: Mission[] }[]>((acc, m) => {
    const tail = acc.at(-1);
    if (tail && tail.arc === m.arc) tail.rows.push(m);
    else acc.push({ arc: m.arc, rows: [m] });
    return acc;
  }, []);

  return (
    <div id={`chapter-${ch.n}`} className="scroll-mt-40">
      <button type="button" aria-expanded={open} onClick={onToggle} className="panel flex min-h-16 w-full cursor-pointer flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 text-left hover:border-(--pink)">
        <h3 className="font-display text-2xl leading-none">{chapterLabel(ch.n)}</h3>
        <span className="label">{first === last ? `#${first}` : `#${first}–${last}`}</span>
        <span className="ml-auto flex items-center gap-3">
          <span className="font-display text-lg tabular-nums">
            {doneCount}
            <span className="text-foreground/50"> / {own.length}</span>
          </span>
          <ChevronDown className={cn("size-5 transition-transform", open && "rotate-180")} />
        </span>
      </button>
      {open && (
        <div className="space-y-4 px-1 pt-4">
          {(ch.opens.length > 0 || trophy) && (
            <div className="space-y-2">
              {ch.opens.length > 0 && (
                <div>
                  <p className="label">What opens</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-[0.95rem] marker:text-(--pink)">
                    {ch.opens.map((o) => (
                      <li key={o.text}>
                        {o.text}
                        {o.mission && missionById(o.mission) && (
                          <>
                            {" "}
                            <a href={`#mission-${o.mission}`} className="whitespace-nowrap underline underline-offset-4 hover:text-(--pink)">
                              {missionById(o.mission)?.name}
                            </a>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {trophy && (
                <p className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="label">Trophy</span>
                  <a href={`#trophy-${trophy.id}`} className="inline-flex items-center gap-2 underline underline-offset-4 hover:text-(--pink)">
                    <GameImage src={trophy.icon} alt="" width={24} height={24} className="size-6 rounded" />
                    {trophy.name}
                  </a>
                  <span className="text-muted-foreground">{trophy.description}</span>
                </p>
              )}
            </div>
          )}
          {rows.length === 0 && <p className="text-muted-foreground">Nothing here. Change the filters.</p>}
          <ul>
            {groups.map((g, i) => (
              <Fragment key={`${g.arc ?? "-"}-${i}`}>
                {g.arc ? (
                  <li className="my-3 list-none border-l-4 border-(--orange) pl-3">
                    <p className="label text-(--orange)">Heist · {g.arc}</p>
                    <ul>
                      {g.rows.map((m) => (
                        <Row key={m.id} m={m} done={done.has(m.id)} open={openM.has(m.id)} flash={flash === m.id} onDone={() => onDone(m.id)} onOpen={() => onOpenM(m.id)} />
                      ))}
                    </ul>
                  </li>
                ) : (
                  g.rows.map((m) => <Row key={m.id} m={m} done={done.has(m.id)} open={openM.has(m.id)} flash={flash === m.id} onDone={() => onDone(m.id)} onOpen={() => onOpenM(m.id)} />)
                )}
              </Fragment>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Todas as missões da história, em ordem, por capítulo: marque o que já fez e abra os detalhes de cada uma. */
export function Story() {
  const { set: done, toggle, reset } = useLocalSet("grand-theft-auto-vi:story-done");
  const [openCh, setOpenCh] = useState<ReadonlySet<number>>(new Set());
  const [openM, setOpenM] = useState<ReadonlySet<string>>(new Set());
  const [who, setWho] = useState<WhoId | null>(null);
  const [hideDone, setHideDone] = useState(false);
  const [optional, setOptional] = useState(true);
  const [flash, setFlash] = useState<string | null>(null);

  const doneMain = mains.filter((m) => done.has(m.id)).length;
  const next = mains.find((m) => !done.has(m.id));

  const show = (id: string) => {
    const m = missionById(id);
    if (!m) return;
    setWho(null);
    setHideDone(false);
    setOptional(true);
    setOpenCh((prev) => new Set(prev).add(m.chapter));
    if (hasDetails(m)) setOpenM((prev) => new Set(prev).add(id));
    setFlash(id);
  };
  // Vindo da busca ou de um link (#mission-<id>, #chapter-<n>): abre o capítulo, rola até a linha e a destaca.
  useEffect(() => {
    const onHash = () => {
      const mission = /^#mission-(.+)$/.exec(location.hash)?.[1];
      const chapter = /^#chapter-(\d)$/.exec(location.hash)?.[1];
      if (mission) show(mission);
      else if (chapter) setOpenCh((prev) => new Set(prev).add(Number(chapter)));
    };
    const t = setTimeout(onHash, 0);
    window.addEventListener("hashchange", onHash);
    return () => {
      clearTimeout(t);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);
  useEffect(() => {
    if (!flash) return;
    document.getElementById(`mission-${flash}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
    const t = setTimeout(() => setFlash(null), 2200);
    return () => clearTimeout(t);
  }, [flash]);

  const flip = <T,>(set: ReadonlySet<T>, v: T) => {
    const next = new Set(set);
    if (!next.delete(v)) next.add(v);
    return next;
  };

  const rowsOf = useMemo(
    () => (n: number) => missions.filter((m) => m.chapter === n && (optional || m.kind === "main") && (!who || m.who.includes(who)) && !(hideDone && done.has(m.id))),
    [optional, who, hideDone, done],
  );

  return (
    <div className="space-y-4">
      <div className="sticky top-17 z-20 -mx-1 space-y-2 border-b border-border bg-background/95 px-1 pb-2 pt-2 backdrop-blur lg:top-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-display text-3xl leading-none">
            {doneMain}
            <span className="text-foreground/50"> / {MAIN_COUNT}</span>
          </span>
          <div className="min-w-24 flex-1">
            <Bar value={doneMain} max={MAIN_COUNT} label="Main missions done" />
          </div>
          {next && (
            <button type="button" className="btn" onClick={() => show(next.id)} title={`Next: ${next.name}`}>
              <ArrowDown className="size-4" /> Next #{next.n}
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip active={who === "jason"} onClick={() => setWho(who === "jason" ? null : "jason")}>
            <span className="inline-flex items-center gap-2">
              <Who who={["jason"]} size="size-6" /> Jason
            </span>
          </Chip>
          <Chip active={who === "lucia"} onClick={() => setWho(who === "lucia" ? null : "lucia")}>
            <span className="inline-flex items-center gap-2">
              <Who who={["lucia"]} size="size-6" /> Lucia
            </span>
          </Chip>
          <Chip active={optional} onClick={() => setOptional((v) => !v)}>
            Optional
          </Chip>
          <Chip active={hideDone} onClick={() => setHideDone((v) => !v)}>
            Hide done
          </Chip>
          <span className="ml-auto flex gap-3 text-sm text-muted-foreground">
            <button type="button" className="cursor-pointer underline underline-offset-4 hover:text-foreground" onClick={() => setOpenCh(new Set(story.chapters.map((c) => c.n)))}>
              Open all
            </button>
            <button type="button" className="cursor-pointer underline underline-offset-4 hover:text-foreground" onClick={() => setOpenCh(new Set())}>
              Close all
            </button>
            <button
              type="button"
              className="cursor-pointer underline underline-offset-4 hover:text-foreground"
              onClick={() => doneMain > 0 && window.confirm("Clear all marked missions?") && reset()}
            >
              Reset
            </button>
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {story.chapters.map((ch) => (
          <ChapterBlock
            key={ch.n}
            ch={ch}
            rows={rowsOf(ch.n)}
            open={openCh.has(ch.n)}
            onToggle={() => setOpenCh((p) => flip(p, ch.n))}
            done={done}
            openM={openM}
            flash={flash}
            onDone={toggle}
            onOpenM={(id) => setOpenM((p) => flip(p, id))}
          />
        ))}
      </div>
    </div>
  );
}
