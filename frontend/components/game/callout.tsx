import { Lightbulb, Sparkles, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "tip" | "combo" | "warning";

const VARIANTS: Record<Variant, { icon: LucideIcon; label: string; chip: string }> = {
  tip: { icon: Lightbulb, label: "Tip", chip: "bg-(--game-accent) text-black" },
  combo: { icon: Sparkles, label: "Combo", chip: "bg-(--game-accent) text-black" },
  warning: { icon: TriangleAlert, label: "Warning", chip: "bg-destructive text-white" },
};

/** Destaque curto dentro de uma seção: dica, combo ou aviso. */
export function Callout({
  variant = "tip",
  title,
  children,
}: {
  variant?: Variant;
  title?: string;
  children: ReactNode;
}) {
  const { icon: Icon, label, chip } = VARIANTS[variant];
  return (
    <aside className="flex gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground">
      <span className={cn("grid size-8 shrink-0 place-items-center rounded-md", chip)}>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 text-sm">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {title ?? label}
        </p>
        <div className="mt-1">{children}</div>
      </div>
    </aside>
  );
}
