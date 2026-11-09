/* Pagamento (simulado): dados, entrega, frete, forma de pagamento e resumo */
(function (L) {
  'use strict';
  const h = L.h, cfg = L.config, S = L.state;
  L.views = L.views || {};

  const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

  const mascaraCep = (v) => v.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');
  const mascaraFone = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };

  // Busca o endereço pelo CEP (ViaCEP). Se a rede bloquear, a pessoa digita.
  async function buscarCep(cep) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 4000);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal: ctl.signal });
      if (!r.ok) return null;
      const j = await r.json();
      return j && !j.erro ? j : null;
    } catch (e) { return null; } finally { clearTimeout(t); }
  }

  function numeroPedido() {
    const d = new Date(), p2 = (n) => String(n).padStart(2, '0');
    return `${String(d.getFullYear()).slice(2)}${p2(d.getMonth() + 1)}${p2(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  L.views.pagamento = {
    titulo: 'Pagamento', grupo: 'fluxo', precisaProjeto: true,
    render(main) {
      const proj = S.projeto;
      proj.checkout = Object.assign({ frete: 'expresso', pagamento: 'pix', presente: false }, proj.checkout || {});
      const ck = proj.checkout;
      const erros = L.verificar(proj).filter((i) => i.nivel === 'erro');
      if (erros.length) { L.ir('revisao'); return; }

      const resumo = h('aside', { class: 'resumo', 'aria-labelledby': 'resumo-titulo' });
      const form = h('form', { class: 'form checkout__form', novalidate: true });
      main.append(h('div', { class: 'checkout' },
        h('div', { class: 'revisao__cabeca' },
          h('p', { class: 'eyebrow' }, 'Pagamento'),
          h('h1', null, 'Finalizar pedido')),
        h('div', { class: 'aviso aviso--demo' },
          h('span', { html: L.svg('lock') }),
          h('p', null, h('strong', null, 'Ambiente de demonstração. '), 'Nenhum pagamento é cobrado e seus dados ficam só neste navegador. No site real, o pagamento abre na tela segura de um provedor como Mercado Pago, Pagar.me ou Stripe.')),
        h('div', { class: 'checkout__grade' }, form, resumo)));

      const salvar = L.debounce(() => L.alterou('checkout'), 300);
      function campo(id, rotulo, attrs = {}, extra) {
        const input = h('input', Object.assign({
          id: 'ck-' + id, name: id, class: 'input', value: ck[id] || '',
          onInput: (e) => {
            if (id === 'cep') e.target.value = mascaraCep(e.target.value);
            if (id === 'telefone') e.target.value = mascaraFone(e.target.value);
            ck[id] = e.target.value; e.target.removeAttribute('aria-invalid');
            const msg = L.$('#erro-' + id); if (msg) msg.hidden = true;
            salvar();
            if (id === 'cep') aoMudarCep();
          },
        }, attrs));
        return h('div', { class: 'campo' + (extra ? ' ' + extra : '') },
          h('label', { for: 'ck-' + id }, rotulo, attrs.required ? null : h('span', { class: 'opcional' }, ' (opcional)')),
          input,
          h('p', { class: 'campo__erro', id: 'erro-' + id, hidden: true }));
      }

      let ultimoCep = '';
      async function aoMudarCep() {
        const cep = (ck.cep || '').replace(/\D/g, '');
        if (cep.length !== 8 || cep === ultimoCep) return;
        ultimoCep = cep;
        const st = L.$('#cep-status');
        st.textContent = 'Buscando endereço…';
        const r = await buscarCep(cep);
        if (!r) { st.textContent = 'Preencha o endereço abaixo.'; return; }
        const map = { rua: r.logradouro, bairro: r.bairro, cidade: r.localidade, uf: r.uf };
        for (const k in map) if (map[k]) { ck[k] = map[k]; const el = L.$('#ck-' + k); if (el) el.value = map[k]; }
        st.textContent = 'Endereço encontrado. Confira e informe o número.';
        salvar();
        const num = L.$('#ck-numero'); if (num) num.focus();
      }

      const ufSelect = h('select', { id: 'ck-uf', name: 'uf', class: 'input', required: true, onChange: (e) => { ck.uf = e.target.value; e.target.removeAttribute('aria-invalid'); L.$('#erro-uf').hidden = true; salvar(); } },
        h('option', { value: '' }, 'UF'), UFS.map((u) => h('option', { value: u, selected: ck.uf === u ? true : null }, u)));

      const blocoPresente = h('div', { class: 'campo-grupo', hidden: !ck.presente }, campo('destinatario', 'Nome de quem vai receber', { autocomplete: 'off', maxlength: '60' }));
      form.append(
        h('fieldset', { class: 'secao-form' }, h('legend', null, '1. Seus dados'),
          campo('nome', 'Nome completo', { required: true, autocomplete: 'name', maxlength: '80' }),
          h('div', { class: 'duas' },
            campo('email', 'E-mail', { required: true, type: 'email', autocomplete: 'email', inputmode: 'email', maxlength: '80' }),
            campo('telefone', 'WhatsApp', { required: true, type: 'tel', autocomplete: 'tel', inputmode: 'tel', placeholder: '(11) 91234-5678' }))),
        h('fieldset', { class: 'secao-form' }, h('legend', null, '2. Entrega'),
          h('label', { class: 'check' },
            h('input', { type: 'checkbox', id: 'ck-presente', checked: ck.presente ? true : null, onChange: (e) => { ck.presente = e.target.checked; blocoPresente.hidden = !ck.presente; salvar(); } }),
            h('span', null, 'É presente para outra pessoa', h('small', null, 'Enviamos sem preço na caixa e com embalagem discreta.'))),
          blocoPresente,
          h('div', { class: 'duas duas--cep' },
            campo('cep', 'CEP', { required: true, inputmode: 'numeric', autocomplete: 'postal-code', placeholder: '00000-000' }),
            h('p', { class: 'cep-status', id: 'cep-status', 'aria-live': 'polite' })),
          campo('rua', 'Rua', { required: true, autocomplete: 'address-line1', maxlength: '120' }),
          h('div', { class: 'duas' },
            campo('numero', 'Número', { required: true, inputmode: 'numeric', maxlength: '10' }),
            campo('complemento', 'Complemento', { maxlength: '60', placeholder: 'Apto, bloco…' })),
          h('div', { class: 'tres' },
            campo('bairro', 'Bairro', { required: true, maxlength: '60' }),
            campo('cidade', 'Cidade', { required: true, autocomplete: 'address-level2', maxlength: '60' }),
            h('div', { class: 'campo' }, h('label', { for: 'ck-uf' }, 'Estado'), ufSelect, h('p', { class: 'campo__erro', id: 'erro-uf', hidden: true })))),
        h('fieldset', { class: 'secao-form' }, h('legend', null, '3. Frete'),
          h('div', { class: 'opcoes-radio' }, cfg.frete.map((fr) => {
            const pz = L.prazo(fr.id);
            const subtotal = L.preco(proj).subtotal;
            const gratis = fr.gratisAcima && subtotal >= fr.gratisAcima;
            return h('label', { class: 'radio-card' },
              h('input', { type: 'radio', name: 'frete', value: fr.id, checked: ck.frete === fr.id ? true : null, onChange: () => { ck.frete = fr.id; salvar(); desenharResumo(); } }),
              h('span', { class: 'radio-card__txt' }, h('strong', null, fr.nome), h('small', null, `Chega entre ${L.fmtData(pz.min, 'semana')} e ${L.fmtData(pz.max, 'semana')}`)),
              h('span', { class: 'radio-card__preco' }, gratis ? 'Grátis' : L.money(fr.preco)));
          })),
          h('p', { class: 'dica' }, `Inclui ${cfg.producaoDiasUteis} dias úteis de produção.` + (cfg.frete.some((f) => f.gratisAcima) ? ` Frete padrão grátis acima de ${L.money(cfg.frete.find((f) => f.gratisAcima).gratisAcima)}.` : ''))),
        h('fieldset', { class: 'secao-form' }, h('legend', null, '4. Pagamento'),
          h('div', { class: 'opcoes-radio' },
            h('label', { class: 'radio-card' },
              h('input', { type: 'radio', name: 'pagamento', value: 'pix', checked: ck.pagamento === 'pix' ? true : null, onChange: () => { ck.pagamento = 'pix'; salvar(); desenharResumo(); } }),
              h('span', { class: 'radio-card__icone', html: L.svg('pix') }),
              h('span', { class: 'radio-card__txt' }, h('strong', null, 'Pix'), h('small', null, `${Math.round(cfg.descontoPix * 100)}% de desconto, aprovação na hora`))),
            h('label', { class: 'radio-card' },
              h('input', { type: 'radio', name: 'pagamento', value: 'cartao', checked: ck.pagamento === 'cartao' ? true : null, onChange: () => { ck.pagamento = 'cartao'; salvar(); desenharResumo(); } }),
              h('span', { class: 'radio-card__icone', html: L.svg('card') }),
              h('span', { class: 'radio-card__txt' }, h('strong', null, 'Cartão de crédito'), h('small', null, 'Até 3x sem juros'))))),
        h('div', { class: 'checkout__enviar' },
          h('button', { type: 'submit', class: 'btn btn--primario btn--g btn--bloco' }, 'Confirmar pedido (simulação)'),
          h('p', { class: 'dica' }, 'Ao confirmar, geramos o arquivo de impressão e simulamos o envio para a gráfica e para os parceiros.')));

      function desenharResumo() {
        const p = L.preco(proj);
        const pz = L.prazo(ck.frete);
        L.clear(resumo).append(
          h('h2', { id: 'resumo-titulo', class: 'resumo__titulo' }, 'Resumo'),
          h('div', { class: 'resumo__livro' },
            h('div', { class: 'resumo__capa' }, L.livroCapa(proj.paginas[0])),
            h('div', null, h('strong', null, proj.paginas[0].titulo || 'Seu livro'), h('p', null, `${p.livro.formato.nome} ${p.livro.formato.cm} × ${p.livro.formato.cm} cm · ${p.livro.paginas} páginas`), h('a', { href: '#revisao', class: 'link' }, 'Ver livro'))),
          h('dl', { class: 'resumo__linhas' },
            linha('Livro', L.money(p.livro.valor)),
            p.itens.map((it) => linha(`${it.nome}${it.qtd > 1 ? ` × ${it.qtd}` : ''}`, L.money(it.total))),
            p.descKit ? linha(`Desconto presentes (${Math.round(cfg.descontoKit.percentual * 100)}%)`, '− ' + L.money(p.descKit), 'desconto') : null,
            p.pix ? linha(`Desconto Pix (${Math.round(cfg.descontoPix * 100)}%)`, '− ' + L.money(p.pix), 'desconto') : null,
            linha(`Frete ${p.freteObj.nome.toLowerCase()}`, p.frete ? L.money(p.frete) : 'Grátis'),
            linha('Total', L.money(p.total), 'total')),
          h('p', { class: 'resumo__prazo' }, h('span', { html: L.svg('truck') }), `Chega entre ${L.fmtData(pz.min, 'semana')} e ${L.fmtData(pz.max, 'semana')}`));
        L.atualizarResumoTopo();
      }
      function linha(rot, val, cls) { return h('div', { class: 'resumo__linha' + (cls ? ' resumo__linha--' + cls : '') }, h('dt', null, rot), h('dd', null, val)); }
      desenharResumo();

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const obrig = ['nome', 'email', 'telefone', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'uf'];
        if (ck.presente) obrig.splice(3, 0, 'destinatario');
        const msgs = {
          email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Digite um e-mail válido, como nome@exemplo.com.'),
          telefone: (v) => (v.replace(/\D/g, '').length >= 10 ? '' : 'Digite o WhatsApp com DDD.'),
          cep: (v) => (v.replace(/\D/g, '').length === 8 ? '' : 'O CEP tem 8 números.'),
        };
        let primeiro = null;
        for (const k of obrig) {
          const v = String(ck[k] || '').trim();
          const msg = !v ? 'Preencha este campo.' : msgs[k] ? msgs[k](v) : '';
          const el = L.$('#ck-' + k), err = L.$('#erro-' + k);
          if (msg) {
            el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', 'erro-' + k);
            if (err) { err.textContent = msg; err.hidden = false; }
            primeiro = primeiro || el;
          }
        }
        if (primeiro) { primeiro.focus(); L.toast('Confira os campos destacados.', { tipo: 'erro' }); return; }

        const btn = form.querySelector('[type=submit]');
        btn.disabled = true; btn.textContent = 'Confirmando…';
        await L.sleep(700);
        const agora = new Date();
        const p = L.preco(proj), pz = L.prazo(ck.frete, agora);
        const pedido = {
          id: 'LC-' + numeroPedido(),
          criadoEm: agora.toISOString(),
          projeto: L.clone(proj),
          preco: { livro: p.livro.valor, formato: p.livro.formato.id, paginas: p.livro.paginas, itens: p.itens, descKit: p.descKit, pix: p.pix, frete: p.frete, freteNome: p.freteObj.nome, total: p.total },
          prazo: { producao: pz.producao.toISOString(), min: pz.min.toISOString(), max: pz.max.toISOString() },
          cliente: { nome: ck.nome, email: ck.email, telefone: ck.telefone },
          entrega: { presente: !!ck.presente, destinatario: ck.destinatario || '', cep: ck.cep, rua: ck.rua, numero: ck.numero, complemento: ck.complemento || '', bairro: ck.bairro, cidade: ck.cidade, uf: ck.uf },
          pagamento: ck.pagamento,
          arquivo: null,
          parceirosEm: p.itens.length ? agora.toISOString() : null,
          gerarAoAbrir: true,
        };
        await L.salvarPedido(pedido);
        // o rascunho vira pedido; as fotos continuam guardadas para o pedido
        S.projeto = null;
        await L.idb.del('kv', 'rascunho');
        L.ir('pedido-' + pedido.id);
      });
    },
  };
})(window.L = window.L || {});
