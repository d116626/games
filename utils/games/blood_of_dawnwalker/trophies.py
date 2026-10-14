"""Troféus (PS5): lista e raridade vêm do PSNProfiles; tags e etapas do guia dele; dicas escritas à mão."""

import re

from utils.common.http import fetch_file_if_missing
from utils.common.paths import assets_dir, raw_dir
from utils.games.blood_of_dawnwalker.constants import GAME, PSN_GUIDE_MD, PSN_TROPHIES_MD
from utils.games.blood_of_dawnwalker.schemas import Trophy, TrophyDataset, TrophyStage

POINTS = {"platinum": 300, "gold": 90, "silver": 30, "bronze": 15}
TAGS = ["Missable", "Difficulty Specific", "Time Limited", "Side Quest", "Collectable", "Story", "Grind"]

ROW = re.compile(
    r"^\| !\[\]\((?P<icon>https://img\.psnprofiles\.com/trophy/s/42703/[^)]+)\) \| "
    r"\[(?P<name>[^\]]+)\]\((?P<url>[^)]*?/(?P<id>\d+)-[^/)]*)\) (?P<desc>.*?) \|  \| "
    r"!\[\]\([^)]*spacer\.png\)(?P<psn>[\d.]+)% (?P<psn_tier>[A-Za-z ]+?) \| "
    r"(?P<pp>[\d.]+)% (?P<pp_tier>[A-Za-z ]+?) \| "
    r"!\[\]\([^)]*/40-(?P<grade>\w+)\.png\) \|",
    re.M,
)

# Dicas curtas (escritas à mão a partir do guia do PSNProfiles e da Fextralife).
TIPS: dict[str, str] = {
    "Uphill Battle": (
        "Finish on Duelist and free your family with any of the 4 main endings, before day 30. "
        "Never change the difficulty (it becomes Custom and the trophy is lost). Reach level 20-25 first with Court "
        "Activities and camps, then take down the three boyars; Infamy 9 unlocks The Turncoat, the ending the PSNProfiles guide uses for this trophy."
    ),
    "Selfish": (
        "Buy dried fish from the fishmonger (day market, north-east Svartrau City) and sell it back. "
        "At Infamy 9 the city gates close, so do this before."
    ),
    "Throne of Thorns": "Reach Infamy 9 (Edict IX) by clearing camps, ruining Court Activities and defeating the boyars. The level never goes down.",
    "Better Safe than Sorry": (
        "Day only. Curse an enemy with Burning Blood, then land Artery Strike (decapitation chance 10% at rank 1, 70% at max rank; "
        "much higher on low-health enemies). Artery Strike books drop from camps or are sold by sword teachers."
    ),
    "Make It Rain": (
        "Night only. Learn Blood Surge (drink Xanthe's blood, or take her blood sample from the Treasury in Svartrau City). "
        "Cast it on a weak, low-health enemy without a skull."
    ),
    "Absolutely Insatiable": "Equip 3 passive abilities (for example Swiftness, Walking Fortress, Scarlet Shield) in the active ability slots.",
    "Arbiter's Blade": (
        "Needs the 3 Broken Sword shards (caves in Maragir Wealds, the west fortress and east of St. Tyna's Grove), the hilt from Mihai "
        "(Svartrau Cathedral, at night) and the blacksmith Uriashi in Briar Sloughs, then a blessing in her cave."
    ),
    "Arbiter's Regalia": (
        "Craft with Uriashi once Edict reaches 4-6 and the letter arrives. Items: Large Lizard Moult, Relic of St. Dasius, "
        "Flask of Quicksilver (Home Sweet Home at the Silts tower) and Silk Threads (Sanzhana quest)."
    ),
    "Gear of the Gods": "Equip 4 armour pieces, 1 sword, 1 necklace and 2 rings of every rarity tier. Never sell legendary items: most have a single copy.",
    "Capture the Flag": "5 banners over the Svartrau City gates (4 entrance + 1 inner). Each costs 1 segment and gives 100 XP. Reach the gatehouses via the wall stairs (day) or by teleporting (night).",
    "Bird's-Eye View": "11 towers, one per region plus three inside Svartrau City. Night only (needs Teleportation). Also reveals the points of interest of the region.",
    "Feral Hunger": (
        "Night only, with very low health (last health segment, about 2-3%). Lose control in a dialogue and drain someone. "
        "Closing Wounds makes this nearly impossible; do not pick the 'Give Me Your Hunger' option yourself."
    ),
    "Dead Man Talkin'": "Story trophy during 'Smoke and Ashes'. Anca teaches Compel Soul (day only).",
    "Master of Arms": "Choose 1 Ultimate in Swordmastery. Needs 35 points spent in the tree plus the perk itself. Skill points are too few for all three trees.",
    "Arch Warlock": "Choose 1 Ultimate in Witchcraft. Same cost as Swordmastery; save before spending and use a separate save per tree.",
    "Creature of the Night": "Choose 1 Ultimate in Vampirism. Needs Corruption level 15: drink blood, use Voracious Bite and consumables.",
    "Glass Ceiling": (
        "The longest grind: all quests and activities are not enough XP. Be picky with skill points (each perk costs time), "
        "finish the Sanzhani chain for an extra day and farm about 4000 XP from city guards at night."
    ),
    "A Hero They Deserve": "Needs Planeshift and Shadowstep, so at night. Leave through the broken bridge west of Briar Sloughs or the main gate south-east of Tantari Woods, then pick 'leave the valley forever'.",
    "The Right Fist of the Knyaz": (
        "Kill Ambrus in the duel at Maragir: ruin his activities to about 70% anger, ring the bell at night. "
        "Killing him at the mansion or in the finale gives nothing. Poisoning Iulian (The Bittersweet Toast) weakens him for 48 segments."
    ),
    "The Mad Khan": (
        "Kill Bakir during the Lunar Game (Farkas invites you at about 70% anger). Do not use vampire abilities in the maze, "
        "or he finds you and you fight his guards first."
    ),
    "The Dark Mistress": (
        "At about 70% anger, guards ask for help finding lost girls and give a lantern (The Cycle of Love). You can fight or ally with her. "
        "Her mansion has two legendary items you cannot return for."
    ),
    "Sins of the Past": (
        "Anca's four-quest chain (22 segments, 1800 XP). Do not drain Anca or progress the story too far; "
        "she dies if you leave her without clearing the rooms she asks for."
    ),
    "Misery Loves Company": "Reach Lacra's fifth quest (The Night of Horrors). Do not start the sixth quest, Midnight Reckoning, without a manual save: it triggers the ending.",
    "The Manumit": "Reach the eighth Crake quest (A Closer Look). Do not start 'Rise at Dawn' without a manual save: it triggers the ending.",
    "The Turncoat": "At Infamy 9 Brencis invites you to a meeting for 10 nights. Accept the deal ('I just want my family back', 'I'll do it'), and do not pick up a weapon. Save first.",
    "The Patricide": "Finish Lacra's six quests (22 segments). Midnight Reckoning triggers the ending, so save before it.",
    "The Knyazmaker": "Finish Crake's ten quests (40 segments). Fall Before Dusk is the ending; save before Rise at Dawn.",
    "The Folk Hero": "At Brencis's meeting pick 'Enough. Time to end this.' and fight him alone. Reload your pre-meeting save after getting a first ending.",
    "In the Nick of Time": "Awarded for any of the 4 endings that free your family before day 30.",
    "Untouchable": "5 perfect blocks in a row (L1 plus the right stick direction as the hit lands). A dash resets the chain. Easier after about 10 hours.",
    "Delivery Delay": "Disrupt 8 of the 10 Vrakhiri transports (they roam; reveal them from region towers). Ambrus 4, Bakir 2, Xanthe 4.",
    "Shadow Roamer": "1000 m with Shadowstep, Planeshift or Shapeshift (Shapeshift needs Corruption level 2 and 1 skill point).",
    "Miser": "Hold 5000 denarii at once. Loot camps after level 35 (epic items sell for 700-800) and keep legendaries.",
    "Balanced Diet": "Drink 10 creatures (rats in the first cave count). Voracious Bite kills count.",
    "Mastery": "Fully upgrade one ability (4 upgrades, 4 skill points, 5 segments). Vampirism abilities only need Corruption, not books.",
    "The Unquenchable Thirst": "Vicho's chain begins after Lacra's first quest ('A Study in Crimson' in central Svartrau City). Buy his legendary items before the ending: some choices make him die. The quest has a 5-day gap, so start early.",
    "The Outcast": "Finish 'The Heart Wants What It Wants' (tavern in Svartrau City). Best after Lacra's 'Song of the Mountain' so Ocha's village gives more XP.",
    "Together Forever": (
        "'Home Sweet Home' at the Silts tower (6 segments to enter). Ignore the well and repeat the loop until you can stay with your family. "
        "Sources disagree: Steam and Fextralife say 4 full loops and the choice appears on the 5th; PSNProfiles says 5 rescues and the 6th entry traps you."
    ),
    "The Tsarina's Favourite Human": "Complete the Sanzhani chain: 'Good Home' in Svartrau Outskirts unlocks four more quests. It can give back an extra day.",
    "Smuggler": "Earn 1000 denarii from selling silver trade goods.",
    "Tour Guide Training": "Visit every village in Vale Sangora.",
    "Every Last Drop": "Platinum: all other 46 trophies.",
}

STAGES = [
    TrophyStage(
        id=1,
        title="Set difficulty to Duelist and save your mother",
        summary="Pick Duelist before you start and never change it. Save your mother in the prologue.",
        points=[
            "Duelist is the hardest preset; changing it later makes it Custom and you lose Uphill Battle.",
            "Give your mother Anca's remedy (hot water and three spoonfuls of herbs) before sunset.",
            "Help Anca when the tree falls on her house if you want the romance scene.",
        ],
    ),
    TrophyStage(
        id=2,
        title="Level up Coen",
        summary="Spend about 18-20 days on Court Activities, camps and upgrades. Be level 30-35 before the first boss.",
        points=[
            "Boss levels: Ambrus 25, Xanthe 28, Bakir 30 (Xanthe's soldiers are stronger, but she herself is the weakest).",
            "Spend only 3-4 days on abilities and perks, or you will not reach level 50 in 30 days.",
            "Most side-quest, collectable and exploration trophies fit here.",
        ],
    ),
    TrophyStage(
        id=3,
        title="Defeat the boyars and deal with Brencis",
        summary="At about level 35, drop the three boyars in a night or two to reach Infamy 9 and open the first ending.",
        points=[
            "Manual save before the meeting with Brencis.",
            "Going too far in Lacra's or Crake's questline closes this meeting.",
        ],
    ),
    TrophyStage(
        id=4,
        title="Reach the other endings",
        summary="Reload the pre-meeting save, drop the difficulty to Easy (Uphill Battle is already done) and collect the remaining endings.",
        points=[
            "The Folk Hero: refuse the deal and fight Brencis.",
            "The Patricide and The Knyazmaker: long questlines, many segments. Save before the last quest of each.",
            "A Hero They Deserve and Together Forever are escapes and do not free your family.",
        ],
    ),
    TrophyStage(
        id=5,
        title="Clean up",
        summary="Use the remaining days to level up and finish anything missing.",
    ),
]


# O guia não lista estes troféus nas etapas; o texto da etapa 3 manda derrubar os três boyars.
STAGE_FIX = {"The Right Fist of the Knyaz": 3, "The Mad Khan": 3, "The Dark Mistress": 3}


def _norm(text: str) -> str:
    return text.replace("’", "'").strip()


def parse_trophies(md: str, guide: str) -> list[Trophy]:
    names = [_norm(m["name"]) for m in ROW.finditer(md)]
    tags: dict[str, list[str]] = {n: [] for n in names}
    for tag in TAGS:
        match = re.search(rf"^\| {tag} \| (.+?) \|\s*$", guide, re.M)
        if not match:
            continue
        rest = _norm(match.group(1))
        while rest:
            name = max((n for n in names if rest.startswith(n)), key=len, default=None)
            if name is None:
                raise ValueError(f"tag {tag}: nome não reconhecido em '{rest[:40]}'")
            tags[name].append(tag)
            rest = rest[len(name) :].lstrip()

    stage_of: dict[str, int] = {}
    stage = 0
    for line in guide.splitlines():
        if line.startswith("| ![](https://img.psnprofiles.com/trophy/"):
            break
        if m := re.match(r"# Stage (\d+):", line):
            stage = int(m.group(1))
        elif stage and _norm(line) in tags:
            stage_of.setdefault(_norm(line), stage)

    trophies = []
    for m in ROW.finditer(md):
        name = _norm(m["name"])
        n = int(m["id"])
        trophies.append(
            Trophy(
                id=n,
                name=name,
                description=m["desc"].strip(),
                grade=m["grade"],
                icon=f"games/{GAME}/trophies/{n:02d}.png",
                url=m["url"],
                psn_rate=float(m["psn"]),
                psn_tier=m["psn_tier"],
                profiles_rate=float(m["pp"]),
                profiles_tier=m["pp_tier"],
                tags=tags[name],
                stage=stage_of.get(name, STAGE_FIX.get(name)),
                tip=TIPS.get(name),
            )
        )
    unknown = set(TIPS) - set(names)
    if unknown:
        raise ValueError(f"dicas para troféus inexistentes: {unknown}")
    return trophies


def download_icons(md: str) -> None:
    for m in ROW.finditer(md):
        fetch_file_if_missing(m["icon"], assets_dir(GAME) / "trophies" / f"{int(m['id']):02d}.png")


def build() -> TrophyDataset:
    md = (raw_dir(GAME) / PSN_TROPHIES_MD).read_text(encoding="utf-8")
    guide = (raw_dir(GAME) / PSN_GUIDE_MD).read_text(encoding="utf-8")
    download_icons(md)
    trophies = parse_trophies(md, guide)
    counts = {g: sum(t.grade == g for t in trophies) for g in POINTS}
    return TrophyDataset(
        difficulty="5/10",
        hours="about 40",
        points=sum(POINTS[t.grade] for t in trophies),
        counts=counts,
        stages=STAGES,
        trophies=trophies,
    )
