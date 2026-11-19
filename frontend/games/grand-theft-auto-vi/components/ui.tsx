import { GameImage } from "@/components/game/game-image";
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

const WHO = {
  jason: { name: "Jason", src: "games/grand-theft-auto-vi/characters/jason.jpg", ring: "border-[#2fa84f]" },
  lucia: { name: "Lucia", src: "games/grand-theft-auto-vi/characters/lucia.jpg", ring: "border-[#e0529c]" },
} as const;

/** Retratos redondos de quem joga a missão (Lucia atrás de Jason quando são os dois). */
export function Who({ who, size = "size-9" }: { who: ("jason" | "lucia")[]; size?: string }) {
  if (who.length === 0) return null;
  const ordered = (["lucia", "jason"] as const).filter((w) => who.includes(w));
  return (
    <span className="inline-flex shrink-0" role="img" aria-label={ordered.map((w) => WHO[w].name).join(" and ")} title={ordered.map((w) => WHO[w].name).join(" and ")}>
      {ordered.map((w, i) => (
        <GameImage key={w} src={WHO[w].src} alt="" width={60} height={78} className={cn("rounded-full border-[3px] bg-card object-cover object-top", size, WHO[w].ring, i > 0 && "-ml-3")} />
      ))}
    </span>
  );
}
