"""Finais: Fextralife (Endings Guide) + PSNProfiles (condições e avisos de save). Texto escrito à mão."""

from utils.games.blood_of_dawnwalker.schemas import Ending, EndingsDataset

MEETING = [
    "Ruin the Court (Ambrus, Bakir, Xanthe) until Infamy reaches level IX.",
    "Pass time to the next morning: Brencis invites you to a private meeting for the next 10 nights ('A Deal with the Devil').",
]
MEETING_WARNING = "Going too far in Lacra's or Crake's questline closes the meeting. Save manually before it."

ENDINGS = [
    Ending(
        id="turncoat",
        name="The Turncoat",
        group="main",
        trophy="The Turncoat",
        frees_family=True,
        summary="Betray your allies to Brencis in exchange for your family.",
        steps=[
            *MEETING,
            "Pick 'I just want my family back', then 'I'll do it'. Do not pick up a weapon.",
            "Mark the Manumit Hideout on Brencis's map. You only know where it is after The Firebrand, Shadows in the Woods and Where Loyalty Lies.",
        ],
        warnings=[MEETING_WARNING, "At Infamy IX Svartrau City closes its gates (you lose the fishmonger for Selfish)."],
    ),
    Ending(
        id="folk-hero",
        name="The Folk Hero",
        group="main",
        trophy="The Folk Hero",
        frees_family=True,
        summary="Refuse the deal and kill Brencis alone.",
        steps=[
            *MEETING,
            "At the meeting choose 'Enough. Time to end this.' and fight Brencis.",
            "Early alternative: go to Brencis's castle right after the prologue. At night climb the wall with Planeshift and Shadowstep; by day or night use the side entrance north-west of the Vedera Shallows Shrine.",
            "Side entrance: team up with Father Florin ('In the Name of the Father') or take the Side Gate Key from the miniboss Georghe at Racovitza's Bandit Camp (east edge of the map).",
        ],
        warnings=[MEETING_WARNING, "The early route ends the story at once: do it last, or on its own save."],
    ),
    Ending(
        id="patricide",
        name="The Patricide",
        group="main",
        trophy="The Patricide",
        frees_family=True,
        summary="Defeat Brencis together with Lacra.",
        steps=[
            "Do Lacra's questline in order: A Friend Like This, Song of the Mountain, Hive and Seek, Our Rotten Roots, The Night of Horrors, Midnight Reckoning.",
            "Total 22 segments (3, 4, 4, 4, 7). Midnight Reckoning is the finale.",
            "Romancing Lacra in The Night of Horrors grants the Mesmerise ability; the mandrake at the end of the cave grants Mandrake Ward.",
        ],
        warnings=["Starting Midnight Reckoning triggers the ending (1-2 hours, no autosave before it). Save manually first; that same save gives Misery Loves Company."],
    ),
    Ending(
        id="knyazmaker",
        name="The Knyazmaker",
        group="main",
        trophy="The Knyazmaker",
        frees_family=True,
        summary="Defeat Brencis together with Crake and the Manumit.",
        steps=[
            "Do Crake's ten quests in order: The Firebrand, Shadows in the Woods, Where Loyalty Lies, What Hunts the Night, What Moves the Dead, Who Pulls the Strings, Distant Shadows, A Closer Look, Rise at Dawn, Fall Before Dusk.",
            "Total 40 segments. Distant Shadows and A Closer Look are optional for the ending but needed for The Manumit.",
            "Life Lock (Witchcraft) is on the third floor of the tower in Who Pulls the Strings.",
        ],
        warnings=["Starting Rise at Dawn (quest 9) triggers the ending sequence with no autosave before it. Save manually first; the eighth quest already gives The Manumit."],
    ),
    Ending(
        id="coward",
        name="The Coward's Path",
        group="secret",
        trophy="A Hero They Deserve",
        frees_family=False,
        summary="Leave Vale Sangora and abandon your family.",
        steps=[
            "After 'Smoke and Ashes', go west of Briar Sloughs to the broken bridge (Coward's Path shrine).",
            "At night use Planeshift and Shadowstep to climb the canyon and cross the bridge.",
            "At the gate pick 'leave the valley forever'. The other exit is the main gate south-east of Tantari Woods (guards and a Gargoyle).",
        ],
        warnings=["Needs night. Ends the game and gives The Blood of Dawnwalker but not Uphill Battle or In the Nick of Time."],
    ),
    Ending(
        id="time-runs-out",
        name="Time Runs Out",
        group="secret",
        frees_family=False,
        summary="Fail to save your family within 30 days.",
        steps=[
            "Let the 30 days pass (for example by waiting at shrines).",
            "A cutscene shows Brencis killing your family and the goal becomes revenge.",
        ],
        warnings=["No unique trophy, but it still gives The Blood of Dawnwalker."],
    ),
    Ending(
        id="together-forever",
        name="Together... Forever...",
        group="secret",
        trophy="Together Forever",
        frees_family=False,
        summary="Stay in the cursed dream with your family.",
        steps=[
            "At the Silts tower (south-west) open the top-floor door to start 'Home Sweet Home' (6 segments).",
            "You relive the family rescue in a loop. Ignore the well (focus mode) and repeat.",
            "When you can stay with your family, cut logs and talk to Esme in the kitchen.",
            "To escape instead: use the well, speak to Alin, Esme and Coen in the Church of Dreams, then break the glowing red stump and ride the river.",
        ],
        warnings=["Loop count differs between sources (4 or 5 full loops). Ends the game early; keep a separate save."],
    ),
]


def build() -> EndingsDataset:
    return EndingsDataset(
        intro=(
            "The game has 7 endings. Four free your family (the main ones) and three are secret. "
            "You can see all of them in one playthrough with manual saves before the Brencis meeting and before the last quest of each ally."
        ),
        endings=ENDINGS,
    )
