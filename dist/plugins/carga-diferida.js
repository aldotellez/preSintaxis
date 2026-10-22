preSintaxis.registrarPlugin('carga-diferida', (api) => {
  if (!('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const pre = e.target;
        obs.unobserve(pre);
        pre.setAttribute('data-lazy-listo', 'true');
        // Forzar procesamiento (si el core no lo ha hecho ya)
        if (!pre.hasAttribute('data-sintaxis-listo')) {
          pre.removeAttribute('data-lazy-pendiente');
          // Disparar init dentro del propio nodo
          api.init(pre.parentNode);
        }
      }
    });
  }, { rootMargin: '200px' });

  // Antes de procesar, si tiene data-lazy, lo marcamos pendiente
  api.hook('antesDeTokenizar').registrar(({ pre, ajustes }) => {
    if (ajustes.lazy === 'true' && !pre.hasAttribute('data-lazy-listo')) {
      pre.setAttribute('data-lazy-pendiente', 'true');
    }
  });

  // Marcar todos los lazy al cargar
  setTimeout(() => {
    document.querySelectorAll('pre[data-ajuste*="lazy:\'true\'"]').forEach(pre => {
      if (!pre.hasAttribute('data-lazy-listo')) obs.observe(pre);
    });
  }, 100);
});