/**
 * Gera imagens placeholder com os nomes corretos da seção 6 do CLAUDE.md.
 * Rode `bash scripts/baixar-assets.sh` para substituí-las pelas imagens reais
 * do site atual (requer acesso à rede).
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = path.join(raiz, 'src', 'assets');
const PROJETOS = path.join(ASSETS, 'projetos');

const GRAFITE = '#16191D';
const TINTA = '#1B1E23';
const ACO = '#6E7680';
const BRONZE = '#A8875A';
const PEDRA = '#F3F2EF';

function svgFoto(largura, altura, rotulo) {
  const fs = Math.max(18, Math.round(largura / 40));
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}">
  <rect width="100%" height="100%" fill="${GRAFITE}"/>
  <rect width="100%" height="100%" fill="${TINTA}" opacity="0.5"/>
  <line x1="0" y1="${altura - 3}" x2="${largura}" y2="${altura - 3}" stroke="${BRONZE}" stroke-width="6"/>
  <text x="50%" y="48%" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="${fs}" fill="${ACO}" letter-spacing="4">${rotulo}</text>
  <text x="50%" y="58%" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="${Math.round(fs * 0.55)}" fill="${ACO}" opacity="0.7">imagem provisória — rode scripts/baixar-assets.sh</text>
</svg>`);
}

function svgIcone(rotulo) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
  <rect x="24" y="24" width="112" height="112" fill="none" stroke="${BRONZE}" stroke-width="4"/>
  <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-family="DejaVu Sans, sans-serif" font-size="40" fill="${BRONZE}">${rotulo}</text>
</svg>`);
}

function svgLogo() {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="360" height="96">
  <rect x="4" y="8" width="80" height="80" fill="${BRONZE}"/>
  <text x="44" y="62" text-anchor="middle" font-family="DejaVu Serif, serif" font-size="42" font-weight="bold" fill="${GRAFITE}">4M</text>
  <text x="104" y="62" font-family="DejaVu Sans, sans-serif" font-size="36" letter-spacing="8" fill="${PEDRA}">GRUPO 4M</text>
</svg>`);
}

function svgFavicon() {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270">
  <rect width="270" height="270" fill="${GRAFITE}"/>
  <text x="50%" y="56%" text-anchor="middle" dominant-baseline="middle" font-family="DejaVu Serif, serif" font-size="120" font-weight="bold" fill="${BRONZE}">4M</text>
</svg>`);
}

const fotos = [
  // [arquivo, largura, altura, rótulo]
  ['home-hero.jpg', 1920, 1080, 'GRUPO 4M'],
  ['imobiliario-hero.jpg', 1920, 1080, 'IMOBILIÁRIO'],
  ['setor-imobiliario.jpg', 1200, 900, 'IMOBILIÁRIO'],
  ['setor-energia.jpg', 1200, 900, 'ENERGIA'],
  ['setor-educacao.jpg', 1200, 900, 'EDUCAÇÃO'],
  ['setor-financeiro.jpg', 1200, 900, 'FINANCEIRO'],
  ['impacto-imobiliario.jpg', 1200, 900, 'PROJETOS IMOBILIÁRIOS'],
  ['impacto-energia.jpg', 1200, 900, 'ENERGIA'],
  ['impacto-educacao.jpg', 1200, 900, 'EDUCAÇÃO'],
  ['impacto-financeiro.jpg', 1200, 900, 'FINANCEIRO'],
];

const projetos = [
  ['muse', 'MUSE'],
  ['bosque-ipiranga', 'BOSQUE IPIRANGA'],
  ['izzy-campinas', 'IZZY CAMPINAS'],
  ['salma-tower', 'SALMA TOWER'],
  ['alphagram', 'ALPHAGRAN'],
  ['jardim-abreus', 'JARDIM ABREUS'],
  ['residencial-dunamis', 'RESIDENCIAL DUNAMIS'],
  ['residencial-jandira', 'RESIDENCIAL JANDIRA'],
  ['vilas-verdes', 'VILAS VERDES'],
  ['saint-paul', 'SAINT PAUL'],
  ['esquina-jk', 'ESQUINA JK'],
  ['banco-bib', 'BANCO BIB'],
  ['fazendas-itu', 'FAZENDAS ITU'],
  ['guacu', 'GUAÇU'],
  ['suape', 'SUAPE'],
  ['agua-vermelha', 'ÁGUA VERMELHA'],
  ['unieduk', 'UNIEDUK'],
  ['banco-industrial-do-brasil', 'BANCO INDUSTRIAL DO BRASIL'],
];

const icones = [
  ['icone-imobiliario.png', '01'],
  ['icone-energia.png', '02'],
  ['icone-educacao.png', '03'],
  ['icone-financeiro.png', '04'],
];

await mkdir(PROJETOS, { recursive: true });

for (const [arquivo, w, h, rotulo] of fotos) {
  await sharp(svgFoto(w, h, rotulo)).jpeg({ quality: 80 }).toFile(path.join(ASSETS, arquivo));
}

for (const [slug, rotulo] of projetos) {
  await sharp(svgFoto(1600, 1000, rotulo))
    .jpeg({ quality: 80 })
    .toFile(path.join(PROJETOS, `${slug}.jpg`));
}

for (const [arquivo, rotulo] of icones) {
  await sharp(svgIcone(rotulo)).png().toFile(path.join(ASSETS, arquivo));
}

await sharp(svgLogo()).png().toFile(path.join(ASSETS, 'logo-grupo4m.png'));
await sharp(svgFavicon()).png().toFile(path.join(ASSETS, 'favicon-src.png'));
await sharp(svgFavicon()).resize(180, 180).png().toFile(path.join(raiz, 'public', 'apple-touch-icon.png'));
await sharp(svgFavicon()).resize(32, 32).png().toFile(path.join(raiz, 'public', 'favicon-32.png'));

console.log('Placeholders gerados em src/assets/. Rode scripts/baixar-assets.sh para baixar as imagens reais.');
