preSintaxis.registrarPlugin('scroll', (api) => {
  const style = document.createElement('style');
  style.textContent = `
    pre[data-scroll-vertical] > code > .ps-contenido {
      max-height: var(--ps-max-altura, 24rem) !important;
      overflow-y: auto !important;
      scrollbar-width: thin;
      scrollbar-color: color-mix(in srgb, var(--ps-texto) 30%, transparent) transparent;
    }
    pre[data-scroll-vertical] > code > .ps-contenido::-webkit-scrollbar { width: 8px; }
    pre[data-scroll-vertical] > code > .ps-contenido::-webkit-scrollbar-thumb {
      background: color-mix(in srgb, var(--ps-texto) 30%, transparent);
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);

  api.hook('despuesDeRenderizar').registrar(({ pre, lineas, ajustes }) => {
    const maxLineas = 'maxlineas' in ajustes ? parseInt(ajustes.maxlineas, 10) : 20;
    const altura = ajustes.altura || '24rem';

    if (maxLineas > 0 && lineas.length > maxLineas) {
      pre.setAttribute('data-scroll-vertical', 'true');
      pre.style.setProperty('--ps-max-altura', altura);
    } else {
      pre.removeAttribute('data-scroll-vertical');
      pre.style.removeProperty('--ps-max-altura');
    }
  });
});