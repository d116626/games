import { game } from "@/games/blood-of-dawnwalker/game";
import { endings, skills, trophies } from "@/games/blood-of-dawnwalker/lib/data";

const TICKS = Array.from({ length: 30 }, (_, i) => i);

/** Relógio de 30 dias: anel de dias, 16 segmentos (8 de dia, 8 de noite) e a gota no centro. */
function Dial() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden className="mx-auto w-full max-w-sm drop-shadow-[0_0_40px_rgb(214_51_75/0.35)]">
      <defs>
        <radialGradient id="sun" cx="35%" cy="40%" r="75%">
          <stop offset="0" stopColor="#ffe3a8" />
          <stop offset="0.55" stopColor="#e8a85a" />
          <stop offset="1" stopColor="#9a3a2a" />
        </radialGradient>
        <radialGradient id="night" cx="70%" cy="35%" r="80%">
          <stop offset="0" stopColor="#2a2548" />
          <stop offset="1" stopColor="#0e0b1c" />
        </radialGradient>
        <clipPath id="left-half">
          <rect x="0" y="0" width="200" height="400" />
        </clipPath>
        <clipPath id="right-half">
          <rect x="200" y="0" width="200" height="400" />
        </clipPath>
      </defs>

      <g className="dial-spin" stroke="#efe4d2">
        {TICKS.map((i) => {
          const major = i % 5 === 0;
          return (
            <line
              key={i}
              x1="200"
              y1={major ? 8 : 16}
              x2="200"
              y2="28"
              strokeWidth={major ? 2.5 : 1}
              strokeOpacity={major ? 0.9 : 0.45}
              transform={`rotate(${i * 12} 200 200)`}
            />
          );
        })}
      </g>
      <circle cx="200" cy="200" r="168" fill="none" stroke="#efe4d2" strokeOpacity="0.2" />

      <path d="M200 340 A140 140 0 0 1 200 60" pathLength="8" fill="none" stroke="#e8a85a" strokeWidth="14" strokeDasharray="0.86 0.14" />
      <path d="M200 60 A140 140 0 0 1 200 340" pathLength="8" fill="none" stroke="#aab4d6" strokeWidth="14" strokeDasharray="0.86 0.14" />

      <circle cx="200" cy="200" r="104" fill="none" stroke="#efe4d2" strokeOpacity="0.3" />
      <circle cx="200" cy="200" r="96" fill="url(#sun)" clipPath="url(#left-half)" />
      <circle cx="200" cy="200" r="96" fill="url(#night)" clipPath="url(#right-half)" />
      <g clipPath="url(#right-half)">
        <circle cx="252" cy="160" r="22" fill="#dfe3f0" />
        <circle cx="262" cy="153" r="20" fill="#14102a" />
        <circle cx="236" cy="228" r="2" fill="#dfe3f0" />
        <circle cx="270" cy="212" r="1.5" fill="#dfe3f0" />
        <circle cx="282" cy="186" r="1.5" fill="#dfe3f0" />
      </g>
      <line x1="200" y1="104" x2="200" y2="296" stroke="#0b0709" strokeWidth="2" />
      <path
        d="M200 168 C200 168 180 196 180 212 a20 20 0 0 0 40 0 C220 196 200 168 200 168 Z"
        fill="#d6334b"
        stroke="#0b0709"
        strokeWidth="3"
      />
      <path d="M192 208 q-2 8 3 14" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** Hero do guia: título gótico, relógio de 30 dias e entradas para troféus e rota. */
export function Hero() {
  const stats = [
    "30 days",
    `${trophies.trophies.length} trophies`,
    `${endings.endings.length} endings`,
    `${skills.abilities.length + skills.perks.length} skills`,
  ];
  return (
    <section className="relative mt-4 grid items-center gap-8 py-8 md:grid-cols-[1fr_minmax(0,24rem)] md:py-12">
      <div className="space-y-6">
        <p className="label text-(--dawn)">Fan guide · PS5 trophy roadmap</p>
        <h1 className="font-display text-6xl leading-[0.9] md:text-8xl">
          The <span className="text-(--game-accent)">Blood</span> of Dawnwalker
        </h1>
        <p className="max-w-lg text-lg leading-snug text-muted-foreground">{game.tagline}</p>
        <ul className="flex flex-wrap gap-2">
          {stats.map((s) => (
            <li key={s} className="rounded-full border border-border px-3 py-1 text-sm font-medium">
              {s}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <a href="#trophies" className="seal inline-flex min-h-12 items-center px-6 text-sm">
            Trophy roadmap
          </a>
          <a href="#route" className="seal-ghost inline-flex min-h-12 items-center px-6 text-sm">
            Plan the 30 days
          </a>
        </div>
      </div>
      <Dial />
    </section>
  );
}
