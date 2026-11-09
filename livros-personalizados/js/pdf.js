/* Arquivo para a gráfica: PDF em 300 dpi com sangria, capa aberta
   (contracapa + lombada + capa) e miolo, gerado no próprio navegador. */
(function (L) {
  'use strict';
  const cfg = L.config;
  const MM_POL = 25.4;

  L.fontesProntas = (() => {
    let p;
    return () => p || (p = (async () => {
      if (!document.fonts || !document.fonts.load) return;
      const pedidos = Object.values(cfg.fontes).map((f) => document.fonts.load(`${f.peso} 40px "${f.familia}"`, 'AaÇçãéõ'));
      try { await Promise.race([Promise.all(pedidos), L.sleep(5000)]); } catch (e) { /* segue com a fonte reserva */ }
      L.limparCacheTexto();
    })());
  })();

  // Celulares limitam o tamanho de um canvas (~16 megapixels)
  function dpiSeguro(wIn, hIn, dpi) {
    const max = 16e6;
    return wIn * dpi * hIn * dpi > max ? Math.floor(Math.sqrt(max / (wIn * hIn))) : dpi;
  }
  function novoCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

  async function paraJpeg(cv, wMm, hMm, sangMm) {
    const blob = await new Promise((r) => cv.toBlob(r, 'image/jpeg', cfg.impressao.qualidadeJpeg));
    if (!blob) throw new Error('O navegador não conseguiu gerar a imagem da página.');
    const jpeg = new Uint8Array(await blob.arrayBuffer());
    const pt = 72 / MM_POL;
    const out = { jpeg, wPx: cv.width, hPx: cv.height, wPt: wMm * pt, hPt: hMm * pt, sangPt: sangMm * pt };
    cv.width = cv.height = 0; // libera memória
    return out;
  }

  function textoLombada(ctx, capa, x, w, h, pxmm) {
    if (w < 6 * pxmm || !capa.titulo) return;
    const txt = capa.titulo.replace(/\s*\n\s*/g, ' ');
    const fk = capa.fonteTitulo || 'titulo';
    let s = w * 0.42;
    ctx.save();
    ctx.translate(x + w / 2, h / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = capa.cor;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = L.fonteCss(fk, s);
    while (ctx.measureText(txt).width > h * 0.66 && s > 4) { s *= 0.92; ctx.font = L.fonteCss(fk, s); }
    ctx.fillText(txt, 0, 0);
    ctx.restore();
  }

  L.gerarArquivoImpressao = async (proj, onProgresso) => {
    await L.fontesProntas();
    const f = L.formato(proj.formato), imp = cfg.impressao;
    const ladoMm = f.cm * 10, sangMm = imp.sangriaMm, lombMm = L.lombadaMm(proj);
    const miolo = L.miolo(proj).slice();
    if (miolo.length % 2) miolo.push(L.paginaEmBranco());
    const capa = proj.paginas[0], contra = proj.paginas[proj.paginas.length - 1];
    const total = miolo.length + 1;
    const paginas = [];

    const cache = new Map();
    const getImg = async (id) => { if (!cache.has(id)) cache.set(id, await L.carregarImagemImpressao(id)); return cache.get(id); };

    try {
      // 1) capa aberta: contracapa | lombada | capa
      onProgresso && onProgresso(0, total);
      {
        const wMm = 2 * ladoMm + lombMm + 2 * sangMm, hMm = ladoMm + 2 * sangMm;
        const dpi = dpiSeguro(wMm / MM_POL, hMm / MM_POL, imp.dpi), pxmm = dpi / MM_POL;
        const cv = novoCanvas(Math.round(wMm * pxmm), Math.round(hMm * pxmm));
        const ctx = cv.getContext('2d');
        ctx.fillStyle = capa.bg; ctx.fillRect(0, 0, cv.width, cv.height);
        const lado = ladoMm * pxmm, sang = sangMm * pxmm, lomb = lombMm * pxmm;
        await L.desenharPagina(ctx, contra, { x0: sang, y0: sang, lado, sangria: sang, getImg, bordas: { dir: false } });
        ctx.fillStyle = capa.bg; ctx.fillRect(sang + lado, 0, lomb, cv.height);
        textoLombada(ctx, capa, sang + lado, lomb, cv.height, pxmm);
        await L.desenharPagina(ctx, capa, { x0: sang + lado + lomb, y0: sang, lado, sangria: sang, getImg, bordas: { esq: false } });
        paginas.push(await paraJpeg(cv, wMm, hMm, sangMm));
      }
      // 2) miolo
      const ladoTotMm = ladoMm + 2 * sangMm;
      const dpi = dpiSeguro(ladoTotMm / MM_POL, ladoTotMm / MM_POL, imp.dpi), pxmm = dpi / MM_POL;
      for (let i = 0; i < miolo.length; i++) {
        onProgresso && onProgresso(i + 1, total);
        const cv = novoCanvas(Math.round(ladoTotMm * pxmm), Math.round(ladoTotMm * pxmm));
        const ctx = cv.getContext('2d');
        await L.desenharPagina(ctx, miolo[i], { x0: sangMm * pxmm, y0: sangMm * pxmm, lado: ladoMm * pxmm, sangria: sangMm * pxmm, getImg });
        paginas.push(await paraJpeg(cv, ladoTotMm, ladoTotMm, sangMm));
        await L.frame();
      }
      onProgresso && onProgresso(total, total);
      const tema = L.tema(proj.tema);
      const blob = L.montarPdf(paginas, { titulo: `${capa.titulo || 'Livro'} — ${tema.nome}` });
      return { blob, bytes: blob.size, paginasPdf: paginas.length, paginasMiolo: miolo.length, dpi, lombadaMm: lombMm, formato: f };
    } finally {
      cache.forEach((v) => v && URL.revokeObjectURL(v.url));
    }
  };

  /* ---------- escritor de PDF mínimo (páginas = imagens JPEG) ---------- */
  function textoPdf(s) {
    let hex = 'FEFF';
    for (const ch of String(s || '')) {
      const cp = ch.codePointAt(0);
      if (cp > 0xffff) { const v = cp - 0x10000; hex += (0xd800 + (v >> 10)).toString(16).padStart(4, '0') + (0xdc00 + (v & 0x3ff)).toString(16).padStart(4, '0'); }
      else hex += cp.toString(16).padStart(4, '0');
    }
    return '<' + hex.toUpperCase() + '>';
  }
  function dataPdf(d = new Date()) {
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  }

  L.montarPdf = (paginas, meta = {}) => {
    const partes = [], offsets = [];
    let pos = 0;
    const add = (x) => {
      let b = x;
      if (typeof x === 'string') { b = new Uint8Array(x.length); for (let i = 0; i < x.length; i++) b[i] = x.charCodeAt(i) & 255; }
      partes.push(b); pos += b.length;
    };
    const obj = (n, corpo) => { offsets[n] = pos; add(`${n} 0 obj\n`); corpo(); add('\nendobj\n'); };
    const N = paginas.length;
    add('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
    obj(1, () => add('<< /Type /Catalog /Pages 2 0 R >>'));
    obj(2, () => add(`<< /Type /Pages /Kids [${paginas.map((_, i) => `${4 + 3 * i} 0 R`).join(' ')}] /Count ${N} >>`));
    obj(3, () => add(`<< /Title ${textoPdf(meta.titulo)} /Producer ${textoPdf(cfg.marca + ' Livros (MVP)')} /Creator ${textoPdf(cfg.marca + ' Livros (MVP)')} /CreationDate (D:${dataPdf()}) >>`));
    paginas.forEach((p, i) => {
      const np = 4 + 3 * i, nc = 5 + 3 * i, ni = 6 + 3 * i;
      const w = p.wPt.toFixed(2), hh = p.hPt.toFixed(2), s = p.sangPt;
      obj(np, () => add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${hh}] /BleedBox [0 0 ${w} ${hh}] /TrimBox [${s.toFixed(2)} ${s.toFixed(2)} ${(p.wPt - s).toFixed(2)} ${(p.hPt - s).toFixed(2)}] /Resources << /XObject << /Im0 ${ni} 0 R >> >> /Contents ${nc} 0 R >>`));
      const conteudo = `q ${w} 0 0 ${hh} 0 0 cm /Im0 Do Q`;
      obj(nc, () => { add(`<< /Length ${conteudo.length} >>\nstream\n`); add(conteudo); add('\nendstream'); });
      obj(ni, () => {
        add(`<< /Type /XObject /Subtype /Image /Width ${p.wPx} /Height ${p.hPx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.jpeg.length} >>\nstream\n`);
        add(p.jpeg); add('\nendstream');
      });
    });
    const xref = pos, total = 4 + 3 * N;
    add(`xref\n0 ${total}\n0000000000 65535 f \n`);
    for (let n = 1; n < total; n++) add(String(offsets[n]).padStart(10, '0') + ' 00000 n \n');
    add(`trailer\n<< /Size ${total} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
    return new Blob(partes, { type: 'application/pdf' });
  };
})(window.L = window.L || {});
