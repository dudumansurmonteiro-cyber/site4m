/* O livro: layouts das páginas, quebra de texto (igual na tela e na
   impressão), geometria das fotos, montagem automática, preço e checagens. */
(function (L) {
  'use strict';
  const cfg = L.config;

  /* ---------------------------------------------------------------
     LAYOUTS — coordenadas em fração da página (0 a 1).
     tam = tamanho da fonte em "unidades" (página = 1000 unidades).
     --------------------------------------------------------------- */
  const LAYOUTS = {
    'capa-foto': {
      nome: 'Foto inteira', grupo: 'capa', fotos: 1,
      elementos: [
        { tipo: 'foto', i: 0, x: 0, y: 0, w: 1, h: 1 },
        { tipo: 'veu', x: 0, y: 0.45, w: 1, h: 0.55 },
        { tipo: 'texto', campo: 'titulo', x: 0.08, y: 0.63, w: 0.84, h: 0.2, tam: 100, fonte: 'titulo', cor: '#FFFFFF', sombra: true, ph: 'Título do livro' },
        { tipo: 'texto', campo: 'subtitulo', x: 0.1, y: 0.84, w: 0.8, h: 0.07, tam: 40, cor: '#FFFFFF', sombra: true, ph: 'Subtítulo' },
      ],
    },
    'capa-moldura': {
      nome: 'Foto com moldura', grupo: 'capa', fotos: 1,
      elementos: [
        { tipo: 'foto', i: 0, x: 0.13, y: 0.1, w: 0.74, h: 0.55 },
        { tipo: 'texto', campo: 'titulo', x: 0.08, y: 0.69, w: 0.84, h: 0.16, tam: 88, fonte: 'titulo', ph: 'Título do livro' },
        { tipo: 'texto', campo: 'subtitulo', x: 0.1, y: 0.86, w: 0.8, h: 0.06, tam: 38, ph: 'Subtítulo' },
      ],
    },
    'capa-texto': {
      nome: 'Só texto', grupo: 'capa', fotos: 0,
      elementos: [
        { tipo: 'texto', campo: 'titulo', x: 0.1, y: 0.24, w: 0.8, h: 0.38, tam: 124, fonte: 'titulo', ph: 'Título do livro' },
        { tipo: 'linha', x: 0.43, y: 0.655, w: 0.14, h: 0.005 },
        { tipo: 'texto', campo: 'subtitulo', x: 0.1, y: 0.69, w: 0.8, h: 0.09, tam: 40, ph: 'Subtítulo' },
      ],
    },
    'foto-legenda': {
      nome: 'Foto + legenda', grupo: 'miolo', fotos: 1,
      elementos: [
        { tipo: 'foto', i: 0, x: 0.08, y: 0.08, w: 0.84, h: 0.64 },
        { tipo: 'texto', campo: 'texto', x: 0.1, y: 0.75, w: 0.8, h: 0.18, tam: 54, ph: 'Escreva uma legenda' },
      ],
    },
    'foto-inteira': {
      nome: 'Foto inteira', grupo: 'miolo', fotos: 1,
      elementos: [
        { tipo: 'foto', i: 0, x: 0, y: 0, w: 1, h: 1 },
        { tipo: 'veu', x: 0, y: 0.6, w: 1, h: 0.4, campo: 'texto' },
        { tipo: 'texto', campo: 'texto', x: 0.08, y: 0.79, w: 0.84, h: 0.14, tam: 52, cor: '#FFFFFF', sombra: true, ph: 'Legenda (opcional)' },
      ],
    },
    polaroid: {
      nome: 'Polaroid', grupo: 'miolo', fotos: 1,
      elementos: [
        { tipo: 'moldura', x: 0.15, y: 0.09, w: 0.7, h: 0.82, rot: -2.5 },
        { tipo: 'foto', i: 0, x: 0.19, y: 0.13, w: 0.62, h: 0.56, rot: -2.5 },
        { tipo: 'texto', campo: 'texto', x: 0.19, y: 0.715, w: 0.62, h: 0.16, tam: 52, rot: -2.5, cor: '#2A2426', ph: 'Escreva aqui' },
      ],
    },
    'duas-fotos': {
      nome: 'Duas fotos', grupo: 'miolo', fotos: 2,
      elementos: [
        { tipo: 'foto', i: 0, x: 0.07, y: 0.08, w: 0.42, h: 0.62 },
        { tipo: 'foto', i: 1, x: 0.51, y: 0.08, w: 0.42, h: 0.62 },
        { tipo: 'texto', campo: 'texto', x: 0.1, y: 0.74, w: 0.8, h: 0.19, tam: 50, ph: 'Escreva uma legenda' },
      ],
    },
    texto: {
      nome: 'Só texto', grupo: 'miolo', fotos: 0,
      elementos: [{ tipo: 'texto', campo: 'texto', x: 0.12, y: 0.12, w: 0.76, h: 0.76, tam: 62, ph: 'Escreva um texto' }],
    },
    pergunta: {
      nome: 'Pergunta', grupo: 'miolo', fotos: 0,
      elementos: [
        { tipo: 'texto', campo: 'texto', x: 0.1, y: 0.15, w: 0.8, h: 0.4, tam: 112, fonte: 'titulo', ph: 'Sua pergunta' },
        { tipo: 'opcoes', x: 0.16, y: 0.6, w: 0.68, h: 0.24, tam: 60 },
      ],
    },
    contracapa: {
      nome: 'Contracapa', grupo: 'contracapa', fotos: 0,
      elementos: [
        { tipo: 'texto', campo: 'texto', x: 0.15, y: 0.34, w: 0.7, h: 0.26, tam: 46, ph: 'Texto da contracapa' },
        { tipo: 'marca', x: 0.25, y: 0.85, w: 0.5, h: 0.05, tam: 24 },
      ],
    },
  };
  L.LAYOUTS = LAYOUTS;
  L.layoutsDoGrupo = (grupo) => Object.keys(LAYOUTS).filter((k) => LAYOUTS[k].grupo === grupo);

  /* ---------- acessos rápidos ---------- */
  L.tema = (id) => cfg.temas.find((t) => t.id === id) || cfg.temas[0];
  L.formato = (id) => cfg.formatos.find((f) => f.id === id) || cfg.formatos[1];
  L.extra = (id) => cfg.extras.find((e) => e.id === id);
  L.miolo = (proj) => proj.paginas.filter((p) => p.tipo === 'miolo');
  L.totalPaginas = (proj) => { const n = L.miolo(proj).length; return n + (n % 2); };
  L.nomePagina = (proj, idx) => (idx === 0 ? 'Capa' : idx === proj.paginas.length - 1 ? 'Contracapa' : `Página ${idx}`);

  /* ---------- fontes e texto ---------- */
  const mctx = document.createElement('canvas').getContext('2d');
  const cache = new Map();
  L.limparCacheTexto = () => cache.clear();

  L.fonteCss = (key, px) => {
    const f = cfg.fontes[key] || cfg.fontes.moderna;
    return `${f.estilo || 'normal'} ${f.peso} ${px}px "${f.familia}", ${f.fallback}`;
  };
  L.familiaCss = (key) => { const f = cfg.fontes[key] || cfg.fontes.moderna; return `"${f.familia}", ${f.fallback}`; };
  L.fonteDo = (el, pg) => (el.fonte === 'titulo' ? pg.fonteTitulo || 'titulo' : pg.fonte || 'moderna');
  L.corDo = (el, pg) => el.cor || pg.cor || '#1E1B1E';

  function quebrar(texto, maxW) {
    const out = [];
    for (const par of String(texto).split('\n')) {
      if (!par.trim()) { out.push(''); continue; }
      let linha = '';
      for (const palavra of par.split(/\s+/).filter(Boolean)) {
        const teste = linha ? linha + ' ' + palavra : palavra;
        if (mctx.measureText(teste).width <= maxW) { linha = teste; continue; }
        if (linha) out.push(linha);
        linha = '';
        if (mctx.measureText(palavra).width > maxW) {
          let pedaco = '';
          for (const ch of Array.from(palavra)) {
            if (pedaco && mctx.measureText(pedaco + ch).width > maxW) { out.push(pedaco); pedaco = ch; }
            else pedaco += ch;
          }
          linha = pedaco;
        } else linha = palavra;
      }
      out.push(linha);
    }
    return out;
  }

  // Encolhe a fonte até caber na caixa (mínimo: metade do tamanho)
  L.layoutTexto = (texto, fonteKey, tamBase, boxW, boxH, lhMul = 1) => {
    const chave = texto + '|' + fonteKey + '|' + tamBase + '|' + boxW + '|' + boxH + '|' + lhMul;
    const em = cache.get(chave);
    if (em) return em;
    const f = cfg.fontes[fonteKey] || cfg.fontes.moderna;
    const lhF = (f.lh || 1.2) * lhMul;
    const minimo = tamBase * 0.5;
    let size = tamBase, r;
    for (;;) {
      mctx.font = L.fonteCss(fonteKey, size);
      const linhas = quebrar(texto || '', boxW);
      const lh = size * lhF, alt = linhas.length * lh;
      if (alt <= boxH + 0.01 || size <= minimo) { r = { size, lh, linhas, alt, estoura: alt > boxH + 0.5 }; break; }
      size = Math.max(minimo, size * 0.94);
    }
    if (cache.size > 3000) cache.clear();
    cache.set(chave, r);
    return r;
  };

  L.layoutDoElemento = (el, pg, texto) => {
    const fk = L.fonteDo(el, pg);
    const tam = el.tam * ((cfg.fontes[fk] || {}).escala || 1) * (pg.tamanho || 1);
    return L.layoutTexto(texto != null ? texto : pg[el.campo] || '', fk, tam, el.w * 1000, el.h * 1000, el.lh || 1);
  };

  // Caixinhas de resposta da página "Pergunta"
  L.layoutOpcoes = (el, pg) => {
    const fk = pg.fonte || 'moderna';
    const tam = el.tam * ((cfg.fontes[fk] || {}).escala || 1) * (pg.tamanho || 1);
    const f = cfg.fontes[fk] || cfg.fontes.moderna;
    mctx.font = L.fonteCss(fk, tam);
    const caixa = tam * 0.82, gap = tam * 0.42;
    const rotulos = (pg.opcoes || []).slice(0, 2).map((t) => t || '');
    const larg = Math.max(1, ...rotulos.map((t) => mctx.measureText(t || ' ').width));
    const blocoW = Math.min(el.w * 1000, caixa + gap + larg);
    const x0 = el.x * 1000 + (el.w * 1000 - blocoW) / 2;
    const lh = tam * (f.lh || 1.2);
    const linhas = rotulos.map((texto, i) => ({ texto, cy: el.y * 1000 + el.h * 1000 * (i === 0 ? 0.27 : 0.73) }));
    return { fk, tam, caixa, gap, x0, lh, linhas };
  };

  // Marca discreta na contracapa
  L.layoutMarca = (el) => {
    const tam = el.tam;
    mctx.font = L.fonteCss('moderna', tam);
    const texto = `feito com ${cfg.marca}`;
    const iconW = tam * 1.5, gap = tam * 0.35;
    const tw = mctx.measureText(texto).width;
    const total = iconW + gap + tw;
    const x0 = el.x * 1000 + (el.w * 1000 - total) / 2;
    return { tam, texto, iconW, gap, x0, cy: (el.y + el.h / 2) * 1000 };
  };

  /* ---------- fotos ---------- */
  // Enquadra a foto preenchendo a área (cover) + zoom + deslocamento (-1..1)
  L.geoFoto = (slotW, slotH, imgW, imgH, f) => {
    const z = (f && f.zoom) || 1;
    const s = Math.max(slotW / imgW, slotH / imgH) * z;
    const dw = imgW * s, dh = imgH * s;
    const ox = dw - slotW, oy = dh - slotH;
    return { s, dw, dh, ox, oy, dx: (-ox / 2) * (1 + ((f && f.px) || 0)), dy: (-oy / 2) * (1 + ((f && f.py) || 0)) };
  };
  L.dpiFoto = (el, foto, formato) => {
    const rec = L.img(foto && foto.img);
    if (!rec) return null;
    const g = L.geoFoto(el.w, el.h, rec.w, rec.h, foto);
    const pxNaLargura = el.w / g.s;
    const polegadas = (el.w * formato.cm) / 2.54;
    return pxNaLargura / polegadas;
  };

  /* ---------- páginas ---------- */
  const foto = (id) => ({ img: id || null, zoom: 1, px: 0, py: 0 });
  L.novaFoto = foto;
  L.novaPagina = (tipo, layout, props = {}) => {
    const pg = Object.assign({
      id: L.uid('pg_'), tipo, layout,
      fotos: [foto(null), foto(null)],
      texto: '', titulo: '', subtitulo: '', opcoes: ['Sim', 'Claro que sim'],
      fonte: 'moderna', fonteTitulo: 'titulo', tamanho: 1, cor: '#1E1B1E', bg: '#FFFFFF',
      adesivos: [],
    }, props);
    while (pg.fotos.length < 2) pg.fotos.push(foto(null));
    return pg;
  };
  L.paginaEmBranco = () => L.novaPagina('miolo', 'texto', { texto: '', bg: '#FFFFFF' });

  L.varsDoTema = (tema, campos = {}) => {
    const v = {};
    for (const c of tema.campos) v[c.k] = String(campos[c.k] || '').trim() || c.padrao || '';
    const d = campos.data;
    v.data = d ? L.fmtData(d, 'pontos') : '';
    v.dataLonga = d ? L.fmtData(d, 'longa') : '';
    v.ano = d ? String(d).slice(0, 4) : String(new Date().getFullYear());
    return v;
  };

  // Monta o livro inteiro a partir da ocasião + nomes + fotos
  L.criarLivro = ({ temaId, campos = {}, imagens = [] }) => {
    const tema = L.tema(temaId);
    const vars = L.varsDoTema(tema, campos);
    const P = tema.paginas;
    const paginas = [];
    paginas.push(L.novaPagina('capa', imagens.length ? tema.capa.layout : 'capa-texto', {
      titulo: L.fill(tema.capa.titulo, vars), subtitulo: L.fill(tema.capa.subtitulo, vars),
      bg: tema.capa.bg, cor: tema.capa.cor, fonte: 'moderna', fonteTitulo: 'titulo', fotos: [foto(imagens[0])],
    }));
    if (tema.dedicatoria) paginas.push(L.novaPagina('miolo', 'texto', { texto: L.fill(tema.dedicatoria, vars), bg: P.bg, cor: P.cor, fonte: P.fonte }));
    const ritmo = ['foto-legenda', 'foto-legenda', 'polaroid', 'foto-legenda', 'foto-inteira', 'foto-legenda'];
    imagens.forEach((id, i) => {
      const layout = ritmo[i % ritmo.length];
      paginas.push(L.novaPagina('miolo', layout, {
        fotos: [foto(id)], texto: layout === 'foto-inteira' ? '' : tema.legendas[i % tema.legendas.length],
        bg: P.bg, cor: P.cor, fonte: P.fonte,
      }));
    });
    if (tema.final) {
      paginas.push(L.novaPagina('miolo', tema.final.layout, {
        texto: L.fill(tema.final.texto, vars), opcoes: (tema.final.opcoes || ['Sim', 'Claro que sim']).slice(),
        bg: P.bg, cor: P.cor, fonte: P.fonte, fonteTitulo: 'titulo',
      }));
    }
    paginas.push(L.novaPagina('contracapa', 'contracapa', { texto: L.fill(tema.contracapa, vars), bg: tema.capa.bg, cor: tema.capa.cor, fonte: 'moderna' }));
    return {
      id: L.uid('livro_'), tema: tema.id, campos: Object.assign({}, campos), formato: 'classico',
      paginas, presentes: {}, criadoEm: Date.now(),
      checkout: { frete: 'expresso', pagamento: 'pix' },
    };
  };

  /* ---------- preço ---------- */
  const r2 = (v) => Math.round(v * 100) / 100;
  L.precoLivro = (proj) => {
    const f = L.formato(proj.formato);
    const n = L.totalPaginas(proj);
    const extras = Math.max(0, n - cfg.paginas.inclusas);
    return { formato: f, paginas: n, paginasExtras: extras, valor: r2(f.preco + extras * f.paginaExtra) };
  };
  L.precoExtra = (e, proj) => (e.precoFator ? r2(L.precoLivro(proj).valor * e.precoFator) : e.preco);

  L.preco = (proj) => {
    const livro = L.precoLivro(proj);
    const itens = [];
    let somaExtras = 0, somaKit = 0, qtdKit = 0;
    for (const id in proj.presentes || {}) {
      const sel = proj.presentes[id], e = L.extra(id);
      if (!e || !sel || !sel.qtd) continue;
      const unit = L.precoExtra(e, proj), total = r2(unit * sel.qtd);
      itens.push({ id, nome: e.nome, qtd: sel.qtd, unit, total, fornecedor: e.fornecedor, texto: sel.texto || '' });
      somaExtras += total;
      if (id !== 'copia') { somaKit += total; qtdKit++; }
    }
    const descKit = qtdKit >= cfg.descontoKit.minimo ? r2(somaKit * cfg.descontoKit.percentual) : 0;
    const subtotal = r2(livro.valor + somaExtras - descKit);
    const fr = cfg.frete.find((x) => x.id === ((proj.checkout && proj.checkout.frete) || 'expresso')) || cfg.frete[0];
    const frete = fr.gratisAcima && subtotal >= fr.gratisAcima ? 0 : fr.preco;
    const pix = proj.checkout && proj.checkout.pagamento === 'pix' ? r2(subtotal * cfg.descontoPix) : 0;
    return { livro, itens, somaExtras: r2(somaExtras), descKit, qtdKit, subtotal, frete, freteObj: fr, pix, total: r2(subtotal - pix + frete) };
  };

  L.prazo = (freteId, de) => {
    const fr = cfg.frete.find((x) => x.id === freteId) || cfg.frete[0];
    const inicio = de ? new Date(de) : new Date();
    const producao = L.addDiasUteis(inicio, cfg.producaoDiasUteis);
    return { producao, min: L.addDiasUteis(producao, fr.dias[0]), max: L.addDiasUteis(producao, fr.dias[1]), frete: fr };
  };

  L.lombadaMm = (proj) => {
    const f = L.formato(proj.formato), imp = cfg.impressao;
    const mm = (L.totalPaginas(proj) / 2) * imp.folhaMm + (f.capaDura ? imp.capaDuraMm : imp.capaFlexivelMm);
    return Math.max(3, Math.round(mm * 2) / 2);
  };

  /* ---------- checagens antes de imprimir ---------- */
  L.verificar = (proj) => {
    const itens = [];
    const n = L.miolo(proj).length, min = cfg.paginas.minimo, max = cfg.paginas.maximo;
    if (n < min) itens.push({ nivel: 'erro', texto: `Seu livro tem ${n} páginas. O mínimo é ${min}: adicione mais ${min - n}.`, acao: 'adicionar' });
    if (n > max) itens.push({ nivel: 'erro', texto: `O máximo é ${max} páginas. Remova ${n - max}.` });
    const f = L.formato(proj.formato);
    proj.paginas.forEach((pg, idx) => {
      const nome = L.nomePagina(proj, idx);
      (LAYOUTS[pg.layout] || LAYOUTS.texto).elementos.forEach((el) => {
        if (el.tipo === 'foto') {
          const ft = pg.fotos[el.i];
          if (!ft || !ft.img) itens.push({ nivel: 'erro', texto: `${nome}: falta uma foto.`, pagina: idx });
          else {
            const dpi = L.dpiFoto(el, ft, f);
            if (dpi && dpi < cfg.impressao.dpiMinimoAviso) itens.push({ nivel: 'aviso', texto: `${nome}: a foto pode sair com pouca nitidez neste formato (${Math.round(dpi)} dpi).`, pagina: idx });
          }
        } else if (el.tipo === 'texto' && pg[el.campo]) {
          if (L.layoutDoElemento(el, pg).estoura) itens.push({ nivel: 'aviso', texto: `${nome}: o texto está longo e pode ser cortado.`, pagina: idx });
        }
      });
    });
    if (n % 2 === 1 && n >= min) itens.push({ nivel: 'info', texto: 'Vamos incluir 1 página em branco no final para fechar o caderno.' });
    return itens;
  };
})(window.L = window.L || {});
