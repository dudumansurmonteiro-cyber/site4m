/* Editor: página grande no centro, ferramentas ao lado, miniaturas embaixo.
   Edição direta na página: tocar na foto, digitar a legenda, arrastar emojis. */
(function (L) {
  'use strict';
  const h = L.h, cfg = L.config, S = L.state;
  L.views = L.views || {};

  const ABAS = {
    layout: ['layout', 'Layout'], texto: ['type', 'Texto'], emoji: ['smile', 'Emoji'], cores: ['drop', 'Cores'], foto: ['image', 'Foto'],
  };
  const TAMANHOS = [['P', 0.85], ['M', 1], ['G', 1.18]];

  L.views.editor = {
    titulo: 'Personalizar', grupo: 'fluxo', precisaProjeto: true,
    render(main) {
      const proj = S.projeto;
      S.ui = S.ui || {};
      let idx = L.clamp(S.ui.paginaAtual || 0, 0, proj.paginas.length - 1);
      let aba = null, adesivoSel = null, fotoSel = null, modoEmoji = 'pagina';
      let ultimoCampo = null; // último campo de texto focado (para inserir emoji)
      let arrastou = false;

      const pg = () => proj.paginas[idx];
      const lay = () => L.LAYOUTS[pg().layout] || L.LAYOUTS.texto;
      const tema = L.tema(proj.tema);

      /* ---------- estrutura ---------- */
      const barra = h('div', { class: 'editor__barra' });
      const palco = h('div', { class: 'editor__palco' });
      const tira = h('div', { class: 'editor__tira', role: 'list', 'aria-label': 'Páginas do livro' });
      const abas = h('div', { class: 'abas', role: 'tablist', 'aria-label': 'Ferramentas' });
      const corpo = h('div', { class: 'painel__corpo', role: 'tabpanel' });
      const painel = h('aside', { class: 'editor__painel', 'aria-label': 'Ferramentas da página' }, abas, corpo);
      const rodape = h('div', { class: 'acoes-fluxo' },
        h('a', { class: 'btn btn--fantasma', href: '#criar' }, h('span', { html: L.svg('arrowLeft') }), 'Voltar'),
        h('button', { type: 'button', class: 'btn btn--contorno', onClick: abrirPrevia }, h('span', { html: L.svg('book') }), 'Folhear'),
        h('a', { class: 'btn btn--primario', href: '#revisao' }, 'Revisar livro', h('span', { html: L.svg('arrowRight') })));
      main.append(h('div', { class: 'editor' },
        h('div', { class: 'editor__principal' }, barra, palco, tira), painel), rodape);

      /* ---------- navegação ---------- */
      function irPara(i, focarMini) {
        idx = L.clamp(i, 0, proj.paginas.length - 1);
        S.ui.paginaAtual = idx;
        adesivoSel = null; fotoSel = null;
        if (!abasDisponiveis().includes(aba)) aba = null;
        tudo();
        if (focarMini) { const m = tira.children[idx]; m && m.focus({ preventScroll: true }); }
      }
      function abasDisponiveis() {
        const p = pg(), l = lay();
        const lista = p.tipo === 'contracapa' ? ['texto', 'emoji', 'cores'] : ['layout', 'texto', 'emoji', 'cores'];
        if (l.fotos) lista.push('foto');
        return lista;
      }
      function abaPadrao() {
        const l = lay(), p = pg();
        if (l.fotos && l.elementos.some((e) => e.tipo === 'foto' && !(p.fotos[e.i] && p.fotos[e.i].img))) return 'foto';
        return 'texto';
      }

      function tudo() { desenharBarra(); desenharPalco(); desenharTira(); desenharPainel(); }

      /* ---------- barra superior ---------- */
      function desenharBarra() {
        L.clear(barra);
        const p = pg(), ehMiolo = p.tipo === 'miolo';
        const nMiolo = L.miolo(proj).length;
        const nome = idx === 0 ? 'Capa' : idx === proj.paginas.length - 1 ? 'Contracapa' : `Página ${idx} de ${nMiolo}`;
        const primeiroMiolo = 1, ultimoMiolo = proj.paginas.length - 2;
        L.add(barra,
          h('div', { class: 'editor__nav' },
            h('button', { type: 'button', class: 'btn-icone', 'aria-label': 'Página anterior', disabled: idx === 0, html: L.svg('left'), onClick: () => irPara(idx - 1) }),
            h('span', { class: 'editor__nome', 'aria-live': 'polite' }, nome),
            h('button', { type: 'button', class: 'btn-icone', 'aria-label': 'Próxima página', disabled: idx === proj.paginas.length - 1, html: L.svg('right'), onClick: () => irPara(idx + 1) })),
          ehMiolo ? h('div', { class: 'editor__acoes' },
            h('button', { type: 'button', class: 'btn-acao', disabled: idx <= primeiroMiolo, onClick: () => mover(-1), title: 'Mover para trás' }, h('span', { html: L.svg('arrowLeft') }), h('span', { class: 'btn-acao__txt' }, 'Mover')),
            h('button', { type: 'button', class: 'btn-acao', disabled: idx >= ultimoMiolo, onClick: () => mover(1), title: 'Mover para frente' }, h('span', { class: 'btn-acao__txt' }, 'Mover'), h('span', { html: L.svg('arrowRight') })),
            h('button', { type: 'button', class: 'btn-acao', onClick: duplicar }, h('span', { html: L.svg('copy') }), h('span', { class: 'btn-acao__txt' }, 'Duplicar')),
            h('button', { type: 'button', class: 'btn-acao btn-acao--perigo', onClick: excluir }, h('span', { html: L.svg('trash') }), h('span', { class: 'btn-acao__txt' }, 'Excluir'))) : null);
      }
      function mover(d) {
        const a = idx, b = idx + d;
        if (proj.paginas[b].tipo !== 'miolo') return;
        [proj.paginas[a], proj.paginas[b]] = [proj.paginas[b], proj.paginas[a]];
        L.alterou('ordem'); irPara(b);
      }
      function duplicar() {
        const copia = L.clone(pg());
        copia.id = L.uid('pg_');
        copia.adesivos.forEach((a) => (a.id = L.uid('a')));
        proj.paginas.splice(idx + 1, 0, copia);
        L.alterou('duplicar'); irPara(idx + 1);
        L.toast('Página duplicada.');
      }
      function excluir() {
        const removida = proj.paginas.splice(idx, 1)[0], onde = idx;
        L.alterou('excluir'); irPara(Math.min(idx, proj.paginas.length - 2));
        L.toast('Página excluída.', { acao: 'Desfazer', tempo: 6000, onAcao: () => { proj.paginas.splice(onde, 0, removida); L.alterou('desfazer'); irPara(onde); } });
      }
      function novaPaginaDoTema(layout, props = {}) {
        const P = tema.paginas;
        return L.novaPagina('miolo', layout, Object.assign({ bg: P.bg, cor: P.cor, fonte: P.fonte }, props));
      }
      function adicionarPagina() {
        if (L.miolo(proj).length >= cfg.paginas.maximo) { L.toast(`O livro aceita até ${cfg.paginas.maximo} páginas.`, { tipo: 'erro' }); return; }
        const onde = L.clamp(idx + 1, 1, proj.paginas.length - 1);
        proj.paginas.splice(onde, 0, novaPaginaDoTema('foto-legenda'));
        L.alterou('nova'); irPara(onde);
      }
      async function adicionarFotos() {
        const files = await L.escolherArquivos({ multiplos: true });
        if (!files.length) return;
        const fechar = L.toast(`Preparando ${files.length} ${files.length === 1 ? 'foto' : 'fotos'}…`, { tempo: 60000 });
        const { ok, erros } = await L.processarArquivos(files);
        fechar();
        const espaco = cfg.paginas.maximo - L.miolo(proj).length;
        const usar = ok.slice(0, Math.max(0, espaco));
        const onde = proj.paginas.length - 1;
        const novas = usar.map((r, i) => novaPaginaDoTema('foto-legenda', { fotos: [L.novaFoto(r.id), L.novaFoto(null)], texto: tema.legendas[i % tema.legendas.length] }));
        proj.paginas.splice(onde, 0, ...novas);
        if (erros.length) L.toast(erros[0], { tipo: 'erro', tempo: 6000 });
        if (ok.length > usar.length) L.toast(`Só couberam ${usar.length} fotos (limite de ${cfg.paginas.maximo} páginas).`, { tipo: 'erro' });
        if (novas.length) { L.alterou('fotos'); irPara(onde); L.toast(`${novas.length} ${novas.length === 1 ? 'página nova' : 'páginas novas'} no fim do livro.`); }
      }

      /* ---------- palco (página grande) ---------- */
      function desenharPalco() {
        L.clear(palco);
        const p = pg();
        const lado = p.tipo === 'miolo' ? (idx % 2 === 1 ? 'dir' : 'esq') : p.tipo;
        const pgEl = L.renderPagina(p, { modo: 'editar', adesivoSel, fotoSel });
        const folha = h('div', { class: 'palco__pagina palco__pagina--' + lado }, pgEl);
        palco.append(folha);
        if (adesivoSel) {
          const a = p.adesivos.find((x) => x.id === adesivoSel);
          if (a) palco.append(h('p', { class: 'palco__dica' }, 'Arraste o emoji para posicionar. Tamanho e giro ficam na aba Emoji.'));
        } else if (fotoSel != null && p.fotos[fotoSel] && p.fotos[fotoSel].img) {
          palco.append(h('p', { class: 'palco__dica' }, 'Arraste a foto para enquadrar. O zoom fica na aba Foto.'));
        }
        // campos de texto direto na página
        L.$$('textarea', pgEl).forEach((ta) => {
          const campo = ta.dataset.campo;
          const el = lay().elementos.find((e) => e.tipo === 'texto' && e.campo === campo);
          ta.addEventListener('input', () => {
            p[campo] = ta.value;
            L.atualizarTextoNoEditor(ta.parentElement, el, p);
            const veu = pgEl.querySelector(`.pg-veu[data-campo="${campo}"]`);
            if (veu) veu.hidden = !ta.value;
            const espelho = corpo.querySelector(`[data-espelho="${campo}"]`);
            if (espelho && espelho !== document.activeElement) espelho.value = ta.value;
            mudou('texto');
          });
          ta.addEventListener('focus', () => {
            ultimoCampo = ta;
            if (aba !== 'texto' && aba !== 'emoji') { aba = 'texto'; desenharPainel(); }
          });
        });
      }

      // re-renderiza o palco mantendo o texto em edição
      const atualizarMiniaturaAtual = L.debounce(() => desenharMiniatura(idx), 250);
      function mudou(det) {
        L.alterou(det);
        atualizarMiniaturaAtual();
        L.atualizarResumoTopo();
      }

      /* ---------- interações com o mouse/dedo ---------- */
      palco.addEventListener('pointerdown', (e) => {
        arrastou = false;
        const ad = e.target.closest('.pg-adesivo');
        if (ad) { arrastarAdesivo(e, ad); return; }
        const slot = e.target.closest('.pg-foto');
        if (slot) { arrastarFoto(e, slot); return; }
        if (e.target.closest('textarea')) return;
        if (e.target.closest('.pg') && (adesivoSel || fotoSel != null)) { adesivoSel = null; fotoSel = null; desenharPalco(); desenharPainel(); }
      });
      palco.addEventListener('click', (e) => {
        const slot = e.target.closest('.pg-foto');
        if (!slot || arrastou) return;
        const i = +slot.dataset.slot;
        if (!(pg().fotos[i] && pg().fotos[i].img)) { trocarFoto(i); return; }
        if (fotoSel !== i) { fotoSel = i; adesivoSel = null; aba = 'foto'; desenharPalco(); desenharPainel(); }
      });
      palco.addEventListener('keydown', (e) => {
        const ad = e.target.closest && e.target.closest('.pg-adesivo');
        if (!ad) return;
        const a = pg().adesivos.find((x) => x.id === ad.dataset.adesivo);
        if (!a) return;
        const passo = e.shiftKey ? 0.05 : 0.01;
        const mapa = { ArrowLeft: [-passo, 0], ArrowRight: [passo, 0], ArrowUp: [0, -passo], ArrowDown: [0, passo] };
        if (mapa[e.key]) {
          e.preventDefault();
          a.x = L.clamp(a.x + mapa[e.key][0], 0.02, 0.98); a.y = L.clamp(a.y + mapa[e.key][1], 0.02, 0.98);
          ad.style.left = a.x * 100 + '%'; ad.style.top = a.y * 100 + '%';
          mudou('adesivo');
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault(); removerAdesivo(a.id);
        } else if (e.key === '+' || e.key === '=' || e.key === '-') {
          e.preventDefault();
          a.s = L.clamp(a.s * (e.key === '-' ? 0.9 : 1.1), 40, 280);
          ad.style.fontSize = a.s / 10 + 'cqw';
          mudou('adesivo');
        }
      });
      palco.addEventListener('wheel', (e) => {
        const slot = e.target.closest('.pg-foto');
        if (!slot || fotoSel !== +slot.dataset.slot) return;
        const ft = pg().fotos[fotoSel], rec = L.img(ft && ft.img);
        if (!rec) return;
        e.preventDefault();
        ft.zoom = L.clamp((ft.zoom || 1) * (1 - e.deltaY * 0.0015), 1, 3);
        const el = lay().elementos.find((x) => x.tipo === 'foto' && x.i === fotoSel);
        L.aplicarEnquadramento(slot.querySelector('img'), el, rec, ft);
        const zoom = corpo.querySelector('#zoom-foto');
        if (zoom) zoom.value = ft.zoom;
        mudou('zoom');
      }, { passive: false });

      function arrastarAdesivo(e, node) {
        const a = pg().adesivos.find((x) => x.id === node.dataset.adesivo);
        if (!a) return;
        e.preventDefault();
        if (adesivoSel !== a.id) {
          adesivoSel = a.id; fotoSel = null; aba = 'emoji';
          L.$$('.pg-adesivo.is-sel', palco).forEach((n) => n.classList.remove('is-sel'));
          node.classList.add('is-sel');
          desenharPainel();
        }
        node.focus({ preventScroll: true });
        const rect = node.closest('.pg').getBoundingClientRect();
        const ini = { x: e.clientX, y: e.clientY, ax: a.x, ay: a.y };
        node.setPointerCapture(e.pointerId);
        const mover = (ev) => {
          const dx = ev.clientX - ini.x, dy = ev.clientY - ini.y;
          if (Math.abs(dx) + Math.abs(dy) > 3) arrastou = true;
          a.x = L.clamp(ini.ax + dx / rect.width, 0.02, 0.98);
          a.y = L.clamp(ini.ay + dy / rect.height, 0.02, 0.98);
          node.style.left = a.x * 100 + '%'; node.style.top = a.y * 100 + '%';
        };
        const soltar = () => {
          node.removeEventListener('pointermove', mover);
          node.removeEventListener('pointerup', soltar);
          node.removeEventListener('pointercancel', soltar);
          if (arrastou) mudou('adesivo');
        };
        node.addEventListener('pointermove', mover);
        node.addEventListener('pointerup', soltar);
        node.addEventListener('pointercancel', soltar);
      }

      function arrastarFoto(e, slot) {
        const i = +slot.dataset.slot;
        const ft = pg().fotos[i], rec = L.img(ft && ft.img);
        if (!rec) return;
        // no celular, o primeiro toque seleciona (para não atrapalhar a rolagem)
        if (e.pointerType !== 'mouse' && fotoSel !== i) return;
        e.preventDefault();
        const el = lay().elementos.find((x) => x.tipo === 'foto' && x.i === i);
        const r = slot.getBoundingClientRect();
        const g = L.geoFoto(el.w, el.h, rec.w, rec.h, ft);
        const oxT = (g.ox / el.w) * r.width, oyT = (g.oy / el.h) * r.height;
        const img = slot.querySelector('img');
        const ini = { x: e.clientX, y: e.clientY, px: ft.px || 0, py: ft.py || 0 };
        slot.setPointerCapture(e.pointerId);
        const mover = (ev) => {
          const dx = ev.clientX - ini.x, dy = ev.clientY - ini.y;
          if (Math.abs(dx) + Math.abs(dy) > 3) arrastou = true;
          ft.px = oxT > 0.5 ? L.clamp(ini.px - (2 * dx) / oxT, -1, 1) : 0;
          ft.py = oyT > 0.5 ? L.clamp(ini.py - (2 * dy) / oyT, -1, 1) : 0;
          L.aplicarEnquadramento(img, el, rec, ft);
        };
        const soltar = () => {
          slot.removeEventListener('pointermove', mover);
          slot.removeEventListener('pointerup', soltar);
          slot.removeEventListener('pointercancel', soltar);
          if (arrastou) {
            mudou('enquadrar');
            if (fotoSel !== i) { fotoSel = i; adesivoSel = null; aba = 'foto'; desenharPalco(); desenharPainel(); }
          }
        };
        slot.addEventListener('pointermove', mover);
        slot.addEventListener('pointerup', soltar);
        slot.addEventListener('pointercancel', soltar);
      }

      async function trocarFoto(i) {
        const [file] = await L.escolherArquivos();
        if (!file) return;
        const fechar = L.toast('Preparando a foto…', { tempo: 30000 });
        try {
          const rec = await L.processarArquivo(file);
          pg().fotos[i] = L.novaFoto(rec.id);
          fotoSel = i; aba = 'foto';
          L.alterou('foto');
          tudo();
        } catch (err) {
          L.toast(err.amigavel ? err.message : 'Não foi possível usar esta foto.', { tipo: 'erro', tempo: 6000 });
        } finally { fechar(); }
      }

      function adicionarAdesivo(e) {
        const p = pg();
        const n = p.adesivos.length;
        const a = { id: L.uid('a'), e, x: L.clamp(0.78 - (n % 4) * 0.12, 0.1, 0.9), y: L.clamp(0.16 + Math.floor(n / 4) * 0.12 + (n % 2) * 0.04, 0.1, 0.9), s: 96, r: 0 };
        p.adesivos.push(a);
        adesivoSel = a.id; fotoSel = null;
        mudou('adesivo');
        desenharPalco(); desenharPainel();
      }
      function removerAdesivo(id) {
        const p = pg();
        const i = p.adesivos.findIndex((x) => x.id === id);
        if (i < 0) return;
        const [rem] = p.adesivos.splice(i, 1);
        adesivoSel = null;
        mudou('adesivo');
        desenharPalco(); desenharPainel();
        L.toast('Emoji removido.', { acao: 'Desfazer', onAcao: () => { p.adesivos.splice(i, 0, rem); mudou('adesivo'); desenharPalco(); } });
      }

      /* ---------- miniaturas ---------- */
      function rotuloMini(i) { return i === 0 ? 'Capa' : i === proj.paginas.length - 1 ? 'Contracapa' : String(i); }
      function miniatura(i) {
        const p = proj.paginas[i];
        return h('button', {
          type: 'button', class: 'miniatura' + (i === idx ? ' is-atual' : ''), role: 'listitem',
          'aria-label': `${L.nomePagina(proj, i)}${i === idx ? ' (aberta)' : ''}`, 'aria-current': i === idx ? 'true' : null,
          onClick: () => irPara(i),
        }, h('span', { class: 'miniatura__pg' }, L.renderPagina(p, { modo: 'preview' })), h('span', { class: 'miniatura__n' }, rotuloMini(i)));
      }
      function desenharTira() {
        L.clear(tira);
        proj.paginas.forEach((_, i) => {
          if (i === proj.paginas.length - 1) {
            tira.append(
              h('button', { type: 'button', class: 'miniatura miniatura--add', onClick: adicionarPagina }, h('span', { class: 'miniatura__pg', html: L.svg('plus') }), h('span', { class: 'miniatura__n' }, 'Página')),
              h('button', { type: 'button', class: 'miniatura miniatura--add', onClick: adicionarFotos }, h('span', { class: 'miniatura__pg', html: L.svg('images') }), h('span', { class: 'miniatura__n' }, 'Fotos')));
          }
          tira.append(miniatura(i));
        });
        const atual = tira.querySelector('.is-atual');
        if (atual) {
          const tr = tira.getBoundingClientRect(), ar = atual.getBoundingClientRect();
          if (ar.left < tr.left || ar.right > tr.right) tira.scrollLeft += ar.left - tr.left - tr.width / 2 + ar.width / 2;
        }
      }
      function desenharMiniatura(i) {
        const btns = L.$$('.miniatura:not(.miniatura--add)', tira);
        const velho = btns[i];
        if (velho) velho.replaceWith(miniatura(i));
      }

      /* ---------- painel de ferramentas ---------- */
      function desenharPainel() {
        const disp = abasDisponiveis();
        if (!aba || !disp.includes(aba)) aba = abaPadrao();
        L.clear(abas);
        disp.forEach((k) => {
          const [ic, nome] = ABAS[k];
          abas.append(h('button', {
            type: 'button', role: 'tab', class: 'aba', id: 'aba-' + k, 'aria-selected': aba === k ? 'true' : 'false', tabindex: aba === k ? '0' : '-1',
            onClick: () => { aba = k; desenharPainel(); },
            onKeydown: (e) => {
              const j = disp.indexOf(aba);
              if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                aba = disp[(j + (e.key === 'ArrowRight' ? 1 : disp.length - 1)) % disp.length];
                desenharPainel(); L.$('#aba-' + aba).focus();
              }
            },
          }, h('span', { html: L.svg(ic) }), nome));
        });
        L.clear(corpo);
        corpo.setAttribute('aria-labelledby', 'aba-' + aba);
        ({ layout: painelLayout, texto: painelTexto, emoji: painelEmoji, cores: painelCores, foto: painelFoto })[aba]();
      }

      const grupo = (titulo, ...kids) => h('section', { class: 'grupo' }, titulo ? h('h3', { class: 'grupo__titulo' }, titulo) : null, ...kids);

      function esquema(key) {
        const l = L.LAYOUTS[key];
        const box = h('span', { class: 'esquema', 'aria-hidden': 'true' });
        l.elementos.forEach((el) => {
          if (!['foto', 'texto', 'moldura', 'opcoes'].includes(el.tipo)) return;
          const n = h('span', { class: 'esquema__' + el.tipo });
          n.style.cssText = `left:${el.x * 100}%;top:${el.y * 100}%;width:${el.w * 100}%;height:${el.h * 100}%;${el.rot ? `transform:rotate(${el.rot}deg)` : ''}`;
          box.append(n);
        });
        return box;
      }

      function painelLayout() {
        const p = pg();
        const grupoLay = p.tipo === 'capa' ? 'capa' : 'miolo';
        corpo.append(grupo('Escolha o layout desta página',
          h('div', { class: 'layouts' }, L.layoutsDoGrupo(grupoLay).map((k) => h('button', {
            type: 'button', class: 'layout-op' + (p.layout === k ? ' is-sel' : ''), 'aria-pressed': p.layout === k ? 'true' : 'false',
            onClick: () => {
              p.layout = k;
              if (k === 'pergunta' && !p.texto) p.texto = 'Quer namorar comigo?';
              fotoSel = null; adesivoSel = null;
              L.alterou('layout'); desenharPalco(); desenharMiniatura(idx); desenharPainel();
            },
          }, esquema(k), h('span', null, L.LAYOUTS[k].nome))))));
        if (p.tipo === 'miolo') corpo.append(h('p', { class: 'dica' }, 'Fotos e textos ficam guardados quando você troca de layout.'));
      }

      function campoEspelho(rotulo, campo, multilinha, max) {
        const id = 'esp-' + campo;
        const p = pg();
        const ctl = h(multilinha ? 'textarea' : 'input', {
          id, class: 'input', value: p[campo] || '', maxlength: String(max || 220), rows: multilinha ? '3' : null, dataset: { espelho: campo },
          onInput: (e) => {
            p[campo] = e.target.value;
            const ta = palco.querySelector(`textarea[data-campo="${campo}"]`);
            if (ta) {
              ta.value = p[campo];
              const el = lay().elementos.find((x) => x.tipo === 'texto' && x.campo === campo);
              L.atualizarTextoNoEditor(ta.parentElement, el, p);
              const veu = palco.querySelector(`.pg-veu[data-campo="${campo}"]`);
              if (veu) veu.hidden = !p[campo];
            }
            mudou('texto');
          },
          onFocus: (e) => { ultimoCampo = e.target; },
        });
        return h('div', { class: 'campo' }, h('label', { for: id }, rotulo), ctl);
      }

      function aplicarLegenda(texto) {
        pg().texto = texto;
        L.alterou('texto'); desenharPalco(); desenharMiniatura(idx); desenharPainel();
      }

      function painelTexto() {
        const p = pg(), l = lay();
        const campos = l.elementos.filter((e) => e.tipo === 'texto').map((e) => e.campo);
        const fonteChave = p.tipo === 'capa' || p.layout === 'pergunta' ? 'fonteTitulo' : 'fonte';
        const textos = grupo(null);
        if (p.tipo === 'capa') {
          textos.append(campoEspelho('Título', 'titulo', false, 80), campoEspelho('Subtítulo', 'subtitulo', false, 80));
        } else if (p.layout === 'pergunta') {
          textos.append(campoEspelho('Pergunta', 'texto', true, 120));
          [0, 1].forEach((i) => {
            textos.append(h('div', { class: 'campo' }, h('label', { for: 'op-' + i }, `Resposta ${i + 1}`),
              h('input', { id: 'op-' + i, class: 'input', value: p.opcoes[i] || '', maxlength: '28', onInput: (e) => { p.opcoes[i] = e.target.value; mudou('opcoes'); redesenharPalcoSuave(); } })));
          });
        } else if (campos.includes('texto')) {
          textos.append(campoEspelho(p.tipo === 'contracapa' ? 'Texto da contracapa' : l.fotos ? 'Legenda' : 'Texto', 'texto', true, 220));
        }
        corpo.append(textos);

        if (p.tipo === 'miolo' && l.fotos) {
          const ideias = h('div', { class: 'chips' }, tema.legendas.map((t) => h('button', { type: 'button', class: 'chip', onClick: () => aplicarLegenda(t) }, t)));
          const ia = grupoIA(p);
          corpo.append(grupo('Sem ideia? Toque para usar', ideias), ia);
        }

        corpo.append(grupo('Fonte',
          h('div', { class: 'fontes' }, Object.entries(cfg.fontes).map(([k, f]) => h('button', {
            type: 'button', class: 'fonte-op' + (p[fonteChave] === k ? ' is-sel' : ''), 'aria-pressed': p[fonteChave] === k ? 'true' : 'false',
            onClick: () => { p[fonteChave] = k; L.alterou('fonte'); desenharPalco(); desenharMiniatura(idx); desenharPainel(); },
          }, h('span', { class: 'fonte-op__aa', style: { fontFamily: L.familiaCss(k), fontWeight: f.peso } }, 'Aa'), h('span', null, f.nome))))));

        corpo.append(grupo('Tamanho do texto',
          h('div', { class: 'segmentos' }, TAMANHOS.map(([n, v]) => h('button', {
            type: 'button', class: 'segmento' + (Math.abs((p.tamanho || 1) - v) < 0.01 ? ' is-sel' : ''), 'aria-pressed': Math.abs((p.tamanho || 1) - v) < 0.01 ? 'true' : 'false',
            'aria-label': { P: 'Pequeno', M: 'Médio', G: 'Grande' }[n], onClick: () => { p.tamanho = v; L.alterou('tamanho'); desenharPalco(); desenharMiniatura(idx); desenharPainel(); },
          }, n)))));

        corpo.append(grupo('Cor do texto', amostras(cfg.cores.textos.concat([tema.capa.cor]), p.cor, (cor) => { p.cor = cor; if (p.tipo === 'capa') sincronizarContracapa(); L.alterou('cor'); desenharPalco(); desenharMiniatura(idx); desenharPainel(); }, 'texto')));
        if (['foto-inteira', 'capa-foto', 'polaroid'].includes(p.layout)) corpo.append(h('p', { class: 'dica' }, 'Neste layout, o texto sobre a foto fica sempre em uma cor fixa para dar leitura.'));
      }
      const redesenharPalcoSuave = L.debounce(() => { const ativo = document.activeElement && document.activeElement.id; desenharPalco(); desenharMiniatura(idx); if (ativo) { const el = document.getElementById(ativo); el && el.focus(); } }, 120);

      function grupoIA(p) {
        const box = grupo(null);
        if (!L.caps.ia || !(p.fotos[0] && p.fotos[0].img)) return box;
        const saida = h('div', { class: 'chips', 'aria-live': 'polite' });
        const btn = h('button', { type: 'button', class: 'btn btn--ia btn--p' }, h('span', { html: L.svg('sparkle') }), 'Sugerir legendas olhando a foto');
        btn.addEventListener('click', async () => {
          btn.disabled = true;
          L.clear(saida).append(h('span', { class: 'carregando' }, 'Olhando a foto…'));
          try {
            const sugestoes = await L.sugerirLegendasIA(p, proj);
            L.clear(saida);
            if (!sugestoes.length) saida.append(h('span', { class: 'dica' }, 'Não veio nenhuma sugestão. Tente de novo.'));
            sugestoes.forEach((t) => saida.append(h('button', { type: 'button', class: 'chip chip--ia', onClick: () => aplicarLegenda(t) }, t)));
          } catch (e) {
            L.clear(saida);
            if (e && (e.code === 'not_granted' || e.code === 'sampling_disabled' || e.code === 'indisponivel')) { L.caps.ia = false; box.remove(); return; }
            saida.append(h('span', { class: 'dica' }, e && e.code === 'rate_limited' ? 'Muitos pedidos seguidos. Espere um pouco e tente de novo.' : 'Não deu para sugerir agora. Tente de novo.'));
          } finally { btn.disabled = false; }
        });
        box.append(btn, saida);
        return box;
      }

      function amostras(cores, atual, aoEscolher, tipo) {
        const lista = Array.from(new Set(cores.map((c) => c.toUpperCase())));
        const id = 'cor-livre-' + tipo;
        return h('div', { class: 'amostras' },
          lista.map((c) => h('button', {
            type: 'button', class: 'amostra' + ((atual || '').toUpperCase() === c ? ' is-sel' : ''), style: { '--c': c },
            'aria-label': 'Cor ' + c, 'aria-pressed': (atual || '').toUpperCase() === c ? 'true' : 'false', onClick: () => aoEscolher(c),
          })),
          h('label', { class: 'amostra amostra--livre', title: 'Outra cor' },
            h('span', { class: 'sr' }, 'Escolher outra cor'),
            h('input', { id, type: 'color', value: /^#[0-9a-f]{6}$/i.test(atual || '') ? atual : '#ffffff', onChange: (e) => aoEscolher(e.target.value.toUpperCase()) })));
      }

      function sincronizarContracapa() {
        const capa = proj.paginas[0], contra = proj.paginas[proj.paginas.length - 1];
        contra.bg = capa.bg; contra.cor = capa.cor;
      }

      function painelCores() {
        const p = pg();
        if (p.tipo === 'capa' || p.tipo === 'contracapa') {
          corpo.append(grupo('Cor da capa', amostras([tema.capa.bg, '#9E1B34', '#1F2B4D', '#0E4F57', '#2F5D50', '#4B2E83', '#F2B33D', '#CFE3F2', '#1E1B1E', '#FFFFFF'], p.bg, (c) => {
            const capa = proj.paginas[0]; capa.bg = c; sincronizarContracapa(); L.alterou('cor'); tudo();
          }, 'capa')));
          corpo.append(grupo('Cor do texto', amostras(cfg.cores.textos.concat([tema.capa.cor]), p.cor, (c) => {
            const capa = proj.paginas[0]; capa.cor = c; sincronizarContracapa(); L.alterou('cor'); tudo();
          }, 'texto-capa')));
          corpo.append(h('p', { class: 'dica' }, 'Capa e contracapa usam as mesmas cores (é a mesma peça na gráfica).'));
          return;
        }
        corpo.append(grupo('Fundo da página', amostras(cfg.cores.fundos.concat([tema.capa.bg]), p.bg, (c) => { p.bg = c; L.alterou('cor'); desenharPalco(); desenharMiniatura(idx); desenharPainel(); }, 'fundo')));
        corpo.append(h('button', {
          type: 'button', class: 'btn btn--contorno btn--p', onClick: () => {
            L.miolo(proj).forEach((m) => { m.bg = p.bg; m.cor = p.cor; });
            L.alterou('cor'); tudo(); L.toast('Fundo e cor do texto aplicados em todas as páginas internas.');
          },
        }, 'Usar este fundo em todas as páginas'));
      }

      function painelEmoji() {
        const p = pg();
        const sel = adesivoSel && p.adesivos.find((x) => x.id === adesivoSel);
        if (sel) {
          corpo.append(grupo('Emoji selecionado',
            h('div', { class: 'adesivo-sel' },
              h('span', { class: 'adesivo-sel__e', 'aria-hidden': 'true' }, sel.e),
              h('div', { class: 'adesivo-sel__ctl' },
                faixa('Tamanho', 'tam-adesivo', 40, 280, 1, sel.s, (v) => { sel.s = v; const n = palco.querySelector(`[data-adesivo="${sel.id}"]`); if (n) n.style.fontSize = v / 10 + 'cqw'; mudou('adesivo'); }),
                faixa('Girar', 'rot-adesivo', -45, 45, 1, sel.r || 0, (v) => { sel.r = v; const n = palco.querySelector(`[data-adesivo="${sel.id}"]`); if (n) n.style.transform = `translate(-50%, -50%) rotate(${v}deg)`; mudou('adesivo'); }))),
            h('div', { class: 'linha-botoes' },
              h('button', { type: 'button', class: 'btn btn--contorno btn--p', onClick: () => { const c = Object.assign({}, sel, { id: L.uid('a'), x: L.clamp(sel.x + 0.06, 0.05, 0.95), y: L.clamp(sel.y + 0.06, 0.05, 0.95) }); p.adesivos.push(c); adesivoSel = c.id; mudou('adesivo'); desenharPalco(); desenharPainel(); } }, h('span', { html: L.svg('copy') }), 'Duplicar'),
              h('button', { type: 'button', class: 'btn btn--perigo-contorno btn--p', onClick: () => removerAdesivo(sel.id) }, h('span', { html: L.svg('trash') }), 'Remover'))));
        }
        corpo.append(h('div', { class: 'segmentos', role: 'radiogroup', 'aria-label': 'Onde colocar o emoji' },
          [['pagina', 'Colar na página'], ['texto', 'Inserir no texto']].map(([k, n]) => h('button', {
            type: 'button', role: 'radio', class: 'segmento' + (modoEmoji === k ? ' is-sel' : ''), 'aria-checked': modoEmoji === k ? 'true' : 'false',
            onClick: () => { modoEmoji = k; desenharPainel(); },
          }, n))));
        const usar = (e) => {
          if (modoEmoji === 'pagina') { adicionarAdesivo(e); return; }
          const campo = lay().elementos.find((x) => x.tipo === 'texto');
          if (!campo) { L.toast('Esta página não tem texto. Use "Colar na página".'); return; }
          const alvo = ultimoCampo && ultimoCampo.isConnected ? ultimoCampo : null;
          const chave = alvo ? alvo.dataset.campo || alvo.dataset.espelho : campo.campo;
          const atual = p[chave] || '';
          const pos = alvo && typeof alvo.selectionStart === 'number' ? alvo.selectionStart : atual.length;
          p[chave] = atual.slice(0, pos) + e + atual.slice(pos);
          L.alterou('texto'); desenharPalco(); desenharMiniatura(idx); desenharPainel();
          L.toast(`Emoji inserido no texto.`);
        };
        const secoes = [['Para ' + tema.nome.toLowerCase(), tema.emojis]].concat(Object.entries(cfg.emojis));
        secoes.forEach(([nome, lista]) => corpo.append(grupo(nome,
          h('div', { class: 'emojis' }, lista.map((e) => h('button', { type: 'button', class: 'emoji-op', 'aria-label': 'Usar ' + e, onClick: () => usar(e) }, e))))));
      }

      function faixa(rotulo, id, min, max, passo, valor, aoMudar) {
        return h('div', { class: 'campo campo--faixa' }, h('label', { for: id }, rotulo),
          h('input', { id, type: 'range', min: String(min), max: String(max), step: String(passo), value: String(valor), onInput: (e) => aoMudar(+e.target.value) }));
      }

      function painelFoto() {
        const p = pg(), l = lay();
        const slots = l.elementos.filter((e) => e.tipo === 'foto');
        if (fotoSel == null || !slots.some((s) => s.i === fotoSel)) fotoSel = slots[0].i;
        if (slots.length > 1) {
          corpo.append(h('div', { class: 'segmentos' }, slots.map((s) => h('button', {
            type: 'button', class: 'segmento' + (fotoSel === s.i ? ' is-sel' : ''), 'aria-pressed': fotoSel === s.i ? 'true' : 'false',
            onClick: () => { fotoSel = s.i; desenharPalco(); desenharPainel(); },
          }, `Foto ${s.i + 1}`))));
        }
        const el = slots.find((s) => s.i === fotoSel);
        const ft = p.fotos[fotoSel], rec = L.img(ft && ft.img);
        if (!rec) {
          corpo.append(grupo('Esta página está sem foto',
            h('button', { type: 'button', class: 'btn btn--primario', onClick: () => trocarFoto(fotoSel) }, h('span', { html: L.svg('upload') }), 'Adicionar foto'),
            usarDoLivro()));
          return;
        }
        const dpi = L.dpiFoto(el, ft, L.formato(proj.formato));
        const qual = dpi >= 250 ? ['ok', 'Ótima para impressão'] : dpi >= cfg.impressao.dpiMinimoAviso ? ['ok', 'Boa para impressão'] : ['aviso', 'Pode sair sem nitidez neste formato'];
        corpo.append(grupo(null,
          h('div', { class: 'foto-atual' }, h('img', { src: rec.url, alt: 'Foto atual da página' }),
            h('div', null, h('p', { class: 'selo-qualidade selo-qualidade--' + qual[0] }, qual[1]), h('p', { class: 'dica' }, `${Math.round(dpi)} dpi no formato ${L.formato(proj.formato).nome}`))),
          h('div', { class: 'linha-botoes' },
            h('button', { type: 'button', class: 'btn btn--contorno btn--p', onClick: () => trocarFoto(fotoSel) }, h('span', { html: L.svg('upload') }), 'Trocar foto'),
            h('button', { type: 'button', class: 'btn btn--perigo-contorno btn--p', onClick: () => { p.fotos[fotoSel] = L.novaFoto(null); L.alterou('foto'); tudo(); } }, h('span', { html: L.svg('trash') }), 'Tirar foto'))));
        corpo.append(grupo('Enquadramento',
          faixa('Zoom', 'zoom-foto', 1, 3, 0.01, ft.zoom || 1, (v) => {
            ft.zoom = v;
            const slot = palco.querySelector(`.pg-foto[data-slot="${fotoSel}"]`);
            if (slot) L.aplicarEnquadramento(slot.querySelector('img'), el, rec, ft);
            mudou('zoom');
          }),
          h('button', { type: 'button', class: 'btn btn--fantasma btn--p', onClick: () => { ft.zoom = 1; ft.px = 0; ft.py = 0; L.alterou('zoom'); desenharPalco(); desenharMiniatura(idx); desenharPainel(); } }, h('span', { html: L.svg('center') }), 'Centralizar'),
          h('p', { class: 'dica' }, 'Dica: toque na foto e arraste para escolher a parte que aparece.')));
        corpo.append(usarDoLivro());
      }

      // Reaproveitar uma foto que já está no livro
      function usarDoLivro() {
        const ids = Array.from(L.idsDeImagens(proj));
        if (!ids.length) return grupo(null);
        return grupo('Ou use uma foto que já está no livro',
          h('div', { class: 'galeria' }, ids.slice(0, 24).map((id) => h('button', {
            type: 'button', class: 'galeria__item', 'aria-label': 'Usar esta foto',
            onClick: () => { pg().fotos[fotoSel] = L.novaFoto(id); L.alterou('foto'); tudo(); },
          }, h('img', { src: L.imgUrl(id), alt: '' })))));
      }

      function abrirPrevia() {
        L.modal({ titulo: 'Seu livro', largura: 'g', conteudo: h('div', { class: 'previa-modal' }, L.criarFolheador(proj), h('p', { class: 'dica' }, 'Toque nas páginas ou use as setas para folhear.')) });
      }

      // atualiza o painel quando a IA fica disponível
      const off = L.on((ev) => { if (ev.tipo === 'caps' && aba === 'texto') desenharPainel(); });
      // no celular, as abas ficam presas logo abaixo da página
      let ro = null;
      if (window.ResizeObserver) {
        ro = new ResizeObserver(() => document.documentElement.style.setProperty('--palco-h', palco.offsetHeight + 'px'));
        ro.observe(palco);
      }
      tudo();
      return () => { off(); if (ro) ro.disconnect(); };
    },
  };
})(window.L = window.L || {});
