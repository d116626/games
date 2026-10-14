import { Atkinson_Hyperlegible_Next, Barlow_Condensed } from "next/font/google";
import type { ReactNode } from "react";
import "@/games/blood-of-dawnwalker/theme.css";

const barlow = Barlow_Condensed({ variable: "--font-barlow", subsets: ["latin"], weight: ["600", "700"] });
const atkinson = Atkinson_Hyperlegible_Next({ variable: "--font-atkinson", subsets: ["latin"] });

export default function Layout({ children }: { children: ReactNode }) {
  return <div className={`theme-dawn ${barlow.variable} ${atkinson.variable}`}>{children}</div>;
}
