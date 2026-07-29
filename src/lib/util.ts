/**
 * Prefixa um caminho interno com a base do site. Com a base padrão ("/")
 * devolve o caminho intacto; num deploy em subcaminho (ex.: GitHub Pages
 * em /site4m/) devolve "/site4m/imobiliario/".
 */
export function comBase(caminho: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${caminho}`;
}

/** Converte um rótulo em id/âncora ASCII ("Edifícios" → "edificios"). */
export function slugificar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
