"use client";

import { Menu } from "@base-ui/react/menu";
import { Download, MoreHorizontal, RotateCcw, Upload } from "lucide-react";
import { useRef } from "react";

/** Menu "···" do Crew: levar o progresso para outro navegador ou apagar tudo. */
export function CrewMenu({ onExport, onImport, onReset }: { onExport: () => void; onImport: () => void; onReset: () => void }) {
  // o popup vai para o tema do jogo (as cores são variáveis CSS dele), não para o <body>
  const theme = useRef<HTMLElement | null>(null);
  return (
    <Menu.Root>
      <Menu.Trigger
        ref={(node: HTMLButtonElement | null) => {
          theme.current = node?.closest<HTMLElement>(".theme-dinn") ?? null;
        }}
        aria-label="Progress menu"
        title="Export, import or reset"
        className="icon-btn"
      >
        <MoreHorizontal className="size-5" />
      </Menu.Trigger>
      <Menu.Portal container={theme}>
        <Menu.Positioner align="end" sideOffset={4} className="z-50">
          <Menu.Popup className="pick-popup" style={{ width: "auto", minWidth: "12rem" }}>
            <Menu.Item className="pick-item" onClick={onExport}>
              <Download className="size-4" /> Export progress
            </Menu.Item>
            <Menu.Item className="pick-item" onClick={onImport}>
              <Upload className="size-4" /> Import progress
            </Menu.Item>
            <Menu.Item className="pick-item" onClick={onReset}>
              <RotateCcw className="size-4" /> Reset all
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
