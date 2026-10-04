/* eslint-disable @next/next/no-img-element -- site estático com images.unoptimized */
import type { ComponentProps } from "react";
import { withBase } from "@/lib/base-path";

/** `<img>` para arquivos de `public/` (sem `/` inicial): aplica o basePath do site. */
export function GameImage({
  src,
  alt,
  ...props
}: Omit<ComponentProps<"img">, "src" | "alt"> & { src: string; alt: string }) {
  return <img src={withBase(src)} alt={alt} loading="lazy" decoding="async" {...props} />;
}
