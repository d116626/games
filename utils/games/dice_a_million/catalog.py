"""Catálogo de dados, anéis, cartas e mãos, lido do banco do jogo (`data/raw/<jogo>/game/db.json`).

O banco é gerado por `data/raw/<jogo>/game/extract.py` a partir do jogo instalado (nomes, textos, raridade,
formato e sprites oficiais). Itens ocultos com nome entram marcados (`hidden`): não aparecem em runs normais.
"""

import json
import re
import shutil
from pathlib import Path

from utils.common.paths import assets_dir, raw_dir
from utils.games.dice_a_million.constants import GAME
from utils.games.dice_a_million.schemas import Catalog, CatalogItem, Rarity, Trait

GAME_DIR = raw_dir(GAME) / "game"
RARITY: dict[int, Rarity] = {0: "common", 1: "uncommon", 2: "rare", 3: "legendary", 4: "occult"}
# (tipo no site, lista visível, lista oculta) na ordem do jogo
KINDS = (("dice", "dice", "dice_hidden"), ("rings", "rings", "rings_hidden"), ("cards", "cards", "cards_hidden"), ("hands", "hands", None))
RENAMES = {"J.'s Die": "J's Die"}  # nome usado em todo o guia
SKIP_HIDDEN = {"friendship_used"}  # estado do Friendship Ring, não um item
WORD = re.compile(r"\w")

# Palavras-chave do glossário do jogo (`db["keywords"]`, com o texto oficial) e tags que descrevem o item de forma clara.
# As outras tags são internas do jogo (nodemo, forceanimation...) ou repetem o desbloqueio (cartas special).
KEYWORD_LABELS = {
    "face": "Face", "ev": "Extra value", "destroy": "Destroy", "discard": "Discard", "charge": "Charge", "ghost": "Ghost",
    "exhaust": "Exhaust", "stampmult": "Stamp multiplier", "fire": "Burn", "randomize": "Randomize", "negative": "Negative",
    "parity": "Odd / even", "prime": "Prime", "fibonacci": "Fibonacci", "chooseface": "Choose face", "activering": "Active",
    "faceweight": "Face weight",
}
KEYWORD_TEXT = {"fibonacci": "The Fibonacci sequence is: 1, 1, 2, 3, 5, 8, 13, 21, etc."}  # o texto do jogo traz um número em tempo de execução
TAG_TRAITS = {  # id -> (rótulo, descrição)
    "odd-faces": ("Odd faces", "Every face of this die is an odd number."),
    "even-faces": ("Even faces", "Every face of this die is an even number."),
    "face-zero": ("Face 0", "Its face is 0, so what it does comes from its effect."),
    "variable-face": ("Variable face", "Its face is calculated from something else instead of being a fixed number."),
    "single-face": ("Single face", "A die with one single face."),
    "huge": ("Huge", "A die with a huge number of faces."),
    "nearby": ("Nearby dice", "Its effect touches the dice next to it on the table."),
    "gem": ("Gem", "A gem die."),
    "countdown": ("Countdown", "Triggers every few rolls."),
    "growing": ("Growing value", "Gives pips based on a value that grows during the run."),
}
TAG_IDS = {  # tag do jogo -> id em TAG_TRAITS
    "faces_odd": "odd-faces", "faces_even": "even-faces", "faces_zero": "face-zero", "variableface": "variable-face",
    "faces_special": "variable-face", "oneface": "single-face", "large": "huge", "area": "nearby", "gem": "gem",
    "countdown": "countdown", "value": "growing",
}


def load_db() -> dict[str, list[dict[str, object]]]:
    path = GAME_DIR / "db.json"
    if not path.exists():
        raise FileNotFoundError(f"{path} não existe: rode data/raw/{GAME}/game/extract.py (precisa do jogo instalado)")
    return json.loads(path.read_text(encoding="utf-8"))


def item_names(db: dict[str, list[dict[str, object]]]) -> dict[str, dict[str, str]]:
    """{grupo: {id: nome}} de dados, anéis e cartas (grupos separados porque os ids se repetem entre eles)."""
    return {
        group: {str(e["id"]): str(e["name"]) for k in keys for e in db[k] if "name" in e}
        for group, keys in (("dice", ("dice", "dice_hidden")), ("rings", ("rings",)), ("cards", ("cards",)))
    }


def unlock_text(entry: dict[str, object]) -> str | None:
    """Como desbloquear: nota explicativa > texto do jogo > condições legíveis (ex. Golden Die só tem estas)."""
    conditions: list[str] = entry.get("unlock_conditions") or []  # type: ignore[assignment]
    text = entry.get("unlock_note") or entry.get("unlock") or " and ".join(conditions)
    return str(text) if text else None


def item_traits(entry: dict[str, object], keywords: set[str]) -> list[str] | None:
    """Palavras-chave (as que têm texto no glossário) e tags úteis do item, sem repetir."""
    found = [k for k in entry.get("keywords") or [] if k in keywords]  # type: ignore[attr-defined]
    for tag in entry.get("tags") or []:  # type: ignore[attr-defined]
        if (trait := TAG_IDS.get(tag)) and trait not in found:
            found.append(trait)
    return found or None


def build_traits(db: dict[str, list[dict[str, object]]]) -> list[Trait]:
    keywords = [
        Trait(id=k, label=KEYWORD_LABELS[k], description=KEYWORD_TEXT.get(k) or str(e["description"]))
        for e in db["keywords"]
        if (k := str(e["id"])) in KEYWORD_LABELS
    ]
    return keywords + [Trait(id=i, label=label, description=text) for i, (label, text) in TAG_TRAITS.items()]


def copy_sprite(sprite: str) -> str:
    """Copia o sprite do jogo para o site e devolve o caminho público."""
    target = assets_dir(GAME) / "items" / sprite
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(GAME_DIR / "sprites" / sprite, target)
    return f"games/{GAME}/items/{sprite}"


def build_catalog() -> Catalog:
    db = load_db()
    items_dir = assets_dir(GAME) / "items"
    shutil.rmtree(items_dir, ignore_errors=True)  # só ficam os sprites usados
    traits = build_traits(db)
    keyword_ids = {t.id for t in traits}
    items: list[CatalogItem] = []
    names: set[tuple[str, str]] = set()
    for kind, visible, hidden in KINDS:
        entries = [(e, False) for e in db[visible]]
        if hidden:
            entries += [(e, True) for e in db[hidden]]
        for entry, is_hidden in entries:
            if "name" not in entry or entry["id"] in SKIP_HIDDEN or "boss" in (entry.get("tags") or []):  # dados do chefe final: bestiário
                continue
            name = RENAMES.get(str(entry["name"]), str(entry["name"]))
            if name == "???" or (kind, name) in names:  # key1 e key2 são o mesmo Shattered Die
                continue
            names.add((kind, name))
            faces = str(entry.get("faces_text", ""))
            rarity = entry.get("rarity")
            items.append(
                CatalogItem(
                    id=f"{kind}-{entry['id']}",
                    kind=kind,  # type: ignore[arg-type]
                    name=name,
                    condition=unlock_text(entry),
                    effect=str(entry.get("description", "")).replace("$", "X"),
                    faces=faces if kind == "dice" and WORD.search(faces) else None,
                    sides=int(entry["shape"]) if kind == "dice" else None,  # formato oficial: 1 a 6 pontos, 7 = cruz
                    rarity=RARITY[rarity] if isinstance(rarity, int) else None,
                    hidden=True if is_hidden else None,
                    traits=item_traits(entry, keyword_ids),
                    icon=copy_sprite(str(entry["sprite"])),
                )
            )
    return Catalog(items=items, traits=traits)
