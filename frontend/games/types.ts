/** Metadados de um jogo. Cada jogo vive em `games/<slug>/` e tem a rota `/guides/<slug>`. */
export type Game = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  /** Cor de destaque do jogo (hex), usada no card do hub e no guia. */
  accent: string;
  /** Imagem de capa, relativa a `public/` (ex.: `games/<slug>/capa.jpg`); use `withBase`. */
  cover?: string;
};

/** Mesmo formato do `meta.json` exportado pelo Python (`utils/common/schemas.py`). */
export type Source = { title: string; url: string; note?: string };
export type Link = { title: string; url: string; description?: string };
export type GameImage = { src: string; alt: string; credit?: string };
export type GameMeta = {
  name: string;
  /** Data (ISO) da última execução do pipeline. */
  updated?: string;
  sources: Source[];
  links: Link[];
  images: GameImage[];
};
