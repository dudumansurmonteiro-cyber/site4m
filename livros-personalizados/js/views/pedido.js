/* Pedido confirmado (com geração do arquivo da gráfica) e lista "Meus pedidos" */
(function (L) {
  'use strict';
  const h = L.h, cfg = L.config, S = L.state;
  L.views = L.views || {};

  const nomeArquivo = (pedido) => `${pedido.id}-impressao.pdf`;

  function linhaTempo(pedido) {
    const pz = pedido.prazo;
    const passos = [
      { feito: true, titulo: 'Pedido confirmado', quando: L.fmtData(new Date(pedido.criadoEm), 'hora') },
      { feito: !!pedido.arquivo, titulo: 'Arquivo de impressão enviado à gráfica', quando: pedido.arquivo ? L.fmtData(new Date(pedido.arquivo.geradoEm), 'hora') : 'gerando agora…' },
    ];
    if (pedido.preco.itens.length) passos.push({ feito: !!pedido.parceirosEm, titulo: 'Presentes pedidos aos parceiros', quando: pedido.parceirosEm ? L.fmtData(new Date(pedido.parceirosEm), 'hora') : '' });
    passos.push(
      { feito: false, titulo: 'Impressão e acabamento', quando: 'previsto até ' + L.fmtData(new Date(pz.producao), 'semana') },
      { feito: false, titulo: 'Saiu para entrega', quando: 'previsto ' + L.fmtData(new Date(pz.producao), 'semana') },
      { feito: false, titulo: 'Entregue', quando: `entre ${L.fmtData(new Date(pz.min), 'semana')} e ${L.fmtData(new Date(pz.max), 'semana')}` });
    return h('ol', { class: 'status' }, passos.map((p) => h('li', { class: 'status__item' + (p.feito ? ' is-feito' : '') },
      h('span', { class: 'status__marca', html: p.feito ? L.svg('check') : '' }),
      h('span', { class: 'status__txt' }, h('strong', null, p.titulo), h('small', null, p.quando)))));
  }

  function fichaTecnica(pedido) {
    const proj = pedido.projeto, f = L.formato(proj.formato), a = pedido.arquivo;
    const linhas = [
      ['Formato', `${f.nome} · ${f.cm} × ${f.cm} cm (refilado)`],
      ['Miolo', `${pedido.preco.paginas} páginas · ${f.papel}`],
      ['Capa', `${f.capa} · capa aberta com lombada de ${L.num(L.lombadaMm(proj), 1)} mm`],
      ['Sangria', `${cfg.impressao.sangriaMm} mm em todos os lados (TrimBox e BleedBox no PDF)`],
      ['Resolução', a ? `${a.dpi} dpi · RGB · JPEG qualidade ${Math.round(cfg.impressao.qualidadeJpeg * 100)}%` : `${cfg.impressao.dpi} dpi`],
      ['Arquivo', a ? `${nomeArquivo(pedido)} · ${a.paginasPdf} páginas · ${L.bytes(a.bytes)}` : '—'],
    ];
    return h('dl', { class: 'ficha' }, linhas.map(([k, v]) => h('div', { class: 'ficha__linha' }, h('dt', null, k), h('dd', null, v))));
  }

  L.views.pedido = {
    titulo: 'Pedido', grupo: 'site',
    async render(main, rota) {
      const pedido = S.pedidos.find((p) => p.id === rota.id);
      if (!pedido) {
        main.append(h('div', { class: 'vazio' }, h('h1', null, 'Pedido não encontrado'), h('p', null, 'Nesta demonstração, os pedidos ficam salvos apenas no aparelho em que foram feitos.'), h('a', { class: 'btn btn--primario', href: '#pedidos' }, 'Ver meus pedidos')));
        return;
      }
      await L.garantirImagens(L.idsDeImagens(pedido.projeto));
      const proj = pedido.projeto;
      const pz = pedido.prazo;
      const box = h('div', { class: 'pedido' });
      main.append(box);

      const cardArquivo = h('section', { class: 'cartao', 'aria-labelledby': 'arq-titulo' });
      const cardStatus = h('section', { class: 'cartao', 'aria-labelledby': 'st-titulo' });

      function desenharStatus() {
        L.clear(cardStatus).append(h('h2', { id: 'st-titulo', class: 'cartao__titulo' }, 'Acompanhe o pedido'), linhaTempo(pedido));
      }

      function desenharArquivo(progresso) {
        L.clear(cardArquivo);
        cardArquivo.append(h('h2', { id: 'arq-titulo', class: 'cartao__titulo' }, h('span', { html: L.svg('printer') }), 'Arquivo para a gráfica'));
        if (progresso) {
          cardArquivo.append(
            h('p', null, progresso.texto),
            h('div', { class: 'progresso' }, h('span', { style: { width: progresso.pct + '%' } })));
        } else if (S.pdfs.get(pedido.id)) {
          const dl = S.pdfs.get(pedido.id);
          const podeBaixar = !L.caps.dentroDoClaude || !!L.caps.downloads;
          cardArquivo.append(
            h('p', null, 'Este é o PDF que a gráfica recebe: capa aberta (contracapa, lombada e capa) e miolo, já com sangria e com a área de corte definida no arquivo.'),
            fichaTecnica(pedido),
            podeBaixar
              ? h('button', { type: 'button', class: 'btn btn--primario', onClick: () => L.salvarArquivo(dl.blob, nomeArquivo(pedido)) }, h('span', { html: L.svg('download') }), 'Baixar PDF de impressão')
              : h('p', { class: 'dica' }, 'O download não está disponível nesta visualização.'));
        } else {
          L.add(cardArquivo,
            h('p', null, pedido.arquivo ? 'O arquivo já foi enviado. Para baixar uma cópia, gere de novo neste aparelho.' : 'O arquivo ainda não foi gerado.'),
            pedido.arquivo ? fichaTecnica(pedido) : null,
            h('button', { type: 'button', class: 'btn btn--contorno', onClick: gerar }, h('span', { html: L.svg('printer') }), 'Gerar arquivo de impressão'));
        }
      }

      async function gerar() {
        desenharArquivo({ texto: 'Preparando as páginas em alta resolução…', pct: 2 });
        try {
          const r = await L.gerarArquivoImpressao(proj, (i, n) => desenharArquivo({ texto: i === 0 ? 'Desenhando a capa aberta (contracapa + lombada + capa)…' : i >= n ? 'Montando o PDF…' : `Desenhando a página ${i} de ${n - 1}…`, pct: Math.max(2, Math.round((i / n) * 100)) }));
          S.pdfs.set(pedido.id, r);
          const primeiraVez = !pedido.arquivo;
          pedido.arquivo = { bytes: r.bytes, paginasPdf: r.paginasPdf, dpi: r.dpi, lombadaMm: r.lombadaMm, geradoEm: pedido.arquivo ? pedido.arquivo.geradoEm : new Date().toISOString() };
          pedido.gerarAoAbrir = false;
          await L.salvarPedido(pedido);
          desenharArquivo(); desenharStatus();
          if (primeiraVez) L.toast('Arquivo gerado e enviado para a gráfica (simulação).');
        } catch (e) {
          console.error(e);
          L.clear(cardArquivo).append(
            h('h2', { id: 'arq-titulo', class: 'cartao__titulo' }, 'Arquivo para a gráfica'),
            h('p', { class: 'campo__erro' }, 'Não conseguimos gerar o arquivo neste aparelho (pouca memória?). Tente de novo ou use um computador.'),
            h('button', { type: 'button', class: 'btn btn--contorno', onClick: gerar }, 'Tentar de novo'));
        }
      }

      const ent = pedido.entrega;
      box.append(
        h('div', { class: 'pedido__cabeca' },
          h('span', { class: 'pedido__ok', html: L.svg('check') }),
          h('div', null,
            h('p', { class: 'eyebrow' }, `Pedido ${pedido.id}`),
            h('h1', null, 'Pedido confirmado!'),
            h('p', { class: 'criar__sub' }, `Chega entre ${L.fmtData(new Date(pz.min), 'semana')} e ${L.fmtData(new Date(pz.max), 'semana')} em ${ent.cidade}/${ent.uf}.`))),
        h('div', { class: 'aviso aviso--demo' }, h('span', { html: L.svg('info') }),
          h('p', null, h('strong', null, 'Demonstração: '), 'nenhum pagamento foi cobrado. No site real, o PDF e a ficha técnica vão automaticamente para a gráfica parceira (por API ou e-mail), e cada presente vira um pedido para o fornecedor.')),
        h('div', { class: 'pedido__grade' },
          h('div', { class: 'pedido__col' },
            h('div', { class: 'pedido__livro' }, L.criarFolheador(proj, { compacto: true })),
            cardArquivo),
          h('div', { class: 'pedido__col' },
            cardStatus,
            pedido.preco.itens.length ? h('section', { class: 'cartao', 'aria-labelledby': 'parc-titulo' },
              h('h2', { id: 'parc-titulo', class: 'cartao__titulo' }, h('span', { html: L.svg('gift') }), 'Pedidos aos parceiros'),
              h('ul', { class: 'parceiros' }, pedido.preco.itens.map((it) => h('li', null,
                h('span', null, h('strong', null, `${it.qtd > 1 ? it.qtd + '× ' : ''}${it.nome}`), h('small', null, it.fornecedor + (it.texto ? ` · mensagem: “${it.texto}”` : ''))),
                h('span', { class: 'selo-qualidade selo-qualidade--ok' }, 'Enviado'))))) : null,
            h('section', { class: 'cartao', 'aria-labelledby': 'res-titulo' },
              h('h2', { id: 'res-titulo', class: 'cartao__titulo' }, 'Resumo'),
              h('dl', { class: 'resumo__linhas' },
                h('div', { class: 'resumo__linha' }, h('dt', null, `Livro ${L.formato(proj.formato).nome} · ${pedido.preco.paginas} páginas`), h('dd', null, L.money(pedido.preco.livro))),
                pedido.preco.itens.map((it) => h('div', { class: 'resumo__linha' }, h('dt', null, `${it.nome}${it.qtd > 1 ? ' × ' + it.qtd : ''}`), h('dd', null, L.money(it.total)))),
                pedido.preco.descKit ? h('div', { class: 'resumo__linha resumo__linha--desconto' }, h('dt', null, 'Desconto presentes'), h('dd', null, '− ' + L.money(pedido.preco.descKit))) : null,
                pedido.preco.pix ? h('div', { class: 'resumo__linha resumo__linha--desconto' }, h('dt', null, 'Desconto Pix'), h('dd', null, '− ' + L.money(pedido.preco.pix))) : null,
                h('div', { class: 'resumo__linha' }, h('dt', null, `Frete ${pedido.preco.freteNome.toLowerCase()}`), h('dd', null, pedido.preco.frete ? L.money(pedido.preco.frete) : 'Grátis')),
                h('div', { class: 'resumo__linha resumo__linha--total' }, h('dt', null, `Total (${pedido.pagamento === 'pix' ? 'Pix' : 'cartão'})`), h('dd', null, L.money(pedido.preco.total)))),
              h('p', { class: 'dica' }, `Entrega para ${ent.presente && ent.destinatario ? ent.destinatario : pedido.cliente.nome}: ${ent.rua}, ${ent.numero}${ent.complemento ? ' · ' + ent.complemento : ''} · ${ent.bairro} · ${ent.cidade}/${ent.uf} · CEP ${ent.cep}`)))),
        h('div', { class: 'acoes-fluxo acoes-fluxo--fim' },
          h('a', { class: 'btn btn--fantasma', href: '#pedidos' }, 'Meus pedidos'),
          h('a', { class: 'btn btn--primario', href: '#criar', onClick: () => { S.criacao = null; } }, 'Criar outro livro')));

      desenharStatus();
      desenharArquivo();
      if (pedido.gerarAoAbrir && !S.pdfs.get(pedido.id)) gerar();
    },
  };

  L.views.pedidos = {
    titulo: 'Meus pedidos', grupo: 'site',
    render(main) {
      const box = h('div', { class: 'pedidos' }, h('div', { class: 'revisao__cabeca' }, h('p', { class: 'eyebrow' }, 'Pedidos'), h('h1', null, 'Meus pedidos')));
      main.append(box);
      if (!S.pedidos.length) {
        box.append(h('div', { class: 'vazio' }, h('p', null, 'Você ainda não fez nenhum pedido neste aparelho.'), h('a', { class: 'btn btn--primario', href: '#criar' }, 'Criar meu livro')));
        return;
      }
      box.append(h('ul', { class: 'lista-pedidos' }, S.pedidos.map((p) => {
        const capa = p.projeto.paginas[0];
        return h('li', null, h('a', { class: 'pedido-item', href: '#pedido-' + p.id },
          h('span', { class: 'pedido-item__capa' }, L.livroCapa(capa)),
          h('span', { class: 'pedido-item__txt' },
            h('strong', null, capa.titulo || 'Livro'),
            h('small', null, `${p.id} · ${L.fmtData(new Date(p.criadoEm), 'hora')}`),
            h('small', null, `Entrega prevista até ${L.fmtData(new Date(p.prazo.max), 'semana')}`)),
          h('span', { class: 'pedido-item__total' }, L.money(p.preco.total))));
      })));
    },
  };
})(window.L = window.L || {});
