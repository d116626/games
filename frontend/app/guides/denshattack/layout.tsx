import { Anton, Barlow } from "next/font/google";
import type { ReactNode } from "react";
import "@/games/denshattack/theme.css";

const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });
const barlow = Barlow({ variable: "--font-barlow", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function Layout({ children }: { children: ReactNode }) {
  return <div className={`theme-train ${anton.variable} ${barlow.variable}`}>{children}</div>;
}
