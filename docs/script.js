/* =========================================================
   LandingDocs v1.0 — script.js
   Responsabilidades:
   1) Alternar entre la landing y la documentación.
   2) Generar el menú lateral desde las secciones del HTML.
   3) Inicializar preSintaxis.js y gestionar los temas de código.
   ========================================================= */
(() => {
  'use strict';

  /* ---------------------------------------------------------
     1. Referencias del DOM y estado
     --------------------------------------------------------- */
  const dom = {
    vistas: {
      inicio: document.getElementById('vista-inicio'),
      docs: document.getElementById('vista-docs'),
    },
    menu: document.getElementById('menu-docs'),
    contenido: document.getElementById('contenido-docs'),
    selectorTema: document.getElementById('selector-tema'),
    acciones: document.querySelectorAll('[data-accion]'),
    anio: document.getElementById('anio'),
    paginacion: document.getElementById('paginacion-docs'),
    botonSiguiente: document.getElementById('boton-siguiente'),
    siguienteTitulo: document.getElementById('siguiente-titulo'),
    menuPanel: document.getElementById('docs-lateral'),
    menuBoton: document.getElementById('alternar-menu'),
    menuCerrar: document.getElementById('cerrar-menu'),
    menuFondo: document.getElementById('fondo-menu'),
  };

  /** Módulos declarados en el HTML: fuente única de verdad del menú y las rutas. */
  const modulos = Array.from(dom.contenido.querySelectorAll('.doc-modulo'));

  /** La librería puede no estar disponible (CDN bloqueado): degradamos sin errores. */
  const hayResaltado = typeof window.preSintaxis !== 'undefined';

  const CLAVE_TEMA = 'landingdocs:tema';
  const TEMAS_VALIDOS = ['atom-one-dark', 'github-light', 'monokai', 'dracula', 'nord'];

  /* Temas propios que complementan al plugin oficial `temas.js`.
     Usan las variables semánticas que expone preSintaxis.js. */
  const TEMAS_EXTRA = {
    'atom-one-dark': {
      '--ps-encabezado': '#21252b',
      '--ps-contenido': '#282c34',
      '--ps-texto': '#abb2bf',
      '--ps-palabra': '#c678dd',
      '--ps-identificador': '#abb2bf',
      '--ps-operador': '#56b6c2',
      '--ps-delimitador': '#5c6370',
      '--ps-tipo': '#61afef',
      '--ps-valor': '#98c379',
      '--ps-comentario': '#5c6370',
    },
    monokai: {
      '--ps-encabezado': '#272822',
      '--ps-contenido': '#1e1f1c',
      '--ps-texto': '#f8f8f2',
      '--ps-palabra': '#f92672',
      '--ps-identificador': '#f8f8f2',
      '--ps-operador': '#f92672',
      '--ps-delimitador': '#75715e',
      '--ps-tipo': '#66d9ef',
      '--ps-valor': '#e6db74',
      '--ps-comentario': '#75715e',
    },
  };

  /* ---------------------------------------------------------
     2. Navegación entre vistas y módulos
     --------------------------------------------------------- */

  /** Muestra una vista y oculta la otra (landing o documentación). */
  const mostrarVista = (nombre) => {
    Object.entries(dom.vistas).forEach(([clave, seccion]) => {
      if (!seccion) return;
      const activa = clave === nombre;
      seccion.hidden = !activa;
      seccion.classList.toggle('vista--activa', activa);
    });
    document.body.dataset.vista = nombre;
  };

  /* Menú lateral deslizante (pantallas pequeñas) */
  const menuAbierto = () =>
    Boolean(dom.menuPanel && dom.menuPanel.classList.contains('esta-abierto'));

  /** Abre el panel y bloquea el desplazamiento del contenido de fondo. */
  const abrirMenu = () => {
    if (!dom.menuPanel) return;
    dom.menuPanel.classList.add('esta-abierto');
    if (dom.menuFondo) dom.menuFondo.hidden = false;
    if (dom.menuBoton) dom.menuBoton.setAttribute('aria-expanded', 'true');
    document.body.classList.add('sin-scroll');
    if (dom.menuCerrar) dom.menuCerrar.focus();
  };

  /** Cierra el panel y, si se pide, devuelve el foco al botón que lo abrió. */
  const cerrarMenu = ({ devolverFoco = false } = {}) => {
    if (!dom.menuPanel) return;
    dom.menuPanel.classList.remove('esta-abierto');
    if (dom.menuFondo) dom.menuFondo.hidden = true;
    if (dom.menuBoton) dom.menuBoton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('sin-scroll');
    if (devolverFoco && dom.menuBoton) dom.menuBoton.focus();
  };

  /** Activa un módulo, sincroniza el menú y (opcionalmente) desplaza la vista. */
  const mostrarModulo = (id, { desplazar = true } = {}) => {
    const destino = modulos.find((modulo) => modulo.id === id) || modulos[0];
    if (!destino) return;

    modulos.forEach((modulo) => {
      modulo.hidden = modulo !== destino;
    });

    Array.from(dom.menu.querySelectorAll('.menu-docs__enlace')).forEach((enlace) => {
      const activo = enlace.dataset.modulo === destino.id;
      enlace.classList.toggle('menu-docs__enlace--activo', activo);
      if (activo) {
        enlace.setAttribute('aria-current', 'true');
      } else {
        enlace.removeAttribute('aria-current');
      }
    });

    // Los bloques del módulo recién mostrado se procesan una sola vez
    iniciarResaltado(dom.contenido);

    // Botón "Siguiente": apunta al capítulo inmediato y se oculta en el último
    const indice = modulos.indexOf(destino);
    const siguiente = modulos[indice + 1];
    if (dom.paginacion && dom.botonSiguiente && dom.siguienteTitulo) {
      dom.paginacion.hidden = !siguiente;
      if (siguiente) {
        const titulo = siguiente.dataset.titulo || siguiente.id;
        dom.siguienteTitulo.textContent = titulo;
        dom.botonSiguiente.dataset.destino = siguiente.id;
        dom.botonSiguiente.setAttribute('aria-label', `Ir al siguiente capítulo: ${titulo}`);
      }
    }

    if (desplazar) {
      dom.contenido.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /** Actualiza la URL sin recargar y vuelve a enrutar (rutas tipo #doc-temas). */
  const navegar = (hash) => {
    if (location.hash !== `#${hash}`) {
      history.pushState(null, '', `#${hash}`);
    }
    enrutar();
  };

  /** Lee el hash actual y decide qué vista y qué módulo mostrar. */
  function enrutar() {
    // Un cambio de ruta nunca debe dejar el menú deslizante abierto
    cerrarMenu();

    const hash = location.hash.replace(/^#/, '');
    const modulo = modulos.find((item) => item.id === hash);
    const esDocumentacion = Boolean(modulo) || hash === 'documentacion';

    if (!esDocumentacion) {
      mostrarVista('inicio');
      // Al volver a la landing se restaura el inicio de la página
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    mostrarVista('docs');
    mostrarModulo(modulo ? modulo.id : modulos[0].id, { desplazar: true });
  }

  /* ---------------------------------------------------------
     3. Menú lateral autogenerado
     --------------------------------------------------------- */
  const construirMenu = () => {
    if (!dom.menu) return;

    const fragmento = document.createDocumentFragment();

    modulos.forEach((modulo) => {
      const enlace = document.createElement('a');
      enlace.className = 'menu-docs__enlace';
      enlace.href = `#${modulo.id}`;
      enlace.dataset.modulo = modulo.id;
      enlace.textContent = modulo.dataset.titulo || modulo.id;

      enlace.addEventListener('click', (evento) => {
        evento.preventDefault();
        cerrarMenu();
        navegar(modulo.id);
        // El foco pasa al contenido para que lectores de pantalla anuncien el cambio
        dom.contenido.focus({ preventScroll: true });
      });

      fragmento.appendChild(enlace);
    });

    dom.menu.appendChild(fragmento);
  };

  /* ---------------------------------------------------------
     4. Resaltado de sintaxis y temas
     --------------------------------------------------------- */

  /** Inicializa los bloques pendientes dentro de un contenedor concreto. */
  function iniciarResaltado(contenedor = document) {
    if (!hayResaltado) {
      console.warn('[LandingDocs] preSintaxis.js no está disponible: el código se muestra sin resaltar.');
      return;
    }
    window.preSintaxis.init(contenedor);
  }

  /** Sustituye el bloque :root que la librería inyecta en <head>. */
  const inyectarVariables = (variables) => {
    const estilos = document.getElementById('ps-estilos');
    if (!estilos) return false;

    const bloque = `:root {\n${Object.entries(variables)
      .map(([clave, valor]) => `  ${clave}: ${valor};`)
      .join('\n')}\n}`;

    estilos.textContent = estilos.textContent.replace(/:root\s*\{[\s\S]*?\}/, bloque);
    return true;
  };

  /** Aplica un tema: primero los propios y luego los del plugin oficial. */
  const aplicarTema = (nombre) => {
    if (TEMAS_EXTRA[nombre]) {
      inyectarVariables(TEMAS_EXTRA[nombre]);
      return;
    }
    if (window.preSintaxisTemas) {
      window.preSintaxisTemas.aplicar(nombre);
    }
  };

  // Recupera la preferencia guardada, si es válida
  const temaInicial = () => {
    let guardado = null;
    try {
      guardado = localStorage.getItem(CLAVE_TEMA);
    } catch (error) {
      guardado = null;
    }
    return TEMAS_VALIDOS.includes(guardado) ? guardado : dom.selectorTema.value;
  };

  const guardarTema = (nombre) => {
    try {
      localStorage.setItem(CLAVE_TEMA, nombre);
    } catch (error) {
      /* Almacenamiento no disponible: la preferencia dura solo la sesión */
    }
  };

  /* ---------------------------------------------------------
     5. Registro de eventos e inicio de la aplicación
     --------------------------------------------------------- */
  const enlazarEventos = () => {
    // Botones y enlaces con data-accion (marca, menú superior, llamado a la acción)
    dom.acciones.forEach((elemento) => {
      elemento.addEventListener('click', (evento) => {
        evento.preventDefault();
        navegar(elemento.getAttribute('href').replace(/^#/, ''));
      });
    });

    // Cambio manual de tema de código
    dom.selectorTema.addEventListener('change', () => {
      const nombre = dom.selectorTema.value;
      aplicarTema(nombre);
      guardarTema(nombre);
    });

    // Botones atrás/adelante del navegador
    window.addEventListener('popstate', enrutar);

    // Menú lateral deslizante en pantallas pequeñas
    if (dom.menuBoton) {
      dom.menuBoton.addEventListener('click', () => {
        if (menuAbierto()) {
          cerrarMenu({ devolverFoco: true });
        } else {
          abrirMenu();
        }
      });
    }

    if (dom.menuCerrar) {
      dom.menuCerrar.addEventListener('click', () => cerrarMenu({ devolverFoco: true }));
    }

    if (dom.menuFondo) {
      dom.menuFondo.addEventListener('click', () => cerrarMenu({ devolverFoco: true }));
    }

    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape' && menuAbierto()) {
        cerrarMenu({ devolverFoco: true });
      }
    });

    // Al volver a escritorio el panel debe quedar cerrado y sin bloquear el scroll
    window.addEventListener('resize', () => {
      if (window.matchMedia('(min-width: 961px)').matches) {
        cerrarMenu();
      }
    });

    // Botón "Siguiente" del final de cada capítulo
    if (dom.botonSiguiente) {
      dom.botonSiguiente.addEventListener('click', () => {
        const destino = dom.botonSiguiente.dataset.destino;
        if (!destino) return;
        navegar(destino);
        dom.contenido.focus({ preventScroll: true });
      });
    }
  };

  const iniciar = () => {
    // Año dinámico del pie de página
    if (dom.anio) {
      dom.anio.textContent = String(new Date().getFullYear());
    }

    construirMenu();
    enlazarEventos();

    // Procesa la landing (el bloque de ejemplo) y los módulos ya visibles
    iniciarResaltado(document);

    // El tema requiere que la librería haya inyectado #ps-estilos
    const tema = temaInicial();
    dom.selectorTema.value = tema;
    aplicarTema(tema);

    // Respeta el hash de entrada (#documentacion, #doc-temas, etc.)
    enrutar();
  };

  // El núcleo del resaltador ya escuchó DOMContentLoaded antes que nosotros,
  // por lo que sus estilos existen cuando se ejecuta este callback.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
