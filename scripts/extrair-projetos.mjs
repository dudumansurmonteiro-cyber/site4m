#!/usr/bin/env node
/**
 * Extrai dados das 18 páginas de projeto do site atual (CLAUDE.md, seção 4.9):
 *   1. baixa a og:image de cada página para src/assets/projetos/{slug}.jpg
 *   2. imprime um relatório com o tipo do empreendimento e as metragens
 *      encontradas, prontos para conferir/colar no frontmatter em
 *      src/content/projetos/{slug}.md
 *
 * Uso:  node scripts/extrair-projetos.mjs
 * Requer Node 18+ (fetch nativo) e acesso normal à internet.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const DESTINO = join(RAIZ, 'src', 'assets', 'projetos');
const BASE = 'https://www.grupo4m.com';
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const SLUGS = [
  'muse', 'bosque-ipiranga', 'izzy-campinas', 'salma-tower',
  'alphagram', 'jardim-abreus', 'residencial-dunamis', 'residencial-jandira',
  'vilas-verdes', 'saint-paul', 'esquina-jk', 'banco-bib', 'fazendas-itu',
  'guacu', 'suape', 'agua-vermelha', 'unieduk', 'banco-industrial-do-brasil',
];

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

function textoVisivel(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

const falhas = [];
await mkdir(DESTINO, { recursive: true });

for (const slug of SLUGS) {
  const url = `${BASE}/${slug}/`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    console.log(`\n=== /${slug}/ ===`);

    // 1) og:image → src/assets/projetos/{slug}.jpg
    const og = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
      ?? html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    if (og) {
      const imgRes = await fetch(og[1], { headers: { 'User-Agent': UA } });
      if (imgRes.ok) {
        await writeFile(join(DESTINO, `${slug}.jpg`), Buffer.from(await imgRes.arrayBuffer()));
        console.log(`imagem: og:image salva em src/assets/projetos/${slug}.jpg`);
      } else {
        console.log(`imagem: falha ao baixar og:image (${imgRes.status}) — ${og[1]}`);
        falhas.push(slug);
      }
    } else {
      console.log('imagem: og:image não encontrada no HTML');
      falhas.push(slug);
    }

    // 2) candidatos a tipo/stats para o frontmatter
    const linhas = textoVisivel(html);
    const tipo = linhas.find((l) => /^(empreendimento|loteamento|terreno|usina|termel|edif|residencial|comercial)/i.test(l) && l.length < 80);
    if (tipo) console.log(`tipo (candidato): "${tipo}"`);
    const stats = linhas.filter((l) => /(m²|m2\b|\bMW\b|\bkm\b|hectares|lotes|unidades|pavimentos|andares)/i.test(l) && l.length < 90);
    if (stats.length) {
      console.log('stats (candidatos):');
      for (const s of [...new Set(stats)].slice(0, 8)) console.log(`  - ${s}`);
    }
    if (!tipo && !stats.length) console.log('sem tipo/metragens detectáveis nesta página');
  } catch (erro) {
    console.log(`\n=== /${slug}/ ===\nFALHOU: ${erro.message}`);
    falhas.push(slug);
  }
  await esperar(300);
}

console.log('\n----------------------------------------');
if (falhas.length) {
  console.log(`Pendências (${falhas.length}): ${[...new Set(falhas)].join(', ')}`);
  console.log('Para esses slugs, mantenha o placeholder e/ou preencha o frontmatter à mão.');
  process.exitCode = 1;
} else {
  console.log('Todos os projetos processados. Confira o relatório acima e');
  console.log('atualize tipo/stats em src/content/projetos/*.md quando fizer sentido.');
}
