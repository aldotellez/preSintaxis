preSintaxis.registrarPlugin('diff', (api) => {
  const style = document.createElement('style');
  style.textContent = `
    .ps-linea.ps-diff-add    { background: color-mix(in srgb, #22c55e 15%, transparent); border-left: 3px solid #22c55e; }
    .ps-linea.ps-diff-del    { background: color-mix(in srgb, #ef4444 15%, transparent); border-left: 3px solid #ef4444; opacity: .8; }
    .ps-linea.ps-diff-hunk   { background: color-mix(in srgb, #38bdf8 15%, transparent); border-left: 3px solid #38bdf8; color: #38bdf8; font-weight: 600; }
  `;
  document.head.appendChild(style);

  api.hook('antesDeRenderizar').registrar(({ lineas, ajustes }) => {
    if (ajustes.diff !== 'true') return;
    lineas.forEach(tks => {
      const lineTexto = tks.map(t => t.c).join('');
      let clase = null;
      if (/^\+\s?/.test(lineTexto)) clase = 'ps-diff-add';
      else if (/^-\s?/.test(lineTexto)) clase = 'ps-diff-del';
      else if (/^@@/.test(lineTexto)) clase = 'ps-diff-hunk';
      if (clase) {
        if (!tks[0]) tks[0] = { t:'plano', c:'' };
        tks.psDiffClase = clase;
      }
    });
  });

  api.hook('despuesDeRenderizar').registrar(({ wrapper, ajustes }) => {
    if (ajustes.diff !== 'true') return;
    wrapper.querySelectorAll('.ps-linea').forEach(linea => {
      const t = linea.textContent;
      if (/^\+\s?/.test(t)) linea.classList.add('ps-diff-add');
      else if (/^-\s?/.test(t)) linea.classList.add('ps-diff-del');
      else if (/^@@/.test(t)) linea.classList.add('ps-diff-hunk');
    });
  });
});