"""Texto de apoio escrito à mão. Fontes: Tips & Strategies do PSNProfiles (Kramers001), introdução do guia de
dicas da Steam 1565813913 e "How you're supposed to identify people" (1552463657)."""

from utils.games.return_of_the_obra_dinn.faces import FACES
from utils.games.return_of_the_obra_dinn.schemas import Face, GuideDataset, Sketch, Topic

BASICS = [
    Topic(title="The job", items=[
        "You are an inspector for the East India Company in 1807. The Obra Dinn left in 1803 and has just drifted back to England with "
        "no one aboard. You fill in the book with who each of the 60 souls was, how they died and, when there is one, who killed them.",
    ]),
    Topic(title="Memories", items=[
        "Each remnant (a corpse or what is left of one) lets you use the pocket watch to enter the victim's last moment.",
        "A memory starts on a black screen with the sound of the moment, sometimes with spoken lines shown as subtitles. After that you can walk around "
        "the frozen scene for as long as you like. About a minute in, the game moves on to the book and documents the victim.",
        "Most memories have more corpses in them. After closing the book the watch shakes: use it in the dark scene and the next corpse "
        "glows. Once outside, press the watch again and follow the white trail to the new remnant.",
        "Doors that a character opens in a memory are unlocked when you get back out. A keyhole with an I is open, an X is locked.",
        "If you cannot find the next remnant, flip through the chapter pages: some of them circle the place where an unfound one lies.",
    ]),
    Topic(title="The book", items=[
        "Contents and chapters: jump straight to a page. Each chapter page shows the victim, a transcript of the memory, the corpse's place on the deck plan "
        "and the people who were also in the scene.",
        "The ship: deck plans for the four decks, with the order of events of each chapter. Some areas are usually occupied by crew of a given role.",
        "The crew: the manifest with a number, role (called quality) and origin for each of the 60. Origin and role are what most deductions rest on.",
        "Life at sea: the sketches used for faces. Moving the magnifying glass over someone highlights the profile picture. "
        "The sketches themselves hide clues about who is who and who knows whom.",
        "Glossary: what each role does on a ship and what each part of the ship is. Read it, it matters for the deductions.",
    ]),
    Topic(title="Solving a fate", items=[
        "A fate can only be written once the victim is in the book. The picture on the upper left opens the fate card: pick the name, the cause of death "
        "and, if there is one, the killer. The \"?\" on the page explains how.",
        "Fates are confirmed in sets of three. A correct answer is not confirmed until two other fates are also correct, so the game never tells you "
        "that a single guess was right. After three, a cutscene ticks them off as black lines around the skull on the last page.",
        "A wrong answer costs nothing. You can change any unconfirmed fate at any time.",
        "A blurred face cannot be identified yet. It sharpens when you have seen enough memories to deduce the name, and up to three triangles "
        "above the face show how hard that is.",
        "To follow someone through the game, use the memory icon under their picture and choose Bookmark Memories. Tags then mark the pages where "
        "that person is present.",
    ]),
]

DEDUCTION = [
    Topic(title="What the triangles mean", items=[
        "One triangle: someone says it out loud. A name, an origin, a role or a relationship to another person.",
        "Two triangles: something you can see. Clothes, what they are doing or holding, where they sleep or stand. "
        "Accents and clothing also point to an origin.",
        "Three triangles: elimination. Keep them for last, when few candidates remain.",
        "Some triangles drop as you find more memories. Others never do. Do not stay too long in one memory; the next one may hold the missing clue.",
    ]),
    Topic(title="Where clues hide", items=[
        "Listen to every line. People are called by name, nickname, title or role, and some lines tell you where someone is from "
        "or who they are related to.",
        "Accents and languages are clues to origin. The manifest tells you how many people come from each country.",
        "Titles and uniforms show role: officers dress alike, stewards wear a uniform, midshipmen look young. "
        "Where someone stands compared to the deck plan also hints at their role.",
        "Hammocks, tools, pipes and tattoos are visible in the scenes and tie a face to a belonging.",
        "Shared surnames suggest family, and \"Miss\" means unmarried.",
        "Hold the zoom on anyone in a memory to see their profile in the sketches, even if they are not a victim.",
    ]),
    Topic(title="Working it out", items=[
        "Start with the unique ones: the only person with a given role, name, origin or accent. They sharpen the rest.",
        "Look for small groups with a shared origin: identify the easy ones first and the last one is whoever is left.",
        "If you are down to two or three candidates, write one down. It is safe, and the game confirms it later if you are right.",
        "Not every clue is decisive, and some deductions need educated guesswork. Fill in what you are sure of first.",
    ]),
]

CAUSES = [
    Topic(title="Cause of death", items=[
        "The cause is usually the easy part, since the memory shows the moment of death.",
        "The hard ones are the Disappearances sections found in some chapters: those people have no corpse and no memory, so the game accepts "
        "several causes.",
        "When a death is ambiguous, the game accepts more than one answer. A decapitation with a sword, for instance, can be entered as "
        "Decapitated or as Killed with a sword.",
        "Some options in the cause lists are only there to fill the pages.",
    ]),
    Topic(title="Spiked or speared", items=[
        "If the weapon is long, single and thrown, it is a spear. If it is short, in a group and used close up, it is a spike.",
        "The game usually accepts either answer. Choosing Spiked fills in \"by a beast\" for you; Speared makes you choose the beast.",
    ]),
    Topic(title="The killer", items=[
        "Most fates have someone responsible, and you identify that person like any victim. Some have none.",
        "The killer is not always a person: sometimes it is a beast, and sometimes it is the victim themselves.",
    ]),
]


def build(sketch: tuple[str, int, int]) -> GuideDataset:
    src, width, height = sketch
    return GuideDataset(
        basics=BASICS, deduction=DEDUCTION, causes=CAUSES,
        sketch=Sketch(
            src=src, width=width, height=height, credit="Return of the Obra Dinn (Lucas Pope / 3909 LLC)",
            alt='The three sketches of the book: "Under Way", "Formosan Royalty" and "Justice at Sea".',
            faces=[Face(crew_id=cid, x=x, y=y, w=w, h=h) for cid, (x, y, w, h) in FACES.items()],
        ),
    )
