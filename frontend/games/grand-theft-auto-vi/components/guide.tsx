import { Who } from "@/games/grand-theft-auto-vi/components/ui";
import { Overview } from "@/games/grand-theft-auto-vi/components/overview";
import { Story } from "@/games/grand-theft-auto-vi/components/story";
import { MAIN_COUNT, story } from "@/games/grand-theft-auto-vi/lib/data";

const FACTS: [string, React.ReactNode][] = [
  ["Platforms", "PS5 and Xbox Series X|S. Released November 19, 2026."],
  [
    "You play as",
    <span key="who" className="inline-flex items-center gap-2">
      <Who who={["jason", "lucia"]} size="size-8" /> Jason Duval and Lucia Caminos
    </span>,
  ],
  ["Length", "The story takes about 50 to 80 hours; the 100% checklist about 200. Both are first estimates."],
  ["World", "The state of Leonida: 5 counties, about 175 km², roughly a third of it water."],
  ["Trophies", "55, with one Platinum. All single-player, no online or DLC trophies."],
  ["Saves", "15 manual slots and 1 autosave. No difficulty settings and no New Game+."],
];

const TIPS: [string, string][] = [
  ["Save often", "There is no mission replay. Keep a save at the start and end of every chapter."],
  ["Know the icons", "Pink is a main mission, black with pink letters optional, purple a side task. An hourglass means it expires."],
  ["Do optionals as they come", "Most stay after the story, and nothing needed for 100% can be missed."],
  ["One trophy can slip", "Lucia's meditation in Chapter 1, right after Down to Earth. Say yes to it."],
  ["Scan from the start", "WAiNK app for vehicles (200 needed), binoculars for animals (100). Turn on all progress notifications."],
  ["Fast travel is hidden", "Call a taxi or open RydeMe, set a map marker and pay $100."],
  ["Watch your profile", "At Psycho and Irredeemable the police shoot on sight, and Irredeemable never goes away."],
  ["Cheats cost trophies", "They switch off trophies and saving for that save."],
];

/** O guia: o essencial do jogo, dicas para começar e as missões da história em ordem. */
export function Guide() {
  return (
    <div className="space-y-12">
      <div className="max-w-3xl space-y-8">
        <p className="text-lg">
          Welcome to Leonida. The essentials first, then a look at every chapter and all the story missions in order. The world, side missions and the 100% checklist come next.
        </p>
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {FACTS.map(([k, v]) => (
            <div key={k}>
              <dt className="label">{k}</dt>
              <dd className="mt-0.5">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div id="tips" className="scroll-mt-24">
        <h3 className="font-display text-3xl">Before you start</h3>
        <ol className="mt-5 grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {TIPS.map(([title, text], i) => (
            <li key={title} className="flex gap-3">
              <span className="font-display text-2xl leading-none text-(--pink)">{i + 1}</span>
              <p>
                <b className="font-bold">{title}.</b> <span className="text-muted-foreground">{text}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div id="overview" className="scroll-mt-24 space-y-4">
        <div className="max-w-3xl">
          <h3 className="font-display text-3xl">Chapter overview</h3>
          <p className="mt-2 text-muted-foreground">
            What happens in each chapter, what you are working towards and what opens up. The summaries come from the mission descriptions, and Chapters 4 and 5 have no walkthrough yet, so they stay short.
          </p>
        </div>
        <Overview />
      </div>

      <div id="story" className="scroll-mt-24 space-y-4">
        <div className="max-w-3xl">
          <h3 className="font-display text-3xl">Story missions</h3>
          <p className="mt-2 text-muted-foreground">
            The {MAIN_COUNT} main missions in order, from the Prologue to Chapter 5, numbered by us. Optional missions sit between them without a number. Missions can show up in a slightly
            different order in your game, and a mission only needs its walkthrough when you click it. Tick what you have done; it is saved only in this browser.
          </p>
        </div>
        <Story />
      </div>

      <details className="max-w-3xl">
        <summary className="cursor-pointer font-semibold underline underline-offset-4">Where the sources differ</summary>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
          {story.discrepancies.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
