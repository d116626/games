import { IM_Fell_English, Lora } from "next/font/google";
import type { ReactNode } from "react";
import "@/games/return-of-the-obra-dinn/theme.css";

const fell = IM_Fell_English({ variable: "--font-fell", subsets: ["latin"], weight: "400" });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"] });

export default function Layout({ children }: { children: ReactNode }) {
  return <div className={`theme-dinn ${fell.variable} ${lora.variable}`}>{children}</div>;
}
