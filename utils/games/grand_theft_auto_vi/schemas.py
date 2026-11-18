from typing import Literal

from utils.common.schemas import CamelModel


class Trophy(CamelModel):
    id: int  # posição na lista da PSN (1 = platina)
    name: str
    description: str
    grade: Literal["platinum", "gold", "silver", "bronze"]
    icon: str  # relativo a public/
    url: str
    psn_rate: float | None = None  # só depois que há dados de raridade (ver TrophyDataset.has_rarity)
    psn_tier: str | None = None
    note: str | None = None  # dica própria (ainda não temos nenhuma)


class TrophyDataset(CamelModel):
    points: int
    counts: dict[str, int]
    # No lançamento a PSN mostra 0,0% "Ultra Rare" para tudo: isso não é raridade. Fica False até o HTML ser salvo de novo com taxas reais.
    has_rarity: bool
    trophies: list[Trophy]
