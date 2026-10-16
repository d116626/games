import { GameImage } from "@/components/game/game-image";
import { cn } from "@/lib/utils";

/** Botão de filtro (pílula) com estado pressionado. */
export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-10 cursor-pointer rounded-full border-2 border-foreground px-4 text-sm font-bold transition-colors",
        active ? "bg-foreground text-background" : "bg-card hover:bg-(--mustard)",
      )}
    >
      {children}
    </button>
  );
}

/** Etiqueta de coleira (pílula com contorno). */
export function Tag({
  tone = "mustard",
  className,
  children,
}: {
  tone?: "mustard" | "pink" | "teal" | "paper";
  className?: string;
  children: React.ReactNode;
}) {
  return <span className={cn("tag", tone !== "mustard" && `tag-${tone}`, className)}>{children}</span>;
}

/** Miniatura quadrada com contorno de tinta; some se não houver imagem. */
export function Thumb({ src, className }: { src?: string; className?: string }) {
  if (!src) return null;
  return (
    <GameImage
      src={src}
      alt=""
      width={56}
      height={56}
      className={cn("size-14 shrink-0 rounded-lg border-2 border-foreground bg-card", className)}
    />
  );
}

/** Numeral grande de caderno. */
export function Big({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("font-display text-4xl leading-none text-(--coral)", className)}>{children}</span>;
}
