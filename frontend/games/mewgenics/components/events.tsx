"use client";

import { useState } from "react";
import { GameImage } from "@/components/game/game-image";
import { Bullets } from "@/games/mewgenics/components/bullets";
import { Chip, Tag } from "@/games/mewgenics/components/chip";
import { events } from "@/games/mewgenics/lib/data";

function Shot({ src, alt }: { src: string; alt: string }) {
  return (
    <GameImage
      src={src}
      alt={alt}
      width={720}
      height={405}
      className="aspect-video w-full rounded-lg border-2 border-foreground bg-card"
    />
  );
}

/** Eventos do mapa: regras dos resultados, eventos por grupo (com filtro) e os eventos de tragédia. */
export function Events() {
  const [group, setGroup] = useState<string | null>(null);
  const groups = events.groups.filter((g) => !group || g.id === group);
  const { tragedy } = events;
  return (
    <div className="space-y-5">
      <p className="max-w-3xl">{events.intro}</p>
      <Bullets title="Possible outcomes" items={events.outcomes} />
      <Bullets title="What decides the result" items={events.rules} />

      <div className="flex flex-wrap gap-2">
        <Chip active={group === null} onClick={() => setGroup(null)}>
          All
        </Chip>
        {events.groups.map((g) => (
          <Chip key={g.id} active={group === g.id} onClick={() => setGroup(group === g.id ? null : g.id)}>
            {g.title}
          </Chip>
        ))}
        <Chip active={group === "tragedy"} onClick={() => setGroup(group === "tragedy" ? null : "tragedy")}>
          Tragedy
        </Chip>
      </div>

      {groups.map((g) => (
        <div key={g.id}>
          <h4 className="font-display text-2xl">{g.title}</h4>
          {g.intro && <p className="text-muted-foreground">{g.intro}</p>}
          <ul className="mt-2 divide-y divide-border border-y-2 border-foreground">
            {g.events.map((e) => (
              <li key={e.id} id={`event-${e.id}`} className="scroll-mt-24 py-3">
                <div className={e.image ? "grid gap-3 md:grid-cols-[1fr_16rem] md:items-start" : undefined}>
                  <div>
                    <h5 className="flex flex-wrap items-center gap-2 text-lg font-extrabold">
                      {e.name}
                      {e.flag && <Tag tone={e.tone === "good" ? "teal" : e.tone === "bad" ? "pink" : "paper"}>{e.flag}</Tag>}
                    </h5>
                    <p className="mt-1 max-w-3xl">{e.text}</p>
                  </div>
                  {e.image && <Shot src={e.image} alt={`${e.name} event screen`} />}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {(!group || group === "tragedy") && (
        <div id="event-tragedy" className="scroll-mt-24">
          <h4 className="font-display text-2xl">Tragedy events</h4>
          <div className="mt-2 grid gap-3 md:grid-cols-[1fr_16rem] md:items-start">
            <div className="space-y-3">
              <p className="max-w-3xl">{tragedy.text}</p>
              <Bullets title="These variations have no effect" items={tragedy.harmless} />
            </div>
            {tragedy.image && <Shot src={tragedy.image} alt="Tragedy event screen" />}
          </div>
        </div>
      )}
    </div>
  );
}
