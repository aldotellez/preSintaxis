preSintaxis.registrarPlugin('exportar-imagen', (api) => {
  // Icono de imagen
  const SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;

  api.hook('despuesDeRenderizar').registrar(({ pre, ajustes }) => {
    // Verificamos si el ajuste está activo (todo en minúsculas)
    if (ajustes.exportarimagen !== 'true') return;

    // 1. Buscar la barra de botones. Si no existe, la creamos y la anclamos al <pre>
    let bar = pre.querySelector('.ps-btn-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'ps-btn-bar';
      // Estilos en línea por si el CSS base no los aplica en este caso
      bar.style.position = 'absolute';
      bar.style.top = '0.4rem';
      bar.style.right = '0.75rem';
      bar.style.display = 'flex';
      bar.style.gap = '0.3rem';
      bar.style.zIndex = '2';
      pre.appendChild(bar);
    }

    // 2. Crear el botón
    const b = document.createElement('button');
    b.type = 'button'; 
    b.className = 'ps-btn'; 
    b.setAttribute('aria-label', 'Exportar como imagen PNG'); 
    b.innerHTML = SVG;
    
    // 3. Lógica de generación de imagen (Canvas)
    b.onclick = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const scale = 2; 
      
      const rect = pre.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);
      
      // Obtener colores del tema
      const style = getComputedStyle(pre);
      const bgColor = style.getPropertyValue('--ps-contenido').trim() || '#111827';
      const textColor = style.getPropertyValue('--ps-texto').trim() || '#e5e7eb';
      const headerBg = style.getPropertyValue('--ps-encabezado').trim() || '#1f2937';
      
      // Pintar fondo
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      
      // Pintar Encabezado
      const encabezado = pre.getAttribute('data-encabezado');
      let offsetY = 0;
      if (encabezado) {
        const headerHeight = 36; 
        ctx.fillStyle = headerBg;
        ctx.fillRect(0, 0, width, headerHeight);
        ctx.fillStyle = textColor;
        ctx.font = 'bold 12px monospace';
        ctx.textBaseline = 'middle';
        ctx.fillText(encabezado, 16, headerHeight / 2);
        offsetY = headerHeight;
      }
      
      // Pintar líneas de código
      const lineas = pre.querySelectorAll('.ps-linea');
      const lineHeight = 21; 
      const padding = 16;
      
      lineas.forEach((linea, index) => {
        let x = padding;
        const y = offsetY + padding + (index * lineHeight);
        
        // Números de línea
        if (pre.classList.contains('ps-con-lineas')) {
          ctx.fillStyle = 'rgba(156, 163, 175, 0.5)';
          ctx.font = '14px monospace';
          ctx.textAlign = 'right';
          ctx.fillText(String(index + 1), padding + 20, y);
          x += 40; 
        }
        
        // Pintar tokens
        const tokens = linea.querySelectorAll('span');
        ctx.textAlign = 'left';
        ctx.font = '14px monospace';
        
        if (tokens.length === 0) {
          ctx.fillStyle = textColor;
          ctx.fillText(linea.textContent, x, y);
        } else {
          tokens.forEach(token => {
            const tokenStyle = getComputedStyle(token);
            ctx.fillStyle = tokenStyle.color;
            if (tokenStyle.fontWeight === 'bold' || tokenStyle.fontWeight === '600') {
              ctx.font = 'bold 14px monospace';
            } else {
              ctx.font = '14px monospace';
            }
            const tokenText = token.textContent;
            ctx.fillText(tokenText, x, y);
            x += ctx.measureText(tokenText).width;
          });
        }
      });
      
      // Descargar
      try {
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = (pre.dataset.psEnc || 'codigo') + '.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
        console.error(e);
      }
    };
    
    // Añadir el botón a la barra
    bar.appendChild(b);
  });
});