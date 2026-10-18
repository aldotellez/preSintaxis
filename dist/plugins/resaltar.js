preSintaxis.registrarPlugin('resaltar', (api) => {
  const style = document.createElement('style');
  style.textContent = `
    .ps-linea.ps-resaltada {
      background: color-mix(in srgb, var(--ps-palabra) 15%, transparent) !important;
      border-left: 3px solid var(--ps-palabra) !important;
      padding-left: calc(1rem - 3px) !important;
    }
  `;
  document.head.appendChild(style);

  const parseRangos = (str) => {
    const s = new Set();
    if (!str) return s;
    for (const b of String(str).split(',')) {
      const [a, z] = b.trim().split('-');
      const i = +a, f = z !== undefined ? +z : i;
      if (Number.isFinite(i) && Number.isFinite(f))
        for (let x = Math.min(i, f); x <= Math.max(i, f); x++) s.add(x);
    }
    return s;
  };

  api.hook('despuesDeRenderizar').registrar(({ wrapper, ajustes }) => {
    const rangos = parseRangos(ajustes.resaltar);
    if (!rangos.size) return;
    
    // Buscamos dentro del wrapper (el contenedor creado en el core)
    const lineasHtml = wrapper.querySelectorAll('.ps-linea');
    lineasHtml.forEach((linea, index) => {
      if (rangos.has(index + 1)) {
        linea.classList.add('ps-resaltada');
      }
    });
  });
});