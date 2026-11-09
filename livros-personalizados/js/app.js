/* Roteador (#nome-da-tela) e inicialização */
(function (L) {
  'use strict';
  const S = L.state;
  S.ui = S.ui || {};

  const ROTAS = { '': 'inicio', inicio: 'inicio', criar: 'criar', editor: 'editor', revisao: 'revisao', presentes: 'presentes', pagamento: 'pagamento', pedidos: 'pedidos' };

  L.rotaAtual = () => {
    const hsh = decodeURIComponent((location.hash || '').replace(/^#/, ''));
    if (hsh.startsWith('pedido-')) return { nome: 'pedido', id: hsh.slice(7) };
    return { nome: ROTAS[hsh] || 'inicio' };
  };

  L.ir = (nome) => {
    if (location.hash === '#' + nome) render();
    else {
      try { location.hash = nome; } catch (e) { render(nome); }
    }
  };

  let limpar = null, ultimaRota = null;
  async function render(forcar) {
    const rota = forcar ? { nome: forcar } : L.rotaAtual();
    let view = L.views[rota.nome] || L.views.inicio;
    if (view.precisaProjeto && !S.projeto) { L.ir(rota.nome === 'editor' ? 'criar' : S.pedidos.length && rota.nome === 'pagamento' ? 'pedidos' : 'criar'); return; }
    if (limpar) { try { limpar(); } catch (e) { /* nada */ } limpar = null; }
    const main = L.$('#conteudo');
    L.clear(main);
    main.className = 'conteudo conteudo--' + rota.nome;
    document.title = `${view.titulo} · ${L.config.marca} Livros`;
    L.renderTopo(L.$('#topo'), rota, view);
    L.renderRodape(L.$('#rodape'), view);
    const mesmaTela = ultimaRota === rota.nome + (rota.id || '');
    ultimaRota = rota.nome + (rota.id || '');
    const r = await view.render(main, rota);
    if (typeof r === 'function') limpar = r;
    if (!mesmaTela) {
      window.scrollTo({ top: 0 });
      main.focus({ preventScroll: true });
    }
  }
  L.redesenhar = () => render();

  // topo acompanha o salvamento/preço
  L.on((ev) => { if (ev.tipo === 'salvo' || ev.tipo === 'projeto') L.atualizarResumoTopo(); });

  async function iniciar() {
    document.documentElement.lang = 'pt-BR';
    L.$('#pular').addEventListener('click', () => L.$('#conteudo').focus());
    await L.carregarDados();
    window.addEventListener('hashchange', () => render());
    render();
    // quando as fontes chegarem, a quebra de texto muda: redesenha a tela atual
    L.fontesProntas().then(() => {
      const ativo = document.activeElement;
      if (ativo && (ativo.tagName === 'TEXTAREA' || ativo.tagName === 'INPUT')) return;
      render();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})(window.L = window.L || {});
