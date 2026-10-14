"""Corte Vrakhiri e Edicto: PSNProfiles (níveis, gatilhos, tabela do Edict) + Fextralife (atividades)."""

from utils.games.blood_of_dawnwalker.schemas import CourtDataset, CourtMember, EdictLevel

MEMBERS = [
    CourtMember(
        id="ambrus",
        name="Ambrus",
        level=25,
        where="Briar Sloughs and Maragir Wealds",
        activities=[
            "Cellars (3, 1 segment each)",
            "Collectors (3)",
            "Dungeons (3)",
            "Prisoners (2)",
            "Transports (2)",
        ],
        trigger="Ruin his activities until his anger is about 70%. He posts notices south of Maragir with the duel location; ring the bell there at night.",
        fight="The duel. Killing him at his Maragir mansion or in the finale does not count for the trophy.",
        quests=["The Gilded Gauntlet", "The Bittersweet Toast"],
        notes=[
            "Most activities cost 3 segments.",
            "'The Bittersweet Toast' poisons Iulian Codrin's blood: you have 48 segments to start the duel with Ambrus weakened. Going in hurt makes you drain Iulian.",
            "Draining Ambrus gives the Scarlet Shield ability.",
        ],
        trophy="The Right Fist of the Knyaz",
    ),
    CourtMember(
        id="xanthe",
        name="Xanthe",
        level=28,
        where="Svartrau City and her mansion",
        activities=["Artefact transports (2)", "Abducted transports (2)"],
        trigger="At about 70% anger two guards ask you to help find lost girls and give you a lantern to break the spell on her mansion door ('The Cycle of Love').",
        fight="At her mansion. Killing her early at the cathedral, or meeting her only in the finale, does not count.",
        quests=["The Cycle of Love"],
        notes=[
            "You may ally with her for the finale instead of draining her.",
            "Her mansion has two legendary items you cannot return for.",
            "Her blood teaches Blood Surge. A sample can be taken without a fight: key behind a book in the cathedral, then the gold box on the first floor of the Treasury.",
            "The sources used list only her transports; the rest of her activities are not documented here.",
            "Her soldiers hit harder than Bakir's, but she is the weakest boss.",
        ],
        trophy="The Dark Mistress",
    ),
    CourtMember(
        id="bakir",
        name="Bakir",
        level=30,
        where="Boar's Back and Rockfalls (mansion in The Silts)",
        activities=[
            "Distilleries (3)",
            "Headhunters (3)",
            "Pillories (3)",
            "Transports (2)",
            "Hidden quest 'A Mother's Plea'",
        ],
        trigger="At about 70% anger Farkas invites you to the Lunar Game.",
        fight="At the Lunar Game: pick the bottom option to fight him at once, or run the maze first and return stronger. Killing him at his mansion does not count.",
        quests=["The Lunar Game", "The Ring"],
        notes=[
            "In the maze use no vampire abilities, or he finds you and you fight his death guards first.",
            "The strongest of the three.",
        ],
        trophy="The Mad Khan",
    ),
]

EDICT = [
    EdictLevel(level=1, numeral="I", grade="Insignificant", name="On Protection of Habitations", effect="Additional patrols in settlements."),
    EdictLevel(level=2, numeral="II", grade="Insignificant", name="On Increased Vigilance", effect="Military checkpoints appear throughout the valley."),
    EdictLevel(level=3, numeral="III", grade="Insignificant", name="On Prices and Tolls", effect="Price increases throughout the valley."),
    EdictLevel(level=4, numeral="IV", grade="Insignificant", name="On Road Safety", effect="More soldiers patrol the roads. Patrol commanders now recognize Coen."),
    EdictLevel(level=5, numeral="V", grade="Notorious", name="On Curfew", effect="Fewer people outdoors between dusk and dawn."),
    EdictLevel(level=6, numeral="VI", grade="Notorious", name="On Civil Unrest", effect="More checkpoints and further price increases."),
    EdictLevel(level=7, numeral="VII", grade="Notorious", name="On Public Enemy", effect="Headhunters appear in the valley. All soldiers recognize Coen."),
    EdictLevel(level=8, numeral="VIII", grade="Dreaded", name="On Army Reform", effect="All soldiers become stronger."),
    EdictLevel(level=9, numeral="IX", grade="Dreaded", name="On Svartrau Defences", effect="Svartrau City gates are shut. Brencis offers the meeting (The Turncoat)."),
]

EDICT_RULES = [
    "Infamy rises by clearing soldier camps, ruining Court Activities and defeating boyars. Small stealing also adds a little, with no time cost.",
    "It never goes down. A new Edict level appears at the start of a new day.",
    "Your level (Roman numerals) is shown under the branching chart in the Court menu.",
    "At level IV-VI a messenger delivers the anonymous letter for the Arbiter's armour.",
    "At level IX the first ending opens, but the city closes: finish city errands first (fishmonger, banners, shopping).",
]


def build() -> CourtDataset:
    return CourtDataset(
        intro=(
            "The Court Activities menu opens after 'Smoke and Ashes'. Disrupt each boyar's activities until their anger reaches about 70%, "
            "then fight them in their special encounter. Save manually after the three fights."
        ),
        members=MEMBERS,
        edict_rules=EDICT_RULES,
        edict=EDICT,
    )
