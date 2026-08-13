#!/usr/bin/env node
/**
 * Gera public/favicon.ico (16/32/48, PNGs embutidos) a partir de
 * src/assets/favicon-src.png. Rode de novo depois de baixar o favicon
 * real com scripts/baixar-assets.sh:
 *
 *   node scripts/gerar-favicon.mjs
 *
 * Usa o sharp que já é dependência do projeto — sem instalar nada extra.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEM = join(RAIZ, 'src', 'assets', 'favicon-src.png');
const DESTINO = join(RAIZ, 'public', 'favicon.ico');
const TAMANHOS = [16, 32, 48];

const origem = await readFile(ORIGEM);
const pngs = await Promise.all(
  TAMANHOS.map((t) => sharp(origem).resize(t, t, { fit: 'cover' }).png().toBuffer())
);

// Container ICO: cabeçalho (6 bytes) + 1 entrada de 16 bytes por imagem + PNGs
const cabecalho = Buffer.alloc(6);
cabecalho.writeUInt16LE(0, 0); // reservado
cabecalho.writeUInt16LE(1, 2); // tipo: ícone
cabecalho.writeUInt16LE(pngs.length, 4);

const entradas = [];
let deslocamento = 6 + 16 * pngs.length;
for (const [i, png] of pngs.entries()) {
  const entrada = Buffer.alloc(16);
  const t = TAMANHOS[i];
  entrada.writeUInt8(t === 256 ? 0 : t, 0); // largura
  entrada.writeUInt8(t === 256 ? 0 : t, 1); // altura
  entrada.writeUInt8(0, 2); // paleta
  entrada.writeUInt8(0, 3); // reservado
  entrada.writeUInt16LE(1, 4); // planos
  entrada.writeUInt16LE(32, 6); // bits por pixel
  entrada.writeUInt32LE(png.length, 8); // tamanho dos dados
  entrada.writeUInt32LE(deslocamento, 12); // offset
  entradas.push(entrada);
  deslocamento += png.length;
}

await writeFile(DESTINO, Buffer.concat([cabecalho, ...entradas, ...pngs]));
console.log(`favicon.ico gerado (${TAMANHOS.join('/')}) em public/favicon.ico`);
