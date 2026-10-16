import { Bowlby_One, Nunito } from "next/font/google";
import type { ReactNode } from "react";
import "@/games/mewgenics/theme.css";

const bowlby = Bowlby_One({ variable: "--font-bowlby", subsets: ["latin"], weight: "400" });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });

export default function Layout({ children }: { children: ReactNode }) {
  return <div className={`theme-cat ${bowlby.variable} ${nunito.variable}`}>{children}</div>;
}
