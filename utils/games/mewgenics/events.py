"""Eventos: resumo à mão das seções 'Events!' (partes 1 e 2) do guia do Greenside (só uma fonte).
As capturas seguem a entrada, com uma exceção conferida à vista: a da entrada do Steven mostra o Fetus."""

from utils.common.paths import assets_dir, raw_dir
from utils.games.mewgenics.biome_images import IMG, SOURCE, shrink
from utils.games.mewgenics.constants import GAME
from utils.games.mewgenics.schemas import EventDataset, EventGroup, GameEvent, Tragedy

E = GameEvent

# evento -> índice da imagem na seção Events! (a de índice 8 vem no Steven, mas mostra o Fetus)
SHOTS = {
    "pity-cat": 0, "weather": 1, "poop": 2, "mouse-trap": 3, "cat-orgy": 4, "cat-bed": 5, "mysterious-machine": 6,
    "watching-head": 7, "fetus": 8, "butch": 9, "beggar": 10,
}
TRAGEDY_SHOT = 11

INTRO = "Every '?' on the map is an event, either generic or tied to your current biome."
OUTCOMES = ["Success", "Critical success", "Failure", "Critical failure (usually with dramatic music)"]
RULES = [
    "Every choice has at most 4 hardcoded outcomes: the four above.",
    "Int and Dex successes tend to reward items. Strength and Constitution successes tend to reward food and buffs for the next fight. Both can give stat ups on success, and disorders or stat downs on failure.",
    "Your Luck stat: higher means better outcomes.",
    "The difficulty mode: you take a penalty for each level above normal.",
    "The min-max bonus only applies to options that test a stat. Picking the cat's overall highest stat gives a luck bonus, picking its lowest gives a penalty.",
    "Failures are not inherently bad and sometimes reward you. Quest items like the Magic Mirror can force events to fail.",
]

GENERIC = [
    E(id="pity-cat", name="Pity Cat", text="If a party member died permanently, the game offers a pity cat with a neverstone. It can only happen once per adventure, so intentionally killing unwanted cats at the start is a way to farm neverstones."),
    E(id="weather", name="Weather", text="Events can impose random weather, shown at the top right of the map (hover for the effect). The Act 3 Antenna quest item makes every event a weather event. You can get snow in the desert, and it does not cancel Heat Wave."),
    E(id="cat-shaped-hole", name="Cat Shaped Hole", text="A Junji Ito reference and one of the few events that can kill your cat, but a critical success rewards a massive number of mutations.", flag="Can kill a cat", tone="bad"),
    E(id="human-skin", name="Human Skin", text="Success can reward mutations. Failure gives disorders, stat downs or debuffs for the next fight."),
    E(id="large-mushroom", name="Large Mushroom", text="Eating affects Int, looting can give a mushroom item, examining can give an item. Failing any of them can award a disorder."),
    E(id="poop", name="Poop", text="Comes in 3 sizes. Destroying it gives coins, eating can award the Scatological disorder, examining can give items. Failing any option inflicts a disorder, and eating is the most likely way to get one."),
    E(id="fetus", name="Fetus", text="Eating can award heals and stat ups. Charming awards temporary familiars."),
    E(id="mysterious-stain", name="Mysterious Stain", text="Licking can award stat ups and mutations. Failing gives stat downs and disorders."),
    E(id="mouse-trap", name="Mouse Trap", text="Examining can give rewards. Sneaking by gives no rewards and has the same penalties as examining."),
    E(id="cat-orgy", name="Cat Orgy", text="Sneaking by gives no rewards but has the lightest penalties. Fighting can give coins and loot, but failing gives injuries and disorders. Joining in can give a new collarless cat, but failing can give Cat AIDS (FIV)."),
    E(id="cat-bed", name="Cat Bed", text="A rare, luck-based event with no crippling downside (only extra enemy fleas).", flag="Always sleep", tone="good"),
    E(id="maggot-pile", name="Maggot Pile", text="Bashing and examining give the same rewards, and charming can give extra familiars. Every option inflicts parasites on failure, and Malaria is the worst because it effectively kills the cat."),
    E(id="mysterious-machine", name="Mysterious Machine", text="Failing the first check stuns you. Print duplicates items, and Copy can duplicate one of your cats. Scaling inflicts dwarfism or gigantism, so be careful with it.", flag="Duplicates items"),
    E(id="strange-door", name="Strange Door", text="Succeeding takes you to a shop, but it sells no rare candies. Unless you need an item from the current biome to finish a set, skip it."),
    E(id="cat-pelts", name="Cat Pelts", text="Rewards and penalties are the same for every option, so pick the best stat."),
    E(id="watching-head", name="Watching Head", text="Failure can inflict birth defects on your cat.", flag="Most dangerous", tone="bad"),
    E(id="smelly-bag", name="Smelly Bag", text="All options give the same rewards. Destroying is the safest, then looting, then examining."),
    E(id="steven", name="Steven", text="A circular event: going around Steven puts him in front of you again. Failing can give cats Steven's Deja Vu penalty, and succeeding can reward mutations."),
]

LIMITED = [
    E(id="monkeys-paw", name="Monkey's Paw", text="Examining the paw can let you make a wish. After 4 wishes the event disappears forever. The guide recommends wishing for Good Genes: the smallest downside and a lot of mutations.", flag="Wish: Good Genes", tone="good"),
    E(id="tape-recorder", name="Tape Recorder", text="Appears after clearing the Boneyard a few times. Listening can award permanent stat ups or rare items. Bashing has the same penalties and risks destroying the event forever.", flag="Never bash", tone="bad"),
]

NPC = [
    E(id="butch", name="Butch", text="Rewards items based on your answer. Scabs often gives a Callous, cuts give a glass or razor blade item."),
    E(id="tink", name="Tink", text="A permanent bonus to Intelligence or Charisma, one of the best generic events.", flag="One of the best", tone="good"),
    E(id="jack-tracy", name="Jack and Tracy", text="They ask for money, and the more you give the better the items. Always give 25 coins if you can. Jack tracks what you give him across adventures.", flag="Give 25 coins", tone="good"),
    E(id="beggar", name="Beggar", text="Like Jack or Tracy but with worse odds, a reference to the beggars from Isaac."),
    E(id="beanies", name="Beanies", text="Fairly good rewards and manageable punishments. The result is purely luck and your answer does not change it."),
    E(id="organ-grinder", name="Organ Grinder", text="Offers Itchies (a cursed item) and Wheezies (a disorder). You can leave with no immediate punishment, but that cat will get a tragedy event in the future."),
]

GROUPS = [
    EventGroup(id="generic", title="Generic events", events=GENERIC),
    EventGroup(id="limited", title="Limited events", intro="These can be lost forever.", events=LIMITED),
    EventGroup(id="npc", title="NPC events", intro="Tied to the merchants and NPCs. They count as generic events.", events=NPC),
]

TRAGEDY = Tragedy(
    text="Tragedy events come from your answers to other events, and each event has its own tragedy counter that sets how many you meet. A tragedy gives a debuff for your next fight (shown on its map icon) or 1 random injury.",
    harmless=[
        "Your cat recalls fond memories of being cared for by its mother.",
        "Your cat remembers a time when things were easier.",
        "Your cat feels like an outcast of the group.",
        "Your cat feels existential dread.",
    ],
)


def build() -> EventDataset:
    md = (raw_dir(GAME) / SOURCE).read_text(encoding="utf-8")
    urls = IMG.findall(md.split("## Events! (Part 1)")[1].split("## Debuffs and How")[0])
    for e in (e for g in GROUPS for e in g.events):
        if (i := SHOTS.get(e.id)) is not None:
            e.image = shrink(urls[i], assets_dir(GAME) / "events" / f"{e.id}.jpg")
    TRAGEDY.image = shrink(urls[TRAGEDY_SHOT], assets_dir(GAME) / "events" / "tragedy.jpg")
    return EventDataset(intro=INTRO, outcomes=OUTCOMES, rules=RULES, groups=GROUPS, tragedy=TRAGEDY)
