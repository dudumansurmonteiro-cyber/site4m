// Gera uma versão em arquivo único (CSS e JS embutidos) para publicar a demo
// como página do Claude (Artifact) ou mandar por e-mail.
// Uso: node tools/gerar-artifact.mjs [saida.html]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const saida = resolve(process.argv[2] || join(raiz, 'build', 'laco-livros.html'));
const html = readFileSync(join(raiz, 'index.html'), 'utf8');

const pegar = (re) => (html.match(re) || [])[0] || '';
const titulo = pegar(/<title>[\s\S]*?<\/title>/);
const metaLados = pegar(/<meta name="claude:viewport-fit-sides"[^>]*>/);
const fontes = (html.match(/<link rel="(?:preconnect|stylesheet)" href="https:\/\/fonts\.[^>]*>/g) || []).join('\n');
const css = readFileSync(join(raiz, 'css', 'app.css'), 'utf8');

let corpo = html.slice(html.indexOf('<body>') + 6, html.lastIndexOf('</body>'));
corpo = corpo.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => {
  const js = readFileSync(join(raiz, src), 'utf8').replace(/<\/script/gi, '<\\/script');
  return `<script>\n/* ${src} */\n${js}\n</script>`;
});

const pagina = [titulo, metaLados, fontes, `<style>\n${css}\n</style>`, corpo.trim()].join('\n');
mkdirSync(dirname(saida), { recursive: true });
writeFileSync(saida, pagina);
console.log(`Gerado: ${saida} (${Math.round(pagina.length / 1024)} KB)`);
