"use client";

import { Combobox } from "@base-ui/react/combobox";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRef } from "react";
import type { Option } from "@/games/return-of-the-obra-dinn/lib/answers";

const CLEAR: Option = { value: "", label: "Clear choice" };

/** Menu com busca: o campo de texto fica dentro do popup e a lista é curta, com rolagem. */
export function Picker({
  options,
  value,
  placeholder,
  label,
  state,
  onChange,
}: {
  options: Option[];
  value: string | undefined;
  placeholder: string;
  label: string;
  state: "idle" | "ok" | "bad";
  onChange: (value: string) => void;
}) {
  // o popup vai para o tema do jogo (as cores são variáveis CSS dele), não para o <body>
  const theme = useRef<HTMLElement | null>(null);
  const selected = options.find((o) => o.value === value) ?? null;

  return (
    <Combobox.Root
      items={[CLEAR, ...options]}
      value={selected}
      onValueChange={(o: Option | null) => onChange(o?.value ?? "")}
      itemToStringLabel={(o: Option) => o.label}
      isItemEqualToValue={(a: Option, b: Option) => a.value === b.value}
    >
      <Combobox.Trigger
        ref={(node) => {
          theme.current = node?.closest<HTMLElement>(".theme-dinn") ?? null;
        }}
        aria-label={label}
        data-answer={state}
        aria-invalid={state === "bad"}
        className="pick"
      >
        <span className="min-w-0 flex-1 truncate text-left">
          {selected ? selected.label : <span className="text-muted-foreground">{placeholder}</span>}
        </span>
        <Combobox.Icon className="shrink-0">
          <ChevronsUpDown className="size-4" />
        </Combobox.Icon>
      </Combobox.Trigger>
      <Combobox.Portal container={theme}>
        <Combobox.Positioner align="start" sideOffset={4} className="z-50">
          <Combobox.Popup aria-label={label} className="pick-popup">
            <Combobox.Input placeholder="Search..." className="pick-input" />
            <Combobox.Empty className="px-3 py-3 text-sm text-muted-foreground empty:hidden">No match.</Combobox.Empty>
            <Combobox.List className="max-h-56 overflow-y-auto overscroll-contain py-1">
              {(o: Option) => (
                <Combobox.Item key={o.value || "clear"} value={o} className="pick-item">
                  <Combobox.ItemIndicator className="grid size-4 place-items-center">
                    <Check className="size-4" />
                  </Combobox.ItemIndicator>
                  <span className={o.value ? "col-start-2" : "col-start-2 text-muted-foreground"}>{o.label}</span>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
