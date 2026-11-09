/* Presentes extras: recomendados pela ocasião + todos os outros */
(function (L) {
  'use strict';
  const h = L.h, cfg = L.config, S = L.state;
  L.views = L.views || {};

  L.views.presentes = {
    titulo: 'Presentes', grupo: 'fluxo', precisaProjeto: true,
    render(main) {
      const proj = S.projeto;
      proj.presentes = proj.presentes || {};
      const tema = L.tema(proj.tema);
      const box = h('div', { class: 'presentes' });
      main.append(box);

      const recomendados = tema.extras.map(L.extra).filter(Boolean);
      const outros = cfg.extras.filter((e) => !tema.extras.includes(e.id));

      const faixaKit = h('div', { class: 'kit', 'aria-live': 'polite' });
      const resumo = h('div', { class: 'presentes__resumo' });

      function atualizarResumo() {
        const p = L.preco(proj);
        const qtdKit = p.qtdKit, min = cfg.descontoKit.minimo, pct = Math.round(cfg.descontoKit.percentual * 100);
        L.clear(faixaKit).append(
          h('span', { class: 'kit__icone', html: L.svg('gift') }),
          p.descKit
            ? h('p', null, h('strong', null, `Desconto de ${pct}% aplicado:`), ` você economiza ${L.money(p.descKit)} nos presentes.`)
            : h('p', null, h('strong', null, `Leve ${min} presentes ou mais e ganhe ${pct}% de desconto neles.`), qtdKit ? ` Falta ${min - qtdKit}.` : ''));
        L.clear(resumo).append(
          h('div', { class: 'presentes__total' },
            h('span', null, 'Livro'), h('strong', null, L.money(p.livro.valor)),
            h('span', null, 'Presentes'), h('strong', null, L.money(p.somaExtras - p.descKit)),
            h('span', { class: 'presentes__sub' }, 'Total parcial'), h('strong', { class: 'presentes__sub' }, L.money(p.subtotal))));
        L.atualizarResumoTopo();
      }

      function cartao(e) {
        const sel = proj.presentes[e.id];
        const ativo = !!(sel && sel.qtd);
        const preco = L.precoExtra(e, proj);
        const card = h('article', { class: 'presente' + (ativo ? ' is-sel' : '') });
        const corpo = h('div', { class: 'presente__corpo' },
          h('h3', null, e.nome),
          h('p', { class: 'presente__desc' }, e.desc),
          h('p', { class: 'presente__preco' }, L.money(preco), e.quantidade ? h('small', null, ' cada') : null));
        const acoes = h('div', { class: 'presente__acoes' });
        const redesenhar = () => { card.replaceWith(cartao(e)); atualizarResumo(); };
        if (!ativo) {
          acoes.append(h('button', { type: 'button', class: 'btn btn--contorno btn--p', 'aria-label': `Adicionar ${e.nome}`, onClick: () => { proj.presentes[e.id] = { qtd: e.qtdPadrao || 1, texto: '' }; L.alterou('presente'); redesenhar(); } }, h('span', { html: L.svg('plus') }), 'Adicionar'));
        } else {
          if (e.quantidade) {
            acoes.append(h('div', { class: 'qtd', role: 'group', 'aria-label': 'Quantidade' },
              h('button', { type: 'button', class: 'btn-icone btn-icone--p', 'aria-label': 'Diminuir', html: L.svg('minus'), onClick: () => { sel.qtd = Math.max(0, sel.qtd - 1); if (!sel.qtd) delete proj.presentes[e.id]; L.alterou('presente'); redesenhar(); } }),
              h('span', { class: 'qtd__n', 'aria-live': 'polite' }, `${sel.qtd} un.`),
              h('button', { type: 'button', class: 'btn-icone btn-icone--p', 'aria-label': 'Aumentar', html: L.svg('plus'), onClick: () => { sel.qtd = Math.min(30, sel.qtd + 1); L.alterou('presente'); redesenhar(); } })));
          }
          acoes.append(h('button', { type: 'button', class: 'btn btn--adicionado btn--p', 'aria-label': `Remover ${e.nome}`, onClick: () => { delete proj.presentes[e.id]; L.alterou('presente'); redesenhar(); } }, h('span', { html: L.svg('check') }), 'Adicionado'));
          if (e.texto) {
            const id = 'msg-' + e.id;
            corpo.append(h('div', { class: 'campo' }, h('label', { for: id }, 'Mensagem do cartão'),
              h('textarea', { id, class: 'input', rows: '3', maxlength: '300', placeholder: 'Escreva aqui. Nós passamos para o papel à mão.', value: sel.texto || '', onInput: (ev) => { sel.texto = ev.target.value; L.alterou('presente'); } })));
          }
        }
        corpo.append(acoes);
        card.append(h('div', { class: 'presente__visual' }, L.visualExtra(e.id, proj)), corpo);
        return card;
      }

      L.add(box,
        h('div', { class: 'revisao__cabeca' },
          h('p', { class: 'eyebrow' }, 'Presentes'),
          h('h1', null, 'Quer completar o presente?'),
          h('p', { class: 'criar__sub' }, `Separamos itens que combinam com ${tema.nome.toLowerCase()}. Tudo chega junto com o livro, na mesma entrega.`)),
        faixaKit,
        h('h2', { class: 'grupo__titulo grupo__titulo--g' }, 'Combinam com o seu livro'),
        h('div', { class: 'presentes__grade' }, recomendados.map(cartao)),
        outros.length ? h('h2', { class: 'grupo__titulo grupo__titulo--g' }, 'Outros presentes') : null,
        outros.length ? h('div', { class: 'presentes__grade' }, outros.map(cartao)) : null,
        resumo,
        h('div', { class: 'acoes-fluxo' },
          h('a', { class: 'btn btn--fantasma', href: '#revisao' }, h('span', { html: L.svg('arrowLeft') }), 'Voltar'),
          h('a', { class: 'btn btn--primario', href: '#pagamento' }, 'Continuar para pagamento', h('span', { html: L.svg('arrowRight') }))));
      atualizarResumo();
    },
  };
})(window.L = window.L || {});
