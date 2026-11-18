import { cn } from "@/lib/utils";

type Tone = "pink" | "orange" | "cyan" | "dim" | "silver" | "bronze";

/** Etiqueta (caixa alta, cantos arredondados). */
export function Tag({ tone = "pink", className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return <span className={cn("tag", `tag-${tone}`, className)}>{children}</span>;
}

/** Botão de filtro com estado pressionado. */
export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-10 cursor-pointer rounded-full border px-4 text-sm font-bold uppercase tracking-wider transition-colors",
        active ? "border-(--pink) bg-(--pink) text-black" : "border-border bg-card hover:border-(--pink) hover:text-(--pink)",
      )}
    >
      {children}
    </button>
  );
}

/** Barra de progresso com o degradê do pôr do sol. */
export function Bar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} className="bar">
      <i style={{ width: `${pct}%` }} />
    </div>
  );
}
