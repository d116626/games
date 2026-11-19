"""Capítulos: o que abre em cada um (texto nosso, a partir dos guias do PowerPyx e do GTABase) e o troféu que o conclui."""

import re

from utils.games.grand_theft_auto_vi.schemas import Chapter, Opens, Trophy

# Cada item vem de uma frase dos guias baixados (fonte em comentário). `mission` é o id da missão no GTABase.
OPENS: dict[int, list[Opens]] = {
    1: [
        Opens(text="Taxi fast travel works after Gone Fishing: call the taxi, set a marker on the map and pay $100 to skip the ride.", mission="gone-fishing"),  # powerpyx/fast-travel
        Opens(text="Money you earn in Chapter 1 is lost when the chapter ends, so do not farm it. Just follow the story."),  # powerpyx/money
        Opens(text="The one possibly missable trophy item: after Down to Earth, accept Lucia's morning meditation on the balcony. Unclear if it counts for Positive Mental Attitude, so do it.", mission="down-to-earth"),  # powerpyx/roadmap
    ],
    2: [
        Opens(text="After Coffee Break you can switch between Jason and Lucia in the open world.", mission="coffee-break"),  # powerpyx/switch-characters, gtabase/missions
        Opens(text="Moses unlocks: you can sell him stolen cars without trackers, and the Scooter Bros app arrives.", mission="moses"),  # powerpyx/money, roadmap
        Opens(text="The RydeMe app replaces the taxi for fast travel."),  # powerpyx/fast-travel
        Opens(text="Prepare for Vice City only starts once you have at least $15,000 saved and the other pending Chapter 2 missions are done.", mission="prepare-for-vice-city"),  # gtabase/missions/prepare-for-vice-city
    ],
    3: [
        Opens(text="Credit Check unlocks bank jobs and the Dye Pack Jammer you need to fence marked bills.", mission="credit-check"),  # powerpyx/100-checklist
        Opens(text="Yasmani's Jewelry Jobs open jewelry store robberies, which pay $10,000 to $25,000 each."),  # powerpyx/money
        Opens(text="Clonin' Keys, Makin' GS unlocks the Key Cloner and Randy's Wish List of high-end cars.", mission="clonin-keys-makin-gs"),  # powerpyx/money
        Opens(text="You receive $120,000 automatically at the end of the chapter."),  # powerpyx/money
    ],
    4: [
        Opens(text="The optional mission That's Where the Money Is... unlocks large bank vault robberies, the fastest money in the game. Doing it is effectively the point of no return before the ending.", mission="thats-where-the-money-is"),  # powerpyx/money
    ],
    5: [
        Opens(text="The last chapter. After the story you go back to free-roam and the 100% Completion checklist becomes visible under Progress > Stats."),  # powerpyx/100-checklist, wiki
    ],
}


# Visão geral de cada capítulo: texto nosso, a partir das frases das missões do GTABase e dos guias do PowerPyx
# (os Capítulos 4 e 5 ainda não têm walkthrough: só nomes e frases curtas).
OVERVIEW: dict[int, dict] = {
    0: {
        "summary": "Lucia talks to a prison counselor about her arrest and her chances of early release. A flashback then shows the payday loan robbery that put her there.",
        "goal": "Learn the basics as Lucia.",
    },
    1: {
        "summary": "Jason works for Brian in the Keys with Cal and Donnie: smuggling runs, collecting rent, a dive trip for Kenton. Lucia is released early, the two set up home and open a bank account, "
        "and then Mattia's \"simple job\" ends in trouble at Vice City Hospital.",
        "goal": "Settle in the Keys, get Lucia home and survive the hospital job.",
        "unlocks": ["Taxi fast travel", "BuckMe bank account", "Meditation"],
        "side": ["Kirk and the Skunk Ape, at night only", "Shirley's two missions, gone once Tourist Trap starts"],  # powerpyx/strangers-freaks
    },
    2: {
        "summary": "A motel in Port Gellhorn. Lucia runs things while Jason recovers: she pays the motel bill, hunts for painkillers, gets a car from Moses and a new look. "
        "Then the two start pulling stick-ups together and need $15,000 to move to Vice City.",
        "goal": "Earn $15,000 and move to Vice City.",
        "unlocks": ["Switch between Jason and Lucia", "Moses buys stolen cars", "RydeMe fast travel", "Scooter Bros app"],
        "side": ["Kyle, Moses, Bret Vogel and Billy start here"],
    },
    3: {
        "summary": "Vice City. Dre'Quan, Boobie and Lucia's mother Mia help them settle while Jason picks up work from Tyrone. They meet Raul and his crew, run jobs for him, "
        "and spend the second half preparing the Cartel Heist at Sinfrontera National Bank.",
        "goal": "Pull off the Cartel Heist.",
        "unlocks": ["Bank jobs", "Key Cloner and Randy's cars", "Jewelry store robberies", "$120,000 at the end"],
        "side": ["Yago's races, Andy, Yasmani, Randy, Tyrone and Dunk start here"],
    },
    4: {
        "summary": "Ocean Beach. A new base, a lawyer called Abe Gonzalez and a string of jobs. The long VCIA Takedown builds up an airport heist, with Lucia working with Nate and Kordell and Jason "
        "scouting the airport. Jason also chases blackmail material, and a kidnapping involving Rafa pulls them in. It closes with Sunset and Starting From Zero.",
        "goal": "Pull off the airport heist and deal with what it leaves behind.",
        "unlocks": ["Large bank vaults, the fastest money"],
        "side": ["Eddie Acosta and Pilot Pete start here"],
    },
    5: {
        "summary": "The final stretch: boost a car, a new plan, a favour for Mattia, a contraband hunt with Vinny and the Operation Savage Glory shipment, then more dealings with Abe. "
        "It ends with The End of the Road.",
        "goal": "Finish the story.",
        "unlocks": ["Free-roam after the credits", "The 100% checklist"],
    },
}


def build(trophies: list[Trophy]) -> list[Chapter]:
    """O troféu de cada capítulo é o que a PSN descreve como "Complete Chapter N."; o do último é o "Complete the final mission."."""
    by_chapter: dict[int, int] = {}
    for t in trophies:
        if m := re.fullmatch(r"Complete Chapter (\d)\.", t.description):
            by_chapter[int(m[1])] = t.id
        elif t.description == "Complete the final mission.":
            by_chapter[5] = t.id
    return [Chapter(n=n, trophy=by_chapter.get(n), opens=OPENS.get(n, []), **OVERVIEW[n]) for n in range(0, 6)]
