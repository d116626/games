"""Interações escondidas: resumo à mão do post de coleta no r/mewgenics (uma única fonte, escrita por jogador).
Só levam `status` as dicas que o próprio post marca como confirmada nos comentários ou como falsa; `note` cruza com o guia do Greenside."""

from utils.games.mewgenics.schemas import HiddenDataset, HiddenGroup, HiddenTip

T = HiddenTip

INTRO = (
    "Collected by players in one r/mewgenics thread, so treat each line as one player's observation rather than a documented rule. "
    "Only the entries tagged Confirmed or Disputed were checked in the thread's comments. Notes compare them with the Greenside guide where it covers the same ground."
)

GROUPS = [
    HiddenGroup(
        id="terrain",
        title="Fire, water, wind and the map",
        tips=[
            T(id="food-fire", title="Cooked food", text="Food lying on the ground can be cooked by fire, which adds more healing and +1 melee damage."),
            T(
                id="wet-lightning",
                title="Wet conducts lightning",
                text="Wet units pass lightning on to adjacent units, your own cats included. Water tiles make lightning travel too.",
                status="confirmed",
                note="The thread's author first doubted the water tile part and the comments confirmed it.",
            ),
            T(id="grass-water", title="Water grows grass", text="Grass tiles grow when hit with a water effect, so 'Spit' can be used to create tall grass."),
            T(
                id="wind-fire",
                title="Wind feeds fire",
                text="Wind intensifies fire, so be careful about scorching the earth with the wind map effect. The Boneyard can roll wind as a map event, which the author says can wreck one of its fights (presumably the Dybbuk, its boss).",
                note="Greenside: at the end of the round wind knocks every cat back in a random direction, and bear traps move with it.",
            ),
            T(id="melee-coins", title="Melee picks up coins", text="Melee attacks can grab things like coins from adjacent tiles."),
        ],
    ),
    HiddenGroup(
        id="facing",
        title="Facing",
        tips=[
            T(
                id="face-ground",
                title="Free facing",
                text="After you have used all your moves, click the ground to turn your cat in any direction. That denies enemies a backstab.",
                status="confirmed",
                note="The comments confirmed you do not need an ability or item to force the turn. Greenside's combat section agrees: changing facing costs 0 action points.",
            ),
        ],
    ),
    HiddenGroup(
        id="collarless",
        title="Collarless cats",
        tips=[
            T(
                id="collarless-wildcard",
                title="Collarless wildcards",
                text="Collarless cats are strong wildcards, and their blank skills include some very good debuffs. The one drawback is that they get no stat buffs. Do not pick a class at the start of a run if you want a cat to stay collarless.",
            ),
            T(
                id="collarless-skills",
                title="Collarless gaining class skills",
                text="The claim that collarless cats can gain skills of other classes on level up.",
                status="disputed",
                note="The author later edited the post to say this looks false. Greenside's level-up list offers one collarless spell or passive alongside the class ones, and other classes only via multiclass sources such as mutations, soul passives and the Chaos Device.",
            ),
        ],
    ),
    HiddenGroup(
        id="solo",
        title="Solo runs and the Dybbuk",
        tips=[
            T(id="solo-fighter", title="Solo Fighter", text="Solo runs as Fighter barely work. Send the cat off with really good items."),
            T(id="dybbuk-skip", title="Dybbuk vs one cat", text="The Dybbuk skips his possession if you only have one cat, dropping out of it immediately."),
            T(
                id="dybbuk-solo",
                title="Solo against the Dybbuk",
                text="The Dybbuk is miserable solo: you need anything that applies damage over time to him, and the mana drain hurts a lot in a 1v1. The author only sees a familiar-focused build as an alternative.",
                note="Greenside: he avoids every attack unless he cannot move, and damage over time is one of the answers.",
            ),
            T(id="dybbuk-charm", title="Charmed enemies and possession", text="If you convert enemies and then the Dybbuk possesses one of your cats, you still lose the fight when the converted enemies are the only ones left alive."),
        ],
    ),
    HiddenGroup(
        id="charm-familiars",
        title="Charm, familiars and summons",
        tips=[
            T(
                id="charm-no-target",
                title="Charmed enemies with no target",
                text="A charmed enemy that cannot find anything to attack will attack your cats. This is worst with the Ranger's charming shot, because it gives that enemy an extra turn.",
                note="Greenside: charm takes over the unit's AI and it focuses on your enemies over you, but charm does not stop it from attacking you.",
            ),
            T(id="druid-crow", title="Druid's crow", text="Do not underestimate the Druid: the crow is basically a fifth cat."),
            T(
                id="druid-song",
                title="Druid song inherits basic attack boosts",
                text="Damage ups increase the healing of the basic Druid song. Any effect that enhances basic attacks is inherited by the song and by the Druid's crow. Be careful with anything that makes basic attacks apply soul link.",
            ),
            T(id="familiar-control", title="Who controls summons", text="Druid summons and familiars are controllable, Hunter summons are not."),
            T(id="cratermaker", title="Cratermaker", text="The Cratermaker is horrible for builds with non-controllable familiars. Kill its trash summons if you can."),
            T(id="mini-me", title="Mini-Me with Thornshot", text="A Mini-Me with Thornshot will shoot bosses for damage on its own, which the author counts as a downside of that passive."),
            T(id="alley-egg", title="Alley egg event", text="The Alleys can roll the Act 2 alien egg event, and the tank mini-boss there treats hostile familiars as her kittens."),
        ],
    ),
    HiddenGroup(
        id="progress",
        title="Furniture and Dr. Beanies",
        tips=[
            T(id="furniture-hard", title="Furniture on hard paths", text="Hard paths give more furniture the further in you are. Act 1 gives only normal furniture and Act 2 can give rare furniture boxes."),
            T(
                id="beanies-infinite",
                title="Dr. Beanies takes unlimited cats",
                text="Dr. Beanies takes an unlimited number of mutated cats from you, which suggests his devices can be obtained more than once instead of just being unlocked for later runs.",
                note="The Soul Jar guide in Advanced techniques describes the Storage Locker as repeatable, which fits.",
            ),
        ],
    ),
]


def build() -> HiddenDataset:
    return HiddenDataset(intro=INTRO, groups=GROUPS)
