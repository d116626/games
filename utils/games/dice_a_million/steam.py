"""Lê a página oficial de conquistas da Steam e baixa os assets (ícones, capa, logo, screenshots)."""

import html
import json
import re
from dataclasses import dataclass

from utils.common.http import fetch_file_if_missing
from utils.common.paths import assets_dir, raw_dir
from utils.common.schemas import Image
from utils.games.dice_a_million.constants import APP_ID, GAME

STORE_ASSETS = f"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{APP_ID}"
ACHIEVEMENTS_URL = f"https://steamcommunity.com/stats/{APP_ID}/achievements?l=english"
APPDETAILS_URL = f"https://store.steampowered.com/api/appdetails?appids={APP_ID}&l=english"
CREDIT = "Steam / countlessnights"
SCREENSHOTS = 4

ROW = re.compile(
    r'<img src="([^"]+/apps/\d+/([0-9a-f]+)\.jpg)".*?achievePercent">([\d.]+)%.*?<h3>(.*?)</h3>\s*<h5>(.*?)</h5>',
    re.S,
)


@dataclass
class SteamAchievement:
    id: str
    name: str
    description: str
    rarity: float
    icon_url: str


def fetch_achievements() -> list[SteamAchievement]:
    page = fetch_file_if_missing(ACHIEVEMENTS_URL, raw_dir(GAME) / "steam-achievements.html")
    rows = ROW.findall(page.read_text(encoding="utf-8"))
    return [
        SteamAchievement(h, html.unescape(name).strip(), html.unescape(desc).strip(), float(pct), url)
        for url, h, pct, name, desc in rows
    ]


def download_icons(items: list[SteamAchievement]) -> None:
    for a in items:
        fetch_file_if_missing(a.icon_url, assets_dir(GAME) / "achievements" / f"{a.id}.jpg")


def download_images() -> list[Image]:
    """Capa, logo e screenshots da página da loja. Retorna as imagens para o `meta.json`."""
    out = assets_dir(GAME)
    fetch_file_if_missing(f"{STORE_ASSETS}/library_hero.jpg", out / "hero.jpg")
    fetch_file_if_missing(f"{STORE_ASSETS}/logo.png", out / "logo.png")
    details = fetch_file_if_missing(APPDETAILS_URL, raw_dir(GAME) / "steam-appdetails.json")
    shots = json.loads(details.read_text(encoding="utf-8"))[str(APP_ID)]["data"]["screenshots"][:SCREENSHOTS]
    images = [
        Image(src=f"games/{GAME}/hero.jpg", alt="Dice A Million key art", credit=CREDIT),
        Image(src=f"games/{GAME}/logo.png", alt="Dice A Million logo", credit=CREDIT),
    ]
    for i, shot in enumerate(shots):
        fetch_file_if_missing(shot["path_thumbnail"], out / "screens" / f"{i}.jpg")
        images.append(Image(src=f"games/{GAME}/screens/{i}.jpg", alt=f"Gameplay screenshot {i + 1}", credit=CREDIT))
    return images
