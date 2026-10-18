preSintaxis.registrarPlugin('temas', (api) => {
  const TEMAS = {
    dracula: {
      '--ps-encabezado':'#282a36', '--ps-contenido':'#1e1f29', '--ps-texto':'#f8f8f2',
      '--ps-palabra':'#ff79c6', '--ps-identificador':'#f8f8f2', '--ps-operador':'#ff79c6',
      '--ps-delimitador':'#6272a4', '--ps-tipo':'#8be9fd', '--ps-valor':'#f1fa8c', '--ps-comentario':'#6272a4'
    },
    nord: {
      '--ps-encabezado':'#2e3440', '--ps-contenido':'#242933', '--ps-texto':'#d8dee9',
      '--ps-palabra':'#81a1c1', '--ps-identificador':'#d8dee9', '--ps-operador':'#81a1c1',
      '--ps-delimitador':'#4c566a', '--ps-tipo':'#8fbcbb', '--ps-valor':'#a3be8c', '--ps-comentario':'#616e88'
    },
    'github-light': {
      '--ps-encabezado':'#f6f8fa', '--ps-contenido':'#ffffff', '--ps-texto':'#24292f',
      '--ps-palabra':'#cf222e', '--ps-identificador':'#24292f', '--ps-operador':'#0550ae',
      '--ps-delimitador':'#6e7781', '--ps-tipo':'#953800', '--ps-valor':'#0a3069', '--ps-comentario':'#6e7781'
    }
  };

  const aplicarTema = (nombre) => {
    const tema = TEMAS[nombre];
    if (!tema) return;

    const styleEl = document.getElementById('ps-estilos');
    if (!styleEl) return;

    // Construye el nuevo bloque :root
    let varsCSS = `:root {\n`;
    for (const [clave, valor] of Object.entries(tema)) {
      varsCSS += `  ${clave}: ${valor};\n`;
    }
    varsCSS += `}`;

    // Reemplaza el bloque :root en el CSS inyectado
    styleEl.textContent = styleEl.textContent.replace(/:root\s*\{[\s\S]*?\}/, varsCSS);
  };

  window.preSintaxisTemas = { aplicar: aplicarTema, temas: Object.keys(TEMAS) };
});