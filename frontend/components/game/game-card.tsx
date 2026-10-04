import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Game } from "@/games/types";

export function GameCard({ game, index }: { game: Game; index: number }) {
  return (
    <Link
      href={`/guides/${game.slug}`}
      className="rise group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:border-white/30"
      style={{ "--delay": `${0.1 + index * 0.06}s` } as React.CSSProperties}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${game.accent}, transparent)` }}
      />
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-3xl leading-none">{game.name}</h2>
        <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
      <p className="text-sm text-muted-foreground">{game.tagline}</p>
      {game.tags.length > 0 && (
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {game.tags.map((t) => (
            <li
              key={t}
              className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              {t}
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}
