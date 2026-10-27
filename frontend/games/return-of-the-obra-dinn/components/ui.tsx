import { cn } from "@/lib/utils";

type Tone = "paper" | "dim" | "warn" | "outline";

/** Etiqueta de uma linha (caixa alta, canto reto). */
export function Tag({ tone = "paper", className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return <span className={cn("tag", tone !== "paper" && `tag-${tone}`, className)}>{children}</span>;
}

/** Botão de filtro com estado pressionado. */
export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-10 min-w-10 cursor-pointer border-2 px-3 font-display text-sm uppercase tracking-wider",
        active ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground",
      )}
    >
      {children}
    </button>
  );
}

/** Barra de progresso em xadrez. */
export function Bar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} className="bar">
      <i style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Dica ou resposta escondida: abre ao clicar, sem JavaScript. */
export function Reveal({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="reveal">
      <summary>{label}</summary>
      <div>{children}</div>
    </details>
  );
}
