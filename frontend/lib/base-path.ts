/** Mesmo basePath do `next.config.ts` (o site roda em /games no GitHub Pages). */
const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.NODE_ENV === "production" ? "/games" : "");

/** Prefixa o basePath em arquivos de `public/` (imagens, etc.): `withBase("games/x/mapa.png")`. */
export const withBase = (src: string) => `${BASE_PATH}/${src.replace(/^\//, "")}`;
