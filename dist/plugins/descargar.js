preSintaxis.registrarPlugin('descargar', (api) => {
  const SVG_DESC = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;

  api.hook('despuesDeRenderizar').registrar(({ pre, ajustes, texto, lenguaje }) => {
    if (ajustes.descargar !== 'true') return;
    
    const bar = pre.querySelector('.ps-btn-bar') || document.createElement('div');
    if (!bar.parentNode) {
      bar.className = 'ps-btn-bar';
      pre.appendChild(bar);
    }

    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ps-btn'; b.setAttribute('aria-label', 'Descargar código'); b.innerHTML = SVG_DESC;
    b.onclick = () => {
      const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = pre.dataset.psEnc || `codigo.${lenguaje || 'txt'}`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    bar.appendChild(b);
  });
});