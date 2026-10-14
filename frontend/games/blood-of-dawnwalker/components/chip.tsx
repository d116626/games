import { cn } from "@/lib/utils";

/** Botão de filtro (pílula) com estado pressionado. */
export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-10 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors",
        active
          ? "border-(--game-accent) bg-(--game-accent) text-white"
          : "border-border text-muted-foreground hover:border-(--dawn) hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/** Etiqueta curta, sem caixa: só texto em caixa-alta. */
export function Tag({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn("label", className)}>{children}</span>;
}
