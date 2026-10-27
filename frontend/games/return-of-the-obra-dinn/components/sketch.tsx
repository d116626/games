"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GameImage } from "@/components/game/game-image";
import { guide } from "@/games/return-of-the-obra-dinn/lib/data";
import { cn } from "@/lib/utils";

const ZOOMS = [1, 1.5, 2, 3];

/** O sketch do livro: cada rosto é um botão que leva ao retrato dele na tabela. Zoom para acertar rostos pequenos. */
export function Sketch({
  onPick,
  highlight,
  solved,
}: {
  onPick: (crewId: string) => void;
  highlight: string | null;
  solved: ReadonlySet<string>;
}) {
  const { src, alt, width, height, credit, faces } = guide.sketch;
  const [zoom, setZoom] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const step = (d: number) => setZoom((z) => Math.min(ZOOMS.length - 1, Math.max(0, z + d)));

  // Rola só a caixa do sketch até o rosto (a página não se mexe: o sketch fica ao lado da lista).
  useEffect(() => {
    const el = highlight ? document.getElementById(`face-${highlight}`) : null;
    const b = box.current;
    if (!el || !b) return;
    b.scrollTo({ left: el.offsetLeft - (b.clientWidth - el.offsetWidth) / 2, top: el.offsetTop - (b.clientHeight - el.offsetHeight) / 2, behavior: "smooth" });
  }, [highlight, zoom]);

  return (
    <figure className="w-full">
      <div className="mb-2 flex items-center gap-2">
        <button type="button" className="btn btn-ghost" onClick={() => step(-1)} disabled={zoom === 0} aria-label="Zoom out">
          <Minus className="size-4" />
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => step(1)} disabled={zoom === ZOOMS.length - 1} aria-label="Zoom in">
          <Plus className="size-4" />
        </button>
        <span className="label">{ZOOMS[zoom]}x</span>
        <span className="label ml-auto">
          {faces.length - solved.size} left · {solved.size} solved
        </span>
      </div>
      <div ref={box} className="max-h-[calc(100dvh-10rem)] overflow-auto border-2 border-foreground">
        <div className="relative" style={{ width: `${ZOOMS[zoom] * 100}%` }}>
          <GameImage src={src} alt={alt} width={width} height={height} className="pixel block h-auto w-full" />
          {faces.map((f) => (
            <button
              key={f.crewId}
              id={`face-${f.crewId}`}
              type="button"
              aria-label="Go to this face in the crew list"
              onClick={() => onPick(f.crewId)}
              className={cn(
                "absolute cursor-pointer",
                solved.has(f.crewId)
                  ? "bg-[rgb(143_240_176/0.3)] outline-2 outline-(--ok)"
                  : "hover:outline-2 hover:outline-(--blood) focus-visible:outline-2 focus-visible:outline-(--blood)",
                highlight === f.crewId && "bg-[rgb(255_122_107/0.3)] outline-4 outline-(--blood)",
              )}
              style={{ left: `${(f.x / width) * 100}%`, top: `${(f.y / height) * 100}%`, width: `${(f.w / width) * 100}%`, height: `${(f.h / height) * 100}%` }}
            />
          ))}
        </div>
      </div>
      <figcaption className="mt-2 text-xs text-muted-foreground">
        Click a face to find its portrait; click a portrait to find its face. Green = solved. Image: {credit}. Face positions:{" "}
        <a className="underline" href="https://github.com/sondregronas/obra-dinn-interactive-crew-list">
          obra-dinn-interactive-crew-list
        </a>{" "}
        (MIT).
      </figcaption>
    </figure>
  );
}
