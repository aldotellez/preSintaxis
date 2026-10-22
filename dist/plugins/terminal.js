preSintaxis.registrarPlugin('terminal', (api) => {
  const style = document.createElement('style');
  style.textContent = `
    .ps-linea.ps-term-cmd   { color: #38bdf8; font-weight: 600; }
    .ps-linea.ps-term-ok    { color: #22c55e; }
    .ps-linea.ps-term-warn  { color: #fbbf24; }
    .ps-linea.ps-term-err   { color: #ef4444; font-weight: 600; }
  `;
  document.head.appendChild(style);

  api.hook('despuesDeRenderizar').registrar(({ wrapper, ajustes }) => {
    if (ajustes.terminal !== 'true') return;
    wrapper.querySelectorAll('.ps-linea').forEach(l => {
      const t = l.textContent.trim();
      if (t.startsWith('$')) l.classList.add('ps-term-cmd');
      else if (t.startsWith('>')) l.classList.add('ps-term-ok');
      else if (t.startsWith('!')) l.classList.add('ps-term-warn');
      else if (t.startsWith('✗') || t.startsWith('x') || t.startsWith('X')) l.classList.add('ps-term-err');
    });
  });
});