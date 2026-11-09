/* Criar: ocasião → nomes → fotos → livro montado automaticamente */
(function (L) {
  'use strict';
  const h = L.h, cfg = L.config, S = L.state;
  L.views = L.views || {};

  function estado() {
    if (!S.criacao) S.criacao = { passo: 1, temaId: null, campos: {}, fotos: [] };
    return S.criacao;
  }

  function cabecalho(passo, titulo, sub) {
    return h('div', { class: 'criar__cabeca' },
      h('p', { class: 'eyebrow' }, `Passo ${passo} de 3`),
      h('h1', null, titulo),
      sub ? h('p', { class: 'criar__sub' }, sub) : null);
  }

  /* ---------- passo 1: ocasião ---------- */
  function passo1(box, redesenhar) {
    const c = estado();
    box.append(cabecalho(1, 'Qual é a ocasião?', 'Cada ocasião já vem com capa, cores, frases e presentes que combinam. Dá para mudar tudo depois.'));
    if (S.projeto) {
      box.append(h('div', { class: 'aviso aviso--info' },
        h('span', { html: L.svg('book') }),
        h('p', null, 'Você tem um livro em andamento. ', h('a', { href: '#editor' }, 'Continuar editando'), ' ou escolha uma ocasião para começar outro.')));
    }
    const grade = h('div', { class: 'temas temas--criar' });
    box.append(grade);
    L.garantirAmostras(L.CENAS).then(() => {
      cfg.temas.forEach((t) => {
        grade.append(h('button', {
          type: 'button', class: 'tema' + (c.temaId === t.id ? ' is-sel' : ''), 'aria-pressed': c.temaId === t.id ? 'true' : 'false',
          onClick: () => { if (c.temaId !== t.id) c.campos = {}; c.temaId = t.id; c.passo = 2; redesenhar(); },
        }, L.livroCapa(L.capaDoTema(t.id), 'Capa de exemplo: ' + t.nome), h('span', { class: 'tema__nome' }, t.nome), h('span', { class: 'tema__resumo' }, t.resumo)));
      });
    });
  }

  /* ---------- passo 2: nomes ---------- */
  function passo2(box, redesenhar) {
    const c = estado();
    const tema = L.tema(c.temaId);
    const ex = L.EXEMPLOS[tema.id] || {};
    box.append(cabecalho(2, 'Para quem é o livro?', `${tema.nome}: usamos estas informações na capa e na dedicatória. Você pode editar os textos depois.`));
    const previa = h('div', { class: 'criar__previa' });
    const desenharPrevia = () => {
      L.clear(previa);
      const campos = Object.assign({}, c.campos);
      tema.campos.forEach((cp) => { if (!campos[cp.k] && !cp.opcional) campos[cp.k] = (ex.campos || {})[cp.k] || ''; });
      previa.append(L.livroCapa(L.capaDoTema(tema.id, campos), 'Prévia da capa'), h('p', { class: 'criar__legenda-previa' }, 'Prévia da capa'));
    };
    const form = h('form', { class: 'form criar__form', novalidate: true });
    tema.campos.forEach((cp) => {
      const id = 'campo-' + cp.k;
      const input = h('input', {
        id, name: cp.k, type: cp.tipo || 'text', class: 'input', value: c.campos[cp.k] || '',
        placeholder: cp.tipo === 'date' ? null : 'Ex.: ' + (cp.ph || ''), autocomplete: 'off', maxlength: '40',
        required: !cp.opcional, onInput: (e) => { c.campos[cp.k] = e.target.value; erro.hidden = true; desenharPrevia(); },
      });
      form.append(h('div', { class: 'campo' },
        h('label', { for: id }, cp.label, cp.opcional ? h('span', { class: 'opcional' }, ' (opcional)') : null), input));
    });
    const erro = h('p', { class: 'campo__erro', role: 'alert', hidden: true }, 'Preencha os campos obrigatórios para continuar.');
    form.append(erro, h('div', { class: 'acoes' },
      h('button', { type: 'button', class: 'btn btn--fantasma', onClick: () => { c.passo = 1; redesenhar(); } }, h('span', { html: L.svg('arrowLeft') }), 'Trocar ocasião'),
      h('button', { type: 'submit', class: 'btn btn--primario' }, 'Continuar', h('span', { html: L.svg('arrowRight') }))));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const faltando = tema.campos.filter((cp) => !cp.opcional && !String(c.campos[cp.k] || '').trim());
      L.$$('.input', form).forEach((i) => i.setAttribute('aria-invalid', faltando.some((f) => 'campo-' + f.k === i.id) ? 'true' : 'false'));
      if (faltando.length) { erro.hidden = false; L.$('#campo-' + faltando[0].k).focus(); return; }
      c.passo = 3; redesenhar();
    });
    box.append(h('div', { class: 'criar__duas' }, form, previa));
    desenharPrevia();
    setTimeout(() => { const p = form.querySelector('input'); if (p && matchMedia('(min-width: 720px)').matches) p.focus({ preventScroll: true }); }, 30);
  }

  /* ---------- passo 3: fotos ---------- */
  function passo3(box, redesenhar) {
    const c = estado();
    const tema = L.tema(c.temaId);
    box.append(cabecalho(3, 'Agora, as fotos', `Escolha de 1 a ${cfg.paginas.maximo} fotos. Cada uma vira uma página, com legenda pronta para você editar.`));
    const status = h('p', { class: 'criar__status', 'aria-live': 'polite' });
    const barra = h('div', { class: 'progresso', hidden: true }, h('span'));
    const lista = h('ol', { class: 'fotos-sel', 'aria-label': 'Fotos escolhidas' });
    const montar = h('button', { type: 'button', class: 'btn btn--primario btn--g' });

    async function adicionar(files) {
      if (!files.length) return;
      barra.hidden = false;
      const { ok, erros } = await L.processarArquivos(files, (i, n) => {
        status.textContent = i < n ? `Preparando fotos: ${i + 1} de ${n}…` : '';
        barra.firstChild.style.width = (i / n) * 100 + '%';
      });
      barra.hidden = true;
      c.fotos.push(...ok.map((r) => r.id));
      if (erros.length) L.toast(erros[0] + (erros.length > 1 ? ` (+${erros.length - 1})` : ''), { tipo: 'erro', tempo: 6000 });
      atualizar();
    }

    async function usarExemplos() {
      status.textContent = 'Preparando fotos de exemplo…';
      const cenas = L.CENAS.slice(0, 8);
      await L.garantirAmostras(cenas);
      for (const cena of cenas) await L.garantirAmostraEmAlta(L.ID_AMOSTRA(cena));
      cenas.forEach((cena) => { const id = L.ID_AMOSTRA(cena); if (!c.fotos.includes(id)) c.fotos.push(id); });
      status.textContent = '';
      atualizar();
    }

    const zona = h('div', { class: 'zona-fotos' },
      h('span', { class: 'zona-fotos__icone', html: L.svg('images') }),
      h('p', { class: 'zona-fotos__titulo' }, 'Arraste as fotos para cá ou'),
      h('button', { type: 'button', class: 'btn btn--primario', onClick: async () => adicionar(await L.escolherArquivos({ multiplos: true })) }, h('span', { html: L.svg('upload') }), 'Escolher fotos'),
      h('p', { class: 'zona-fotos__dica' }, 'JPG ou PNG. Fotos do celular funcionam direto.'),
      h('button', { type: 'button', class: 'btn btn--fantasma btn--p', onClick: usarExemplos }, 'Sem fotos agora? Usar fotos de exemplo'));
    zona.addEventListener('dragover', (e) => { e.preventDefault(); zona.classList.add('is-sobre'); });
    zona.addEventListener('dragleave', () => zona.classList.remove('is-sobre'));
    zona.addEventListener('drop', (e) => {
      e.preventDefault(); zona.classList.remove('is-sobre');
      adicionar(Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith('image/')));
    });

    function atualizar() {
      L.clear(lista);
      c.fotos.forEach((id, i) => {
        const url = L.imgUrl(id);
        if (!url) return;
        lista.append(h('li', { class: 'fotos-sel__item' },
          h('img', { src: url, alt: `Foto ${i + 1}` }),
          h('span', { class: 'fotos-sel__n' }, i + 1),
          h('button', { type: 'button', class: 'fotos-sel__tirar', 'aria-label': `Remover foto ${i + 1}`, html: L.svg('x'), onClick: () => { c.fotos.splice(i, 1); atualizar(); } })));
      });
      const n = c.fotos.length;
      L.clear(montar);
      montar.append(n ? `Montar meu livro com ${n} ${n === 1 ? 'foto' : 'fotos'}` : 'Montar sem fotos (adiciono depois)', h('span', { html: L.svg('arrowRight') }));
      if (n > cfg.paginas.maximo) status.textContent = `O livro aceita até ${cfg.paginas.maximo} fotos. Remova ${n - cfg.paginas.maximo}.`;
    }

    montar.addEventListener('click', async () => {
      if (c.fotos.length > cfg.paginas.maximo) return;
      if (S.projeto) {
        const ok = await L.confirmar({ titulo: 'Começar um livro novo?', texto: 'O livro que você estava montando será substituído por este.', ok: 'Começar novo', perigo: true });
        if (!ok) return;
      }
      // amostras precisam da versão em alta antes de ir para o livro
      for (const id of c.fotos) if (id.startsWith('amostra-')) { await L.garantirAmostraEmAlta(id); const r = L.img(id); L.addImagem(r, true); }
      let imagens = c.fotos.slice();
      const proj = L.criarLivro({ temaId: tema.id, campos: c.campos, imagens });
      if (!imagens.length) {
        // sem fotos: cria páginas prontas para receber as fotos depois
        const P = tema.paginas;
        const fim = proj.paginas.length - (tema.final ? 2 : 1);
        const novas = Array.from({ length: 8 }, (_, i) => L.novaPagina('miolo', 'foto-legenda', { texto: tema.legendas[i % tema.legendas.length], bg: P.bg, cor: P.cor, fonte: P.fonte }));
        proj.paginas.splice(fim, 0, ...novas);
        proj.paginas[0].layout = tema.capa.layout;
      }
      S.projeto = proj;
      S.ui = { paginaAtual: 0 };
      S.criacao = null;
      L.alterou('novo');
      L.ir('editor');
      L.toast('Seu livro está pronto. Agora deixe com a cara de vocês!');
    });

    box.append(zona, barra, status, lista,
      h('div', { class: 'acoes acoes--fim' },
        h('button', { type: 'button', class: 'btn btn--fantasma', onClick: () => { c.passo = 2; redesenhar(); } }, h('span', { html: L.svg('arrowLeft') }), 'Voltar'),
        montar));
    atualizar();
  }

  L.views.criar = {
    titulo: 'Criar meu livro', grupo: 'fluxo',
    render(main) {
      const box = h('div', { class: 'criar' });
      main.append(box);
      const redesenhar = () => {
        L.clear(box);
        const c = estado();
        if (c.passo > 1 && !c.temaId) c.passo = 1;
        [passo1, passo2, passo3][c.passo - 1](box, redesenhar);
        window.scrollTo({ top: 0 });
      };
      redesenhar();
    },
  };
})(window.L = window.L || {});
