preSintaxis.registrarPlugin('buscar', (api) => {
  const style = document.createElement('style');
  style.textContent = `
    .ps-buscar-bar { padding: .5rem 1rem; background: color-mix(in srgb, var(--ps-texto) 5%, transparent); border-bottom: 1px solid color-mix(in srgb, var(--ps-texto) 15%, transparent); }
    .ps-buscar-bar input { width: 100%; padding: 4px 8px; background: transparent; border: 1px solid color-mix(in srgb, var(--ps-texto) 25%, transparent); color: var(--ps-texto); border-radius: 4px; font-size: .8rem; font-family: monospace; }
    .ps-buscar-bar input:focus { outline: 2px solid var(--ps-tipo); outline-offset: 1px; }
    .ps-linea mark.ps-match { background: #fbbf24; color: #000; border-radius: 2px; }
    .ps-linea mark.ps-match-activa { background: #f97316; color: #fff; }
  `;
  document.head.appendChild(style);

  api.hook('despuesDeRenderizar').registrar(({ pre, code, ajustes }) => {
    if (ajustes.buscar !== 'true') return;
    const bar = document.createElement('div');
    bar.className = 'ps-buscar-bar';
    const inp = document.createElement('input');
    inp.type = 'search';
    inp.placeholder = 'Buscar en el código...';
    bar.appendChild(inp);
    pre.insertBefore(bar, pre.firstChild);

    let matches = [], idx = -1;
    inp.addEventListener('input', () => {
      code.querySelectorAll('mark.ps-match, mark.ps-match-activa').forEach(m => {
        const p = m.parentNode; p.replaceChild(document.createTextNode(m.textContent), m); p.normalize();
      });
      matches = []; idx = -1;
      const q = inp.value.trim();
      if (!q) return;
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      code.querySelectorAll('.ps-linea').forEach(linea => {
        const walker = document.createTreeWalker(linea, NodeFilter.SHOW_TEXT);
        const nodos = [];
        let n; while ((n = walker.nextNode())) nodos.push(n);
        nodos.forEach(nodo => {
          if (!nodo.nodeValue) return;
          const matchesNodo = [...nodo.nodeValue.matchAll(re)];
          if (!matchesNodo.length) return;
          const frag = document.createDocumentFragment();
          let last = 0;
          matchesNodo.forEach(m => {
            if (m.index > last) frag.appendChild(document.createTextNode(nodo.nodeValue.slice(last, m.index)));
            const mark = document.createElement('mark');
            mark.className = 'ps-match'; mark.textContent = m[0];
            matches.push(mark); frag.appendChild(mark);
            last = m.index + m[0].length;
          });
          if (last < nodo.nodeValue.length) frag.appendChild(document.createTextNode(nodo.nodeValue.slice(last)));
          nodo.parentNode.replaceChild(frag, nodo);
        });
      });
      if (matches.length) { idx = 0; matches[0].classList.add('ps-match-activa'); matches[0].scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    });

    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!matches.length) return;
        matches[idx]?.classList.remove('ps-match-activa');
        idx = (idx + (e.shiftKey ? -1 : 1) + matches.length) % matches.length;
        matches[idx].classList.add('ps-match-activa');
        matches[idx].scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    });
  });
});