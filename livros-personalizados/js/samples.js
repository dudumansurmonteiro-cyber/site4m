/* Fotos de exemplo: ilustrações desenhadas no próprio navegador
   (sem banco de imagens), para quem quer testar sem enviar fotos. */
(function (L) {
  'use strict';

  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const hash = (s) => { let x = 2166136261; for (const ch of s) x = Math.imul(x ^ ch.charCodeAt(0), 16777619); return x >>> 0; };

  /* ---------- primitivas ---------- */
  function lin(c, x0, y0, x1, y1, stops) { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, cor]) => g.addColorStop(o, cor)); return g; }
  function fill(c, x, y, w, h, estilo) { c.fillStyle = estilo; c.fillRect(x, y, w, h); }
  function circle(c, x, y, r) { c.beginPath(); c.arc(x, y, Math.max(0.1, r), 0, Math.PI * 2); c.fill(); }
  function ellipse(c, x, y, rx, ry) { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill(); }
  function glow(c, x, y, r, cor) { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, cor); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }
  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function poly(c, pts) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fill(); }
  const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; }

  function ridge(c, w, h, base, amp, rough, cor, R) {
    const n = 129, pts = new Array(n).fill(0);
    pts[0] = (R() - 0.5) * amp; pts[n - 1] = (R() - 0.5) * amp;
    let step = n - 1, a = amp;
    while (step > 1) {
      const half = step / 2;
      for (let i = half; i < n; i += step) pts[i] = (pts[i - half] + pts[i + half]) / 2 + (R() - 0.5) * a;
      step = half; a *= rough;
    }
    c.beginPath(); c.moveTo(0, h);
    for (let i = 0; i < n; i++) c.lineTo((i / (n - 1)) * w, base + pts[i]);
    c.lineTo(w, h); c.closePath(); c.fillStyle = cor; c.fill();
  }
  function colinas(c, w, h, base, amp, cor, R) {
    const ph = R() * 6, f = 1.5 + R() * 1.5;
    c.beginPath(); c.moveTo(0, h);
    for (let x = 0; x <= w + 1; x += w / 80) c.lineTo(x, base + Math.sin((x / w) * Math.PI * f + ph) * amp + Math.sin((x / w) * Math.PI * f * 2.3 + ph * 1.7) * amp * 0.35);
    c.lineTo(w, h); c.closePath(); c.fillStyle = cor; c.fill();
  }

  /* ---------- cenas ---------- */
  const CENAS = {
    praia(c, w, h, R) {
      const hz = h * 0.58;
      fill(c, 0, 0, w, hz, lin(c, 0, 0, 0, hz, [[0, '#2B2F5E'], [0.45, '#B65B83'], [0.78, '#F2836B'], [1, '#FFC27A']]));
      for (let i = 0; i < 7; i++) { c.fillStyle = `rgba(255,190,170,${0.15 + R() * 0.2})`; ellipse(c, R() * w, h * (0.1 + R() * 0.32), w * (0.1 + R() * 0.16), h * 0.011); }
      const sx = w * 0.62, sy = hz - h * 0.015, sr = h * 0.085;
      glow(c, sx, sy, sr * 4.5, 'rgba(255,214,150,0.55)');
      c.fillStyle = '#FFE6A6'; circle(c, sx, sy, sr);
      fill(c, 0, hz, w, h * 0.27, lin(c, 0, hz, 0, hz + h * 0.27, [[0, '#7A4F82'], [1, '#273457']]));
      for (let i = 0; i < 80; i++) {
        const t = R(), y = hz + 3 + t * h * 0.24, spread = w * (0.03 + t * 0.15);
        const x = sx + (R() - 0.5) * spread * 2, len = w * (0.01 + R() * 0.05) * (0.4 + t);
        c.fillStyle = `rgba(255,212,150,${0.2 + R() * 0.5})`; c.fillRect(x - len / 2, y, len, Math.max(2, h * 0.004));
      }
      const areia = () => { c.beginPath(); c.moveTo(0, h * 0.8); c.bezierCurveTo(w * 0.3, h * 0.76, w * 0.7, h * 0.87, w, h * 0.82); };
      areia(); c.lineTo(w, h); c.lineTo(0, h); c.closePath();
      c.fillStyle = lin(c, 0, h * 0.78, 0, h, [[0, '#E9B98C'], [1, '#B47B57']]); c.fill();
      c.strokeStyle = 'rgba(255,255,255,0.55)'; c.lineWidth = h * 0.006; areia(); c.stroke();
      palmeira(c, w * 0.88, h * 1.02, h * 0.62, '#231A2E');
    },
    cidade(c, w, h, R) {
      const hz = h * 0.64;
      fill(c, 0, 0, w, hz, lin(c, 0, 0, 0, hz, [[0, '#0B1030'], [0.6, '#2A2764'], [1, '#6B4A86']]));
      for (let i = 0; i < 170; i++) { c.fillStyle = `rgba(255,255,255,${0.3 + R() * 0.7})`; circle(c, R() * w, R() * hz * 0.72, R() * h * 0.0025 + 0.6); }
      glow(c, w * 0.2, h * 0.18, h * 0.17, 'rgba(255,240,210,0.35)'); c.fillStyle = '#F6EBCF'; circle(c, w * 0.2, h * 0.18, h * 0.055);
      let x = -10;
      while (x < w) { const bw = w * (0.03 + R() * 0.05), bh = h * (0.12 + R() * 0.22); c.fillStyle = '#2A2A5A'; c.fillRect(x, hz - bh, bw, bh); x += bw + w * 0.004; }
      x = -10;
      while (x < w) {
        const bw = w * (0.05 + R() * 0.07), bh = h * (0.18 + R() * 0.36);
        c.fillStyle = R() < 0.5 ? '#141836' : '#1B1F45'; c.fillRect(x, hz - bh, bw, bh);
        const cols = Math.max(2, Math.floor(bw / (w * 0.012))), rows = Math.floor(bh / (h * 0.03));
        for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
          if (R() < 0.42) { c.fillStyle = R() < 0.8 ? 'rgba(255,214,122,0.92)' : 'rgba(170,210,255,0.8)'; c.fillRect(x + bw * 0.12 + i * ((bw * 0.76) / cols), hz - bh + h * 0.015 + j * h * 0.03, ((bw * 0.76) / cols) * 0.55, h * 0.014); }
        }
        x += bw + w * 0.006;
      }
      fill(c, 0, hz, w, h - hz, lin(c, 0, hz, 0, h, [[0, '#1E1E48'], [1, '#090B20']]));
      c.save(); c.globalAlpha = 0.32; c.translate(0, hz * 2); c.scale(1, -1);
      c.drawImage(c.canvas, 0, hz - h * 0.36, w, h * 0.36, 0, hz - h * 0.36, w, h * 0.36); c.restore();
      for (let i = 0; i < 90; i++) { c.fillStyle = `rgba(255,214,122,${R() * 0.35})`; c.fillRect(R() * w, hz + R() * (h - hz), w * (0.01 + R() * 0.04), Math.max(1.5, h * 0.003)); }
    },
    rodagigante(c, w, h, R) {
      fill(c, 0, 0, w, h, lin(c, 0, 0, 0, h, [[0, '#262457'], [0.5, '#A3518A'], [0.85, '#F49A6C'], [1, '#F7B57D']]));
      const cx = w * 0.6, cy = h * 0.46, r = h * 0.33;
      c.strokeStyle = '#1C1636'; c.lineWidth = h * 0.012; c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke();
      c.lineWidth = h * 0.004; c.beginPath(); c.arc(cx, cy, r * 0.93, 0, Math.PI * 2); c.stroke();
      const n = 16;
      for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); c.stroke(); }
      c.lineWidth = h * 0.014; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx - r * 0.55, h * 0.95); c.moveTo(cx, cy); c.lineTo(cx + r * 0.55, h * 0.95); c.stroke();
      const coresCab = ['#E4572E', '#F3C13A', '#2E9C9A', '#F28482'];
      for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; c.fillStyle = coresCab[i % 4]; rr(c, x - h * 0.018, y, h * 0.036, h * 0.032, h * 0.006); c.fill(); }
      for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; glow(c, cx + Math.cos(a) * r, cy + Math.sin(a) * r, h * 0.014, 'rgba(255,224,138,0.9)'); }
      c.fillStyle = '#1C1636'; circle(c, cx, cy, h * 0.02);
      c.fillRect(0, h * 0.93, w, h * 0.07);
      for (let i = 0; i < 10; i++) circle(c, R() * w, h * 0.935, h * (0.03 + R() * 0.05));
    },
    piquenique(c, w, h, R) {
      fill(c, 0, 0, w, h * 0.62, lin(c, 0, 0, 0, h * 0.62, [[0, '#6DB6E3'], [1, '#CFEAF5']]));
      for (let i = 0; i < 4; i++) {
        const x = w * (0.1 + R() * 0.8), y = h * (0.08 + R() * 0.22), r = h * (0.045 + R() * 0.035);
        c.fillStyle = 'rgba(255,255,255,0.93)';
        for (let k = 0; k < 5; k++) circle(c, x + (k - 2) * r * 0.8, y + Math.abs(k - 2) * r * 0.12, r * (1 - Math.abs(k - 2) * 0.18));
      }
      c.fillStyle = lin(c, 0, h * 0.55, 0, h, [[0, '#9CCB73'], [1, '#4F8B3F']]);
      c.beginPath(); c.moveTo(0, h * 0.6); c.quadraticCurveTo(w * 0.5, h * 0.5, w, h * 0.6); c.lineTo(w, h); c.lineTo(0, h); c.closePath(); c.fill();
      arvore(c, w * 0.14, h * 0.62, h * 0.34, R); arvore(c, w * 0.86, h * 0.6, h * 0.27, R);
      const q = [[w * 0.28, h * 0.73], [w * 0.7, h * 0.71], [w * 0.8, h * 0.96], [w * 0.18, h * 0.99]];
      c.save(); c.fillStyle = '#F7F2EC'; poly(c, q); c.clip();
      c.fillStyle = 'rgba(200,16,46,0.55)';
      for (let i = 0; i < 8; i++) { const t0 = i / 8, t1 = (i + 0.5) / 8; poly(c, [lerp2(q[0], q[1], t0), lerp2(q[0], q[1], t1), lerp2(q[3], q[2], t1), lerp2(q[3], q[2], t0)]); }
      for (let i = 0; i < 6; i++) { const t0 = i / 6, t1 = (i + 0.5) / 6; poly(c, [lerp2(q[0], q[3], t0), lerp2(q[1], q[2], t0), lerp2(q[1], q[2], t1), lerp2(q[0], q[3], t1)]); }
      c.restore();
      c.fillStyle = '#A86B3C'; rr(c, w * 0.55, h * 0.75, w * 0.12, h * 0.09, h * 0.012); c.fill();
      c.strokeStyle = '#7A4A26'; c.lineWidth = h * 0.008; c.beginPath(); c.arc(w * 0.61, h * 0.76, w * 0.045, Math.PI, 0); c.stroke();
      c.fillStyle = '#C8102E'; circle(c, w * 0.44, h * 0.84, h * 0.018); circle(c, w * 0.47, h * 0.86, h * 0.016);
    },
    montanha(c, w, h, R) {
      fill(c, 0, 0, w, h, lin(c, 0, 0, 0, h * 0.7, [[0, '#8FAEDD'], [0.55, '#F2C9C0'], [1, '#FBE2C2']]));
      glow(c, w * 0.72, h * 0.36, h * 0.32, 'rgba(255,240,215,0.6)'); c.fillStyle = '#FFF3DC'; circle(c, w * 0.72, h * 0.36, h * 0.05);
      const cores = ['#A3AFD0', '#7E8DBA', '#57689A', '#34416E', '#1F2847'], bases = [0.42, 0.52, 0.62, 0.74, 0.88];
      for (let i = 0; i < cores.length; i++) {
        ridge(c, w, h, h * bases[i], h * (0.22 - i * 0.025), 0.55, cores[i], R);
        if (i < cores.length - 1) { c.fillStyle = lin(c, 0, h * bases[i], 0, h * (bases[i] + 0.12), [[0, 'rgba(255,240,235,0.35)'], [1, 'rgba(255,240,235,0)']]); c.fillRect(0, h * bases[i] - h * 0.02, w, h * 0.14); }
      }
      c.strokeStyle = 'rgba(40,40,70,0.6)'; c.lineWidth = Math.max(1.5, h * 0.003);
      for (let i = 0; i < 5; i++) {
        const bx = w * (0.25 + R() * 0.3), by = h * (0.17 + R() * 0.12), s = h * (0.012 + R() * 0.01);
        c.beginPath(); c.moveTo(bx - s, by); c.quadraticCurveTo(bx - s / 2, by - s * 0.7, bx, by); c.quadraticCurveTo(bx + s / 2, by - s * 0.7, bx + s, by); c.stroke();
      }
    },
    baloes(c, w, h, R) {
      fill(c, 0, 0, w, h, lin(c, 0, 0, 0, h, [[0, '#86C5E6'], [0.55, '#CDE7F0'], [0.8, '#FBE3C9'], [1, '#F7D3B0']]));
      colinas(c, w, h, h * 0.72, h * 0.05, '#A9C98F', R); colinas(c, w, h, h * 0.8, h * 0.05, '#7FAE6F', R); colinas(c, w, h, h * 0.9, h * 0.04, '#56865A', R);
      [[0.22, 0.32, 0.12, ['#E4572E', '#F3C13A']], [0.63, 0.24, 0.09, ['#2E9C9A', '#F4F1EC']], [0.82, 0.45, 0.06, ['#F28482', '#F6BD60']], [0.43, 0.52, 0.045, ['#5B5F97', '#F3C13A']]]
        .forEach(([bx, by, br, cores]) => balao(c, w * bx, h * by, h * br * 1.9, cores));
    },
    estrada(c, w, h, R) {
      const hz = h * 0.58;
      fill(c, 0, 0, w, hz, lin(c, 0, 0, 0, hz, [[0, '#5B4B8A'], [0.5, '#E9806E'], [1, '#FDC57B']]));
      glow(c, w * 0.5, hz, h * 0.36, 'rgba(255,214,140,0.5)'); c.fillStyle = '#FFE3A1'; circle(c, w * 0.5, hz, h * 0.11);
      mesa(c, w * 0.04, hz, w * 0.28, h * 0.16, '#8C4A55'); mesa(c, w * 0.68, hz, w * 0.3, h * 0.12, '#7A3F4E'); mesa(c, w * 0.4, hz, w * 0.12, h * 0.07, '#9A5660');
      fill(c, 0, hz, w, h - hz, lin(c, 0, hz, 0, h, [[0, '#E8A266'], [1, '#B9653F']]));
      c.fillStyle = '#3B3443'; poly(c, [[w * 0.49, hz], [w * 0.51, hz], [w * 0.83, h], [w * 0.17, h]]);
      c.fillStyle = '#F7E3A1';
      for (let i = 0; i < 9; i++) {
        const t0 = Math.pow(i / 9, 1.8), t1 = Math.pow((i + 0.45) / 9, 1.8);
        const y0 = hz + (h - hz) * t0, y1 = hz + (h - hz) * t1, w0 = w * 0.002 + t0 * w * 0.01, w1 = w * 0.002 + t1 * w * 0.01;
        poly(c, [[w * 0.5 - w0, y0], [w * 0.5 + w0, y0], [w * 0.5 + w1, y1], [w * 0.5 - w1, y1]]);
      }
      cacto(c, w * 0.1, h * 0.88, h * 0.22, '#3F5B3A'); cacto(c, w * 0.9, h * 0.8, h * 0.14, '#3F5B3A');
    },
    acampamento(c, w, h, R) {
      fill(c, 0, 0, w, h, lin(c, 0, 0, 0, h, [[0, '#070C22'], [0.6, '#1B2A57'], [1, '#3A3E73']]));
      for (let i = 0; i < 900; i++) {
        const t = R(), off = (R() + R() + R() - 1.5) * h * 0.12;
        c.fillStyle = `rgba(255,255,255,${R() * 0.55})`; circle(c, t * w, h * 0.75 - t * h * 0.62 + off, R() * h * 0.0022 + 0.4);
      }
      for (let i = 0; i < 220; i++) { c.fillStyle = `rgba(255,255,255,${0.3 + R() * 0.7})`; circle(c, R() * w, R() * h * 0.7, R() * h * 0.0025 + 0.5); }
      ridge(c, w, h, h * 0.7, h * 0.12, 0.55, '#121A3A', R);
      for (let i = 0; i < 22; i++) pinheiro(c, R() * w, h * (0.9 + R() * 0.05), h * (0.12 + R() * 0.16), '#080C1E');
      c.fillStyle = '#090D1F'; c.fillRect(0, h * 0.9, w, h * 0.1);
      const tx = w * 0.42, ty = h * 0.92, ts = h * 0.2;
      glow(c, tx, ty - ts * 0.3, ts * 2.2, 'rgba(255,170,80,0.35)');
      c.fillStyle = '#F5A04A'; poly(c, [[tx - ts * 0.7, ty], [tx, ty - ts], [tx + ts * 0.7, ty]]);
      c.fillStyle = '#FFD08A'; poly(c, [[tx - ts * 0.18, ty], [tx, ty - ts * 0.62], [tx + ts * 0.18, ty]]);
      glow(c, w * 0.62, h * 0.93, h * 0.12, 'rgba(255,140,50,0.6)');
      c.fillStyle = '#FFB347'; c.beginPath(); c.moveTo(w * 0.61, h * 0.94); c.quadraticCurveTo(w * 0.62, h * 0.86, w * 0.63, h * 0.94); c.fill();
    },
    fogos(c, w, h, R) {
      fill(c, 0, 0, w, h, lin(c, 0, 0, 0, h, [[0, '#060A1E'], [0.7, '#1A1544'], [1, '#2A1E4E']]));
      const cores = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#F78FB3', '#FFFFFF'];
      for (let k = 0; k < 6; k++) {
        const x = w * (0.12 + R() * 0.76), y = h * (0.12 + R() * 0.38), r = h * (0.09 + R() * 0.11), cor = cores[k % cores.length];
        glow(c, x, y, r * 1.3, hexA(cor, 0.18));
        const n = 36 + Math.floor(R() * 20);
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 + R() * 0.05, raio = r * (0.75 + R() * 0.3);
          c.strokeStyle = hexA(cor, 0.75); c.lineWidth = Math.max(1, h * 0.0025);
          c.beginPath(); c.moveTo(x + Math.cos(a) * raio * 0.25, y + Math.sin(a) * raio * 0.25); c.lineTo(x + Math.cos(a) * raio, y + Math.sin(a) * raio); c.stroke();
          c.fillStyle = cor; circle(c, x + Math.cos(a) * raio, y + Math.sin(a) * raio, h * 0.004);
        }
      }
      const hz = h * 0.82; let x = 0; c.fillStyle = '#0B0A1C';
      while (x < w) { const bw = w * (0.03 + R() * 0.05), bh = h * (0.04 + R() * 0.14); c.fillRect(x, hz - bh, bw, bh); x += bw; }
      fill(c, 0, hz, w, h - hz, lin(c, 0, hz, 0, h, [[0, '#151033'], [1, '#07061A']]));
      c.save(); c.globalAlpha = 0.25; c.translate(0, hz * 2); c.scale(1, -1);
      c.drawImage(c.canvas, 0, hz - h * 0.5, w, h * 0.5, 0, hz - h * 0.5, w, h * 0.5); c.restore();
    },
  };

  function palmeira(c, x, y, alt, cor) {
    const topX = x - alt * 0.18, topY = y - alt;
    c.strokeStyle = cor; c.lineCap = 'round'; c.lineWidth = alt * 0.045;
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + alt * 0.05, y - alt * 0.55, topX, topY); c.stroke();
    c.fillStyle = cor;
    [[-2.8, 0.55], [-2.2, 0.6], [-1.6, 0.5], [-0.9, 0.48], [-0.3, 0.55], [0.35, 0.5], [-3.4, 0.42]].forEach(([ang, len]) => {
      const F = alt * len, ex = topX + Math.cos(ang) * F, ey = topY + Math.sin(ang) * F * 0.6 + F * 0.35;
      const mx = topX + Math.cos(ang) * F * 0.5, my = topY + Math.sin(ang) * F * 0.5 - F * 0.12;
      c.beginPath(); c.moveTo(topX, topY); c.quadraticCurveTo(mx, my - F * 0.08, ex, ey); c.quadraticCurveTo(mx, my + F * 0.07, topX, topY + alt * 0.012); c.fill();
    });
  }
  function arvore(c, x, y, alt, R) {
    c.fillStyle = '#6B4A2F'; c.fillRect(x - alt * 0.04, y - alt * 0.45, alt * 0.08, alt * 0.5);
    const cores = ['#3F7D3A', '#4C9046', '#2F6A33'];
    for (let i = 0; i < 7; i++) { c.fillStyle = cores[i % 3]; circle(c, x + (R() - 0.5) * alt * 0.5, y - alt * 0.6 + (R() - 0.5) * alt * 0.3, alt * (0.18 + R() * 0.1)); }
  }
  function balao(c, x, y, r, cores) {
    const p = new Path2D();
    p.moveTo(x, y + r * 1.25);
    p.bezierCurveTo(x - r * 0.35, y + r * 1.0, x - r * 1.05, y + r * 0.45, x - r, y - r * 0.1);
    p.bezierCurveTo(x - r * 0.95, y - r * 0.75, x - r * 0.45, y - r * 1.05, x, y - r * 1.05);
    p.bezierCurveTo(x + r * 0.45, y - r * 1.05, x + r * 0.95, y - r * 0.75, x + r, y - r * 0.1);
    p.bezierCurveTo(x + r * 1.05, y + r * 0.45, x + r * 0.35, y + r * 1.0, x, y + r * 1.25);
    c.save(); c.clip(p);
    const n = 6;
    for (let i = 0; i < n; i++) { c.fillStyle = cores[i % 2]; c.fillRect(x - r + i * ((2 * r) / n), y - r * 1.1, (2 * r) / n + 1, r * 2.4); }
    c.fillStyle = lin(c, x - r, 0, x + r, 0, [[0, 'rgba(255,255,255,0.28)'], [0.5, 'rgba(255,255,255,0)'], [1, 'rgba(0,0,0,0.22)']]);
    c.fillRect(x - r, y - r * 1.1, 2 * r, r * 2.4);
    c.restore();
    c.strokeStyle = 'rgba(70,50,40,0.8)'; c.lineWidth = Math.max(1, r * 0.03);
    c.beginPath(); c.moveTo(x - r * 0.12, y + r * 1.2); c.lineTo(x - r * 0.14, y + r * 1.45); c.moveTo(x + r * 0.12, y + r * 1.2); c.lineTo(x + r * 0.14, y + r * 1.45); c.stroke();
    c.fillStyle = '#7A5233'; c.fillRect(x - r * 0.17, y + r * 1.45, r * 0.34, r * 0.24);
  }
  function mesa(c, x, base, ww, hh, cor) { c.fillStyle = cor; poly(c, [[x, base], [x + ww * 0.12, base - hh], [x + ww * 0.88, base - hh], [x + ww, base]]); }
  function cacto(c, x, y, s, cor) {
    c.fillStyle = cor;
    rr(c, x - s * 0.07, y - s, s * 0.14, s, s * 0.07); c.fill();
    rr(c, x - s * 0.3, y - s * 0.65, s * 0.1, s * 0.35, s * 0.05); c.fill(); c.fillRect(x - s * 0.3, y - s * 0.38, s * 0.25, s * 0.08);
    rr(c, x + s * 0.2, y - s * 0.8, s * 0.1, s * 0.4, s * 0.05); c.fill(); c.fillRect(x + s * 0.05, y - s * 0.48, s * 0.2, s * 0.08);
  }
  function pinheiro(c, x, y, s, cor) {
    c.fillStyle = cor;
    for (let i = 0; i < 3; i++) { const yy = y - i * s * 0.28, ww = s * (0.38 - i * 0.09); poly(c, [[x - ww, yy], [x, yy - s * 0.45], [x + ww, yy]]); }
    c.fillRect(x - s * 0.03, y, s * 0.06, s * 0.12);
  }

  function vinheta(c, w, h) {
    const g = c.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.28)');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
  }
  function grao(c, w, h, forca) {
    const img = c.getImageData(0, 0, w, h), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * forca; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    c.putImageData(img, 0, 0);
  }

  L.CENAS = ['praia', 'cidade', 'rodagigante', 'piquenique', 'montanha', 'baloes', 'estrada', 'acampamento', 'fogos'];
  L.NOMES_CENAS = { praia: 'Praia ao pôr do sol', cidade: 'Cidade à noite', rodagigante: 'Roda-gigante', piquenique: 'Piquenique', montanha: 'Montanhas', baloes: 'Balões', estrada: 'Estrada', acampamento: 'Acampamento', fogos: 'Fogos de artifício' };

  L.desenharCena = (nome, w, h) => {
    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const c = cv.getContext('2d', { willReadFrequently: true });
    (CENAS[nome] || CENAS.praia)(c, w, h, rng(hash(nome)));
    vinheta(c, w, h);
    grao(c, w, h, 9);
    return cv;
  };
})(window.L = window.L || {});
