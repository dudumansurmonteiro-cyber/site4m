# Site institucional — Grupo 4M

Reconstrução do site [grupo4m.com](https://www.grupo4m.com) como site 100% estático:
**Astro + Tailwind CSS**, conteúdo em collections, fontes self-hosted, imagens otimizadas.
O briefing completo do projeto está em [`CLAUDE.md`](./CLAUDE.md) — é a fonte de verdade.

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:4321
```

Build de produção (gera `dist/`, sem nenhuma dependência de servidor):

```bash
npm run build
npm run preview    # confere o build localmente
```

## Trocar os placeholders pelas fotos reais

O ambiente onde o site foi gerado não tinha acesso ao site atual, então as imagens
em `src/assets/` são placeholders sóbrios com os **nomes finais corretos**.
De uma máquina com internet normal:

```bash
bash scripts/baixar-assets.sh      # logo, favicon, hero, cards, ícones, impacto
node scripts/extrair-projetos.mjs  # og:image das 18 páginas de projeto + relatório de tipo/metragens
npm run build                      # re-otimiza tudo
```

O segundo script também imprime os candidatos a `tipo` e `stats` de cada projeto,
para conferir e colar no frontmatter correspondente.

## Editar conteúdo

- **Projetos:** um arquivo por projeto em `src/content/projetos/*.md`
  (título, setor, categorias, tipo, stats, imagem, alt). Texto adicional pode ser
  escrito no corpo do arquivo em Markdown — a página exibe automaticamente.
- **Copy dos setores e da navegação:** `src/data/setores.ts` e `src/data/site.ts`.
- **Quem Somos:** copy diretamente em `src/pages/quem-somos.astro`.
- Novos projetos: basta criar o `.md` e colocar a imagem em `src/assets/projetos/` —
  a página, a grade do setor e o sitemap são gerados sozinhos.

## Formulário de contato

A página `/contato/` sai **sem** formulário por padrão (telefone e endereço em
destaque). Para ativar, crie um endpoint num provedor tipo
[Formspree](https://formspree.io) ou [Web3Forms](https://web3forms.com) e defina:

```bash
# .env (ou variável de ambiente do host de deploy)
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/SEU_ID
```

Sem a variável, nenhum form quebrado é publicado.

## Deploy

Qualquer host estático. Diretório de publicação: `dist/`.

| Host | Config |
| --- | --- |
| Vercel | framework Astro (detectado), build `npm run build`, output `dist` |
| Netlify | build `npm run build`, publish `dist` |
| Cloudflare Pages | build `npm run build`, output `dist` |

O domínio deve apontar para `https://www.grupo4m.com` (URL configurada em
`astro.config.mjs` — canonicals, sitemap e OG usam esse valor).

## Pendências com o cliente

Ver a tabela da seção 11 do [`CLAUDE.md`](./CLAUDE.md) (grafia Alphagran/Alphagram,
e-mail do formulário, hospedagem, fotos/textos adicionais dos projetos). Nenhuma
delas trava o site — os padrões definidos lá já estão aplicados.
