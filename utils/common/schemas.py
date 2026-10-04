"""Base dos schemas pydantic. O JSON exportado usa camelCase (consumido pelo TypeScript)."""

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class Source(CamelModel):
    """De onde veio a informação (mostrado na seção "Fontes" do guia)."""

    title: str
    url: str
    note: str | None = None


class Link(CamelModel):
    """Link útil para o jogador (wiki, ferramenta, mapa...)."""

    title: str
    url: str
    description: str | None = None


class Image(CamelModel):
    """Imagem salva em `frontend/public/games/<jogo>/`. `src` é relativo a `public/`
    (ex.: `games/hollow-knight/mapa.png`); no site use `withBase(src)`."""

    src: str
    alt: str
    credit: str | None = None


class GameMeta(CamelModel):
    """`meta.json`: o que todo jogo exporta, além dos dados próprios dele."""

    name: str
    sources: list[Source] = []
    links: list[Link] = []
    images: list[Image] = []
