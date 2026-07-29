/**
 * Extrai dados (tipo, stats, título, meta) das páginas HTML do site atual,
 * salvas por scripts/baixar-assets.sh em scripts/paginas-site-atual/.
 *
 * Gera scripts/dados-extraidos.json para conferência e aponta divergências
 * com o frontmatter atual de src/content/projetos/*.md (seção 4.9 do CLAUDE.md).
 *
 * Uso: node scripts/extrair-dados.mjs
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGINAS = path.join(raiz, 'scripts', 'paginas-site-atual');

function textoLimpo(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

let arquivos;
try {
  arquivos = (await readdir(PAGINAS)).filter((a) => a.endsWith('.html'));
} catch {
  console.error(`Pasta ${PAGINAS} não existe. Rode antes: bash scripts/baixar-assets.sh`);
  process.exit(1);
}

if (arquivos.length === 0) {
  console.error('Nenhuma página salva. Rode antes: bash scripts/baixar-assets.sh');
  process.exit(1);
}

const resultado = {};

for (const arquivo of arquivos) {
  const slug = arquivo.replace(/\.html$/, '');
  const html = await readFile(path.join(PAGINAS, arquivo), 'utf-8');

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? null;
  const ogImage =
    html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i)?.[1] ??
    html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:image"/i)?.[1] ??
    null;
  const description =
    html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)?.[1] ?? null;

  const linhas = textoLimpo(html);

  // Tipo do empreendimento: linhas curtas do tipo "Empreendimento Residencial",
  // "Loteamento", "Usina Termelétrica" etc.
  const tipo =
    linhas.find((l) =>
      /^(empreendimento|loteamento|usina|termel[eé]trica|linha de transmiss[aã]o|edif[ií]cio|terreno|banco|institui[cç][aã]o)/i.test(l) && l.length < 60
    ) ?? null;

  // Stats: pares "label ... valor" com m², MW, kV, hectares etc.
  const stats = [];
  for (let i = 0; i < linhas.length; i++) {
    const l = linhas[i];
    const valor = l.match(/^[\d.,]+\s*(m²|m2|MW|kV|km|ha|hectares|unidades|pavimentos|torres)$/i);
    if (valor && i > 0 && linhas[i - 1].length < 50 && !/^[\d.,]/.test(linhas[i - 1])) {
      stats.push({ label: linhas[i - 1], valor: l });
    }
  }

  resultado[slug] = { title, description, ogImage, tipo, stats };
}

const saida = path.join(raiz, 'scripts', 'dados-extraidos.json');
await writeFile(saida, JSON.stringify(resultado, null, 2) + '\n');
console.log(`Dados extraídos de ${arquivos.length} página(s) → ${saida}`);
console.log('Confira e atualize o frontmatter em src/content/projetos/*.md (campos tipo/stats),');
console.log('removendo "dadosPendentes: true" dos projetos completados.');
