preSintaxis.registrarPlugin('ejecutar-javascript', (api) => {
  const style = document.createElement('style');
  style.textContent = `.ps-run-output { padding: .5rem 1rem; background: #0a0f1a; border-top: 1px solid color-mix(in srgb, var(--ps-texto) 15%, transparent); font: 12px/1.4 monospace; color: #22c55e; white-space: pre-wrap; max-height: 200px; overflow: auto; }`;
  document.head.appendChild(style);

  api.hook('despuesDeRenderizar').registrar(({ pre, ajustes, texto, lenguaje }) => {
    if (ajustes.ejecutar !== 'true') return;
    if (lenguaje !== 'javascript' && lenguaje !== 'js') return;
    let bar = pre.querySelector('.ps-btn-bar');
    if (!bar) { bar = document.createElement('div'); bar.className = 'ps-btn-bar'; pre.appendChild(bar); }
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ps-btn'; b.setAttribute('aria-label', 'Ejecutar');
    b.innerHTML = '▶';
    b.onclick = () => {
      pre.querySelector('.ps-run-output')?.remove();
      const out = document.createElement('div');
      out.className = 'ps-run-output';
      const logs = [];
      const orig = console.log;
      console.log = (...args) => { logs.push(args.join(' ')); orig(...args); };
      try { new Function(texto)(); } catch (e) { logs.push('Error: ' + e.message); }
      console.log = orig;
      out.textContent = logs.join('\n') || '(sin salida)';
      pre.appendChild(out);
    };
    bar.appendChild(b);
  });
});