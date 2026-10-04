import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Game, Source } from "@/games/types";

/** Moldura comum das páginas de guia: voltar, título, conteúdo e fontes. */
export function GameShell({
  game,
  sources = [],
  children,
}: {
  game: Game;
  sources?: Source[];
  children: ReactNode;
}) {
  return (
    <div className="grain relative isolate min-h-dvh overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] opacity-20"
        style={{
          background: `radial-gradient(50% 100% at 50% 0%, ${game.accent}, transparent)`,
        }}
      />
      <header className="mx-auto max-w-6xl px-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Todos os guias
        </Link>
        <h1 className="mt-6 font-display text-5xl leading-none md:text-6xl">
          {game.name}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{game.tagline}</p>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>

      {sources.length > 0 && (
        <footer className="mx-auto max-w-6xl border-t border-border px-6 py-8">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Fontes
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  {s.title}
                </a>
                {s.note && (
                  <span className="text-muted-foreground"> · {s.note}</span>
                )}
              </li>
            ))}
          </ul>
        </footer>
      )}
    </div>
  );
}
