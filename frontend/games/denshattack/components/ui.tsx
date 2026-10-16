import { cn } from "@/lib/utils";

type Tone = "signal" | "pink" | "cyan" | "lime" | "dim" | "silver" | "bronze";

/** Etiqueta de placa (caixa alta, canto reto). */
export function Tag({ tone = "signal", className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return <span className={cn("tag", tone !== "signal" && `tag-${tone}`, className)}>{children}</span>;
}

/** Botão de filtro com estado pressionado. */
export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-10 cursor-pointer rounded-[2px] border px-4 text-sm font-bold uppercase tracking-wider transition-colors",
        active
          ? "border-(--signal) bg-(--signal) text-black"
          : "border-border bg-card hover:border-(--signal) hover:text-(--signal)",
      )}
    >
      {children}
    </button>
  );
}

/** Barra de progresso com dormentes. */
export function Bar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} className="bar">
      <i style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Numeral grande de placa. */
export function Big({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("font-display text-5xl leading-none text-(--signal)", className)}>{children}</span>;
}
