#!/usr/bin/env bash
# Baixa as imagens reais do site atual (www.grupo4m.com) para src/assets/,
# substituindo os placeholders gerados por scripts/gerar-placeholders.mjs.
#
# Uso: bash scripts/baixar-assets.sh
# Requer: curl, acesso à internet.
#
# Origem dos nomes: seção 6 do CLAUDE.md.

set -uo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ASSETS="$RAIZ/src/assets"
PROJETOS="$ASSETS/projetos"
PAGINAS="$RAIZ/scripts/paginas-site-atual"
BASE="https://www.grupo4m.com"
UPLOADS="$BASE/wp-content/uploads"
SUFIXO="grupo-4m-investimento-imobiliario-educacao-energia-financeiro-empresarial-sao-paulo-brasil"

mkdir -p "$ASSETS" "$PROJETOS" "$PAGINAS"

FALHAS=()

baixar() { # baixar <url> <destino>
  local url="$1" destino="$2"
  echo "→ $url"
  if curl -fsSL --retry 2 -o "$destino.tmp" "$url"; then
    mv "$destino.tmp" "$destino"
    echo "  OK: $destino"
  else
    rm -f "$destino.tmp"
    echo "  FALHOU (mantendo placeholder): $destino"
    FALHAS+=("$url")
  fi
}

echo "== Logo e favicon =="
baixar "$UPLOADS/2025/12/logo-1-grupo-4m-grupo-privado-de-investimentos-e-operacoes-energia-infraestrutura-real-estate-bancos-educacao-alimentacao.png" "$ASSETS/logo-grupo4m.png"
baixar "$UPLOADS/2025/12/cropped-logo-2-grupo-4m-grupo-privado-de-investimentos-e-operacoes-energia-infraestrutura-real-estate-bancos-educacao-alimentacao-270x270.png" "$ASSETS/favicon-src.png"

echo "== Home e setores =="
baixar "$UPLOADS/2026/01/imagem-11-$SUFIXO-1.jpg" "$ASSETS/home-hero.jpg"
baixar "$UPLOADS/2026/01/imagem-3-$SUFIXO.jpg" "$ASSETS/setor-imobiliario.jpg"
baixar "$UPLOADS/2026/01/imagem-4-$SUFIXO.jpg" "$ASSETS/setor-energia.jpg"
baixar "$UPLOADS/2026/01/imagem-5-$SUFIXO.jpg" "$ASSETS/setor-educacao.jpg"
baixar "$UPLOADS/2026/01/imagem-6-$SUFIXO.jpg" "$ASSETS/setor-financeiro.jpg"

echo "== Ícones 'O que fazemos' =="
baixar "$UPLOADS/2026/01/icone-1-$SUFIXO.png" "$ASSETS/icone-imobiliario.png"
baixar "$UPLOADS/2026/01/icone-2-$SUFIXO.png" "$ASSETS/icone-energia.png"
baixar "$UPLOADS/2026/01/icone-3-$SUFIXO.png" "$ASSETS/icone-educacao.png"
baixar "$UPLOADS/2026/01/icone-4-$SUFIXO.png" "$ASSETS/icone-financeiro.png"

echo "== Quem Somos / impacto =="
baixar "$UPLOADS/2026/01/imagem-12-$SUFIXO-1.jpg" "$ASSETS/impacto-imobiliario.jpg"
baixar "$UPLOADS/2026/01/imagem-13-$SUFIXO-1.jpg" "$ASSETS/impacto-energia.jpg"
baixar "$UPLOADS/2026/01/imagem-14-$SUFIXO-1.jpg" "$ASSETS/impacto-educacao.jpg"
baixar "$UPLOADS/2026/01/imagem-15-$SUFIXO-1.jpg" "$ASSETS/impacto-financeiro.jpg"

echo "== Página Imobiliário =="
baixar "$UPLOADS/2026/01/imagem-33-$SUFIXO.jpg" "$ASSETS/imobiliario-hero.jpg"

echo "== Páginas de projeto (og:image de cada uma) =="
SLUGS=(
  muse bosque-ipiranga izzy-campinas salma-tower alphagram jardim-abreus
  residencial-dunamis residencial-jandira vilas-verdes saint-paul esquina-jk
  banco-bib fazendas-itu guacu suape agua-vermelha unieduk
  banco-industrial-do-brasil
)

for slug in "${SLUGS[@]}"; do
  pagina="$PAGINAS/$slug.html"
  echo "→ $BASE/$slug/"
  if curl -fsSL --retry 2 -o "$pagina" "$BASE/$slug/"; then
    og=$(grep -o '<meta[^>]*property="og:image"[^>]*>' "$pagina" \
      | grep -o 'content="[^"]*"' | head -1 | sed 's/content="//;s/"$//')
    if [ -n "$og" ]; then
      baixar "$og" "$PROJETOS/$slug.jpg"
    else
      echo "  og:image não encontrada em $BASE/$slug/ (mantendo placeholder)"
      FALHAS+=("$BASE/$slug/ (og:image)")
    fi
  else
    rm -f "$pagina"
    echo "  página fora do ar: $BASE/$slug/ (mantendo placeholder)"
    FALHAS+=("$BASE/$slug/")
  fi
done

echo
if [ ${#FALHAS[@]} -eq 0 ]; then
  echo "Todos os assets foram baixados com sucesso."
else
  echo "Concluído com ${#FALHAS[@]} falha(s) — placeholders mantidos para:"
  printf '  - %s\n' "${FALHAS[@]}"
  echo "Se alguma URL deu 404, abra a página correspondente no site atual e copie a URL exata do HTML (ver CLAUDE.md, seção 6)."
fi

echo
echo "As páginas HTML dos projetos ficaram salvas em scripts/paginas-site-atual/."
echo "Rode 'node scripts/extrair-dados.mjs' para extrair tipo/stats de cada projeto e conferir o frontmatter em src/content/projetos/."
