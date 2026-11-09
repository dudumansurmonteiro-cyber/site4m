/* Fotos: leitura do arquivo, correção de orientação, compressão em duas
   versões (uma leve para a tela e uma em alta para a gráfica). */
(function (L) {
  'use strict';

  const MAX_IMPRESSAO = 2400;  // ~300 dpi numa página de 20 cm
  const MAX_TELA = 1000;

  const fit = (w, h, max) => {
    const s = Math.min(1, max / Math.max(w, h));
    return [Math.max(1, Math.round(w * s)), Math.max(1, Math.round(h * s))];
  };
  const toBlob = (c, q) =>
    new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('Falha ao comprimir a imagem'))), 'image/jpeg', q));

  // Reduz em etapas de 50% para não serrilhar
  function reduzir(src, sw, sh, tw, th) {
    let cur = src, cw = sw, ch = sh;
    while (cw / 2 >= tw * 1.1 && ch / 2 >= th * 1.1) {
      const c = document.createElement('canvas');
      c.width = Math.round(cw / 2); c.height = Math.round(ch / 2);
      const x = c.getContext('2d');
      x.imageSmoothingQuality = 'high';
      x.drawImage(cur, 0, 0, c.width, c.height);
      cur = c; cw = c.width; ch = c.height;
    }
    const out = document.createElement('canvas');
    out.width = tw; out.height = th;
    const x = out.getContext('2d');
    x.imageSmoothingQuality = 'high';
    x.fillStyle = '#fff';
    x.fillRect(0, 0, tw, th);
    x.drawImage(cur, 0, 0, tw, th);
    return out;
  }

  L.versoesDeImagem = async (src, ow, oh, extra) => {
    const [pw, ph] = fit(ow, oh, MAX_IMPRESSAO);
    const grande = reduzir(src, ow, oh, pw, ph);
    const print = await toBlob(grande, 0.9);
    const [vw, vh] = fit(pw, ph, MAX_TELA);
    const preview = await toBlob(reduzir(grande, pw, ph, vw, vh), 0.82);
    return Object.assign({ w: pw, h: ph, ow, oh, preview, print }, extra);
  };

  async function decodificar(file) {
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.decoding = 'async';
      img.src = url;
      await img.decode();
      if (!img.naturalWidth) throw new Error('vazia');
      return { img, url };
    } catch (e) {
      URL.revokeObjectURL(url);
      throw e;
    }
  }

  // Processa um arquivo escolhido pelo cliente
  L.processarArquivo = async (file) => {
    let dec;
    try {
      dec = await decodificar(file);
    } catch (e) {
      const err = new Error(`Não conseguimos abrir “${file.name}”. Envie fotos em JPG ou PNG.`);
      err.amigavel = true;
      throw err;
    }
    try {
      const { img } = dec;
      const rec = await L.versoesDeImagem(img, img.naturalWidth, img.naturalHeight, { id: L.uid('img_'), nome: file.name });
      return L.addImagem(rec);
    } finally {
      URL.revokeObjectURL(dec.url);
    }
  };

  // Processa vários, avisando o progresso
  L.processarArquivos = async (files, onProgresso) => {
    const ok = [], erros = [];
    for (let i = 0; i < files.length; i++) {
      onProgresso && onProgresso(i, files.length);
      try { ok.push(await L.processarArquivo(files[i])); }
      catch (e) { erros.push(e.amigavel ? e.message : `Erro ao ler “${files[i].name}”.`); }
      await L.frame();
    }
    onProgresso && onProgresso(files.length, files.length);
    return { ok, erros };
  };

  /* ---------- fotos de exemplo (ilustrações geradas no navegador) ---------- */
  L.ID_AMOSTRA = (cena) => 'amostra-' + cena;

  // Versão leve (para a vitrine) — rápida
  L.garantirAmostras = async (cenas) => {
    for (const cena of cenas) {
      const id = L.ID_AMOSTRA(cena);
      if (L.state.imagens.has(id)) continue;
      const c = L.desenharCena(cena, 1000, 750);
      const preview = await toBlob(c, 0.85);
      L.addImagem({ id, w: 1800, h: 1350, ow: 1800, oh: 1350, preview, print: null, amostra: cena }, false);
      await L.frame();
    }
  };

  // Versão em alta (quando a amostra vai para um livro de verdade)
  L.garantirAmostraEmAlta = async (id) => {
    const rec = L.state.imagens.get(id);
    if (!rec || rec.print || !rec.amostra) return rec;
    const c = L.desenharCena(rec.amostra, 1800, 1350);
    rec.print = await toBlob(c, 0.9);
    return rec;
  };

  // Imagem decodificada em alta, para desenhar no canvas do PDF
  L.carregarImagemImpressao = async (id) => {
    let rec = L.state.imagens.get(id);
    if (!rec) { await L.garantirImagens([id]); rec = L.state.imagens.get(id); }
    if (!rec) return null;
    if (!rec.print && rec.amostra) await L.garantirAmostraEmAlta(id);
    const blob = rec.print || rec.preview;
    const url = URL.createObjectURL(blob);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return { img, url };
    } catch (e) {
      URL.revokeObjectURL(url);
      return null;
    }
  };

  // Blob reduzido para mandar à IA (legenda automática)
  L.blobParaIA = async (id) => {
    const rec = L.img(id);
    if (!rec) return null;
    const url = rec.url;
    const img = new Image();
    img.src = url;
    await img.decode();
    const [w, h] = fit(img.naturalWidth, img.naturalHeight, 768);
    return toBlob(reduzir(img, img.naturalWidth, img.naturalHeight, w, h), 0.8);
  };
})(window.L = window.L || {});
