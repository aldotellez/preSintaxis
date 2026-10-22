preSintaxis.registrarPlugin('enlaces', (api) => {
  api.hook('despuesDeRenderizar').registrar(({ wrapper, ajustes }) => {
    if (ajustes.enlaces !== 'true') return;
    wrapper.querySelectorAll('.ps-comentario').forEach(c => {
      if (c.querySelector('a')) return;
      c.innerHTML = c.innerHTML.replace(/(https?:\/\/[^\s<>"']+)/g,
        '<a href="$1" target="_blank" rel="noopener" style="color:#38bdf8;text-decoration:underline">$1</a>');
    });
  });
});