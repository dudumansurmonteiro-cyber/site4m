/* Revisão: prova digital (folheador), formato, checagens e todas as páginas */
(function (L) {
  'use strict';
  const h = L.h, cfg = L.config, S = L.state;
  L.views = L.views || {};

  L.views.revisao = {
    titulo: 'Revisar livro', grupo: 'fluxo', precisaProjeto: true,
    render(main) {
      const proj = S.projeto;
      const box = h('div', { class: 'revisao' });
      main.append(box);

      function desenhar() {
        L.clear(box);
        const itens = L.verificar(proj);
        const erros = itens.filter((i) => i.nivel === 'erro');
        const avisos = itens.filter((i) => i.nivel !== 'erro');
        const pl = L.precoLivro(proj);

        box.append(h('div', { class: 'revisao__cabeca' },
          h('p', { class: 'eyebrow' }, 'Prova digital'),
          h('h1', null, 'Confira seu livro'),
          h('p', { class: 'criar__sub' }, 'O que aparece aqui é exatamente o que vai para a gráfica. Folheie com calma.')));

        const lado = h('div', { class: 'revisao__lado' });
        box.append(h('div', { class: 'revisao__grade' }, h('div', { class: 'revisao__livro' }, L.criarFolheador(proj)), lado));

        // checagens
        const check = h('section', { class: 'checagem ' + (erros.length ? 'checagem--erro' : 'checagem--ok'), 'aria-labelledby': 'chk-titulo' },
          h('h2', { id: 'chk-titulo', class: 'checagem__titulo' },
            h('span', { html: L.svg(erros.length ? 'alert' : 'check') }),
            erros.length ? `Falta pouco: ${erros.length} ${erros.length === 1 ? 'ajuste' : 'ajustes'} antes de imprimir` : 'Tudo certo para imprimir'));
        if (itens.length) {
          check.append(h('ul', { class: 'checagem__lista' }, itens.map((it) => h('li', { class: 'checagem__item checagem__item--' + it.nivel },
            h('span', null, it.texto),
            it.pagina != null ? h('button', { type: 'button', class: 'link', onClick: () => { S.ui = { paginaAtual: it.pagina }; L.ir('editor'); } }, 'Corrigir') : null,
            it.acao === 'adicionar' ? h('button', { type: 'button', class: 'link', onClick: () => { S.ui = { paginaAtual: proj.paginas.length - 2 }; L.ir('editor'); } }, 'Adicionar páginas') : null))));
        } else {
          check.append(h('p', { class: 'dica' }, 'Fotos com boa resolução, textos dentro das margens e número de páginas certo.'));
        }
        lado.append(check);

        // formato
        lado.append(h('section', { class: 'grupo', 'aria-labelledby': 'fmt-titulo' },
          h('h2', { id: 'fmt-titulo', class: 'grupo__titulo grupo__titulo--g' }, 'Formato'),
          h('div', { class: 'formatos-op', role: 'radiogroup', 'aria-label': 'Formato do livro' }, cfg.formatos.map((f) => {
            const sel = proj.formato === f.id;
            const extras = Math.max(0, pl.paginas - cfg.paginas.inclusas);
            const valor = f.preco + extras * f.paginaExtra;
            return h('button', {
              type: 'button', role: 'radio', 'aria-checked': sel ? 'true' : 'false', class: 'formato-op' + (sel ? ' is-sel' : ''),
              onClick: () => { proj.formato = f.id; L.alterou('formato'); L.atualizarResumoTopo(); desenhar(); },
            },
              h('span', { class: 'formato-op__nome' }, f.nome, ' ', h('small', null, `${f.cm} × ${f.cm} cm`)),
              h('span', { class: 'formato-op__det' }, `${f.capa} · ${f.papel}`),
              h('span', { class: 'formato-op__preco' }, L.money(valor)),
              f.destaque ? h('span', { class: 'selo selo--p' }, f.destaque) : null);
          })),
          h('p', { class: 'dica' }, `${pl.paginas} páginas${pl.paginasExtras ? ` (${cfg.paginas.inclusas} inclusas + ${pl.paginasExtras} extras)` : ` (até ${cfg.paginas.inclusas} inclusas no preço)`}. Lombada de ${L.num(L.lombadaMm(proj), 1)} mm.`)));

        // todas as páginas
        box.append(h('section', { class: 'todas', 'aria-labelledby': 'todas-titulo' },
          h('h2', { id: 'todas-titulo', class: 'grupo__titulo grupo__titulo--g' }, 'Todas as páginas'),
          h('ol', { class: 'todas__grade' }, proj.paginas.map((p, i) => h('li', null,
            h('button', { type: 'button', class: 'todas__item', onClick: () => { S.ui = { paginaAtual: i }; L.ir('editor'); }, 'aria-label': `Editar ${L.nomePagina(proj, i)}` },
              h('span', { class: 'todas__pg' }, L.renderPagina(p, { modo: 'preview' })),
              h('span', { class: 'todas__n' }, L.nomePagina(proj, i))))))));

        const bloqueado = erros.length > 0;
        box.append(h('div', { class: 'acoes-fluxo' },
          h('a', { class: 'btn btn--fantasma', href: '#editor' }, h('span', { html: L.svg('arrowLeft') }), 'Voltar e editar'),
          bloqueado ? h('p', { class: 'acoes-fluxo__msg' }, 'Resolva os ajustes acima para continuar.') : null,
          h('button', { type: 'button', class: 'btn btn--primario', disabled: bloqueado, onClick: () => L.ir('presentes') }, 'Continuar para presentes', h('span', { html: L.svg('arrowRight') }))));
        void avisos;
      }
      desenhar();
    },
  };
})(window.L = window.L || {});
