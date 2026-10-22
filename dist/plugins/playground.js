preSintaxis.registrarPlugin('playground', (api) => {
  const style = document.createElement('style');
  style.textContent = `
    .ps-playground { border-top: 1px solid color-mix(in srgb, var(--ps-texto) 15%, transparent); }
    .ps-playground textarea { width: 100%; min-height: 120px; padding: .5rem 1rem; background: #0a0f1a; border: 0; color: #a3e635; font: 12px/1.4 monospace; resize: vertical; box-sizing: border-box; }
    .ps-playground textarea:focus { outline: 2px solid var(--ps-tipo); outline-offset: -2px; }
    .ps-playground .ps-run-btn { display: block; margin: .25rem 1rem; padding: 4px 12px; background: var(--ps-tipo); border: 0; color: #000; border-radius: 4px; cursor: pointer; font-size: .75rem; font-weight: 600; }
    .ps-playground iframe { width: 100%; height: 100px; border: 0; border-top: 1px solid #222; background: #fff; }
  `;
  document.head.appendChild(style);

  api.hook('despuesDeRenderizar').registrar(({ pre, ajustes, texto }) => {
    if (ajustes.playground !== 'true') return;
    const wrap = document.createElement('div');
    wrap.className = 'ps-playground';
    const ta = document.createElement('textarea');
    ta.value = texto;
    const btn = document.createElement('button');
    btn.className = 'ps-run-btn'; btn.textContent = '▶ Ejecutar HTML';
    const frame = document.createElement('iframe');
    btn.onclick = () => { frame.srcdoc = ta.value; };
    wrap.appendChild(ta); wrap.appendChild(btn); wrap.appendChild(frame);
    pre.appendChild(wrap);
    frame.srcdoc = ta.value;
  });
});