# Laço Livros: MVP de livros de fotos personalizados

> **Laço** é um nome provisório: troca em uma linha, no `js/config.js`.

Site de demonstração onde qualquer pessoa monta o próprio livro de fotos, com capa,
legendas e emojis, escolhe presentes extras (buquê, chocolates, almofada com foto…)
e faz o pedido. Ao confirmar, o site **gera de verdade o PDF que vai para a gráfica**.
Pagamento e envio são simulados nesta versão.

## Como a pessoa usa (5 etapas)

| Etapa | O que acontece |
| --- | --- |
| 1. Criar | Escolhe a ocasião (pedido de namoro, casamento, viagem a dois, viagem com amigos, aniversário, família, bebê ou livre), digita os nomes e seleciona as fotos. O livro se monta sozinho: capa, dedicatória, uma foto por página com legenda pronta e a página final (no pedido de namoro, a pergunta com as caixinhas "Sim / Claro que sim"). |
| 2. Personalizar | Editor com a página grande: toca na foto para trocar/enquadrar/dar zoom, escreve a legenda direto na página, cola e arrasta emojis, troca layout (foto + legenda, foto inteira, polaroid, duas fotos, só texto, pergunta), fonte, tamanho e cores. Adiciona, duplica, move e exclui páginas. Tudo salva sozinho no aparelho. |
| 3. Revisar | Prova digital folheável (o que aparece é o que vai para a gráfica), escolha do formato (Mini 15 cm, Clássico 20 cm, Grande 28 cm) e checagem automática: falta de foto, foto com pouca nitidez para o formato, texto longo demais, número mínimo de páginas. |
| 4. Presentes | Itens recomendados para a ocasião, com prévia usando a foto da capa (almofada, caneca, chaveiro, polaroids). Quantidade para lembrancinhas, mensagem do cartão e 10% de desconto levando 2 ou mais. |
| 5. Pagamento | Dados, endereço (com busca de CEP), frete com data estimada, Pix (5% off) ou cartão. **Simulado**: nenhum dado sai do navegador. |

Depois do pedido, a tela de confirmação mostra o acompanhamento, os pedidos aos parceiros
e o **arquivo de impressão**: PDF em 300 dpi, sangria de 3 mm, capa aberta
(contracapa + lombada calculada pelo número de páginas + capa) e miolo.

## Diferenciais já visíveis na demo

- **Rápido para montar:** o livro já nasce pronto a partir das fotos; a pessoa só ajusta.
- **Rápido para entregar:** produção em 48 h (configurável) e datas de entrega calculadas na hora.
- **Barato e transparente:** preço aparece no topo o tempo todo; páginas extras e descontos explícitos.
- **Presente completo:** extras por ocasião (flores, chocolates, almofada, lembrancinhas).
- **Sem retrabalho da gráfica:** o PDF sai pronto, no padrão de impressão.

## Rodar no computador

Não precisa instalar nada. Duas opções:

```bash
# opção 1: abrir direto
abra o arquivo index.html no Chrome, Edge ou Safari

# opção 2: servidor local (recomendado)
cd livros-personalizados
python3 -m http.server 8080   # depois acesse http://localhost:8080
```

Para publicar, suba a pasta inteira em qualquer hospedagem estática
(Netlify, Vercel, Cloudflare Pages ou GitHub Pages).

Para gerar um arquivo único (CSS e JS embutidos), útil para mandar a demo:

```bash
node tools/gerar-artifact.mjs build/laco-livros.html
```

## Onde mudar cada coisa

| Quero mudar… | Arquivo |
| --- | --- |
| Nome da marca, preços, formatos, páginas inclusas, prazo de produção, frete, descontos | `js/config.js` (início do arquivo) |
| Ocasiões: textos da capa, dedicatória, legendas sugeridas, emojis, presentes recomendados | `js/config.js` → `temas` |
| Presentes extras: nome, descrição, preço, fornecedor | `js/config.js` → `extras` |
| Especificação do arquivo da gráfica (dpi, sangria, espessura do papel) | `js/config.js` → `impressao` |
| Layouts das páginas | `js/book.js` → `LAYOUTS` |
| Cores e fontes do site | `css/app.css` (bloco `:root` no topo) |

## O que é simulado e o que falta para virar produto

| Hoje (demo) | Para produção |
| --- | --- |
| Pagamento é um botão de simulação | Integrar Mercado Pago, Pagar.me ou Stripe (Pix + cartão) |
| Pedido e fotos ficam só no navegador | Backend para receber pedidos e guardar fotos (ex.: Supabase/Firebase + armazenamento S3/R2) |
| "Enviado à gráfica" é simulado | Enviar o PDF e a ficha técnica para a gráfica parceira (API, e-mail ou FTP), conforme o gabarito dela |
| "Enviado aos parceiros" é simulado | Painel interno ou e-mail/WhatsApp automático para floricultura, chocolateria, estamparia |
| Frete com preço fixo | Cotação real (Correios / Melhor Envio) pelo CEP |
| Emojis usam a fonte do aparelho | Usar um conjunto fixo de emojis (Twemoji/Noto) para o PDF sair igual em qualquer celular |
| PDF em RGB | Confirmar com a gráfica se aceita RGB ou se exige CMYK/perfil de cor |
| — | Termos de uso, política de privacidade (LGPD), nota fiscal, atendimento por WhatsApp |

Recursos extras quando a demo roda como página do Claude: botão de baixar o PDF
e **"Sugerir legendas olhando a foto"** (IA). Fora do Claude, o site mostra as legendas
prontas da ocasião no lugar da IA.

## Estrutura

```
index.html            página única (as telas trocam pelo endereço #criar, #editor…)
css/app.css           visual
js/config.js          tudo que é do negócio (preços, ocasiões, presentes)
js/book.js            layouts, quebra de texto, preço, checagens
js/render.js          desenho das páginas (tela e impressão usam o mesmo layout)
js/pdf.js             geração do PDF da gráfica
js/images.js          leitura e compressão das fotos
js/samples.js         fotos de exemplo (ilustrações desenhadas no navegador)
js/store.js           salvamento no aparelho (IndexedDB)
js/flipbook.js        livro folheável
js/ui.js, js/app.js   topo, rodapé, navegação
js/views/*.js         telas: início, criar, editor, revisão, presentes, pagamento, pedido
```
