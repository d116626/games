import { Bowlby_One, DM_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "@/games/grand-theft-auto-vi/theme.css";

const bowlby = Bowlby_One({ variable: "--font-bowlby", subsets: ["latin"], weight: "400" });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });

export default function Layout({ children }: { children: ReactNode }) {
  return <div className={`theme-vice ${bowlby.variable} ${dmSans.variable}`}>{children}</div>;
}
