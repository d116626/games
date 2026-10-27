"""Como identificar cada tripulante pela dedução. Escrito a partir de "How you're supposed to identify people"
(guia da Steam 1552463657) e conferido com as dicas do PSNProfiles; as ligações com memórias de outros capítulos
estão dentro de cada texto. Chave: id do tripulante (slug do nome)."""

HOW: dict[str, str] = {
    "robert-witterel": "Someone calls to him as \"Captain!\" in the first memory, and there is only one captain on the manifest.",
    "william-hoscut": "In the captain's last memory he speaks of killing his wife's brother. The wife's middle name is her maiden name, "
    "and only one man on the manifest has that surname.",
    "edward-nichols": "Called by name in Pasqua's murder memory, and again by someone in the rowboats.",
    "martin-perrott": "In Abigail's death memory she calls out to \"Martin\". The only Martin on the manifest is the third mate, "
    "and the officer standing nearby is dressed like the captain and first mate.",
    "john-davies": "In the memory where Nichols rows back and is shot, a man watches from a window. Line it up with the deck plan: "
    "it is the fourth mate's cabin. He is also the only mate left, and dressed like one.",
    "alfred-klestil": "The one-armed man says \"Verdammt\" and asks for \"my Frenchman\". Only two crew are from a German-speaking country, "
    "and one of them has a French mate: the bosun's mate. So he is the bosun.",
    "charles-miner": "The bosun's mate: he oversees the crew when the bosun is away and stays close to him. His striped shirt is French "
    "navy style and he never speaks, so there is no accent to go by.",
    "henry-evans": "The surgeon: he diagnoses the sick men, and the officers consult him instead of the other man in the room.",
    "james-wallace": "In the surgeon's room but never the one asked for a medical opinion: the assistant. He is also seen cleaning up.",
    "winston-smith": "Holds a hammer in the carpentry room, is the first out to investigate the beasts, and the other man calls him \"Boss\".",
    "marcus-gibbs": "Works with tools next to the carpenter and calls him \"boss\".",
    "thomas-sefton": "In his death scene he jokes about cooking the beasts, and he carries a two-pronged cooking fork.",
    "emil-o-farrell": "Shows the midshipmen how to butcher the cow, has an Irish accent, and stands with the cook at the execution.",
    "christian-wolff": "The captain orders him by name to carry out the execution. German accent.",
    "olus-wiater": "Handles guns with the gunner and has a vaguely Eastern European accent. He is not dressed like a seaman, "
    "so he is not one of the Russians.",
    "duncan-mckay": "Hides in the purser's office during the fight (visible through the slats), carries papers in the escape "
    "rowboat, and has a Scottish accent.",
    "finley-dalton": "Stands by the ship's wheel in the sketch and in the few scenes he appears in. No lines, and his face "
    "is unblurred from the start.",
    "edward-spratt": "The artist. His face is unblurred from the start, but it is not in the sketch, only his initials. "
    "Compare the manifest with the sketch.",
    "abigail-hoscut-witterel": "She shares the captain's surname, and the captain talks to her body in his last memory. Her own death memory confirms it.",
    "nunzio-pasqua": "Said to have been murdered, and he is the only Italian speaker on the ship.",
    "emily-jackson": "One of the two women left once Abigail and the Formosan woman are known. She wears a wedding ring on her left hand "
    "(Jane is \"Miss\", unmarried).",
    "miss-jane-bird": "\"Miss\" means unmarried, so she is the one of the two remaining women without a wedding ring.",
    "bun-lan-lim": "Another Formosan passenger calls her \"Miss Lim\".",
    "it-beng-sia": "Bun-Lan Lim calls him by name in one scene on the rowboat.",
    "chioh-tan": "The last Formosan passenger: once the other three are identified, he is the only one left.",
    "hok-seng-lau": "Addressed by name at his trial and execution, and seen injured by Nichols in Pasqua's murder memory.",
    "zungi-sathi": "Never named and never speaks. Compare uniforms to spot a steward, tie every other steward to an officer, and he is the one left "
    "(and the steward who looks Indian).",
    "fillip-dahl": "The captain cries \"Twenty years my steward!\". He also speaks a little Swedish.",
    "paul-moss": "Called \"Paul\" (\"Paul, watch out!\") just before he dies, and there is only one Paul on the manifest.",
    "samuel-galligan": "A steward in the rowboat with Nichols, whispers to him at the execution, and has an Irish accent.",
    "roderick-andersen": "In Spratt's death memory he carries a plate of food with the third mate: he is seeing to the third mate's needs.",
    "davey-james": "A steward standing with the fourth mate at Lau's execution, covering his ears.",
    "peter-milroy": "Another midshipman says \"Tell Pete's mom I tried to pull him back\" and is pulling a rope tied around Pete. He also "
    "appears with the other midshipmen at the cow, and he is not \"Charlie\".",
    "thomas-lanke": "A midshipman in uniform, called \"fresh\" by the gunner's mate. He is not Pete (he tried to save him) "
    "and not Charlie (he is not the one throwing up), so he is Thomas.",
    "charles-hershtik": "Called \"Charlie\" at the cow butchering. He is dressed like the other midshipmen and they treat him casually, "
    "so he is not the bosun's mate Charles.",
    "omid-gul": "In Spratt's death memory a hammock with his number holds a curved scimitar. Persian, wears a turban, "
    "and is a seaman, so he cannot be the Indian steward.",
    "timothy-butement": "In Syed's death memory his hammock shows his number, and his arm carries a tattoo of a woman, seen again in his death scene.",
    "huang-li": "One of the Chinese topmen, told apart by footwear in Syed's death memory: toe-cover shoes, darker, no striped stockings.",
    "jie-zhang": "Chinese topman with lighter, whitish shoes and stripe-tinted stockings. Compare with Huang Li in the lightning scene.",
    "li-hong": "Chinese topman with shoes covering up to the ankle. Wei Lee lives until the Doom, so Li Hong is the one whose hammock disappears.",
    "wei-lee": "The last Chinese sailor with a hammock in Spratt's death memory.",
    "nicholas-botterill": "A crew member says \"They've already done for Nick!\" Nichols is long dead, so there is no other Nick.",
    "maba": "From New Guinea and covered in distinctive tribal tattoos. A topman.",
    "lewis-walker": "A topman: by elimination he is the only English one left (not Russian, Chinese or Persian, and not Nicholas or Timothy). "
    "His hammock is the last left on the gun deck.",
    "leonid-volkov": "A Russian topman, seen with the topmen in the lightning scene. The other two Russians are not topmen.",
    "alarcus-nikishin": "One of the three Russians at the card game in Syed's death memory, by elimination from Leonid and Aleksei.",
    "aleksei-toporov": "A satchel with a pipe next to his hammock. He carries it and smokes the pipe when Timothy is shot and in the rowboat.",
    "nathan-peters": "Cries \"You killed my brother!\". His hammock number is visible in scenes, while his brother's is not.",
    "lars-linde": "Nathan Peters calls him \"Dane\", and he is the only Dane on the manifest. He also speaks Danish.",
    "john-naples": "The surgeon calls him \"John\" in his death scene. He is a seaman, so he is not the fourth mate.",
    "renfred-rajub": "Seen dying in his hammock, with its number, in Syed's death memory.",
    "abraham-akbar": "His hammock number is crossed out but he sits in it. He is the only Indian seaman left once the other three are known.",
    "william-wasim": "His hammock is empty because he is helping Syed in that memory, and he speaks Hindi.",
    "soloman-syed": "Called \"Syed\" by name, sleeping in his own numbered hammock. The surgeon blames the \"lascar house\" for his illness.",
    "hamadou-diom": "By elimination: with Booth he is one of the last two seamen. Booth speaks English, Diom comes from Sierra Leone and has no lines. "
    "His hammock is gone after he dies.",
    "henry-brennan": "The first mate calls \"Brennan\" to bring the surgeon's kit, and he covers his ear. Apart from Lewis he is the only man still alive in the scene.",
    "alexander-booth": "The last seaman left by elimination. He speaks English in Linde's death memory and his hammock is still up in Spratt's, so he is not Diom.",
    "patrick-o-hagan": "Irish accent, and Galligan asks \"O'Hagan, you still breathing?\". He is not Russian or Chinese.",
    "george-shirley": "His hammock is with the four Chinese sailors and he sits with Wei Lee, with the number covered. In the sketch he plays dice with them.",
    "samuel-peters": "He never has a visible hammock while Nathan does: he is the brother who died in the accident.",
}
