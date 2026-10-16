"""Técnicas avançadas da comunidade, resumidas à mão de três guias do Steam (uma fonte por técnica):
- 3691376136: Soul Jar, Joker Card, clonagem e mutações;
- 3704171609: duplicação de itens de quest com clones de espelho;
- 3667334759: a quest "Free Win" (Angry Face + The Loner).
As imagens são cartas de itens e telas desses guias, reduzidas com Pillow; `pic` as busca pelo índice na fonte."""

from utils.common.paths import assets_dir
from utils.games.mewgenics.biome_images import shrink, size, source_urls
from utils.games.mewgenics.constants import GAME
from utils.games.mewgenics.schemas import AdvancedDataset, Pic, TechStep, Technique

URLS = {
    "soul": source_urls("steam-3691376136"),
    "mirror": source_urls("steam-3704171609"),
    "free": source_urls("steam-3667334759"),
}


def pic(src: str, index: int, name: str, caption: str) -> Pic:
    rel = shrink(URLS[src][index], assets_dir(GAME) / "advanced" / f"{name}.jpg")
    w, h = size(rel)
    return Pic(src=rel, caption=caption, width=w, height=h)


INTRO = (
    "Community techniques for farming rare items, duplicating items and cloning cats. Each one comes from a single "
    "Steam guide, so treat them as one player's method, not a tested rule. Parts the author did not test are marked. "
    "Some lean on save-scumming or on bugs the game may patch. None of this is needed to finish the game."
)

TECHNIQUES = [
    Technique(
        id="soul-jar",
        title="Farm rare items and get a Soul Jar",
        summary="Three runs that leave you with a Soul Jar, a trinket that repairs everything including itself, and a loadout that rerolls rare and very rare item offers.",
        needs=[
            "3 Neverstones. Farm them in the Alley: kill your own cats on purpose and destroy their bodies, then the stray-cat event gives a cat with another Neverstone (once per run).",
            "Clown Makeup.",
            "Chaos Controller: the reward of the Chaos Device side quest, which you can repeat forever.",
            "Storage Locker: obtained by giving 5 mutated cats to Dr. Beanies, also repeatable.",
            "If any of them is Worn, bring a cat with the Repair ability on the first run.",
        ],
        items=[
            pic("soul", 8, "jester-clown-chaos", "A Jester with Clown Makeup and Chaos Controller: 10 rerolls."),
            pic("soul", 4, "storage-locker", "Storage Locker: your team's active ability level-ups offer rare items instead."),
            pic("soul", 6, "soul-jar", "Soul Jar: when your body is destroyed, it is recovered and permanently gains the ability to summon a ghost copy of you."),
            pic("soul", 3, "beanies-chaos", "Dr. Beanies' Chaos Device quest and its reward, the Chaos Controller."),
        ],
        steps=[
            TechStep(
                title="Run 1: find the Soul Jar",
                text="Put Clown Makeup and Chaos Controller on the same cat, preferably a Jester for 1 extra reroll, and the Storage Locker on any cat. That is 10 rerolls (9 without the Jester) to look through rare and very rare items for the Soul Jar. Put a Neverstone on 3 cats so you choose who levels: get every cat to level 2, then one cat (preferably the Jester) to level 5 in the Alley. That gives 5 items in the Alley, 47 rerolls in total; going further is not worth it for 3 more items. When you find the Soul Jar, go home.",
            ),
            TechStep(
                title="Run 2: trap a Repair cat in the Soul Jar",
                text="Bring a cat born with the Repair ability and give it reroll items to search for passives and abilities. The other 3 cats carry Neverstones (repair them) so only the Repair cat levels. Give them strong armor and weapons to hand to the Repair cat when you jar it, because that gear affects the cat in the jar. Get Repair+, and Hone+ is good too. Paper Bag armor sets mana to your highest stat, which matters because a jarred cat cannot regenerate mana. Reach level 7 in the Alley and put its soul in the jar at the boss, or go further for a maxed cat.",
            ),
            TechStep(
                title="Run 3 and on: farm forever",
                text="You now have 7 items. Bring the Soul Jar on every run with Storage Locker, Chaos Device, Clown Makeup and 3 Neverstones: it repairs all of them and stops them from being Worn, itself included.",
            ),
        ],
        tips=[
            "Jar cats during house boss battles: you can resummon house bosses, and then use the Repair cat for that fight.",
            "A Run 2 loadout with 4 rerolls only finds passives and abilities of one class (5 with Copy Cat Mask instead of Paper Bag). Or use Clown Makeup, Chaos Device and a D6 for about 12 rerolls, with a Jester Repair cat.",
            "The Box helps find items that are specific to a chapter. The Storage Locker cannot find items that only come as a combat or event reward from a given chapter, such as the Rune of Jera head armor from the Act 3 Ice Age.",
        ],
    ),
    Technique(
        id="joker-dupe",
        title="Duplicate items with the Joker Card",
        summary="The Joker Card duplicates one of your equipped items each round of battle, so you can duplicate what you farmed and stop farming it.",
        items=[
            pic("soul", 18, "joker-card", "Joker Card, Cap and Bells and Careful+. The guide notes that Careful+ makes the Joker Card infinite."),
            pic("soul", 19, "irradiated-object", "Irradiated Object: mimics a random passive trinket."),
            pic("soul", 20, "money-bags", "A backpack full of duplicated Money Bags."),
        ],
        steps=[
            TechStep(
                title="What it cannot copy",
                text="Joker Card cannot duplicate trinkets, such as the Soul Jar and the Cat Rib. The other guide below adds that it cannot be used on quest items either.",
            ),
            TechStep(
                title="Duplicating trinkets anyway",
                text="The Irradiated Object, a rare mimic item, is the reward for the hard path in The End (Act 3), so you can farm it every run. Its effect is different each time. Keep farming until it mimics the Cat Rib trinket, then duplicate it forever without the Storage Locker.",
            ),
            TechStep(
                title="Money",
                text="The Joker Card also duplicates money bags for a lot of coins.",
            ),
        ],
    ),
    Technique(
        id="cloning",
        title="Duper cat: clone cats and duplicate items",
        summary="Breed a cat with Careful+ and Repair+, then die with a Cat Rib to leave clones of it. The best Duper cat adds Enchanted Relic+ for even more clones.",
        needs=[
            "A Soul Jar with a Repair cat inside (it repairs the reroll items and Neverstones).",
            "Reroll items: Cap and Bells (hat), Furry Dice, Copy Cat Mask and a D6, for 5 rerolls.",
            "2 helper cats with a Neverstone each (repair them), plus Cat Rib (trinket) and Cap and Bells for the final run.",
        ],
        items=[
            pic("soul", 21, "careful-plus", "Careful+ on a collarless cat."),
            pic("soul", 22, "repair-plus", "Repair+ on a Tinkerer."),
            pic("soul", 27, "clone-maxing", "Clone maxing: 8 clones in total."),
            pic("soul", 29, "five-rerolls", "Cap and Bells, Copycat Mask, Copycat Scarf and D6: 5 rerolls."),
        ],
        steps=[
            TechStep(
                title="Step 1: find the Careful passive",
                text="Cat 1 is collarless and searches for Careful with the reroll items. Cat 2 is the Soul Jar cat with Repair. Cats 3 and 4 hold Neverstones. Use the Soul Jar to repair everything, then down Cat 2 in the first combat so it does not level up. Put the Soul Jar in your inventory and kill Cat 2 in combat 2, since it would steal XP. If you lack the 20 Charisma to repair everyone's gear in combat 1, finish in combat 2 and kill Cat 2 in combat 3. Reach level 7 or 9 to search passives (level 9 means beating the Sewers or Junkyard), then go home.",
            ),
            TechStep(
                title="Step 2: find Repair",
                text="Repeat step 1 with Cat 1 as a Tinkerer, looking for Repair. Reach level 5 or 9 to search abilities.",
            ),
            TechStep(
                title="Step 3: breed and clone",
                text="At home, breed the Repair cat with the Careful cat so the kitten inherits both. Start a new run with the kitten and bring 3 Neverstones for 3 helper cats (repair them). Equip the kitten with Cat Rib and Cap and Bells, reach level 7 (buy a rare candy if needed) so Careful and Repair can be upgraded to Careful+ and Repair+, then die on the boss. You get 3 clones of that cat, all with Careful+ and Repair+.",
            ),
            TechStep(
                title="Clone maxing",
                text="Add Copy Cat Mask (face) and Copy Cat Scarf (neck) to Cap and Bells for 5 clones. Enchanted Relic+ as a second passive adds 3 more, for 8. That needs the Duper cat to be a Cleric at level 9 to upgrade both passives. Put the reroll items on a helper, swap gear with the Duper cat and search for Enchanted Relic.",
            ),
            TechStep(
                title="Step 4: keep going",
                text="Duplicate items right in the run with the Joker Card and Cap and Bells, with no Soul Jar needed. On your last Careful+/Repair+ clone, do a run with Cat Rib, Cap and Bells, Copy Cat Mask and Copy Cat Scarf, and kill it in any combat while wearing them. That makes more clones forever. Duplicate this equipment so you never need the Storage Locker again.",
            ),
        ],
        tips=[
            "Cat Rib: when your body is destroyed, you are reborn as a kitten. That is the clone engine.",
            "To find the Goofball and Super Luck passives, take the Run 1 loadout from the Soul Jar section plus Furry Dice (or the Copycat Scarf) and a D6: 12 rerolls in total.",
            "Put Neverstones on the other cats so the one you are rerolling gets the levels, and find passives and abilities faster.",
        ],
        caveats=["The guide credits Meatball64 for the cloning and Irradiated Object Cat Rib ideas."],
    ),
    Technique(
        id="mutation-farm",
        title="Farm mutations",
        summary="A Radioactive set bonus plus Cancer gives a lot of mutations on one cat. When you roll a good one, take the set off and use the Cat Rib to fix Charisma so the cat can breed.",
        needs=[
            "From the Storage Locker: Uranium Rod (weapon), Cancer (trinket), The Box (trinket) and Cat Rib (trinket).",
            "Radioactive Hat and Radioactive Mask, from an Act 2 run to the Bunker with The Box equipped. Only 2 Radioactive items complete the set because the Uranium Rod counts too. The Necklace also exists.",
            "A Soul Jar with a Repair cat inside.",
        ],
        items=[
            pic("soul", 32, "uranium-rod", "Uranium Rod."),
            pic("soul", 33, "cancer", "Cancer."),
            pic("soul", 34, "the-box", "The Box."),
            pic("soul", 35, "cat-rib", "Cat Rib."),
            pic("soul", 36, "radioactive-hat", "Radioactive Hat."),
            pic("soul", 37, "radioactive-necklace", "Radioactive Necklace."),
            pic("soul", 38, "radioactive-mask", "Radioactive Mask."),
        ],
        steps=[
            TechStep(
                title="Run it",
                text="Bring the Radioactive Hat, Radioactive Mask, Uranium Rod, Cancer, Cat Rib and the Soul Jar with a Repair cat. Farm mutations on one cat.",
            ),
            TechStep(
                title="Lock in a good mutation",
                text="When you find one you want, such as the extra-turn head mutation, unequip the Radioactive set so you do not reroll it by accident. Then use the Cat Rib to fix Charisma: cats will not mate with a cat with 0 or negative Charisma. Take the Radioactive set off before the Cat Rib resets stats so it does not break. The mutations are kept.",
            ),
        ],
        tips=["With the Bare Minimum passive you do not need the Cat Rib, and if you have the Cancer disorder it just means more mutations."],
    ),
    Technique(
        id="op-soul-jar",
        title="Strong Soul Jar cats",
        summary="A loadout for a jarred cat with high stats. The guide only links a video by RisenHowl for this.",
        needs=[
            "Head: Death Shroud. Face: Clown Makeup.",
            "Neck: Steven (while you are downed, any damage heals you), or a Bulletproof Vest if you have a second cat that can revive easily.",
        ],
        tips=[
            "To kill the cat wearing the Death Shroud and Steven necklace, use Soy Milk with Copycat items and the Cap and Bells hat to give the downed cat stats easily.",
            "Killing it with a Thief gives a chance at the multi-hit attack passive.",
        ],
    ),
    Technique(
        id="quest-duplication",
        title="Duplicate quest items with a mirror clone",
        summary="Critically fail the Alley's Closed Window event (or the general Strange Mirror event) to queue a clone of your cat in the next fight, then recruit it. You come home with the clone and one more of every item it carried.",
        needs=[
            "Repair (on a Soul Jar, a Glowing Bone, inherited, or a rerolled Tinkerer).",
            "A way to capture the clone: Friendship Bracelet, Persuasion Device or Eternal Servitude.",
            "The Broken Mirror trinket to duplicate non-trinkets such as Ultra Vision 3000, and/or the Broken Mirror head item for Unidentified Pills and other trinkets. With the head mirror, add as many head-slot doublers as you can (Stunning Chain, Clown Makeup, armor specialist).",
            "Recommended: one Ultra Vision 3000, as low an Intelligence as possible, and Cap and Bells if using the trinket mirror.",
            "Do NOT bring a cat with Super Luck.",
        ],
        steps=[
            TechStep(
                title="Run to the Alley and wait for the event",
                text="Start an Alley run on any difficulty (the author used Impossible for harder events and more food). Repair everything that is Worn, quest items first. Play until you get the Window or Mirror event. If you reach the end of the Alley without one, go home and try again tomorrow. The Window shows up more often than the Mirror.",
                images=[pic("mirror", 2, "closed-window", "The Closed Window event in the Alley.")],
            ),
            TechStep(
                title="With Ultra Vision 3000: save-scum once",
                text="Ultra Vision 3000 makes the event more likely but takes more care. Remember your choices in that event space, because save-quitting repeats all its events and different outcomes can change the next ones. If the cat that got the event took part in an earlier event on that space, ignore it. Otherwise save-quit and change your gear. Steven punishes save-scumming, but the first one carries no punishment. You can do it two more times, but the author saves them for later event spaces. Without Ultra Vision the event is rarer, but you can save-quit freely without doing anything, and you can skip this step.",
            ),
            TechStep(
                title="Stack negative Luck",
                text="Lower Luck as much as you can for the item you want to duplicate. For trinkets and Unidentified Pills: Broken Mirror (hat), Clown Makeup and a Stunning Chain. For other items: Cap and Bells and the Broken Mirror trinket (if you duplicate a hat, the mirror alone is enough). Then take the same options as before.",
                images=[
                    pic("mirror", 3, "gear-trinkets", "Gear for trinkets and Unidentified Pills."),
                    pic("mirror", 4, "gear-others", "Gear for other items."),
                ],
            ),
            TechStep(
                title="Hope for a critical failure",
                text="It is not guaranteed. A plain failure gives a random mental disorder on the Window, or 1 Fear on the Mirror, and you cannot change it without adding more negative Luck.",
                images=[
                    pic("mirror", 5, "failure", "Failure: -25 Luck is roughly a 50% chance of a critical failure."),
                    pic("mirror", 6, "critical-failure", "Critical failure: at -291 Luck it is almost certain."),
                ],
            ),
            TechStep(
                title="Recruit the clone",
                text="Take the mirrors off and give your most mobile cat the Friendship Bracelet. In the next fight, use the Friendship Bracelet, Persuasion Device or Eternal Servitude on the clone (Chains of Guilt is harder). Check the field first so you can save-scum if the clone could wipe your squad. Eternal Servitude needs you to down the target without destroying its body. In that fight the clone has 1 Corpse HP and can be gibbed by excess damage. Then win the fight as normal.",
            ),
            TechStep(
                title="Collect",
                text="With fewer than 4 cats the clone joins the party. With 4 you can extract the duplicated items after the run, and you can confirm it worked in the next fight if you control the clone. Repairing the clone is the safe option. Back home you have the clone and one more of the duplicated item.",
                images=[
                    pic("mirror", 9, "clone-joined", "The clone joined the party and is controllable: an extra Ultra Vision 3000."),
                    pic("mirror", 10, "mitosis", "Mitosis: one more of the duplicated item at home."),
                ],
            ),
        ],
        tips=[
            "Substitutes for the Broken Mirror trinket: the Curse Removal Tail mutation or a prevalent Blessing of Glorg disorder with a sufficiently negative Glowing Meteorite, or a Black Candle at the cost of your head slot. An Irradiated Object with -99 Luck beats the head mirror, and the trinket mirror if you are not using Cap and Bells or a similar modifier.",
            "You can complete a side quest up to four times by bringing several copies: Dr. Beanies acknowledges every completion.",
            "If you finish a quest with a clone while another copy sits in your inventory, the copy stays. That also allows more than 5 unique quest items, because the finished one no longer counts toward Beanies' limit.",
            "Useful for little: more Ultra Vision 3000s when hunting events, and Unidentified Pills for challenge runs.",
        ],
        caveats=[
            "Only mirror clones count as real cats that come home. It does not work with Good Cats, Mini Me or a Printer critical success copy.",
            "Untested by the author: completing a quest that is not active, and duplicating main quest items. The Scalding Orb had its own duplication bug and its copies reportedly vanished, and the Receiver Antenna cannot be duplicated because it turns all events into weather.",
            "It leans on save-scumming, which Steven punishes. To avoid Steven entirely, skip Ultra Vision 3000: Steven does not trigger if you save and quit without taking an action.",
        ],
    ),
    Technique(
        id="free-win",
        title='The "Free Win" quest: Angry Face and The Loner',
        summary="Angry Face turns one of your cats into an enemy. Give that cat The Loner, which kills its allies at the start of each battle, and it shoots the enemy team instead of yours.",
        items=[
            pic("free", 0, "angry-face", "Angry Face: the equipped cat is an enemy, must be downed to win the battle, can still level up, cannot be a collarless cat, and is cursed. On the guide's save it goes to the Boneyard."),
            pic("free", 1, "the-loner", "The Loner: kill all of your allies at the start of each battle. On the guide's save it goes to the Caves."),
            pic("free", 3, "persuasion-device", "Persuasion Device: permanently charm a non-boss enemy, once per battle. It can break when you return home."),
            pic("free", 4, "mystical-blindfold", "Mystical Blindfold: your physical attacks and abilities always miss."),
            pic("free", 5, "peace-symbol", "Peace Symbol Face Paint: damage you deal to allies is reduced to 0."),
            pic("free", 2, "loner-result", "The Loner's result in the guide: -999 on the enemy units."),
        ],
        steps=[
            TechStep(
                title="The build",
                text="Angry Face is one of the hardest quest items alone: you lose a unit and the enemy uses that cat against you in every fight. The upside is you can equip items on the enemy team. Put The Loner on the Angry Face cat and every enemy is shot at the start of the fight. The guide says this trivializes both quests, and any other quest item you bring.",
            ),
            TechStep(
                title="Where it falls short",
                text="Insta-kill damage is capped at 25 against bosses and mini-bosses, and the Angry Face cat shoots each target once. A 2x2 boss counts as 4 targets, so it takes 4 shots, 100 damage in total. Enemies that must be killed several times and enemies with dodge are blind spots, because the bullets can miss.",
            ),
            TechStep(
                title="Keep the Angry Face cat weak",
                text="You still have to down it to win, and it can shoot you too (not an insta-kill, but strong). Use a low-HP cat. A Druid works well: -2 Constitution and a non-damaging main attack. Its bird spawns as an enemy but is shot with the rest. Cancer (+1 random mutation and -3 random stats after each battle) is also recommended for this cat: the stat drops make it less threatening and you can breed the mutations on afterwards.",
            ),
        ],
        tips=[
            "Quest destinations for Dr. Beanies' inventions are randomized, so Angry Face and The Loner will likely go to different places. Do them one after the other and do not talk to Dr. Beanies between runs, since he removes the quest items when you complete one.",
            "Persuasion Device: you keep it after the quest. Use it to charm your Angry Face cat back onto your team on the first mission and play a normal game minus the missing face slot.",
            "Mystical Blindfold on The Loner makes all its shots miss. Equip both on a magic user and deploy 4 cats as normal, if you can find that rare item.",
            "Peace Symbol Face Paint does NOT work on The Loner. The guide's guess is that instant kills do not count as damage.",
        ],
        caveats=["The guide is unsure whether completed quest items can still be redeemed if the item breaks over several runs."],
    ),
]


def build() -> AdvancedDataset:
    return AdvancedDataset(intro=INTRO, techniques=TECHNIQUES)
