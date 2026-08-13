#!/usr/bin/env bash
# Baixa as imagens reais do site atual (grupo4m.com) por cima dos placeholders,
# já renomeadas para os nomes limpos usados pelo código (CLAUDE.md, seção 6).
#
# Uso:  bash scripts/baixar-assets.sh
# Depois rode também:  node scripts/extrair-projetos.mjs
# (baixa a og:image das 18 páginas de projeto e relata tipo/metragens)
#
# Observação: o site atual bloqueia requisições sem User-Agent de navegador,
# por isso o -A abaixo. Rode este script de uma máquina com acesso normal
# à internet (ele falha em ambientes com proxy restritivo).

set -uo pipefail

BASE="https://www.grupo4m.com/wp-content/uploads"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
DESTINO="$(cd "$(dirname "$0")/.." && pwd)/src/assets"
FALHAS=()

baixar() {
  local url="$1" destino="$2"
  echo "→ ${destino#"$DESTINO"/}"
  if ! curl -fsSL --retry 3 --retry-delay 2 -A "$UA" --create-dirs -o "$destino" "$url"; then
    echo "  FALHOU: $url"
    FALHAS+=("$url")
  fi
}

# Padrão longo que o WordPress usa em quase todos os nomes de arquivo
P="grupo-4m-investimento-imobiliario-educacao-energia-financeiro-empresarial-sao-paulo-brasil"

# Logo e favicon
baixar "$BASE/2025/12/logo-1-grupo-4m-grupo-privado-de-investimentos-e-operacoes-energia-infraestrutura-real-estate-bancos-educacao-alimentacao.png" "$DESTINO/logo-grupo4m.png"
baixar "$BASE/2025/12/cropped-logo-2-grupo-4m-grupo-privado-de-investimentos-e-operacoes-energia-infraestrutura-real-estate-bancos-educacao-alimentacao-270x270.png" "$DESTINO/favicon-src.png"

# Home
baixar "$BASE/2026/01/imagem-11-$P-1.jpg" "$DESTINO/home-hero.jpg"
baixar "$BASE/2026/01/imagem-3-$P.jpg"  "$DESTINO/setor-imobiliario.jpg"
baixar "$BASE/2026/01/imagem-4-$P.jpg"  "$DESTINO/setor-energia.jpg"
baixar "$BASE/2026/01/imagem-5-$P.jpg"  "$DESTINO/setor-educacao.jpg"
baixar "$BASE/2026/01/imagem-6-$P.jpg"  "$DESTINO/setor-financeiro.jpg"

# Ícones "O que fazemos" (Quem Somos)
baixar "$BASE/2026/01/icone-1-$P.png" "$DESTINO/icone-imobiliario.png"
baixar "$BASE/2026/01/icone-2-$P.png" "$DESTINO/icone-energia.png"
baixar "$BASE/2026/01/icone-3-$P.png" "$DESTINO/icone-educacao.png"
baixar "$BASE/2026/01/icone-4-$P.png" "$DESTINO/icone-financeiro.png"

# Quem Somos / impacto
baixar "$BASE/2026/01/imagem-12-$P-1.jpg" "$DESTINO/impacto-imobiliario.jpg"
baixar "$BASE/2026/01/imagem-13-$P-1.jpg" "$DESTINO/impacto-energia.jpg"
baixar "$BASE/2026/01/imagem-14-$P-1.jpg" "$DESTINO/impacto-educacao.jpg"
baixar "$BASE/2026/01/imagem-15-$P-1.jpg" "$DESTINO/impacto-financeiro.jpg"

# Página Imobiliário
baixar "$BASE/2026/01/imagem-33-$P.jpg" "$DESTINO/imobiliario-hero.jpg"

# Izzy Campinas (URL conhecida; os demais projetos vêm do extrair-projetos.mjs)
baixar "$BASE/2026/01/imagem-17-$P.jpg" "$DESTINO/projetos/izzy-campinas.jpg"

echo
if [ ${#FALHAS[@]} -gt 0 ]; then
  echo "${#FALHAS[@]} download(s) falharam. Abra a página correspondente no site"
  echo "atual, copie a URL exata da imagem no HTML e baixe manualmente:"
  printf '  %s\n' "${FALHAS[@]}"
  exit 1
fi
echo "Todos os assets baixados. Agora rode:"
echo "  node scripts/extrair-projetos.mjs   # fotos e dados das páginas de projeto"
echo "  node scripts/gerar-favicon.mjs      # regenera o favicon.ico com o logo real"
