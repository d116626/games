"use client";

import { GameImage } from "@/components/game/game-image";
import { Tag } from "@/games/denshattack/components/ui";
import { KIND_LABEL } from "@/games/denshattack/lib/data";
import { toggleItem } from "@/games/denshattack/lib/progress";
import type { Item, ItemKind, Level, LevelKind, Spot } from "@/games/denshattack/types";
import { cn } from "@/lib/utils";

export type Filter = { kind: ItemKind | "all"; missing: boolean };

const LEVEL_KIND: Record<LevelKind, string | null> = {
  level: null,
  race: "Race",
  boss: "Boss",
  story: "Story",
  castle: "Castle shop",
  fanzine: "Fanzine H.Q.",
  onsen: "Onsen",
};

function itemLabel(item: Item): string {
  if (item.kind === "dare") return `Dare: ${item.title}`;
  if (item.kind === "film") return KIND_LABEL.film;
  return `${KIND_LABEL[item.kind]} ${item.n}/${item.of}`;
}

/** Spots que passam no filtro: o tipo escolhido e, se pedido, só o que falta marcar. */
export function visibleSpots(level: Level, filter: Filter, done: ReadonlySet<string>): Spot[] {
  return level.spots.filter((s) =>
    s.items.some((i) => (filter.kind === "all" || i.kind === filter.kind) && (!filter.missing || !done.has(i.id))),
  );
}

function Check({ item, checked }: { item: Item; checked: boolean }) {
  return (
    <label
      className={cn(
        "inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-[2px] border px-2 py-0.5 text-sm font-bold",
        checked ? "border-(--signal) bg-(--signal)/15" : "border-border hover:border-(--signal)",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => toggleItem(item.id)}
        className="size-4 cursor-pointer accent-(--signal)"
      />
      {itemLabel(item)}
    </label>
  );
}

/** Um nível: onde ficam os itens, na ordem em que aparecem, com os itens marcáveis e as capturas de tela. */
export function LevelCard({ level, filter, done }: { level: Level; filter: Filter; done: ReadonlySet<string> }) {
  const filtering = filter.kind !== "all" || filter.missing;
  const visible = filtering ? new Set(visibleSpots(level, filter, done)) : null;
  // o índice original dá o id do spot (`#spot-<nível>-<i>`), mesmo com filtro ativo
  const spots = level.spots.flatMap((spot, i) => (!visible || visible.has(spot) ? [{ spot, i }] : []));
  if (filtering && spots.length === 0) return null;

  const ids = new Set(level.spots.flatMap((s) => s.items.map((i) => i.id)));
  const ticked = [...ids].filter((id) => done.has(id)).length;
  const kind = LEVEL_KIND[level.kind];
  const where = [level.prefecture, level.song && `${level.song} \u2014 ${level.artist}`].filter(Boolean).join(" \u00B7 ");

  return (
    <article id={`level-${level.code}`} className="panel scroll-mt-24 p-4">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Tag>{level.code}</Tag>
        <h4 className="font-display text-2xl leading-none">{level.name}</h4>
        {kind && <Tag tone="cyan">{kind}</Tag>}
        {ids.size > 0 && (
          <span className="ml-auto text-sm font-bold tabular-nums">
            {ticked} / {ids.size}
          </span>
        )}
      </header>
      {(where || level.platinum) && (
        <p className="mt-1 text-sm text-muted-foreground">
          {where}
          {level.platinum && (
            <>
              {where && " \u00B7 "}Platinum medal: <b className="text-foreground">{level.platinum.toLocaleString("en-US")}</b>
            </>
          )}
        </p>
      )}
      {level.note && !filtering && <p className="mt-3">{level.note}</p>}
      {spots.length > 0 && (
        <ol className="mt-3 space-y-4">
          {spots.map(({ spot, i }) => {
            const all = spot.items.every((it) => done.has(it.id));
            return (
              <li key={i} id={`spot-${level.code}-${i}`} className="grid scroll-mt-24 gap-3 border-t border-border pt-3 md:grid-cols-[1fr_auto]">
                <div className={cn(all && "opacity-60")}>
                  <div className="flex flex-wrap gap-2">
                    {spot.items.map((it) => (
                      <Check key={it.id} item={it} checked={done.has(it.id)} />
                    ))}
                  </div>
                  <p className="mt-2">{spot.text}</p>
                </div>
                {spot.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 md:max-w-[26rem]">
                    {spot.images.map((src) => (
                      <GameImage
                        key={src}
                        src={src}
                        alt={`${level.code} ${spot.items.map(itemLabel).join(", ")}`}
                        width={400}
                        height={225}
                        className="aspect-video w-full max-w-[12.5rem] border border-border bg-card object-cover"
                      />
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </article>
  );
}
