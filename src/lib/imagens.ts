import type { ImageMetadata } from 'astro';

const doSite = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/*.{jpg,png}',
  { eager: true }
);

const deProjetos = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/projetos/*.jpg',
  { eager: true }
);

function buscar(
  mapa: Record<string, { default: ImageMetadata }>,
  arquivo: string
): ImageMetadata {
  const chave = Object.keys(mapa).find((k) => k.endsWith(`/${arquivo}`));
  if (!chave) throw new Error(`Imagem não encontrada: ${arquivo}`);
  return mapa[chave].default;
}

/** Imagem institucional de src/assets/ (ex.: "home-hero.jpg"). */
export function imagemSite(arquivo: string): ImageMetadata {
  return buscar(doSite, arquivo);
}

/** Imagem de projeto de src/assets/projetos/ (ex.: "izzy-campinas.jpg"). */
export function imagemProjeto(arquivo: string): ImageMetadata {
  return buscar(deProjetos, arquivo);
}
