/**
 * Captura screenshots das páginas do build (dist/) para validação visual.
 * Uso: node scripts/screenshot.mjs [caminho] [saida] [largura]
 * Ex.:  node scripts/screenshot.mjs / home-desktop.png 1440
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(raiz, 'dist');

const [caminho = '/', saida = 'screenshot.png', largura = '1440'] =
  process.argv.slice(2);

const tipos = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon',
};

const servidor = createServer(async (req, res) => {
  try {
    let alvo = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (alvo.endsWith('/')) alvo += 'index.html';
    const arquivo = path.join(DIST, alvo);
    const corpo = await readFile(arquivo);
    res.writeHead(200, {
      'content-type': tipos[path.extname(arquivo)] ?? 'application/octet-stream',
    });
    res.end(corpo);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});

await new Promise((r) => servidor.listen(4321, r));

const navegador = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium',
});
const pagina = await navegador.newPage({
  viewport: { width: Number(largura), height: 900 },
});
// Sem animações: o scroll-reveal não dispara fora da viewport em fullPage.
await pagina.emulateMedia({ reducedMotion: 'reduce' });
await pagina.goto(`http://localhost:4321${caminho}`, {
  waitUntil: 'networkidle',
});
// Rola a página inteira para disparar lazy-load e espera as imagens.
await pagina.evaluate(async () => {
  for (let y = 0; y <= document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
  await Promise.all(
    Array.from(document.images)
      .filter((img) => !img.complete)
      .map((img) => new Promise((r) => {
        img.addEventListener('load', r, { once: true });
        img.addEventListener('error', r, { once: true });
      }))
  );
});
await pagina.waitForTimeout(400);
await pagina.screenshot({ path: saida, fullPage: true });
await navegador.close();
servidor.close();
console.log(`Screenshot: ${saida} (${caminho} @ ${largura}px)`);
