/* Desenho das páginas.
   - renderPagina(): HTML (tela, editor, folheador)
   - desenharPagina(): canvas (arquivo de impressão)
   Os dois usam o mesmo layout e a mesma quebra de texto, então o que o
   cliente vê é o que vai para a gráfica. */
(function (L) {
  'use strict';
  const h = L.h;
  L.FONTE_EMOJI = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif';
  const pct = (v) => v * 100 + '%';
  const cq = (u) => u / 10 + 'cqw'; // 1000 unidades = largura da página

  function posicionar(node, el) {
    node.style.left = pct(el.x); node.style.top = pct(el.y);
    node.style.width = pct(el.w); node.style.height = pct(el.h);
    if (el.rot) {
      const o = el.origem || [0.5, 0.5];
      node.style.transformOrigin = `${((o[0] - el.x) / el.w) * 100}% ${((o[1] - el.y) / el.h) * 100}%`;
      node.style.transform = `rotate(${el.rot}deg)`;
    }
  }

  function aplicarEnquadramento(img, el, rec, foto) {
    const g = L.geoFoto(el.w, el.h, rec.w, rec.h, foto);
    img.style.width = (g.dw / el.w) * 100 + '%';
    img.style.height = (g.dh / el.h) * 100 + '%';
    img.style.left = (g.dx / el.w) * 100 + '%';
    img.style.top = (g.dy / el.h) * 100 + '%';
  }
  L.aplicarEnquadramento = aplicarEnquadramento;

  function elFoto(el, pg, opts) {
    const ft = pg.fotos[el.i] || {};
    const rec = L.img(ft.img);
    const editar = opts.modo === 'editar';
    const node = h(editar ? 'button' : 'div', {
      class: 'pg-foto' + (rec ? '' : ' pg-foto--vazia') + (editar && opts.fotoSel === el.i ? ' is-sel' : ''),
      dataset: { slot: el.i },
    });
    if (editar) {
      node.type = 'button';
      node.setAttribute('aria-label', rec ? 'Foto da página. Arraste para enquadrar; toque para ver as opções.' : 'Adicionar foto');
    }
    posicionar(node, el);
    if (rec) {
      const img = h('img', { src: rec.url, alt: '', draggable: 'false', decoding: 'async' });
      aplicarEnquadramento(img, el, rec, ft);
      node.append(img);
    } else {
      node.append(h('span', { class: 'pg-foto__vazio', html: L.svg('image') + (editar ? '<span>Adicionar foto</span>' : '') }));
    }
    return node;
  }

  function estiloTexto(node, el, pg, r) {
    const fk = L.fonteDo(el, pg), f = L.config.fontes[fk];
    node.style.color = L.corDo(el, pg);
    node.style.fontFamily = L.familiaCss(fk);
    node.style.fontWeight = f.peso;
    node.style.fontSize = cq(r.size);
    node.style.lineHeight = cq(r.lh);
    node.style.textAlign = el.alinhar || 'center';
  }

  function elTexto(el, pg, opts) {
    const valor = pg[el.campo] || '';
    const r = L.layoutDoElemento(el, pg);
    const node = h('div', { class: 'pg-texto' + (el.sombra ? ' pg-texto--sombra' : ''), dataset: { campo: el.campo } });
    posicionar(node, el);
    estiloTexto(node, el, pg, r);
    const padTop = Math.max(0, (el.h * 1000 - r.alt) / 2);
    if (opts.modo === 'editar') {
      const ta = h('textarea', {
        class: 'pg-texto__campo', rows: '1', spellcheck: 'true', placeholder: el.ph || '',
        'aria-label': el.campo === 'titulo' ? 'Título da capa' : el.campo === 'subtitulo' ? 'Subtítulo da capa' : 'Texto da página',
        maxlength: el.campo === 'titulo' ? '80' : '220', value: valor, dataset: { campo: el.campo },
      });
      ta.style.paddingTop = cq(padTop);
      node.append(ta);
    } else if (valor) {
      node.append(h('div', { class: 'pg-texto__linhas', style: { paddingTop: cq(padTop) } },
        r.linhas.map((l) => h('div', { class: 'pg-linha', style: { height: cq(r.lh) } }, l || ' '))));
    }
    return node;
  }

  // Atualiza um texto já desenhado no editor, sem recriar o campo (mantém o foco)
  L.atualizarTextoNoEditor = (node, el, pg) => {
    const r = L.layoutDoElemento(el, pg);
    estiloTexto(node, el, pg, r);
    const ta = node.querySelector('textarea');
    if (ta) ta.style.paddingTop = cq(Math.max(0, (el.h * 1000 - r.alt) / 2));
  };

  function elOpcoes(el, pg) {
    const o = L.layoutOpcoes(el, pg);
    const node = h('div', { class: 'pg-opcoes', style: { color: pg.cor, fontFamily: L.familiaCss(o.fk), fontWeight: L.config.fontes[o.fk].peso, fontSize: cq(o.tam), lineHeight: cq(o.lh) } });
    o.linhas.forEach((ln) => {
      node.append(h('span', { class: 'pg-opcoes__caixa', style: { left: cq(o.x0), top: cq(ln.cy - o.caixa / 2), width: cq(o.caixa), height: cq(o.caixa), borderWidth: cq(o.tam * 0.07) } }));
      node.append(h('span', { class: 'pg-opcoes__rotulo', style: { left: cq(o.x0 + o.caixa + o.gap), top: cq(ln.cy - o.lh / 2), height: cq(o.lh) } }, ln.texto));
    });
    return node;
  }

  function elMarca(el, pg) {
    const m = L.layoutMarca(el);
    const node = h('div', { class: 'pg-marca', style: { color: pg.cor, fontSize: cq(m.tam) } });
    node.append(h('span', { class: 'pg-marca__icone', style: { left: cq(m.x0), top: cq(m.cy - m.iconW / 3), width: cq(m.iconW), height: cq((m.iconW * 2) / 3) }, html: L.logoSvg('pg-marca__svg') }));
    node.append(h('span', { class: 'pg-marca__texto', style: { left: cq(m.x0 + m.iconW + m.gap), top: cq(m.cy - m.tam * 0.65), lineHeight: cq(m.tam * 1.3) } }, m.texto));
    return node;
  }

  L.renderPagina = (pg, opts = {}) => {
    const lay = L.LAYOUTS[pg.layout] || L.LAYOUTS.texto;
    const raiz = h('div', { class: 'pg' + (opts.modo === 'editar' ? ' pg--editar' : ''), style: { background: pg.bg } });
    for (const el of lay.elementos) {
      let node = null;
      if (el.tipo === 'foto') node = elFoto(el, pg, opts);
      else if (el.tipo === 'texto') node = elTexto(el, pg, opts);
      else if (el.tipo === 'veu') {
        node = h('div', { class: 'pg-veu', dataset: { campo: el.campo || '' } });
        posicionar(node, el);
        if (el.campo && !pg[el.campo]) node.hidden = true;
      } else if (el.tipo === 'moldura') { node = h('div', { class: 'pg-moldura' }); posicionar(node, el); }
      else if (el.tipo === 'linha') { node = h('div', { class: 'pg-linha-deco', style: { background: pg.cor } }); posicionar(node, el); }
      else if (el.tipo === 'opcoes') node = elOpcoes(el, pg);
      else if (el.tipo === 'marca') node = elMarca(el, pg);
      if (node) raiz.append(node);
    }
    for (const a of pg.adesivos || []) {
      const editar = opts.modo === 'editar';
      const node = h(editar ? 'button' : 'span', {
        class: 'pg-adesivo' + (editar && opts.adesivoSel === a.id ? ' is-sel' : ''),
        style: { left: pct(a.x), top: pct(a.y), fontSize: cq(a.s), transform: `translate(-50%, -50%) rotate(${a.r || 0}deg)` },
        dataset: { adesivo: a.id },
      }, a.e);
      if (editar) { node.type = 'button'; node.setAttribute('aria-label', `Emoji ${a.e}. Arraste para mover; use as setas do teclado para ajustar.`); }
      raiz.append(node);
    }
    if (opts.rotulo) { raiz.setAttribute('role', 'img'); raiz.setAttribute('aria-label', opts.rotulo); }
    return raiz;
  };

  /* =================================================================
     CANVAS (impressão)
     ================================================================= */
  function rotacionar(ctx, el, x0, y0, lado) {
    if (!el.rot) return;
    const o = el.origem || [0.5, 0.5];
    const ox = x0 + o[0] * lado, oy = y0 + o[1] * lado;
    ctx.translate(ox, oy); ctx.rotate((el.rot * Math.PI) / 180); ctx.translate(-ox, -oy);
  }
  // Elementos encostados na borda avançam sobre a sangria
  function rectSangria(el, x0, y0, lado, sang, bordas) {
    let x = x0 + el.x * lado, y = y0 + el.y * lado, w = el.w * lado, hh = el.h * lado;
    if (el.x <= 0.001 && bordas.esq) { x -= sang; w += sang; }
    if (el.y <= 0.001 && bordas.topo) { y -= sang; hh += sang; }
    if (el.x + el.w >= 0.999 && bordas.dir) w += sang;
    if (el.y + el.h >= 0.999 && bordas.base) hh += sang;
    return { x, y, w, h: hh };
  }

  async function desenharFoto(ctx, el, pg, o) {
    const ft = pg.fotos[el.i];
    if (!ft || !ft.img) return;
    const dados = await o.getImg(ft.img);
    if (!dados) return;
    const rec = L.img(ft.img);
    const { x0, y0, lado } = o;
    const corte = { x: x0 + el.x * lado, y: y0 + el.y * lado, w: el.w * lado, h: el.h * lado };
    const ext = rectSangria(el, x0, y0, lado, o.sangria, o.bordas);
    const g = L.geoFoto(corte.w, corte.h, rec.w, rec.h, ft);
    let ix = corte.x + g.dx, iy = corte.y + g.dy, iw = g.dw, ih = g.dh;
    // garante que a foto cubra também a sangria
    const cx = corte.x + corte.w / 2, cy = corte.y + corte.h / 2;
    const k = Math.max(1,
      ix > ext.x ? (cx - ext.x) / Math.max(1e-6, cx - ix) : 1,
      ix + iw < ext.x + ext.w ? (ext.x + ext.w - cx) / Math.max(1e-6, ix + iw - cx) : 1,
      iy > ext.y ? (cy - ext.y) / Math.max(1e-6, cy - iy) : 1,
      iy + ih < ext.y + ext.h ? (ext.y + ext.h - cy) / Math.max(1e-6, iy + ih - cy) : 1);
    if (k > 1) { ix = cx + (ix - cx) * k; iy = cy + (iy - cy) * k; iw *= k; ih *= k; }
    ctx.save();
    rotacionar(ctx, el, x0, y0, lado);
    ctx.beginPath(); ctx.rect(ext.x, ext.y, ext.w, ext.h); ctx.clip();
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(dados.img, ix, iy, iw, ih);
    ctx.restore();
  }

  function metricas(ctx, size) {
    const m = ctx.measureText('Hg');
    return {
      asc: m.fontBoundingBoxAscent != null ? m.fontBoundingBoxAscent : size * 0.8,
      desc: m.fontBoundingBoxDescent != null ? m.fontBoundingBoxDescent : size * 0.2,
    };
  }

  function desenharTexto(ctx, el, pg, o) {
    const valor = pg[el.campo];
    if (!valor) return;
    const { x0, y0, lado } = o, S = lado / 1000;
    const r = L.layoutDoElemento(el, pg);
    ctx.save();
    rotacionar(ctx, el, x0, y0, lado);
    ctx.font = L.fonteCss(L.fonteDo(el, pg), r.size * S);
    ctx.fillStyle = L.corDo(el, pg);
    ctx.textBaseline = 'alphabetic';
    const centro = (el.alinhar || 'center') === 'center';
    ctx.textAlign = centro ? 'center' : 'left';
    if (el.sombra) { ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = r.size * S * 0.25; ctx.shadowOffsetY = r.size * S * 0.04; }
    const { asc, desc } = metricas(ctx, r.size * S);
    const lh = r.lh * S;
    let topo = y0 + (el.y * 1000 + Math.max(0, (el.h * 1000 - r.alt) / 2)) * S;
    const x = x0 + (centro ? el.x + el.w / 2 : el.x) * lado;
    for (const linha of r.linhas) { if (linha) ctx.fillText(linha, x, topo + (lh - (asc + desc)) / 2 + asc); topo += lh; }
    ctx.restore();
  }

  function desenharOpcoes(ctx, el, pg, o) {
    const { x0, y0, lado } = o, S = lado / 1000;
    const op = L.layoutOpcoes(el, pg);
    ctx.save();
    ctx.strokeStyle = pg.cor; ctx.fillStyle = pg.cor;
    ctx.lineWidth = op.tam * 0.07 * S;
    ctx.font = L.fonteCss(op.fk, op.tam * S);
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    const { asc, desc } = metricas(ctx, op.tam * S);
    for (const ln of op.linhas) {
      const lw = ctx.lineWidth;
      ctx.strokeRect(x0 + op.x0 * S + lw / 2, y0 + (ln.cy - op.caixa / 2) * S + lw / 2, op.caixa * S - lw, op.caixa * S - lw);
      const topo = y0 + (ln.cy - op.lh / 2) * S;
      ctx.fillText(ln.texto, x0 + (op.x0 + op.caixa + op.gap) * S, topo + (op.lh * S - (asc + desc)) / 2 + asc);
    }
    ctx.restore();
  }

  function desenharMarca(ctx, el, pg, o) {
    const { x0, y0, lado } = o, S = lado / 1000;
    const m = L.layoutMarca(el);
    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.fillStyle = pg.cor;
    const iw = m.iconW * S, ih = (iw * 2) / 3;
    ctx.save();
    ctx.translate(x0 + m.x0 * S, y0 + m.cy * S - ih / 2);
    ctx.scale(iw / 48, ih / 32);
    L.LOGO_PATHS.forEach((d) => ctx.fill(new Path2D(d)));
    ctx.restore();
    ctx.font = L.fonteCss('moderna', m.tam * S);
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.fillText(m.texto, x0 + (m.x0 + m.iconW + m.gap) * S, y0 + m.cy * S);
    ctx.restore();
  }

  // o = { x0, y0, lado (px da página sem sangria), sangria (px), getImg, bordas }
  L.desenharPagina = async (ctx, pg, o) => {
    o.bordas = Object.assign({ esq: true, dir: true, topo: true, base: true }, o.bordas || {});
    const { x0, y0, lado, sangria } = o;
    const fundo = rectSangria({ x: 0, y: 0, w: 1, h: 1 }, x0, y0, lado, sangria, o.bordas);
    ctx.fillStyle = pg.bg || '#FFFFFF';
    ctx.fillRect(fundo.x, fundo.y, fundo.w, fundo.h);
    const lay = L.LAYOUTS[pg.layout] || L.LAYOUTS.texto;
    for (const el of lay.elementos) {
      if (el.tipo === 'foto') await desenharFoto(ctx, el, pg, o);
      else if (el.tipo === 'texto') desenharTexto(ctx, el, pg, o);
      else if (el.tipo === 'veu') {
        if (el.campo && !pg[el.campo]) continue;
        const r = rectSangria(el, x0, y0, lado, sangria, o.bordas);
        const g = ctx.createLinearGradient(0, y0 + el.y * lado, 0, y0 + (el.y + el.h) * lado);
        g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.55)');
        ctx.fillStyle = g; ctx.fillRect(r.x, r.y, r.w, r.h);
      } else if (el.tipo === 'moldura') {
        ctx.save(); rotacionar(ctx, el, x0, y0, lado);
        ctx.shadowColor = 'rgba(0,0,0,0.18)'; ctx.shadowBlur = 16 * (lado / 1000); ctx.shadowOffsetY = 6 * (lado / 1000);
        ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x0 + el.x * lado, y0 + el.y * lado, el.w * lado, el.h * lado);
        ctx.restore();
      } else if (el.tipo === 'linha') {
        ctx.fillStyle = pg.cor; ctx.fillRect(x0 + el.x * lado, y0 + el.y * lado, el.w * lado, el.h * lado);
      } else if (el.tipo === 'opcoes') desenharOpcoes(ctx, el, pg, o);
      else if (el.tipo === 'marca') desenharMarca(ctx, el, pg, o);
    }
    for (const a of pg.adesivos || []) {
      ctx.save();
      const px = a.s * (lado / 1000);
      ctx.translate(x0 + a.x * lado, y0 + a.y * lado);
      if (a.r) ctx.rotate((a.r * Math.PI) / 180);
      ctx.font = `${px}px ${L.FONTE_EMOJI}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(a.e, 0, px * 0.04);
      ctx.restore();
    }
  };
})(window.L = window.L || {});
