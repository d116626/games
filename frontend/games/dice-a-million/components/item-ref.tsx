"use client";

import { useId } from "react";
import { ItemRow } from "@/games/dice-a-million/components/item-row";
import type { ItemInfo } from "@/games/dice-a-million/types";
import { cn } from "@/lib/utils";

/** Botão que abre um cartão com os detalhes do item (Popover API nativa: fecha com Esc ou clique fora). */
export function ItemRef({ item, children, className }: { item: ItemInfo; children: React.ReactNode; className?: string }) {
  const id = useId();
  return (
    <>
      <button type="button" popoverTarget={id} className={cn("cursor-pointer hover:underline", className)}>
        {children}
      </button>
      <div id={id} popover="auto" className="sticker m-auto w-[min(26rem,calc(100vw-2rem))] p-4 backdrop:bg-black/50">
        <ItemRow {...item} text={item.text || "No details."} />
        <button
          type="button"
          popoverTarget={id}
          popoverTargetAction="hide"
          className="hud-tab mt-3 min-h-9 cursor-pointer rounded px-3 text-xs"
        >
          Close
        </button>
      </div>
    </>
  );
}
