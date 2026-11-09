/* =====================================================================
   CONFIGURAÇÃO DO NEGÓCIO
   Tudo o que muda sem programar fica aqui: marca, preços, prazos,
   formatos, ocasiões (temas), presentes extras e emojis.
   Valores em reais. Prazos em dias úteis.
   ===================================================================== */
(function (L) {
  'use strict';

  L.config = {
    marca: 'Laço',                      // nome provisório
    slogan: 'Livros de fotos que viram presente',
    demonstracao: true,                 // mostra os avisos de "pedido simulado"

    paginas: { inclusas: 20, minimo: 10, maximo: 60 },

    formatos: [
      { id: 'mini', nome: 'Mini', cm: 15, capa: 'Capa flexível', papel: 'Couché 150 g', preco: 59.9, paginaExtra: 1.9, capaDura: false },
      { id: 'classico', nome: 'Clássico', cm: 20, capa: 'Capa dura', papel: 'Couché fosco 170 g', preco: 89.9, paginaExtra: 2.5, capaDura: true, destaque: 'Mais escolhido' },
      { id: 'grande', nome: 'Grande', cm: 28, capa: 'Capa dura soft touch', papel: 'Couché fosco 210 g', preco: 139.9, paginaExtra: 3.9, capaDura: true },
    ],

    producaoDiasUteis: 2,               // "pronto em 48h"
    frete: [
      { id: 'expresso', nome: 'Expresso', dias: [1, 3], preco: 29.9 },
      { id: 'padrao', nome: 'Padrão', dias: [4, 7], preco: 14.9, gratisAcima: 199 },
    ],
    descontoPix: 0.05,
    descontoKit: { minimo: 2, percentual: 0.1 },   // 2+ presentes = 10% off neles

    // Especificação do arquivo que vai para a gráfica
    impressao: {
      dpi: 300,
      sangriaMm: 3,
      qualidadeJpeg: 0.9,
      folhaMm: 0.18,          // espessura de cada folha do miolo (lombada)
      capaDuraMm: 4,          // acréscimo da capa dura na lombada
      capaFlexivelMm: 0.6,
      dpiMinimoAviso: 150,    // abaixo disso avisamos que a foto pode perder nitidez
    },

    fontes: {
      titulo:     { nome: 'Elegante',   familia: 'Young Serif',   peso: 400, lh: 1.08, fallback: 'Georgia, "Times New Roman", serif' },
      classica:   { nome: 'Clássica',   familia: 'EB Garamond',   peso: 500, lh: 1.22, fallback: 'Garamond, Georgia, serif' },
      manuscrita: { nome: 'Manuscrita', familia: 'Caveat',        peso: 700, lh: 1.05, escala: 1.28, fallback: '"Segoe Print", "Bradley Hand", cursive' },
      moderna:    { nome: 'Moderna',    familia: 'Figtree',       peso: 600, lh: 1.25, escala: 0.9, fallback: 'system-ui, -apple-system, "Segoe UI", sans-serif' },
      maquina:    { nome: 'Máquina',    familia: 'Courier Prime', peso: 400, lh: 1.3, escala: 0.88, fallback: '"Courier New", monospace' },
    },

    cores: {
      fundos: ['#FFFFFF', '#FAF6F0', '#FCE8E6', '#E8F0F7', '#EAF3EA', '#FFF4D6', '#F1ECF8', '#1E1B1E'],
      textos: ['#1E1B1E', '#5E5154', '#9E1B34', '#1F2B4D', '#0E4F57', '#2F5D50', '#4B2E83', '#FFFFFF'],
    },

    emojis: {
      Amor: ['❤️', '🥰', '😍', '😘', '💕', '💖', '💘', '💌', '🌹', '💍', '🫶', '💑', '🤍', '💋'],
      Viagem: ['✈️', '🏖️', '🌴', '🌅', '🗺️', '🧳', '📸', '🏔️', '🚗', '⛺', '🌊', '🍹', '🎡', '🗽'],
      Festa: ['🎉', '🥳', '🎂', '🎈', '🎁', '🥂', '🍻', '🍾', '🎊', '✨', '🔥', '🎶'],
      Carinhas: ['😂', '😊', '😎', '🤪', '😭', '🥹', '😴', '🤩', '😜', '🙈', '👏', '🙌'],
      Natureza: ['🌸', '🌻', '🌈', '⭐', '🌙', '☀️', '🦋', '🐶', '🐱', '🍀', '🌷', '🐚'],
      Comida: ['🍕', '🍔', '🍦', '🍫', '☕', '🍷', '🍰', '🍓', '🥐', '🍿'],
    },

    /* ---------------------------------------------------------------
       OCASIÕES
       Placeholders nos textos: {de} {para} {grupo} {destino}
       {data} (12.10.2026) {dataLonga} {ano} {titulo} {subtitulo}
       --------------------------------------------------------------- */
    temas: [
      {
        id: 'namoro', nome: 'Pedido de namoro', resumo: 'Termina com a pergunta. A resposta fica no livro.',
        campos: [
          { k: 'de', label: 'Seu nome', ph: 'Pedro' },
          { k: 'para', label: 'Nome do seu amor', ph: 'Ana', padrao: 'você' },
          { k: 'data', label: 'Uma data especial', tipo: 'date', opcional: true },
        ],
        capa: { layout: 'capa-foto', titulo: 'A nossa história', subtitulo: '{de} & {para}', bg: '#9E1B34', cor: '#FFF1EC' },
        paginas: { bg: '#FFFFFF', cor: '#3A1D26', fonte: 'manuscrita' },
        dedicatoria: 'Para {para},\n\ncada página deste livro guarda um pedacinho da nossa história.\n\nCom amor, {de}',
        final: { layout: 'pergunta', texto: 'Quer namorar comigo?', opcoes: ['Sim', 'Claro que sim'] },
        contracapa: '{de} & {para}\n{ano}',
        legendas: ['O dia em que tudo começou', 'Seu sorriso mudou o meu dia', 'Nosso primeiro encontro', 'Eu já sabia ali', 'Meu lugar favorito é do seu lado', 'Você topa qualquer aventura', 'Cada foto, um motivo a mais', 'A gente combina demais'],
        emojis: ['❤️', '🥰', '🌹', '✨', '💌', '😍', '🫶', '💘'],
        extras: ['buque', 'chocolates', 'polaroids', 'cartao', 'caixa'],
      },
      {
        id: 'casamento', nome: 'Pedido de casamento', resumo: 'Da primeira foto até o “sim”.',
        campos: [
          { k: 'de', label: 'Seu nome', ph: 'Rafael' },
          { k: 'para', label: 'Nome do seu amor', ph: 'Júlia', padrao: 'meu amor' },
          { k: 'data', label: 'Data do pedido', tipo: 'date', opcional: true },
        ],
        capa: { layout: 'capa-moldura', titulo: 'Para sempre começa aqui', subtitulo: '{de} & {para}', bg: '#1F2B4D', cor: '#F1DFB4' },
        paginas: { bg: '#FFFFFF', cor: '#1F2B4D', fonte: 'classica' },
        dedicatoria: '{para},\n\nolhando estas fotos eu tive certeza: quero viver todas as próximas ao seu lado.\n\n{de}',
        final: { layout: 'pergunta', texto: 'Casa comigo?', opcoes: ['Sim!', 'Sim, mil vezes'] },
        contracapa: '{de} & {para}\n{data}',
        legendas: ['Desde o primeiro dia', 'O começo do para sempre', 'Nossas melhores memórias', 'Quero viver todas as próximas com você', 'Você é a minha casa', 'Lado a lado, sempre'],
        emojis: ['💍', '💐', '🥂', '❤️', '✨', '🕊️', '💒', '🤍'],
        extras: ['buque', 'chocolates', 'almofada', 'cartao', 'caixa'],
      },
      {
        id: 'viagem-casal', nome: 'Viagem a dois', resumo: 'A primeira de muitas viagens juntos.',
        campos: [
          { k: 'de', label: 'Seu nome', ph: 'Marina' },
          { k: 'para', label: 'Nome de quem viajou com você', ph: 'Theo', padrao: 'você' },
          { k: 'destino', label: 'Para onde vocês foram', ph: 'Fernando de Noronha', opcional: true },
          { k: 'data', label: 'Quando foi', tipo: 'date', opcional: true },
        ],
        capa: { layout: 'capa-foto', titulo: 'Nossa primeira viagem', subtitulo: '{destino} · {data}', bg: '#0E4F57', cor: '#F6E7C8' },
        paginas: { bg: '#FFFFFF', cor: '#0E4F57', fonte: 'manuscrita' },
        dedicatoria: '{para},\n\nobrigada por cada quilômetro, cada pôr do sol e cada risada.\n\n{de}',
        final: { layout: 'texto', texto: 'Para onde vamos na próxima?' },
        contracapa: '{de} & {para}\n{destino}',
        legendas: ['Primeira viagem, primeira de muitas', 'Pé na areia, coração em paz', 'Acordar com essa vista (e com você)', 'O pôr do sol mais bonito', 'Perdidos, mas juntos', 'Nosso cantinho no mundo'],
        emojis: ['✈️', '🏖️', '🌅', '🗺️', '🧳', '🌴', '📸', '🍹'],
        extras: ['almofada', 'polaroids', 'caneca', 'chaveiro', 'caixa'],
      },
      {
        id: 'amigos', nome: 'Viagem com amigos', resumo: 'Para dar de presente para a galera toda.',
        campos: [
          { k: 'grupo', label: 'Nome do grupo ou da viagem', ph: 'Galera de Floripa', padrao: 'A nossa turma' },
          { k: 'data', label: 'Quando foi', tipo: 'date', opcional: true },
        ],
        capa: { layout: 'capa-texto', titulo: '{grupo}', subtitulo: 'A viagem que ninguém vai esquecer · {ano}', bg: '#F2B33D', cor: '#231F20' },
        paginas: { bg: '#FFFFFF', cor: '#231F20', fonte: 'moderna' },
        dedicatoria: 'Para a melhor turma do mundo.\n\nO que acontece na viagem fica no livro.',
        final: { layout: 'texto', texto: 'Próxima viagem:\n________________' },
        contracapa: '{grupo}\n{ano}',
        legendas: ['O grupo mais caótico do Brasil', 'Ninguém dormiu, todo mundo sorriu', 'Quem estava lá sabe', 'Foto oficial da turma', 'A melhor parte foi o caminho', 'Já pode marcar a próxima?'],
        emojis: ['😂', '🍻', '🎉', '🤪', '🚐', '🏕️', '🔥', '📸'],
        extras: ['chaveiro', 'copia', 'caneca', 'polaroids', 'caixa'],
      },
      {
        id: 'aniversario', nome: 'Aniversário', resumo: 'Um ano inteiro de memórias em um presente.',
        campos: [
          { k: 'para', label: 'Nome de quem faz aniversário', ph: 'Carol' },
          { k: 'de', label: 'Quem está dando o presente', ph: 'Lu e Gabi' },
        ],
        capa: { layout: 'capa-moldura', titulo: 'Feliz aniversário, {para}!', subtitulo: 'Com amor, {de}', bg: '#4B2E83', cor: '#FFD9EC' },
        paginas: { bg: '#FFFFFF', cor: '#4B2E83', fonte: 'moderna' },
        dedicatoria: '{para},\n\nque esse novo ano seja tão especial quanto você.\n\n{de}',
        final: { layout: 'texto', texto: 'Que venham muitos anos e muitas fotos juntos.' },
        contracapa: 'Feliz aniversário!\n{ano}',
        legendas: ['Mais um ano ao seu lado', 'Você merece o mundo', 'As melhores risadas', 'Que venham muitos mais', 'Parabéns pra você!', 'Momentos que valem ouro'],
        emojis: ['🎂', '🎉', '🎈', '🥳', '🎁', '✨', '🥂', '💜'],
        extras: ['buque', 'chocolates', 'caneca', 'cartao', 'caixa'],
      },
      {
        id: 'familia', nome: 'Família', resumo: 'Para guardar e passar de geração em geração.',
        campos: [
          { k: 'grupo', label: 'Nome da família', ph: 'Família Souza', padrao: 'Nossa família' },
          { k: 'data', label: 'Uma data especial', tipo: 'date', opcional: true },
        ],
        capa: { layout: 'capa-foto', titulo: '{grupo}', subtitulo: 'Nossas memórias · {ano}', bg: '#2F5D50', cor: '#F4EFE6' },
        paginas: { bg: '#FFFFFF', cor: '#2F5D50', fonte: 'classica' },
        dedicatoria: 'Para quem esteve em cada foto e em cada abraço.',
        final: { layout: 'texto', texto: 'Obrigado por tudo.\nAmamos vocês.' },
        contracapa: '{grupo}\n{ano}',
        legendas: ['Onde tudo faz sentido', 'Domingo em família', 'Os melhores momentos são os simples', 'Raízes e asas', 'Casa cheia, coração cheio', 'Nossa gente'],
        emojis: ['🏡', '❤️', '☀️', '🌻', '🍰', '📷', '🤗', '🌳'],
        extras: ['almofada', 'caneca', 'copia', 'cartao', 'caixa'],
      },
      {
        id: 'bebe', nome: 'Primeiro ano do bebê', resumo: 'Do primeiro sorriso ao primeiro passo.',
        campos: [
          { k: 'para', label: 'Nome do bebê', ph: 'Helena' },
          { k: 'data', label: 'Data de nascimento', tipo: 'date', opcional: true },
        ],
        capa: { layout: 'capa-moldura', titulo: 'Meu primeiro ano', subtitulo: '{para} · {data}', bg: '#CFE3F2', cor: '#203A55' },
        paginas: { bg: '#FFFFFF', cor: '#203A55', fonte: 'moderna' },
        dedicatoria: 'Você chegou e mudou tudo.\n\nEste livro é sobre o seu primeiro ano.',
        final: { layout: 'texto', texto: 'E isso foi só o começo.' },
        contracapa: '{para}\n{ano}',
        legendas: ['Bem-vindo ao mundo', 'Primeiro sorriso', 'Primeiro banho', 'Primeiros passos', 'Crescendo rápido demais', 'Amor que não cabe em mim'],
        emojis: ['👶', '🍼', '🧸', '⭐', '🌙', '💙', '🎈', '🐣'],
        extras: ['almofada', 'caneca', 'cartao', 'caixa'],
      },
      {
        id: 'livre', nome: 'Do seu jeito', resumo: 'Página em branco para qualquer história.',
        campos: [
          { k: 'titulo', label: 'Título do livro', ph: 'Nosso livro', padrao: 'Nosso livro' },
          { k: 'subtitulo', label: 'Subtítulo', ph: 'Verão de 2026', opcional: true },
        ],
        capa: { layout: 'capa-texto', titulo: '{titulo}', subtitulo: '{subtitulo}', bg: '#1E1B1E', cor: '#FFFFFF' },
        paginas: { bg: '#FFFFFF', cor: '#1E1B1E', fonte: 'moderna' },
        dedicatoria: null,
        final: null,
        contracapa: '{titulo}',
        legendas: ['Um dia para lembrar', 'Momentos que ficam', 'Isso aqui foi demais', 'Para nunca esquecer'],
        emojis: ['⭐', '❤️', '✨', '📸', '🎉', '😊', '🌈', '🔥'],
        extras: ['almofada', 'caneca', 'polaroids', 'cartao', 'caixa'],
      },
    ],

    /* ---------------------------------------------------------------
       PRESENTES EXTRAS (comprados de parceiros ou produzidos por nós)
       usaFoto: o mockup usa a foto da capa do cliente
       quantidade: o cliente escolhe quantas unidades
       precoFator: preço relativo ao livro (cópia extra)
       --------------------------------------------------------------- */
    extras: [
      { id: 'buque', nome: 'Buquê de rosas vermelhas', desc: '12 rosas colombianas em papel kraft com laço de cetim.', preco: 129.9, fornecedor: 'Floricultura parceira' },
      { id: 'chocolates', nome: 'Caixa de bombons artesanais', desc: '12 bombons sortidos de chocolate belga.', preco: 54.9, fornecedor: 'Chocolateria parceira' },
      { id: 'almofada', nome: 'Almofada com a foto de vocês', desc: '40 × 40 cm, tecido aveludado, com a foto da capa.', preco: 69.9, fornecedor: 'Estamparia parceira', usaFoto: true },
      { id: 'caneca', nome: 'Caneca com foto', desc: 'Porcelana branca de 325 ml. Pode ir ao micro-ondas.', preco: 44.9, fornecedor: 'Estamparia parceira', usaFoto: true },
      { id: 'chaveiro', nome: 'Chaveiros com foto', desc: 'Lembrancinha em acrílico, frente e verso. Um para cada amigo.', preco: 19.9, fornecedor: 'Brindes parceiro', usaFoto: true, quantidade: true, qtdPadrao: 4 },
      { id: 'polaroids', nome: 'Kit 10 fotos estilo polaroid', desc: 'Fotos do livro em papel fotográfico, com mini prendedores.', preco: 34.9, fornecedor: 'Gráfica parceira', usaFoto: true },
      { id: 'copia', nome: 'Cópia extra do livro', desc: 'Um livro igualzinho para cada pessoa, com 30% de desconto.', precoFator: 0.7, fornecedor: 'Gráfica parceira', quantidade: true, qtdPadrao: 1 },
      { id: 'cartao', nome: 'Cartão escrito à mão', desc: 'Sua mensagem escrita com caneta nanquim em papel algodão.', preco: 12.9, fornecedor: 'Equipe Laço', texto: true },
      { id: 'caixa', nome: 'Caixa presente com laço', desc: 'Caixa rígida, papel de seda e laço de cetim vermelho.', preco: 19.9, fornecedor: 'Equipe Laço' },
    ],
  };
})(window.L = window.L || {});
