/* Peças de interface compartilhadas: topo, rodapé, modal, capas de exemplo,
   ilustrações dos presentes. */
(function (L) {
  'use strict';
  const h = L.h, cfg = L.config, S = L.state;

  /* ---------- exemplos usados na vitrine e como placeholders ---------- */
  L.EXEMPLOS = {
    namoro: { campos: { de: 'Pedro', para: 'Ana', data: '2026-06-12' }, cena: 'cidade' },
    casamento: { campos: { de: 'Rafael', para: 'Júlia', data: '2026-09-20' }, cena: 'rodagigante' },
    'viagem-casal': { campos: { de: 'Marina', para: 'Theo', destino: 'Noronha', data: '2026-03-14' }, cena: 'praia' },
    amigos: { campos: { grupo: 'Galera de Floripa', data: '2026-01-10' }, cena: 'acampamento' },
    aniversario: { campos: { para: 'Carol', de: 'Lu e Gabi' }, cena: 'fogos' },
    familia: { campos: { grupo: 'Família Souza' }, cena: 'piquenique' },
    bebe: { campos: { para: 'Helena', data: '2025-11-02' }, cena: 'baloes' },
    livre: { campos: { titulo: 'Verão 2026', subtitulo: 'Um ano para lembrar' }, cena: 'montanha' },
  };

  // Capa de exemplo de uma ocasião (com foto de exemplo)
  L.capaDoTema = (temaId, campos) => {
    const ex = L.EXEMPLOS[temaId] || L.EXEMPLOS.livre;
    const proj = L.criarLivro({ temaId, campos: campos || ex.campos, imagens: [L.ID_AMOSTRA(ex.cena)] });
    return proj.paginas[0];
  };
  L.livroCapa = (pagina, rotulo) => h('div', { class: 'livro-capa' }, L.renderPagina(pagina, { modo: 'preview', rotulo }));

  // Livro de exemplo da vitrine (pedido de namoro)
  L.livroExemplo = () => {
    const cenas = ['cidade', 'praia', 'rodagigante', 'piquenique', 'montanha', 'baloes', 'estrada', 'fogos'];
    const proj = L.criarLivro({ temaId: 'namoro', campos: L.EXEMPLOS.namoro.campos, imagens: cenas.map(L.ID_AMOSTRA) });
    const ad = (i, e, x, y, s, r) => proj.paginas[i] && proj.paginas[i].adesivos.push({ id: L.uid('a'), e, x, y, s, r });
    ad(2, '✨', 0.86, 0.14, 92, 12);
    ad(3, '🌅', 0.88, 0.8, 80, -8);
    ad(4, '🎡', 0.8, 0.16, 84, 10);
    ad(6, '❤️', 0.87, 0.84, 78, -12);
    ad(10, '🌹', 0.5, 0.88, 110, 0);
    return proj;
  };

  /* ---------- ilustrações dos presentes ---------- */
  const SVG = {
    buque: `<svg viewBox="0 0 200 160" aria-hidden="true">
      <ellipse cx="62" cy="64" rx="24" ry="10" transform="rotate(-38 62 64)" fill="#3E7B4F"/>
      <ellipse cx="138" cy="64" rx="24" ry="10" transform="rotate(38 138 64)" fill="#3E7B4F"/>
      <ellipse cx="100" cy="30" rx="9" ry="20" fill="#4F8F5E"/>
      <path d="M60 74 100 152 140 74z" fill="#D9BC97"/>
      ${[[78, 56], [100, 44], [122, 56], [88, 72], [112, 72], [100, 60]].map(([x, y], i) =>
        `<circle cx="${x}" cy="${y}" r="${i === 5 ? 15 : 16}" fill="${i % 2 ? '#B10E2B' : '#C8102E'}"/><path d="M${x - 7} ${y}a7 7 0 1 1 7 7a4 4 0 0 1-4-4" stroke="#7E0A1E" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join('')}
      <path d="M66 86 100 152 134 86c-10 8-56 8-68 0z" fill="#E8D3B6"/>
      <path d="M100 114c-9-11-23-9-21-1 2 7 14 6 21 1zM100 114c9-11 23-9 21-1-2 7-14 6-21 1z" fill="#C8102E"/>
      <path d="M98 115l-9 22 5-2 3 4 3-23zM102 115l9 22-5-2-3 4-3-23z" fill="#A00D25"/>
      <circle cx="100" cy="114" r="4" fill="#A00D25"/></svg>`,
    chocolates: `<svg viewBox="0 0 200 160" aria-hidden="true">
      <g transform="rotate(-9 100 46)"><rect x="34" y="20" width="132" height="44" rx="5" fill="#C8102E"/><rect x="94" y="20" width="12" height="44" fill="#E9C46A"/></g>
      <rect x="30" y="58" width="140" height="86" rx="6" fill="#5A2E1F"/>
      <rect x="38" y="66" width="124" height="70" rx="4" fill="#3B1D13"/>
      ${Array.from({ length: 12 }, (_, i) => { const x = 54 + (i % 4) * 31, y = 80 + Math.floor(i / 4) * 21; const c = ['#7B4A2F', '#A0673F', '#4A2A1C', '#C4935F'][(i + Math.floor(i / 4)) % 4];
        return `<circle cx="${x}" cy="${y}" r="9.5" fill="${c}"/><ellipse cx="${x - 3}" cy="${y - 3}" rx="3" ry="2" fill="#fff" opacity=".22"/>`; }).join('')}</svg>`,
    cartao: `<svg viewBox="0 0 200 160" aria-hidden="true">
      <rect x="32" y="62" width="136" height="80" rx="4" fill="#EBDDCF"/>
      <path d="M32 64 100 20l68 44z" fill="#E1CDB9"/>
      <rect x="48" y="28" width="104" height="82" rx="3" fill="#FFFFFF" transform="rotate(-4 100 69)"/>
      <text x="100" y="66" text-anchor="middle" transform="rotate(-4 100 69)" font-family="Caveat, cursive" font-weight="700" font-size="24" fill="#1D1517">Te amo!</text>
      <path d="M66 84h66M70 94h56" stroke="#C9BBB0" stroke-width="2" transform="rotate(-4 100 69)" stroke-linecap="round"/>
      <path d="M32 66 100 108l68-42v76H32z" fill="#F4E9DE"/>
      <circle cx="100" cy="104" r="11" fill="#C8102E"/><path d="M100 110s-6-3.6-6-7.4a3.3 3.3 0 0 1 6-1.8 3.3 3.3 0 0 1 6 1.8c0 3.8-6 7.4-6 7.4z" fill="#FBE4E6"/></svg>`,
    caixa: `<svg viewBox="0 0 200 160" aria-hidden="true">
      <rect x="48" y="74" width="104" height="70" rx="3" fill="#FFFFFF" stroke="#E6DCDA" stroke-width="2"/>
      <rect x="40" y="58" width="120" height="22" rx="3" fill="#FFFFFF" stroke="#E6DCDA" stroke-width="2"/>
      <rect x="92" y="58" width="16" height="86" fill="#C8102E"/>
      <g transform="translate(62 18) scale(1.6)">${L.LOGO_PATHS.map((d) => `<path d="${d}" fill="#C8102E"/>`).join('')}</g></svg>`,
  };

  // Ilustração (ou mockup com a foto do cliente) de um presente
  L.visualExtra = (id, proj) => {
    const capa = proj && proj.paginas[0];
    const fotoCapa = (capa && capa.fotos[0] && capa.fotos[0].img) || L.ID_AMOSTRA('praia');
    const fotos = proj ? L.miolo(proj).map((p) => p.fotos[0] && p.fotos[0].img).filter(Boolean) : [];
    const url = (fid) => L.imgUrl(fid) || L.imgUrl(L.ID_AMOSTRA('praia')) || '';
    const img = (fid) => h('img', { src: url(fid), alt: '', decoding: 'async' });
    const wrap = h('div', { class: 'visual visual--' + id });
    switch (id) {
      case 'almofada': wrap.append(h('div', { class: 'mock-almofada' }, img(fotoCapa))); break;
      case 'caneca': wrap.append(h('div', { class: 'mock-caneca' }, h('div', { class: 'mock-caneca__corpo' }, img(fotoCapa)), h('div', { class: 'mock-caneca__alca' }))); break;
      case 'chaveiro': wrap.append(h('div', { class: 'mock-chaveiro' }, h('span', { class: 'mock-chaveiro__argola' }), h('div', { class: 'mock-chaveiro__placa' }, img(fotoCapa)))); break;
      case 'polaroids': {
        const lista = [fotos[0] || fotoCapa, fotos[1] || fotoCapa, fotos[2] || fotoCapa];
        wrap.append(h('div', { class: 'mock-polaroids' }, lista.map((f) => h('div', { class: 'mock-polaroid' }, img(f)))));
        break;
      }
      case 'copia': {
        const pg = capa || L.capaDoTema('amigos');
        wrap.append(h('div', { class: 'mock-copias' }, L.livroCapa(pg), L.livroCapa(pg)));
        break;
      }
      default: wrap.innerHTML = SVG[id] || SVG.caixa;
    }
    return wrap;
  };

  /* ---------- modal e confirmação (alert/confirm não funcionam em todo lugar) ---------- */
  L.modal = ({ titulo, conteudo, largura = 'm', aoFechar }) => {
    const anterior = document.activeElement;
    const fechar = () => {
      fundo.remove();
      document.removeEventListener('keydown', tecla);
      document.body.classList.remove('com-modal');
      if (anterior && anterior.focus) anterior.focus({ preventScroll: true });
      aoFechar && aoFechar();
    };
    const tecla = (e) => { if (e.key === 'Escape') fechar(); };
    const btnFechar = h('button', { type: 'button', class: 'btn-icone', 'aria-label': 'Fechar', html: L.svg('x'), onClick: fechar });
    const caixa = h('div', { class: 'modal__caixa modal__caixa--' + largura },
      h('div', { class: 'modal__topo' }, h('h2', { class: 'modal__titulo' }, titulo), btnFechar), conteudo);
    const fundo = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': titulo }, caixa);
    fundo.addEventListener('click', (e) => { if (e.target === fundo) fechar(); });
    document.addEventListener('keydown', tecla);
    document.body.append(fundo);
    document.body.classList.add('com-modal');
    btnFechar.focus({ preventScroll: true });
    return { fechar, caixa };
  };

  L.confirmar = ({ titulo, texto, ok = 'Confirmar', cancelar = 'Cancelar', perigo }) =>
    new Promise((resolve) => {
      let resposta = false;
      const corpo = h('div', { class: 'confirmar' },
        h('p', null, texto),
        h('div', { class: 'confirmar__acoes' },
          h('button', { type: 'button', class: 'btn btn--contorno', onClick: () => m.fechar() }, cancelar),
          h('button', { type: 'button', class: 'btn ' + (perigo ? 'btn--perigo' : 'btn--primario'), onClick: () => { resposta = true; m.fechar(); } }, ok)));
      const m = L.modal({ titulo, conteudo: corpo, largura: 'p', aoFechar: () => resolve(resposta) });
    });

  /* ---------- topo ---------- */
  const ETAPAS = [['criar', 'Criar'], ['editor', 'Personalizar'], ['revisao', 'Revisar'], ['presentes', 'Presentes'], ['pagamento', 'Pagamento']];
  L.ETAPAS = ETAPAS;

  const logo = () => h('a', { class: 'marca', href: '#inicio', 'aria-label': cfg.marca + ' Livros, página inicial' },
    h('span', { class: 'marca__laco', html: L.logoSvg() }), h('span', { class: 'marca__nome' }, cfg.marca));

  L.irParaSecao = (id) => {
    const alvo = () => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); };
    if (L.rotaAtual().nome !== 'inicio') { L.ir('inicio'); setTimeout(alvo, 60); } else alvo();
  };

  function textoSalvo() {
    return { salvando: 'Salvando…', salvo: 'Salvo neste aparelho', indisponivel: 'Não foi possível salvar neste navegador' }[S.salvo] || '';
  }

  L.renderTopo = (topo, rota, view) => {
    L.clear(topo);
    const inner = h('div', { class: 'topo__inner' });
    topo.append(inner);
    inner.append(logo());
    if (view.grupo === 'fluxo') {
      topo.classList.add('topo--fluxo');
      const idxAtual = ETAPAS.findIndex(([id]) => id === rota.nome);
      const lista = h('ol', { class: 'etapas', 'aria-label': 'Etapas do pedido' });
      ETAPAS.forEach(([id, nome], i) => {
        const liberada = id === 'criar' || !!S.projeto;
        const atual = i === idxAtual;
        const item = liberada && !atual
          ? h('a', { href: '#' + id, class: 'etapa' + (i < idxAtual ? ' is-feita' : '') }, h('span', { class: 'etapa__n' }, i + 1), h('span', { class: 'etapa__nome' }, nome))
          : h('span', { class: 'etapa' + (atual ? ' is-atual' : ' is-bloqueada'), 'aria-current': atual ? 'step' : null }, h('span', { class: 'etapa__n' }, i + 1), h('span', { class: 'etapa__nome' }, nome));
        lista.append(h('li', null, item));
      });
      inner.append(h('nav', { class: 'topo__etapas', 'aria-label': 'Etapas' }, lista,
        h('p', { class: 'etapas__mobile' }, `Etapa ${idxAtual + 1} de ${ETAPAS.length} · `, h('strong', null, ETAPAS[idxAtual] ? ETAPAS[idxAtual][1] : ''))));
      if (S.projeto && rota.nome !== 'criar') {
        const p = L.preco(S.projeto);
        inner.append(h('div', { class: 'topo__resumo' },
          h('span', { class: 'topo__salvo', 'data-salvo': S.salvo }, textoSalvo()),
          h('span', { class: 'topo__preco' }, h('small', null, 'Total parcial'), h('strong', null, L.money(p.subtotal)))));
      }
    } else {
      topo.classList.remove('topo--fluxo');
      const nav = h('nav', { class: 'topo__nav', 'aria-label': 'Principal' },
        [['como-funciona', 'Como funciona'], ['ocasioes', 'Ocasiões'], ['presentes-extras', 'Presentes'], ['precos', 'Preços'], ['duvidas', 'Dúvidas']]
          .map(([id, nome]) => h('button', { type: 'button', class: 'topo__link', onClick: () => L.irParaSecao(id) }, nome)));
      const acoes = h('div', { class: 'topo__acoes' },
        S.pedidos.length ? h('a', { class: 'topo__link', href: '#pedidos' }, 'Meus pedidos') : null,
        h('a', { class: 'btn btn--primario btn--p', href: S.projeto ? '#editor' : '#criar' }, S.projeto ? 'Continuar meu livro' : 'Criar meu livro'));
      inner.append(nav, acoes);
    }
  };

  // Atualiza só o preço e o "salvo" sem redesenhar o topo
  L.atualizarResumoTopo = () => {
    const preco = L.$('.topo__preco strong');
    if (preco && S.projeto) preco.textContent = L.money(L.preco(S.projeto).subtotal);
    const salvo = L.$('.topo__salvo');
    if (salvo) { salvo.textContent = textoSalvo(); salvo.dataset.salvo = S.salvo; }
  };

  /* ---------- rodapé ---------- */
  L.renderRodape = (rodape, view) => {
    L.clear(rodape);
    if (view.grupo === 'fluxo') { rodape.hidden = true; return; }
    rodape.hidden = false;
    rodape.append(h('div', { class: 'rodape__inner' },
      h('div', { class: 'rodape__marca' }, logo(), h('p', null, cfg.slogan + '.')),
      h('div', { class: 'rodape__col' }, h('h2', null, 'Ocasiões'), h('ul', null, cfg.temas.slice(0, 6).map((t) =>
        h('li', null, h('button', { type: 'button', class: 'rodape__link', onClick: () => L.comecarComTema(t.id) }, t.nome))))),
      h('div', { class: 'rodape__col' }, h('h2', null, 'Atendimento'), h('ul', null,
        h('li', null, h('button', { type: 'button', class: 'rodape__link', onClick: () => L.irParaSecao('duvidas') }, 'Dúvidas frequentes')),
        h('li', null, h('a', { class: 'rodape__link', href: '#pedidos' }, 'Meus pedidos')),
        h('li', null, h('button', { type: 'button', class: 'rodape__link', onClick: () => L.irParaSecao('precos') }, 'Formatos e preços')))),
      h('p', { class: 'rodape__legal' }, `© ${new Date().getFullYear()} ${cfg.marca} Livros (nome provisório). Esta é uma versão de demonstração: pedidos, pagamentos e envios para a gráfica são simulados.`)));
  };

  L.comecarComTema = (temaId) => {
    S.criacao = { passo: 2, temaId, campos: {}, fotos: [] };
    L.ir('criar');
  };
})(window.L = window.L || {});
