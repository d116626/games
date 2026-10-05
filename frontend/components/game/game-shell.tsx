import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { BackToTop } from "@/components/game/back-to-top";
import { SectionNav, type SectionLink } from "@/components/game/section-nav";
import type { Game, Source } from "@/games/types";
import { cn } from "@/lib/utils";

/** Moldura comum das páginas de guia: voltar, hero, índice de seções, conteúdo e fontes.
 *  Define `--game-accent` para os componentes filhos. */
export function GameShell({
  game,
  hero,
  sections = [],
  sources = [],
  updated,
  issuesUrl,
  children,
}: {
  game: Game;
  /** Substitui o cabeçalho padrão (título + tagline) por um hero próprio do jogo. */
  hero?: ReactNode;
  /** Seções da página (`<Section id>`); alimenta o índice. */
  sections?: SectionLink[];
  sources?: Source[];
  /** Data (ISO) da última atualização dos dados. */
  updated?: string;
  /** Link para reportar erros no guia. */
  issuesUrl?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="grain relative isolate min-h-dvh overflow-x-clip"
      style={{ "--game-accent": game.accent } as CSSProperties}
    >
      {!hero && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] opacity-20"
          style={{
            background: "radial-gradient(50% 100% at 50% 0%, var(--game-accent), transparent)",
          }}
        />
      )}
      <header className="mx-auto max-w-6xl px-6 pt-[max(1rem,env(safe-area-inset-top))]">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All guides
        </Link>
        {hero ?? (
          <>
            <h1 className="mt-2 font-display text-5xl leading-none md:text-6xl">{game.name}</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">{game.tagline}</p>
          </>
        )}
      </header>

      <div
        className={cn(
          "mx-auto max-w-6xl px-6 pb-10 pt-6",
          sections.length > 0 && "lg:grid lg:grid-cols-[13rem_1fr] lg:gap-12",
        )}
      >
        {sections.length > 0 && <SectionNav sections={sections} />}
        <main className="min-w-0 space-y-20 py-8">{children}</main>
      </div>

      <BackToTop />

      {sources.length > 0 && (
        <footer className="mx-auto max-w-6xl border-t border-border px-6 py-8">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/70">
            Sources
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  {s.title}
                </a>
                {s.note && <span className="text-foreground/70"> · {s.note}</span>}
              </li>
            ))}
          </ul>
          {(updated || issuesUrl) && (
            <p className="mt-5 text-sm text-foreground/70">
              {updated && <>Data updated {updated}. </>}
              {issuesUrl && (
                <a href={issuesUrl} target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
                  Found a mistake? Report it
                </a>
              )}
            </p>
          )}
        </footer>
      )}
    </div>
  );
}
