import { Anton, Atkinson_Hyperlegible_Next, Pixelify_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "@/games/dice-a-million/theme.css";

const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });
const atkinson = Atkinson_Hyperlegible_Next({ variable: "--font-atkinson", subsets: ["latin"] });
const pixel = Pixelify_Sans({ variable: "--font-pixel", subsets: ["latin"] });

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={`theme-dice ${anton.variable} ${atkinson.variable} ${pixel.variable}`}>
      {children}
    </div>
  );
}
