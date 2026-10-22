preSintaxis.registrarPlugin('compartir', (api) => {
  const SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`;

  // Estilos del menú flotante
  const style = document.createElement('style');
  style.textContent = `
    .ps-share-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: #1f2937;
      border: 1px solid #374151;
      border-radius: 6px;
      padding: 6px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      z-index: 10;
      min-width: 150px;
      box-shadow: 0 4px 12px rgba(0,0,0,.5);
    }
    .ps-share-menu a {
      color: #e5e7eb;
      text-decoration: none;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: system-ui, sans-serif;
    }
    .ps-share-menu a:hover { background: #374151; }
  `;
  document.head.appendChild(style);

  api.hook('despuesDeRenderizar').registrar(({ pre, ajustes, texto }) => {
    if (ajustes.compartir !== 'true') return;
    
    let bar = pre.querySelector('.ps-btn-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'ps-btn-bar';
      pre.appendChild(bar);
    }

    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';

    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ps-btn'; b.setAttribute('aria-label', 'Compartir'); b.innerHTML = SVG;
    
    let menuAbierto = false;
    let menuEl = null;

    b.onclick = (e) => {
      e.stopPropagation();
      if (menuAbierto && menuEl) {
        menuEl.remove();
        menuAbierto = false;
        return;
      }

      const url = window.location.href;
      const text = `${pre.dataset.psEnc || 'Código'}\n\n${texto.slice(0, 100)}...`;
      
      menuEl = document.createElement('div');
      menuEl.className = 'ps-share-menu';
      menuEl.innerHTML = `
        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}" target="_blank" rel="noopener">Twitter / X</a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}" target="_blank" rel="noopener">WhatsApp</a>
        <a href="mailto:?subject=${encodeURIComponent(pre.dataset.psEnc || 'Código')}&body=${encodeURIComponent(text + '\n\n' + url)}">Email</a>
        <a href="#" onclick="navigator.clipboard.writeText('${texto.replace(/'/g, "\\'")}'); this.textContent='¡Copiado!'; setTimeout(()=>this.textContent='Copiar texto', 2000); return false;">Copiar texto</a>
      `;

      wrapper.appendChild(menuEl);
      menuAbierto = true;

      // Cerrar al hacer clic fuera
      const cerrar = () => { menuEl.remove(); menuAbierto = false; document.removeEventListener('click', cerrar); };
      setTimeout(() => document.addEventListener('click', cerrar), 10);
    };

    wrapper.appendChild(b);
    bar.appendChild(wrapper);
  });
});