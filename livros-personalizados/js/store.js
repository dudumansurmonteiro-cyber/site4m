/* Estado do app e persistência local (IndexedDB).
   Nesta versão de demonstração, rascunho, fotos e pedidos ficam só no
   navegador de quem está usando. Num produto real, iriam para o servidor. */
(function (L) {
  'use strict';

  const S = (L.state = {
    projeto: null,          // livro em edição (rascunho)
    imagens: new Map(),     // id -> { id, w, h, ow, oh, preview: Blob, print: Blob|null, url }
    pedidos: [],            // pedidos já feitos neste navegador
    pdfs: new Map(),        // id do pedido -> { blob, nome, bytes, paginas }
    salvo: 'ocioso',        // ocioso | salvando | salvo | indisponivel
  });

  /* ---------- eventos simples ---------- */
  const ouvintes = new Set();
  L.on = (fn) => { ouvintes.add(fn); return () => ouvintes.delete(fn); };
  L.emit = (o) => ouvintes.forEach((fn) => { try { fn(o); } catch (e) { console.error(e); } });

  /* ---------- IndexedDB (tudo protegido: modo privado pode bloquear) ---------- */
  let dbp = null;
  function abrir() {
    if (dbp) return dbp;
    dbp = new Promise((resolve) => {
      try {
        const req = indexedDB.open('laco-livros', 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          ['kv', 'imagens', 'pedidos'].forEach((n) => { if (!db.objectStoreNames.contains(n)) db.createObjectStore(n); });
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
        req.onblocked = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
    return dbp;
  }
  async function tx(store, modo, fn) {
    const db = await abrir();
    if (!db) return { ok: false };
    return new Promise((resolve) => {
      try {
        const t = db.transaction(store, modo);
        const req = fn(t.objectStore(store));
        t.oncomplete = () => resolve({ ok: true, valor: req && req.result });
        t.onerror = t.onabort = () => resolve({ ok: false });
      } catch (e) {
        resolve({ ok: false });
      }
    });
  }
  L.idb = {
    get: async (s, k) => (await tx(s, 'readonly', (st) => st.get(k))).valor,
    put: async (s, k, v) => (await tx(s, 'readwrite', (st) => st.put(v, k))).ok,
    del: async (s, k) => (await tx(s, 'readwrite', (st) => st.delete(k))).ok,
    all: async (s) => (await tx(s, 'readonly', (st) => st.getAll())).valor || [],
    keys: async (s) => (await tx(s, 'readonly', (st) => st.getAllKeys())).valor || [],
  };

  /* ---------- imagens ---------- */
  L.addImagem = (rec, persistir = true) => {
    const antigo = S.imagens.get(rec.id);
    if (antigo && antigo.url && antigo.preview !== rec.preview) URL.revokeObjectURL(antigo.url);
    rec.url = antigo && antigo.preview === rec.preview ? antigo.url : URL.createObjectURL(rec.preview);
    S.imagens.set(rec.id, rec);
    if (persistir) {
      const { url, ...dados } = rec;
      L.idb.put('imagens', rec.id, dados);
    }
    return rec;
  };
  L.imgUrl = (id) => (id && S.imagens.get(id) ? S.imagens.get(id).url : null);
  L.img = (id) => (id ? S.imagens.get(id) || null : null);

  L.idsDeImagens = (projeto) => {
    const ids = new Set();
    if (!projeto) return ids;
    for (const p of projeto.paginas) for (const f of p.fotos || []) if (f && f.img) ids.add(f.img);
    return ids;
  };

  L.garantirImagens = async (ids) => {
    for (const id of ids) {
      if (S.imagens.has(id)) continue;
      const rec = await L.idb.get('imagens', id);
      if (rec && rec.preview) L.addImagem(rec, false);
    }
  };

  /* ---------- rascunho ---------- */
  function setSalvo(v) { S.salvo = v; L.emit({ tipo: 'salvo' }); }
  const salvarAgora = async () => {
    if (!S.projeto) return;
    S.projeto.atualizadoEm = Date.now();
    setSalvo('salvando');
    const ok = await L.idb.put('kv', 'rascunho', S.projeto);
    setSalvo(ok ? 'salvo' : 'indisponivel');
  };
  L.salvarRascunho = L.debounce(salvarAgora, 400, 1500);
  // ao sair ou trocar de aba, grava na hora
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && S.projeto) L.salvarRascunho.flush(); });
  window.addEventListener('pagehide', () => { if (S.projeto) L.salvarRascunho.flush(); });

  // Chame depois de qualquer alteração no projeto
  L.alterou = (detalhe) => {
    L.salvarRascunho();
    L.emit({ tipo: 'projeto', detalhe });
  };

  L.descartarRascunho = async () => {
    S.projeto = null;
    await L.idb.del('kv', 'rascunho');
    L.emit({ tipo: 'projeto' });
  };

  /* ---------- pedidos ---------- */
  L.salvarPedido = async (pedido) => {
    const i = S.pedidos.findIndex((p) => p.id === pedido.id);
    if (i >= 0) S.pedidos[i] = pedido; else S.pedidos.unshift(pedido);
    await L.idb.put('pedidos', pedido.id, pedido);
  };

  /* ---------- carregamento inicial ---------- */
  L.carregarDados = async () => {
    const [rascunho, pedidos] = await Promise.all([L.idb.get('kv', 'rascunho'), L.idb.all('pedidos')]);
    S.pedidos = (pedidos || []).sort((a, b) => (b.criadoEm || '').localeCompare(a.criadoEm || ''));
    if (rascunho && rascunho.paginas) S.projeto = rascunho;

    // fotos do rascunho + capas dos pedidos (o resto carrega sob demanda)
    const precisa = L.idsDeImagens(S.projeto);
    for (const p of S.pedidos) {
      const capa = p.projeto && p.projeto.paginas[0];
      if (capa && capa.fotos[0] && capa.fotos[0].img) precisa.add(capa.fotos[0].img);
    }
    await L.garantirImagens(precisa);

    // limpeza: remove fotos que nenhum livro usa mais
    const usadas = L.idsDeImagens(S.projeto);
    for (const p of S.pedidos) L.idsDeImagens(p.projeto).forEach((id) => usadas.add(id));
    const chaves = await L.idb.keys('imagens');
    for (const k of chaves) if (!usadas.has(k)) L.idb.del('imagens', k);
  };
})(window.L = window.L || {});
