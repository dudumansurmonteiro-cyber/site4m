/* Página inicial (vitrine) */
(function (L) {
  'use strict';
  const h = L.h, cfg = L.config, S = L.state;
  L.views = L.views || {};

  const menorPreco = () => Math.min(...cfg.formatos.map((f) => f.preco));

  function hero() {
    const livroBox = h('div', { class: 'hero__livro' },
      h('p', { class: 'nota-mao', 'aria-hidden': 'true' }, 'toque para folhear'),
      h('div', { class: 'hero__placeholder', 'aria-hidden': 'true' }));
    const sec = h('section', { class: 'hero', 'aria-labelledby': 'hero-titulo' },
      h('div', { class: 'hero__fita', 'aria-hidden': 'true' }),
      h('div', { class: 'hero__inner' },
        h('div', { class: 'hero__texto' },
          h('p', { class: 'eyebrow eyebrow--claro' }, 'Livros de fotos personalizados'),
          h('h1', { id: 'hero-titulo' }, 'O presente que conta a história de vocês.'),
          h('p', { class: 'hero__sub' }, 'Monte um livro com suas fotos, legendas e emojis em poucos minutos, direto do celular. A gente imprime em até 48 horas e entrega junto com flores, chocolates ou uma almofada com a foto de vocês.'),
          h('div', { class: 'hero__ctas' },
            h('a', { class: 'btn btn--claro btn--g', href: '#criar', onClick: () => { S.criacao = null; } }, 'Criar meu livro', h('span', { html: L.svg('arrowRight') })),
            S.projeto ? h('a', { class: 'btn btn--contorno-claro btn--g', href: '#editor' }, 'Continuar meu livro') : null),
          h('ul', { class: 'hero__fatos' },
            h('li', null, h('strong', null, `${cfg.producaoDiasUteis * 24}h`), h('span', null, 'para imprimir')),
            h('li', null, h('strong', null, L.money(menorPreco())), h('span', null, 'livro a partir de')),
            h('li', null, h('strong', null, `${Math.round(cfg.descontoPix * 100)}% off`), h('span', null, 'pagando no Pix')))),
        livroBox));
    // folheador com o livro de exemplo (fotos de exemplo são geradas no navegador)
    L.garantirAmostras(L.CENAS).then(() => {
      if (!livroBox.isConnected) return;
      const f = L.criarFolheador(L.livroExemplo(), { compacto: true });
      livroBox.querySelector('.hero__placeholder').replaceWith(f);
    });
    return sec;
  }

  function comoFunciona() {
    const passos = [
      ['Escolha a ocasião', 'Pedido de namoro, viagem, aniversário… Cada ocasião já vem com capa, cores e frases prontas.'],
      ['Envie suas fotos', 'Selecione todas de uma vez. O livro se monta sozinho, uma foto por página.'],
      ['Deixe com a cara de vocês', 'Escreva legendas, cole emojis, troque o layout e as cores. Tudo com prévia na hora.'],
      ['Receba em casa', `Imprimimos em até ${cfg.producaoDiasUteis * 24} horas e enviamos com os presentes que você escolher.`],
    ];
    return h('section', { class: 'secao', id: 'como-funciona', 'aria-labelledby': 'cf-titulo' },
      h('div', { class: 'secao__inner' },
        h('div', { class: 'secao__cabeca' },
          h('p', { class: 'eyebrow' }, 'Como funciona'),
          h('h2', { id: 'cf-titulo' }, 'Do celular para as suas mãos em 4 passos'),
          h('p', { class: 'secao__sub' }, 'Criar é grátis. Você só paga quando decidir pedir.')),
        h('ol', { class: 'passos' }, passos.map(([t, d], i) =>
          h('li', { class: 'passo' }, h('span', { class: 'passo__n', 'aria-hidden': 'true' }, i + 1), h('h3', null, t), h('p', null, d))))));
  }

  function ocasioes() {
    const grade = h('div', { class: 'temas' });
    const sec = h('section', { class: 'secao secao--mesa', id: 'ocasioes', 'aria-labelledby': 'oc-titulo' },
      h('div', { class: 'secao__inner' },
        h('div', { class: 'secao__cabeca' },
          h('p', { class: 'eyebrow' }, 'Ocasiões'),
          h('h2', { id: 'oc-titulo' }, 'Um livro para cada momento'),
          h('p', { class: 'secao__sub' }, 'Comece por um modelo pronto e mude o que quiser.')),
        grade));
    L.garantirAmostras(L.CENAS).then(() => {
      cfg.temas.forEach((t) => {
        grade.append(h('button', { type: 'button', class: 'tema', onClick: () => L.comecarComTema(t.id) },
          L.livroCapa(L.capaDoTema(t.id), 'Capa de exemplo: ' + t.nome),
          h('span', { class: 'tema__nome' }, t.nome),
          h('span', { class: 'tema__resumo' }, t.resumo)));
      });
    });
    return sec;
  }

  function presentes() {
    const livro = cfg.formatos.find((f) => f.id === 'classico') || cfg.formatos[0];
    const combos = [
      { titulo: 'Pedido de namoro ou casamento', texto: 'O livro termina com a pergunta. Junto, um buquê de rosas e uma caixa de bombons.', extras: ['buque', 'chocolates'], tema: 'namoro' },
      { titulo: 'Viagem a dois', texto: 'Para lembrar da primeira viagem juntos: uma almofada com a foto de vocês.', extras: ['almofada'], tema: 'viagem-casal' },
      { titulo: 'Viagem com amigos', texto: 'Lembrancinhas para a galera: chaveiros com foto e uma cópia do livro para cada um.', extras: ['chaveiro', 'copia'], tema: 'amigos' },
    ];
    const grade = h('div', { class: 'combos' });
    const sec = h('section', { class: 'secao', id: 'presentes-extras', 'aria-labelledby': 'pr-titulo' },
      h('div', { class: 'secao__inner' },
        h('div', { class: 'secao__cabeca' },
          h('p', { class: 'eyebrow' }, 'Presentes'),
          h('h2', { id: 'pr-titulo' }, 'Complete a surpresa'),
          h('p', { class: 'secao__sub' }, `Cada ocasião tem presentes que combinam. Tudo chega junto, na mesma entrega. Levando ${cfg.descontoKit.minimo} ou mais, você ganha ${Math.round(cfg.descontoKit.percentual * 100)}% de desconto neles.`)),
        grade));
    L.garantirAmostras(L.CENAS).then(() => {
      combos.forEach((c) => {
        const projEx = L.criarLivro({ temaId: c.tema, campos: L.EXEMPLOS[c.tema].campos, imagens: [L.ID_AMOSTRA(L.EXEMPLOS[c.tema].cena), L.ID_AMOSTRA('praia'), L.ID_AMOSTRA('estrada')] });
        const capa = projEx.paginas[0];
        const precoExtras = c.extras.reduce((s, id) => { const e = L.extra(id); return s + (e.precoFator ? livro.preco * e.precoFator : e.preco); }, 0);
        const kit = c.extras.filter((id) => id !== 'copia').length >= cfg.descontoKit.minimo ? precoExtras * cfg.descontoKit.percentual : 0;
        grade.append(h('article', { class: 'combo' },
          h('div', { class: 'combo__cena combo__cena--' + c.extras.length }, h('div', { class: 'combo__livro' }, L.livroCapa(capa)), c.extras.map((id) => L.visualExtra(id, projEx))),
          h('div', { class: 'combo__texto' },
            h('h3', null, c.titulo),
            h('p', null, c.texto),
            h('p', { class: 'combo__preco' }, 'Livro + presentes a partir de ', h('strong', null, L.money(livro.preco + precoExtras - kit))),
            h('button', { type: 'button', class: 'btn btn--contorno btn--p', onClick: () => L.comecarComTema(c.tema) }, 'Começar este livro'))));
      });
    });
    return sec;
  }

  function precos() {
    const maior = Math.max(...cfg.formatos.map((f) => f.cm));
    return h('section', { class: 'secao secao--mesa', id: 'precos', 'aria-labelledby': 'pc-titulo' },
      h('div', { class: 'secao__inner' },
        h('div', { class: 'secao__cabeca' },
          h('p', { class: 'eyebrow' }, 'Formatos e preços'),
          h('h2', { id: 'pc-titulo' }, 'Preço justo, sem letra miúda'),
          h('p', { class: 'secao__sub' }, `Todos os formatos já incluem ${cfg.paginas.inclusas} páginas. Você escolhe o formato no final, depois de ver o livro pronto.`)),
        h('div', { class: 'formatos' }, cfg.formatos.map((f) =>
          h('article', { class: 'formato' + (f.destaque ? ' formato--destaque' : '') },
            f.destaque ? h('span', { class: 'selo' }, f.destaque) : null,
            h('div', { class: 'formato__escala', 'aria-hidden': 'true' }, h('span', { style: { '--h': Math.round((f.cm / maior) * 64) + 'px' } })),
            h('h3', null, f.nome, ' ', h('span', { class: 'formato__cm' }, `${f.cm} × ${f.cm} cm`)),
            h('p', { class: 'formato__preco' }, L.money(f.preco)),
            h('ul', { class: 'formato__ficha' },
              h('li', null, f.capa),
              h('li', null, `Miolo em ${f.papel.toLowerCase()}`),
              h('li', null, `${cfg.paginas.inclusas} páginas inclusas`),
              h('li', null, `+ ${L.money(f.paginaExtra)} por página extra`)))))));
  }

  function prazo() {
    const p = L.prazo('expresso');
    return h('section', { class: 'faixa-prazo', 'aria-labelledby': 'pz-titulo' },
      h('div', { class: 'faixa-prazo__inner' },
        h('div', null,
          h('p', { class: 'eyebrow eyebrow--claro' }, 'Prazo'),
          h('h2', { id: 'pz-titulo' }, 'Rápido de verdade'),
          h('p', null, 'Seu arquivo vai direto para a gráfica assim que o pedido é confirmado. Sem fila de aprovação manual.')),
        h('ol', { class: 'linha-tempo' },
          h('li', null, h('strong', null, 'Hoje'), h('span', null, 'Você monta o livro e faz o pedido')),
          h('li', null, h('strong', null, L.fmtData(p.producao, 'semana')), h('span', null, 'Livro impresso, encadernado e embalado')),
          h('li', null, h('strong', null, 'até ' + L.fmtData(p.max, 'semana')), h('span', null, 'Chega na sua casa com frete expresso')))));
  }

  function duvidas() {
    const perguntas = [
      ['Preciso criar conta?', 'Não. Você monta o livro direto no site e só informa seus dados na hora de pedir.'],
      ['Posso ver o livro antes de pagar?', 'Sim. Antes do pagamento você folheia a prova digital, que é exatamente o arquivo que vai para a gráfica.'],
      ['E se a foto estiver com pouca qualidade?', 'Na revisão avisamos quais fotos podem sair sem nitidez no formato escolhido, antes de você pedir.'],
      ['Como funcionam os presentes?', 'Flores e chocolates vêm de parceiros selecionados e chegam na mesma entrega do livro. Almofada, caneca e chaveiros são feitos com a sua foto.'],
      ['Quantas páginas o livro pode ter?', `De ${cfg.paginas.minimo} a ${cfg.paginas.maximo} páginas. O preço já inclui ${cfg.paginas.inclusas}; cada página a mais tem um valor pequeno, mostrado na hora.`],
      ['Minhas fotos ficam salvas?', 'Nesta demonstração, o livro fica salvo só no seu aparelho, para você continuar depois. Nada é enviado para servidores.'],
    ];
    return h('section', { class: 'secao', id: 'duvidas', 'aria-labelledby': 'dv-titulo' },
      h('div', { class: 'secao__inner secao__inner--estreito' },
        h('div', { class: 'secao__cabeca' }, h('p', { class: 'eyebrow' }, 'Dúvidas'), h('h2', { id: 'dv-titulo' }, 'Perguntas frequentes')),
        h('div', { class: 'faq' }, perguntas.map(([q, r]) => h('details', { class: 'faq__item' }, h('summary', null, q), h('p', null, r))))));
  }

  function chamadaFinal() {
    return h('section', { class: 'chamada' },
      h('div', { class: 'chamada__inner' },
        h('h2', null, 'Suas fotos merecem sair do celular.'),
        h('p', null, 'Leva poucos minutos e você só paga quando pedir.'),
        h('a', { class: 'btn btn--primario btn--g', href: '#criar', onClick: () => { S.criacao = null; } }, 'Criar meu livro')));
  }

  L.views.inicio = {
    titulo: 'Livros de fotos personalizados', grupo: 'site',
    render(main) {
      main.append(hero(), comoFunciona(), ocasioes(), presentes(), precos(), prazo(), duvidas(), chamadaFinal());
    },
  };
})(window.L = window.L || {});
