import { GameCard } from "@/components/game/game-card";
import { GAMES } from "@/games/registry";

export default function Hub() {
  return (
    <div className="grain relative isolate min-h-dvh overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(45%_35%_at_85%_5%,rgba(255,200,110,0.10),transparent),radial-gradient(50%_40%_at_8%_30%,rgba(90,130,255,0.10),transparent)]"
      />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <span className="font-display text-2xl">Games Guide</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
          {String(GAMES.length).padStart(2, "0")}{" "}
          {GAMES.length === 1 ? "guia" : "guias"}
        </span>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        <h1 className="rise max-w-3xl font-display text-5xl leading-[1.02] md:text-7xl">
          Guias de jogos, organizados e <em>fáceis de consultar</em>.
        </h1>
        <p
          className="rise mt-5 max-w-xl text-muted-foreground"
          style={{ "--delay": "0.1s" } as React.CSSProperties}
        >
          Cada jogo tem uma página própria, montada a partir de uma base de
          conhecimento compilada e referenciada.
        </p>

        {GAMES.length === 0 ? (
          <p className="mt-16 rounded-2xl border border-dashed border-border p-8 text-sm text-muted-foreground">
            Nenhum guia ainda. Crie um com{" "}
            <code className="font-mono">just new-game &lt;id&gt; &quot;Nome&quot;</code>.
          </p>
        ) : (
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GAMES.map((g, i) => (
              <GameCard key={g.slug} game={g} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
