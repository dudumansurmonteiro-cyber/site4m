# Site institucional — Grupo 4M

Site estático em [Astro](https://astro.build) + Tailwind CSS. Conteúdo em
pt-BR, sem CMS e sem backend. O briefing completo do projeto está em
[`CLAUDE.md`](./CLAUDE.md).

## Como rodar

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:4321
npm run build      # build estático em dist/
npm run preview    # pré-visualiza o build
```

## Imagens reais do site atual

O repositório contém **placeholders** com os nomes corretos (a rede do
ambiente de desenvolvimento bloqueava www.grupo4m.com). Para baixar as
imagens reais e os dados dos projetos:

```bash
bash scripts/baixar-assets.sh    # baixa logo, fotos e og:image de cada projeto
node scripts/extrair-dados.mjs   # extrai tipo/stats das páginas salvas
```

Depois confira `scripts/dados-extraidos.json` e complete o frontmatter dos
projetos em `src/content/projetos/*.md` (campos `tipo` e `stats`), removendo
`dadosPendentes: true` dos projetos completados.

## Como editar conteúdo

- **Projetos:** um arquivo Markdown por projeto em `src/content/projetos/`.
  O frontmatter (título, setor, categoria, tipo, stats, imagem) segue o
  modelo da seção 4.9 do `CLAUDE.md`. A imagem correspondente fica em
  `src/assets/projetos/{slug}.jpg`.
- **Textos institucionais:** copy dos setores e contato em
  `src/lib/dados.ts`; textos das páginas nos arquivos de `src/pages/`.
- **Tokens de design:** cores, tipografia e escala em
  `src/styles/global.css`.

## Deploy

`npm run build` gera `dist/` — publique essa pasta em qualquer host
estático (Vercel, Netlify, Cloudflare Pages). Não há dependência de
servidor. O domínio configurado para canonical/sitemap está em
`astro.config.mjs` (`site`).

## Formulário de contato

O form fica oculto até existir a variável de ambiente
`PUBLIC_FORM_ENDPOINT` (endpoint de um provedor como Formspree ou
Web3Forms) no momento do build:

```bash
PUBLIC_FORM_ENDPOINT="https://formspree.io/f/SEU_ID" npm run build
```

Sem a variável, a página de contato mostra telefone e endereço em destaque
— nunca um form quebrado.
