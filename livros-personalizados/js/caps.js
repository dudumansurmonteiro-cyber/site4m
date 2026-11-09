/* Recursos extras quando o site roda dentro do Claude (versão de demonstração):
   - downloads: salvar o PDF da gráfica
   - sample: sugerir legendas com IA olhando a foto
   Fora do Claude, o site funciona igual (download normal e legendas prontas). */
(function (L) {
  'use strict';

  const dentro = !!(window.claude && typeof window.claude.use === 'function');
  L.caps = { dentroDoClaude: dentro, downloads: null, sample: null, ia: false };

  L.capsProntas = (async () => {
    if (!dentro) return;
    const usar = (nome) => window.claude.use(nome).catch(() => null);
    const [dl, sample] = await Promise.all([usar('downloads'), usar('sample')]);
    L.caps.downloads = dl;
    L.caps.sample = sample;
    if (sample) {
      const lim = await sample.limits().catch(() => null);
      L.caps.ia = !!(lim && lim.images);
    }
    L.emit({ tipo: 'caps' });
  })();

  L.sugerirLegendasIA = async (pg, proj) => {
    const s = L.caps.sample;
    if (!s || !L.caps.ia) throw { code: 'indisponivel' };
    const id = pg.fotos && pg.fotos[0] && pg.fotos[0].img;
    const blob = id ? await L.blobParaIA(id) : null;
    const tema = L.tema(proj.tema);
    const nomes = Object.entries(proj.campos || {}).filter(([k, v]) => v && k !== 'data').map(([, v]) => v).join(', ');
    const prompt = [
      'Você escreve legendas curtas e afetivas para um livro de fotos personalizado que vai ser dado de presente.',
      `Ocasião: ${tema.nome}.` + (nomes ? ` Nomes envolvidos: ${nomes}.` : ''),
      (blob ? 'Olhe a foto anexada e sugira' : 'Sugira') +
        ' 3 legendas diferentes em português do Brasil, cada uma com no máximo 60 caracteres, em tom carinhoso e natural, sem exageros. Pode terminar com no máximo 1 emoji.',
      'Responda somente com um array JSON de 3 strings.',
    ].join('\n');
    const opcoes = { modelTier: 'quick', cache: false };
    if (blob) opcoes.images = [blob];
    const out = await s.json(prompt, opcoes);
    return (Array.isArray(out) ? out : []).map((t) => String(t).trim()).filter(Boolean).slice(0, 3);
  };
})(window.L = window.L || {});
