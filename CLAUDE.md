# PROJETO: Reconstrução do site Grupo 4M

Este documento é a **fonte de verdade** do projeto. Leia-o inteiro antes de escrever qualquer código e siga-o à risca. Onde houver decisão em aberto, use o padrão indicado na seção 11 e siga em frente sem travar.

## 1. Missão

Reconstruir do zero o site institucional do **Grupo 4M** (https://www.grupo4m.com), substituindo o site atual (WordPress + Elementor, lento e genérico) por um site estático moderno, rápido, sóbrio e premium. O conteúdo textual oficial está todo neste documento (já revisado e corrigido — o site atual contém erros, ver seção 5). As imagens serão reaproveitadas do site atual (seção 6). Idioma único: **pt-BR**.

**Perfil do cliente:** holding privada de investimentos e operações, sediada em São Paulo (endereço na Av. Juscelino Kubitschek — região Faria Lima/JK). Atua em 4 frentes: **Imobiliário, Energia, Educação e Financeiro**. O tom é institucional, discreto e de longo prazo — nada de linguagem de startup, nada de visual "template".

## 2. Stack e decisões técnicas

- **Framework:** Astro (última versão estável), output 100% estático (`output: 'static'`).
- **Estilos:** Tailwind CSS, com design tokens definidos como CSS custom properties (seção 7) e consumidos pelo Tailwind.
- **Conteúdo:** Astro Content Collections. Projetos e setores são dados (arquivos `.md`/`.json` em `src/content/`), e as páginas de projeto são geradas a partir da collection. Nada de texto importante hardcoded em componente.
- **Fontes:** self-hosted via `@fontsource` (não usar `<link>` do Google Fonts). `font-display: swap`.
- **Imagens:** otimizadas via `astro:assets` (formatos modernos, tamanhos responsivos, lazy loading fora da dobra).
- **Formulário de contato:** sem backend próprio. Preparar o form para um provedor tipo Formspree/Web3Forms com o endpoint em variável de ambiente (`PUBLIC_FORM_ENDPOINT`). Se a variável não existir, exibir a página de contato **sem** o form (telefone, endereço e e-mail em destaque) — nunca publicar um form quebrado.
- **Deploy alvo:** qualquer host estático (Vercel, Netlify ou Cloudflare Pages). Gerar build limpo com `astro build`; não depender de recursos de servidor.
- **Sem CMS na v1.** Conteúdo versionado no repositório. (Estrutura em collections deixa migração futura para CMS headless trivial.)

**Justificativa:** site institucional de ~20 páginas, sem área logada e sem conteúdo dinâmico — estático maximiza performance, SEO e segurança, e elimina a manutenção de WordPress/plugins.

## 3. Sitemap

| Rota | Página |
| --- | --- |
| `/` | Home |
| `/imobiliario/` | Setor |
| `/energia/` | Setor |
| `/educacao/` | Setor |
| `/financeiro/` | Setor |
| `/quem-somos/` | Institucional |
| `/contato/` | **NOVA** página (não existe no site atual) |
| `/[slug-do-projeto]/` | Páginas de projeto (geradas por collection) |
| `/404` | Página de erro |

Manter os **slugs atuais dos projetos na raiz** (ex.: `/izzy-campinas/`, `/suape/`) para preservar SEO e links existentes. Slugs oficiais:

| Setor | Categoria | Projeto | Slug |
| --- | --- | --- | --- |
| Imobiliário | Edifícios | Muse Itaim | `/muse/` |
| Imobiliário | Edifícios | Bosque Ipiranga | `/bosque-ipiranga/` |
| Imobiliário | Edifícios | Izzy Campinas | `/izzy-campinas/` |
| Imobiliário | Edifícios | Salma Tower | `/salma-tower/` |
| Imobiliário | Loteamentos | Alphagran | `/alphagram/` |
| Imobiliário | Loteamentos | Jardim dos Abreus | `/jardim-abreus/` |
| Imobiliário | Loteamentos | Residencial Dunamis | `/residencial-dunamis/` |
| Imobiliário | Loteamentos | Residencial Jandira | `/residencial-jandira/` |
| Imobiliário | Loteamentos | Residencial Manhattan | `/vilas-verdes/` |
| Imobiliário | Loteamentos | Saint Paul | `/saint-paul/` |
| Imobiliário | Terrenos | Esquina JK | `/esquina-jk/` |
| Imobiliário | Terrenos | Banco BIB | `/banco-bib/` |
| Imobiliário | Terrenos | Fazendas Itu | `/fazendas-itu/` |
| Energia | Geração | Guaçu Geração de Energia | `/guacu/` |
| Energia | Geração | Suape Termelétrica | `/suape/` |
| Energia | Transmissão | Água Vermelha Transmissora de Energia S.A. | `/agua-vermelha/` |
| Educação | Ensino | Unieduk | `/unieduk/` |
| Financeiro | Financeiro | Banco Industrial do Brasil (BIB) | `/banco-industrial-do-brasil/` |

**Observação:** no site atual, Salma Tower aparece tanto em "Edifícios" quanto em "Terrenos". Padrão a seguir: listar nas duas categorias, com uma única página.

## 4. Conteúdo oficial (copy revisada)

Usar **exatamente** os textos abaixo. Não parafrasear, não "melhorar" a copy por conta própria.

### 4.1 Navegação e rodapé (todas as páginas)

**Menu:** Imobiliário · Energia · Educação · Financeiro · Quem somos · Contato

**Rodapé:**

- Telefone: (11) 3049 9700 (link `tel:+551130499700`)
- Endereço: Av. Brigadeiro Faria Lima, 3555 | 16º Andar — São Paulo/SP | Brasil
- © Grupo 4M {ano atual}

Não incluir o crédito "Desenvolvido por Mindy Marketing" (era da agência do site antigo).

### 4.2 Home

**Hero:**

> Investimos e operamos negócios nos setores de energia e infraestrutura, real estate, bancos e educação.
>
> Somos um grupo privado de investimentos e operações, sediado em São Paulo, Brasil.

**4 blocos de setor** (cada um com imagem, título, texto e link "Conheça"):

1. **Imobiliário** — Planejamos, investimos, desenvolvemos e gerenciamos empreendimentos residenciais, comerciais e loteamentos urbanos, com foco em urbanização planejada, qualidade construtiva e geração de valor no longo prazo.
2. **Energia** — Investimos e participamos de projetos de geração de energia de grande porte, como Suape Termelétrica e Guaçu, contribuindo para a segurança energética e o fortalecimento da matriz regional.
3. **Educação** — Por meio da participação no Grupo Unieduk, atuamos no desenvolvimento de soluções educacionais voltadas à formação, capacitação e especialização de profissionais, preparando talentos para um mercado cada vez mais exigente e dinâmico.
4. **Financeiro** — Estruturamos e coordenamos operações financeiras, modelos de funding e soluções de capital que viabilizam, sustentam e aceleram cada uma das frentes do grupo.

### 4.3 Página Imobiliário

**Intro:**

> Planejamos, investimos, desenvolvemos e gerenciamos empreendimentos residenciais, comerciais e loteamentos urbanos, com foco em urbanização planejada, qualidade construtiva e geração de valor no longo prazo.
>
> Projetos como Salma Tower, Alphagran e Muse Itaim refletem nossa capacidade de identificar localizações estratégicas, estruturar produtos imobiliários alinhados à demanda do mercado e entregar empreendimentos com alto potencial de valorização e liquidez — contribuindo para a transformação positiva das cidades onde atuamos.

Depois, grade de projetos agrupada em **Edifícios**, **Loteamentos** e **Terrenos** (lista da seção 3).

### 4.4 Página Energia

**Intro:**

> Investimos e participamos de projetos de geração de energia de grande porte, como Suape Termelétrica e Guaçu, contribuindo para a segurança energética e o fortalecimento da matriz regional.
>
> Nossa atuação no setor é orientada por eficiência operacional, viabilidade econômica e visão de longo prazo, buscando projetos que gerem impacto positivo, estabilidade e retorno consistente.

Grade agrupada em **Geração** e **Transmissão**.

### 4.5 Página Educação

**Intro:**

> Por meio da participação no Grupo Unieduk, atuamos no desenvolvimento de soluções educacionais voltadas à formação, capacitação e especialização de profissionais, preparando talentos para um mercado cada vez mais exigente e dinâmico.
>
> Nosso compromisso com a educação está diretamente ligado à criação de capital humano qualificado, essencial para o crescimento sustentável dos negócios e da sociedade.

Destaque único: **Unieduk** (link para `/unieduk/`).

### 4.6 Página Financeiro

**Intro:**

> Estruturamos e coordenamos operações financeiras, modelos de funding e soluções de capital que viabilizam, sustentam e aceleram cada uma das frentes do grupo.
>
> A área financeira atua como pilar estratégico do Grupo 4M, garantindo governança, eficiência na alocação de recursos e integração entre os negócios, sempre com foco em crescimento sólido e disciplinado.

Destaque único: **BIB — Banco Industrial do Brasil** (link para `/banco-industrial-do-brasil/`).

### 4.7 Página Quem Somos

**Abertura:**

> **Investir, desenvolver e estruturar.**
>
> O Grupo 4M nasceu em São Paulo com um propósito claro: investir em projetos que transformem cidades e gerem valor duradouro.
>
> Hoje somos uma holding que reúne diferentes frentes de negócios – incorporação imobiliária, educação, energia, infraestrutura e área financeira – sempre com a mesma ideia em mente: gerar valor de forma sustentável, criar oportunidades e impulsionar o desenvolvimento econômico e social.

**Nossa história:**

> Em poucos anos de trajetória, crescemos e diversificamos. Começamos com investimentos em projetos imobiliários de alto padrão e, a partir dessa base sólida, expandimos para outros setores estratégicos.
>
> Entre os marcos mais importantes, vale destacar o desenvolvimento de empreendimentos residenciais e comerciais que elevaram o padrão de urbanização, como o Salma Tower, Alphagran e Muse Itaim, além de investimentos em educação, com o Grupo Unieduk, e em energia, com a Suape Termelétrica e a Guaçu.
>
> Esses projetos reforçam a infraestrutura de cidades e abrem caminho para novas oportunidades de crescimento.

**O que fazemos** (4 cards com ícone — usar os textos dos setores da seção 4.2; **ATENÇÃO:** o card Financeiro usa o texto de Financeiro, não o de Energia — ver seção 5, erro nº 2).

**Por que nos destacamos:**

> O que nos move é a capacidade de criar e transformar espaços urbanos em polos de desenvolvimento. Diversificamos nossas áreas de atuação para ser uma empresa sólida em qualquer cenário econômico.
>
> Somos reconhecidos pela excelência em planejamento e gestão de empreendimentos, atuando desde a aquisição de terrenos estratégicos até a entrega de projetos de alto padrão.
>
> Contamos com parcerias estratégicas no Brasil e no exterior, garantindo geração de empregos, melhorias de infraestrutura e impacto positivo para as comunidades.

**Nosso impacto** (4 blocos com imagem):

1. **Projetos imobiliários** — Empreendimentos como Salma Tower, Alphagran e Muse Itaim transformam regiões urbanas, criam novos espaços de convivência e impulsionam a valorização imobiliária.
2. **Energia** — Usinas como Suape Termelétrica e Guaçu fortalecem a infraestrutura energética e estimulam o desenvolvimento regional.
3. **Educação** — O Grupo Unieduk amplia o acesso ao conhecimento, capacitando profissionais e gerando inclusão social.
4. **Financeiro** — O Grupo 4M realizou a construção do Banco Industrial do Brasil em São Paulo.

**Fecho:** Em todas as iniciativas, levamos a sério o compromisso com sustentabilidade e uso responsável de recursos.

**Nossa missão:**

> A missão do Grupo 4M é investir, desenvolver e estruturar projetos que transformem cidades e gerem valor duradouro, promovendo crescimento econômico aliado a impacto social positivo e uso responsável dos recursos. Atuamos de forma integrada nos setores imobiliário, educacional, energético, de infraestrutura e financeiro, sempre com foco em planejamento estratégico, excelência na execução e visão de longo prazo.
>
> Buscamos criar empreendimentos que elevem o padrão urbano, fortaleçam a infraestrutura regional, ampliem o acesso à educação e contribuam para uma matriz energética mais robusta e eficiente.
>
> Nosso compromisso é gerar oportunidades, impulsionar o desenvolvimento das comunidades onde atuamos e construir negócios sólidos e sustentáveis, capazes de atravessar diferentes ciclos econômicos e deixar um legado.

**Nossos valores** (7 itens, título + texto):

1. **Visão de longo prazo** — Investimos com foco em crescimento sustentável, priorizando projetos sólidos, bem estruturados e capazes de gerar valor duradouro ao longo do tempo.
2. **Excelência em planejamento e execução** — Buscamos altos padrões de qualidade em todas as etapas dos nossos projetos, desde a concepção até a entrega, com gestão profissional e atenção aos detalhes.
3. **Diversificação com responsabilidade** — Atuamos em diferentes setores estratégicos para garantir solidez e resiliência, sempre avaliando riscos, oportunidades e impactos de forma consciente.
4. **Compromisso com o desenvolvimento urbano e social** — Acreditamos que nossos projetos devem contribuir para a melhoria das cidades, geração de empregos, fortalecimento da infraestrutura e avanço social das comunidades onde estamos presentes.
5. **Ética, transparência e governança** — Conduzimos nossos negócios com integridade, clareza e respeito às normas, construindo relações de confiança com parceiros, investidores, colaboradores e a sociedade.
6. **Sustentabilidade e uso responsável dos recursos** — Incorporamos práticas que valorizam a eficiência, a preservação ambiental e o equilíbrio entre crescimento econômico e responsabilidade socioambiental.
7. **Parcerias estratégicas e colaboração** — Valorizamos relações sólidas no Brasil e no exterior, acreditando que a colaboração é essencial para ampliar impacto, inovação e resultados consistentes.

### 4.8 Página Contato (nova)

**Título:** Fale com o Grupo 4M

Telefone em destaque (click-to-call), endereço completo, mapa incorporado opcional (embed leve do Google Maps ou imagem estática com link — não carregar script pesado de mapa na home).

Formulário (nome, e-mail, telefone, assunto, mensagem) conforme regra da seção 2.

### 4.9 Páginas de projeto

**Modelo de dados** (frontmatter da collection `projetos`):

```yaml
titulo: "Izzy Campinas"
slug: "izzy-campinas"
setor: "imobiliario" # imobiliario | energia | educacao | financeiro
categoria: "Edifícios" # Edifícios | Loteamentos | Terrenos | Geração | Transmissão | Ensino | Financeiro
tipo: "Empreendimento Residencial"
stats:
  - { label: "Área do terreno", valor: "661,25 m²" }
  - { label: "Área total construída", valor: "2.635,76 m²" }
imagem: "izzy-campinas.jpg"
descricao: "" # opcional; o site atual quase não tem texto por projeto
```

**Layout da página de projeto:** breadcrumb (Setor → Categoria → Projeto), imagem hero grande, tipo + stats em bloco de dados com numerais tabulares, e no fim "Outros projetos" (2–3 cards do mesmo setor). **Importante:** as páginas atuais são muito rasas; o novo layout deve ficar bonito mesmo só com imagem + tipo + stats, e escalar bem se o cliente mandar mais texto e fotos depois.

**Como obter os dados de cada projeto:** fazer fetch de cada URL da tabela da seção 3 no site atual (`https://www.grupo4m.com{slug}`) e extrair: o tipo do empreendimento, as metragens/stats e a imagem principal (meta `og:image`). Exemplo já validado: Izzy Campinas = "Empreendimento Residencial", terreno 661,25 m², área construída 2.635,76 m². Se alguma página estiver fora do ar ou sem dados, criar a entrada só com título/categoria/imagem placeholder e listar no relatório final o que ficou pendente.

## 5. Erros do site atual — corrigir obrigatoriamente

1. **Typo "Grup 4M"** no título da página de Energia (falta o "o"). No site novo, padronizar títulos como `{Página} | Grupo 4M`.
2. **Card "Financeiro" na página Quem Somos repete o texto de Energia** (erro de copiar/colar do site atual). Usar o texto correto de Financeiro (seção 4.2, item 4).
3. **"Alphagran" vs "Alphagram":** o texto corrido usa "Alphagran" e a URL usa `/alphagram/`. Padrão: escrever **Alphagran** em todos os textos e manter o slug `/alphagram/` (preserva SEO). Confirmar grafia oficial com o cliente (seção 11).
4. **Alt texts:** o site atual usa a mesma frase-chave gigante em todas as imagens (keyword stuffing). Escrever alts novos, curtos e descritivos do que a imagem mostra.
5. **"Alimentação":** aparece nos metadados do site atual como setor, mas não existe página nem menção real. Padrão: **não** incluir alimentação no site novo.
6. **Título/descrição inconsistentes** entre páginas (algumas usam `|`, outras `-`; Financeiro nem tem meta description). Padronizar tudo conforme a seção 9.

## 6. Assets — imagens do site atual

Baixar do site atual para `src/assets/` (depois otimizar via `astro:assets`), renomeando para nomes limpos:

| URL de origem (prefixo `https://www.grupo4m.com/wp-content/uploads/`) | Novo nome | Uso |
| --- | --- | --- |
| `2025/12/logo-1-grupo-4m-grupo-privado-de-investimentos-e-operacoes-energia-infraestrutura-real-estate-bancos-educacao-alimentacao.png` | `logo-grupo4m.png` | Logo (header) |
| `2025/12/cropped-logo-2-grupo-4m-grupo-privado-de-investimentos-e-operacoes-energia-infraestrutura-real-estate-bancos-educacao-alimentacao-270x270.png` | `favicon-src.png` | Favicon (gerar `.ico`/`.svg`/apple-touch a partir dele) |
| `2026/01/imagem-11-grupo-4m-investimento-imobiliario-educacao-energia-financeiro-empresarial-sao-paulo-brasil-1.jpg` | `home-hero.jpg` | Hero da home + OG image padrão (1920×1080) |
| `2026/01/imagem-3-grupo-4m-investimento-imobiliario-educacao-energia-financeiro-empresarial-sao-paulo-brasil.jpg` | `setor-imobiliario.jpg` | Card Imobiliário |
| `2026/01/imagem-4-grupo-4m-investimento-imobiliario-educacao-energia-financeiro-empresarial-sao-paulo-brasil.jpg` | `setor-energia.jpg` | Card Energia |
| `2026/01/imagem-5-grupo-4m-investimento-imobiliario-educacao-energia-financeiro-empresarial-sao-paulo-brasil.jpg` | `setor-educacao.jpg` | Card Educação |
| `2026/01/imagem-6-grupo-4m-investimento-imobiliario-educacao-energia-financeiro-empresarial-sao-paulo-brasil.jpg` | `setor-financeiro.jpg` | Card Financeiro |
| `2026/01/icone-1-...-sao-paulo-brasil.png` a `icone-4-...` (mesmo padrão de nome) | `icone-imobiliario.png` … `icone-financeiro.png` | Ícones "O que fazemos" |
| `2026/01/imagem-12-...-1.jpg` | `impacto-imobiliario.jpg` | Quem Somos / impacto |
| `2026/01/imagem-13-...-1.jpg` | `impacto-energia.jpg` | Quem Somos / impacto |
| `2026/01/imagem-14-...-1.jpg` | `impacto-educacao.jpg` | Quem Somos / impacto |
| `2026/01/imagem-15-...-1.jpg` | `impacto-financeiro.jpg` | Quem Somos / impacto |
| `2026/01/imagem-33-...-sao-paulo-brasil.jpg` | `imobiliario-hero.jpg` | Topo da página Imobiliário |
| `2026/01/imagem-17-...-sao-paulo-brasil.jpg` | `izzy-campinas.jpg` | Projeto Izzy Campinas |

Para os ícones 1–4 e as imagens 12–15, o padrão completo do nome de arquivo é o mesmo das outras (`...grupo-4m-investimento-imobiliario-educacao-energia-financeiro-empresarial-sao-paulo-brasil...`); se algum 404 der problema, abrir a página correspondente no site atual e copiar a URL exata do HTML.

**Imagens dos demais projetos:** extrair a `og:image` de cada página de projeto (processo da seção 4.9) e salvar como `{slug}.jpg`.

Se os downloads falharem por falta de acesso à rede, criar a pasta `src/assets/` com placeholders nos nomes corretos, gerar um script `scripts/baixar-assets.sh` com todos os `curl -L -o` prontos, e avisar o usuário para rodá-lo.

## 7. Direção de design

**Conceito: "solidez discreta"** — o site de uma holding que não precisa gritar. Muito espaço em branco, tipografia forte, fotografia grande, quase nenhum ornamento.

### Tokens

**Cores** (CSS custom properties; ajustar o acento se o logo baixado tiver cor de marca forte — o logo manda):

```css
--cor-grafite: #16191D; /* fundo escuro: header, footer, seções de respiro */
--cor-tinta: #1B1E23;   /* texto principal sobre fundo claro */
--cor-pedra: #F3F2EF;   /* fundo claro de seções alternadas (frio, não creme) */
--cor-branco: #FFFFFF;
--cor-aco: #6E7680;     /* texto secundário, legendas */
--cor-bronze: #A8875A;  /* acento único — filetes, marcadores, hover. Usar com muita parcimônia */
```

**Tipografia** (via `@fontsource`):

- **Display:** Newsreader (400 e 500). Títulos grandes, tracking levemente negativo.
- **Texto:** Archivo (400/500/600).
- **Dados:** Archivo com `font-variant-numeric: tabular-nums` para metragens, MW e telefone.
- **Escala:** 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64px, line-height generoso no corpo (1.6) e apertado nos títulos (1.05–1.15).

**Layout:** grid de 12 colunas, container máx. 1240px, seções com padding vertical generoso (96–140px no desktop). Fotos sangrando até a borda em momentos-chave; texto nunca com mais de ~70 caracteres por linha.

### Elemento de assinatura: a malha 4M

O nome da empresa é a estrutura do design: 4 frentes = malha de 4 módulos. Usar a numeração **01 Imobiliário / 02 Energia / 03 Educação / 04 Financeiro** como sistema recorrente (aqui a numeração tem significado real — são as 4 frentes do "4M"):

- Na home, os 4 setores em uma grade 2×2 (desktop) que vira coluna no mobile, cada um com seu índice 01–04 pequeno em bronze.
- Na página Quem Somos, "O que fazemos" e "Nosso impacto" reutilizam a mesma malha e os mesmos índices.
- Um filete fino em bronze (2px) como divisor de seção é o único ornamento permitido.

Este é o único gesto de identidade; todo o resto fica quieto. Não adicionar outros efeitos decorativos.

### Movimento

Uma única sequência orquestrada no load do hero (fade + leve subida, com stagger entre título, subtítulo e imagem). Scroll-reveal muito sutil (opacidade + 12px) nas seções. Hover discreto nos cards (imagem escala 1.03, título ganha o bronze). Respeitar `prefers-reduced-motion` desligando tudo isso.

### Proibições

Sem gradientes decorativos, sem glassmorphism, sem emojis, sem carrossel automático, sem sombras pesadas, sem visual genérico "creme + serifa + terracota", sem stock photos novas (usar só as fotos reais do grupo). Bordas retas ou raio máximo de 2–4px.

## 8. Componentes

- **Header** — logo à esquerda, menu à direita, fundo grafite (ou transparente sobre o hero virando grafite no scroll). Menu mobile em tela cheia, simples.
- **Footer** — grafite, logo, contato completo, links do menu, copyright.
- **Hero** — variações: home (foto grande + frase) e páginas internas (título + eyebrow do setor).
- **SectorCard** — índice 01–04, imagem, título, texto, link "Conheça".
- **ProjectCard** — imagem, categoria (eyebrow), título, link.
- **ProjectGrid** — agrupa ProjectCards por categoria com subtítulos (Edifícios/Loteamentos/…).
- **StatBlock** — label pequeno + valor grande em tabular-nums (metragens dos projetos).
- **ValueItem** — título + texto (lista de valores, "Por que nos destacamos").
- **ContactBlock** — telefone, endereço, (form quando habilitado).
- **SEO** — componente central de `<head>` (title, description, canonical, OG, JSON-LD).

## 9. SEO e metadados

- `lang="pt-BR"` no `<html>`.
- Padrão de título: `{Página} | Grupo 4M`; home: `Grupo 4M | Grupo privado de investimentos e operações`.
- **Meta descriptions (usar exatamente):**
  - **Home:** "Investimos e operamos negócios nos setores de energia e infraestrutura, real estate, bancos e educação. Grupo privado sediado em São Paulo."
  - **Imobiliário:** "Planejamos, investimos, desenvolvemos e gerenciamos empreendimentos residenciais, comerciais e loteamentos urbanos."
  - **Energia:** "Investimos e participamos de projetos de geração de energia de grande porte, como Suape Termelétrica e Guaçu."
  - **Educação:** "Por meio da participação no Grupo Unieduk, atuamos no desenvolvimento de soluções educacionais voltadas à formação, capacitação e especialização de profissionais."
  - **Financeiro:** "Estruturamos e coordenamos operações financeiras, modelos de funding e soluções de capital para as frentes do grupo."
  - **Quem Somos:** "Somos uma holding que reúne diferentes frentes de negócios: incorporação imobiliária, educação, energia, infraestrutura e área financeira."
  - **Contato:** "Fale com o Grupo 4M. Av. Brigadeiro Faria Lima, 3555, São Paulo/SP — (11) 3049 9700."
  - **Projetos:** gerar a partir de tipo + setor.
- OG/Twitter card em todas as páginas (imagem padrão `home-hero.jpg`; nos projetos, a imagem do projeto).
- `sitemap.xml` (integração `@astrojs/sitemap`) e `robots.txt`.
- JSON-LD `Organization` na home: nome, url, logo, telefone `+55-11-3049-9700`, endereço completo (`PostalAddress`).
- Canonical em todas as páginas.

## 10. Qualidade — critérios de aceite

- Todas as páginas do sitemap implementadas com a copy exata da seção 4.
- Os 6 erros da seção 5 corrigidos.
- Todas as 18 páginas de projeto geradas pela collection, com os dados extraídos do site atual.
- Responsivo impecável de 360px a 1440px+ (testar menu mobile).
- Lighthouse ≥ 95 nas quatro categorias (Performance, A11y, Best Practices, SEO) na home e em uma página de projeto.
- Contraste AA, foco visível em todos os elementos interativos, navegação completa por teclado, `prefers-reduced-motion` respeitado.
- Alts descritivos reais em todas as imagens (nada de keyword stuffing).
- Build estático (`astro build`) sem erros nem warnings; nenhuma dependência de servidor.
- Zero texto "lorem ipsum" e zero links quebrados (verificar internamente).

## 11. Pendências para confirmar com o cliente (não travar por causa delas)

| Pergunta | Padrão a seguir enquanto não houver resposta |
| --- | --- |
| Grafia oficial: Alphagran ou Alphagram? | Texto "Alphagran", slug `/alphagram/` |
| Salma Tower é Edifício, Terreno ou ambos? | Ambos (como no site atual) |
| Querem formulário de contato? Para qual e-mail? | Página de contato sem form (tel + endereço), form pronto atrás de env var |
| "Alimentação" entra como setor? | Não |
| Onde vão hospedar / domínio aponta para onde? | Build estático agnóstico de host |
| Há fotos e textos adicionais dos projetos? | Layout preparado para receber mais conteúdo depois |

## 12. Processo de trabalho (nesta ordem)

1. Scaffold do projeto Astro + Tailwind + fontes + estrutura de pastas.
2. Baixar e renomear os assets (seção 6); extrair dados dos projetos (seção 4.9).
3. Implementar os design tokens e o layout base (Header/Footer/SEO).
4. Home completa → validar visualmente (screenshot) e criticar contra a seção 7 antes de seguir.
5. Páginas de setor + collection de projetos + template de projeto.
6. Quem Somos e Contato.
7. SEO técnico (sitemap, robots, JSON-LD, redirects se necessário).
8. Passada final de QA contra a seção 10; rodar Lighthouse; corrigir; entregar relatório final com o que ficou pendente da seção 11.

Ao final, gerar um `README.md` curto: como rodar (`npm install && npm run dev`), como editar conteúdo (collections), como fazer deploy e como ativar o formulário.
