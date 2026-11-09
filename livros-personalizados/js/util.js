/* Utilitários: criação de elementos, formatação, datas, ícones, toasts. */
(function (L) {
  'use strict';

  /* ---------- criação de elementos ---------- */
  function append(el, kids) {
    for (const c of kids.flat(Infinity)) {
      if (c == null || c === false || c === true) continue;
      el.append(c instanceof Node ? c : String(c));
    }
  }

  L.h = function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    let value;
    if (props) {
      for (const k in props) {
        const v = props[k];
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'style') {
          if (typeof v === 'string') el.style.cssText = v;
          else for (const s in v) { if (v[s] == null) continue; s.startsWith('--') ? el.style.setProperty(s, v[s]) : (el.style[s] = v[s]); }
        } else if (k === 'html') el.innerHTML = v;
        else if (k === 'dataset') Object.assign(el.dataset, v);
        else if (k === 'value') value = v;
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, v);
      }
    }
    append(el, kids);
    if (value !== undefined) el.value = value;
    return el;
  };
  // append que ignora null/false (o append nativo escreveria "null")
  L.add = (el, ...kids) => { append(el, kids); return el; };
  L.$ = (sel, root) => (root || document).querySelector(sel);
  L.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  L.clear = (el) => { while (el.firstChild) el.firstChild.remove(); return el; };

  /* ---------- ícones (traço 24×24) ---------- */
  const ICONS = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    arrowLeft: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
    images: '<rect x="7" y="7" width="14" height="14" rx="2"/><path d="M17 3H5a2 2 0 0 0-2 2v12"/><circle cx="12" cy="12" r="1.6"/><path d="m21 17-3.5-3.5L11 20"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    type: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 15h18"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8C10.5 8 7 7.5 7 5.5S10 3.5 12 8zm0 0c1.5 0 5-.5 5-2.5S14 3.5 12 8z"/>',
    truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    book: '<path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>',
    download: '<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',
    center: '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    printer: '<path d="M6 9V3h12v6M6 18H4v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7h-2"/><rect x="6" y="14" width="12" height="7"/>',
    heart: '<path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9z"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5h.01"/>',
    pix: '<path d="M12 3l9 9-9 9-9-9z"/><path d="M8.5 12h7"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    bag: '<path d="M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
    pages: '<path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 8h6M9 12h6M9 16h3"/>',
    move: '<path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  };
  L.svg = (name, cls) =>
    `<svg class="ic${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
  L.icon = (name, cls) => {
    const t = document.createElement('template');
    t.innerHTML = L.svg(name, cls);
    return t.content.firstChild;
  };

  // Laço (logo) — o mesmo desenho vai para o PDF (Path2D)
  L.LOGO_PATHS = [
    'M24 15.2C18.6 5.2 7.4 2.6 5.3 8.6c-1.9 5.6 7.2 9.5 18.7 6.6z',
    'M24 15.2c5.4-10 16.6-12.6 18.7-6.6 1.9 5.6-7.2 9.5-18.7 6.6z',
    'M22.3 16.4 15.6 29l3.6-1.1 1.9 3 4-14.2z',
    'M25.7 16.4 32.4 29l-3.6-1.1-1.9 3-4-14.2z',
    'M20.4 15.4a3.6 3.3 0 1 0 7.2 0 3.6 3.3 0 1 0-7.2 0z',
  ];
  L.logoSvg = (cls) =>
    `<svg class="${cls || 'logo-laco'}" viewBox="0 0 48 32" aria-hidden="true">${L.LOGO_PATHS.map((d) =>
      `<path d="${d}" fill="currentColor"/>`).join('')}<path d="M9.2 9.3c1.6-2.4 7.2-.6 10.6 3.9-4.8.4-11.9-1.2-10.6-3.9zM38.8 9.3c-1.6-2.4-7.2-.6-10.6 3.9 4.8.4 11.9-1.2 10.6-3.9z" fill="#000" opacity=".18"/></svg>`;

  /* ---------- números e dinheiro ---------- */
  L.money = (v) => (Math.round(v * 100) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  L.num = (v, d = 0) => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  L.clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  L.uid = (p = '') => p + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  // espera parar de mexer por `ms`; com maxEspera, executa pelo menos a cada maxEspera
  L.debounce = (fn, ms, maxEspera) => {
    let t, primeiro = 0;
    const d = (...a) => {
      clearTimeout(t);
      const agora = Date.now();
      if (!primeiro) primeiro = agora;
      const rodar = () => { primeiro = 0; fn(...a); };
      if (maxEspera && agora - primeiro >= maxEspera) { rodar(); return; }
      t = setTimeout(rodar, ms);
    };
    d.flush = (...a) => { clearTimeout(t); primeiro = 0; return fn(...a); };
    return d;
  };
  L.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  L.frame = () => new Promise((r) => requestAnimationFrame(() => r()));
  L.clone = (o) => JSON.parse(JSON.stringify(o));
  L.bytes = (n) => (n > 1048576 ? L.num(n / 1048576, 1) + ' MB' : L.num(Math.max(1, n / 1024)) + ' KB');

  /* ---------- datas ---------- */
  const DIAS = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];
  const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const p2 = (n) => String(n).padStart(2, '0');
  L.addDiasUteis = (data, n) => {
    const d = new Date(data);
    let somados = 0;
    while (somados < n) {
      d.setDate(d.getDate() + 1);
      const s = d.getDay();
      if (s !== 0 && s !== 6) somados++;
    }
    return d;
  };
  L.fmtData = (d, estilo) => {
    if (!d) return '';
    if (typeof d === 'string') {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
      d = m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(d);
    }
    if (isNaN(d)) return '';
    switch (estilo) {
      case 'pontos': return `${p2(d.getDate())}.${p2(d.getMonth() + 1)}.${d.getFullYear()}`;
      case 'longa': return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
      case 'semana': return `${DIAS[d.getDay()]}, ${p2(d.getDate())}/${p2(d.getMonth() + 1)}`;
      case 'hora': return `${p2(d.getDate())}/${p2(d.getMonth() + 1)} às ${p2(d.getHours())}h${p2(d.getMinutes())}`;
      default: return `${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()}`;
    }
  };

  /* ---------- textos com {placeholders} ---------- */
  L.fill = (tpl, vars) => {
    if (!tpl) return '';
    const s = String(tpl).replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? '').trim());
    return s
      .split('\n')
      .map((linha) =>
        linha
          .replace(/[ \t]+/g, ' ')
          .replace(/,\s*!/g, '!')
          .replace(/^\s*[·&,]\s*/, '')
          .replace(/\s*[·&,]\s*$/, '')
          .trim()
      )
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  /* ---------- toast ---------- */
  let toastBox;
  L.toast = (msg, opts = {}) => {
    if (!toastBox) {
      toastBox = L.h('div', { class: 'toasts', role: 'status', 'aria-live': 'polite' });
      document.body.append(toastBox);
    }
    const el = L.h('div', { class: 'toast' + (opts.tipo ? ' toast--' + opts.tipo : '') },
      L.h('span', null, msg),
      opts.acao && L.h('button', { type: 'button', class: 'toast__acao', onClick: () => { opts.onAcao && opts.onAcao(); fechar(); } }, opts.acao)
    );
    function fechar() { el.classList.add('saindo'); setTimeout(() => el.remove(), 250); }
    toastBox.append(el);
    setTimeout(fechar, opts.tempo || 3800);
    return fechar;
  };

  /* ---------- escolher arquivos (input efêmero) ---------- */
  L.escolherArquivos = ({ multiplos = false } = {}) =>
    new Promise((resolve) => {
      const input = L.h('input', { type: 'file', accept: 'image/*', hidden: true });
      if (multiplos) input.multiple = true;
      let feito = false;
      const fim = (files) => { if (feito) return; feito = true; input.remove(); resolve(files); };
      input.addEventListener('change', () => fim(Array.from(input.files || [])));
      input.addEventListener('cancel', () => fim([]));
      document.body.append(input);
      input.click();
    });

  /* ---------- baixar/salvar um arquivo gerado ---------- */
  L.salvarArquivo = async (blob, nome) => {
    const dl = L.caps && L.caps.downloads;
    if (dl) {
      try {
        await dl.save({ filename: nome, data: blob });
        L.toast('Arquivo salvo.');
      } catch (e) {
        if (e && e.code === 'declined') return;
        L.toast('Não foi possível salvar o arquivo nesta visualização.', { tipo: 'erro' });
      }
      return;
    }
    if (L.caps && L.caps.dentroDoClaude) {
      L.toast('O download não está disponível nesta visualização.', { tipo: 'erro' });
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = L.h('a', { href: url, download: nome, hidden: true });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  };
})(window.L = window.L || {});
