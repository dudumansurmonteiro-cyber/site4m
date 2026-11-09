/* Folheador: prévia do livro com páginas que viram em 3D. */
(function (L) {
  'use strict';
  const h = L.h;

  function faces(proj) {
    const capa = proj.paginas[0], contra = proj.paginas[proj.paginas.length - 1];
    const miolo = L.miolo(proj).slice();
    if (miolo.length % 2) miolo.push(null); // página em branco para fechar o caderno
    return [capa, 'guarda', ...miolo, 'guarda', contra];
  }

  function face(conteudo, lado, rotulo) {
    const el = h('div', { class: 'face face--' + lado });
    if (conteudo === 'guarda') el.append(h('div', { class: 'face__guarda' }));
    else if (conteudo === null) el.append(h('div', { class: 'face__branca' }));
    else el.append(L.renderPagina(conteudo, { modo: 'preview', rotulo }));
    return el;
  }

  L.criarFolheador = (proj, opts = {}) => {
    const lista = faces(proj);
    const nFolhas = lista.length / 2;
    const nMiolo = lista.length - 4;
    const descrever = (i) => {
      const pg = lista[i];
      if (!pg || pg === 'guarda') return 'Página em branco';
      if (pg.tipo === 'capa') return 'Capa: ' + (pg.titulo || '');
      if (pg.tipo === 'contracapa') return 'Contracapa';
      return `Página ${i - 1}` + (pg.texto ? ': ' + pg.texto.replace(/\n/g, ' ') : '');
    };

    const livro = h('div', { class: 'folheador__livro fechado-frente' });
    const folhas = [];
    for (let i = 0; i < nFolhas; i++) {
      const folha = h('div', { class: 'folha', style: { zIndex: nFolhas - i } }, face(lista[2 * i], 'frente', descrever(2 * i)), face(lista[2 * i + 1], 'verso', descrever(2 * i + 1)));
      folhas.push(folha);
      livro.append(folha);
    }

    const rotulo = h('span', { class: 'folheador__rotulo', 'aria-live': 'polite' });
    const ant = h('button', { type: 'button', class: 'btn-icone', 'aria-label': 'Página anterior', html: L.svg('left'), onClick: () => ir(-1) });
    const prox = h('button', { type: 'button', class: 'btn-icone', 'aria-label': 'Próxima página', html: L.svg('right'), onClick: () => ir(1) });
    const palco = h('div', { class: 'folheador__palco' }, livro);
    const raiz = h('div', {
      class: 'folheador' + (opts.compacto ? ' folheador--compacto' : ''), tabindex: '0', role: 'group',
      'aria-roledescription': 'livro', 'aria-label': 'Prévia do livro. Use as setas do teclado para folhear.',
    }, palco, h('div', { class: 'folheador__controles' }, ant, rotulo, prox));

    let atual = 0;
    function texto() {
      if (atual === 0) return 'Capa';
      if (atual === nFolhas) return 'Contracapa';
      const esq = 2 * atual - 1, dir = 2 * atual; // índices das faces visíveis
      const num = (i) => (i >= 2 && i <= nMiolo + 1 ? i - 1 : null);
      const a = num(esq), b = num(dir);
      if (a && b) return `Páginas ${a} e ${b}`;
      return `Página ${a || b}`;
    }
    function atualizar() {
      folhas.forEach((f, i) => f.classList.toggle('virada', i < atual));
      livro.classList.toggle('fechado-frente', atual === 0);
      livro.classList.toggle('fechado-tras', atual === nFolhas);
      rotulo.textContent = texto() + ` · ${atual + 1}/${nFolhas + 1}`;
      ant.disabled = atual === 0;
      prox.disabled = atual === nFolhas;
    }
    function ir(delta) {
      const novo = L.clamp(atual + delta, 0, nFolhas);
      if (novo === atual) return;
      const i = delta > 0 ? atual : atual - 1;
      const f = folhas[i];
      f.style.zIndex = nFolhas + 5;
      atual = novo;
      atualizar();
      let feito = false;
      const fim = () => {
        if (feito) return; feito = true;
        f.style.zIndex = i < atual ? i + 1 : nFolhas - i;
      };
      f.addEventListener('transitionend', fim, { once: true });
      setTimeout(fim, 950);
    }
    palco.addEventListener('click', (e) => {
      const r = palco.getBoundingClientRect();
      ir(e.clientX - r.left > r.width / 2 ? 1 : -1);
    });
    raiz.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); ir(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); ir(-1); }
    });
    // arrastar no celular
    let x0 = null;
    palco.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    palco.addEventListener('touchend', (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { ir(dx < 0 ? 1 : -1); e.preventDefault(); }
      x0 = null;
    });
    atualizar();
    raiz.ir = ir;
    raiz.irPara = (n) => { while (atual < n) ir(1); };
    return raiz;
  };
})(window.L = window.L || {});
