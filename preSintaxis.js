/**
 * preSintaxis.js v3.0.1
 * @version 3.0.1
 * @license MIT
 */
(function (global) {
  'use strict';

  const config = Object.seal({
    maxLineas: 20,
    alturaMaxima: '24rem'
  });

  const reglasSintaxis = {
    javascript: [
      { tipo: 'comentario', regex: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
      { tipo: 'texto',      regex: /`[\s\S]*?`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/ },
      { tipo: 'clave',      regex: /\b(?:const|let|var|function|return|if|else|for|while|class|new|import|export|async|await|try|catch|throw|switch|case|break|continue|typeof|instanceof|this|super|extends)\b/ },
      { tipo: 'funcion',    regex: /\b[A-Za-z_$][\w$]*(?=\s*\()/ },
      { tipo: 'numero',     regex: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/ }
    ],
    python: [
      { tipo: 'comentario', regex: /#[^\n]*|"""[\s\S]*?"""|'''[\s\S]*?'''/ },
      { tipo: 'texto',      regex: /[rbfu]?"(?:[^"\\]|\\.)*"|[rbfu]?'(?:[^'\\]|\\.)*'/ },
      { tipo: 'clave',      regex: /\b(?:def|return|if|else|elif|for|while|in|as|class|import|from|with|try|except|finally|raise|lambda|yield|pass|break|continue|and|or|not|is|None|True|False|async|await|global|nonlocal|assert|del)\b/ },
      { tipo: 'funcion',    regex: /\b[A-Za-z_]\w*(?=\s*\()/ },
      { tipo: 'numero',     regex: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/ }
    ],
    css: [
      { tipo: 'comentario', regex: /\/\*[\s\S]*?\*\// },
      { tipo: 'texto',      regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/ },
      { tipo: 'funcion',    regex: /[\w\-]+(?=\s*:)/ },
      { tipo: 'numero',     regex: /#[a-fA-F0-9]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms)?\b/ }
    ]
  };

  const cache = new Map();

  const compilar = (lenguaje) => {
    if (cache.has(lenguaje)) {
      const rx = cache.get(lenguaje);
      cache.delete(lenguaje); cache.set(lenguaje, rx);
      return rx;
    }
    const reglas = reglasSintaxis[lenguaje];
    if (!reglas) return null;
    const rx = new RegExp(
      reglas.map((r, i) => `(?<r${i}>${r.regex.source})`).join('|'),
      'g'
    );
    cache.set(lenguaje, rx);
    if (cache.size > 32) cache.delete(cache.keys().next().value);
    return rx;
  };

  const ENTIDADES = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' };
  const escapar = (s) => s.replace(/[&<>"']/g, c => ENTIDADES[c]);

  const parseAjustes = (str) => {
    const out = {};
    if (!str) return out;
    const re = /([A-Za-z_]\w*)\s*:\s*(?:'([^']*)'|"([^"]*)"|([^,}]+?))\s*(?=,|}|$)/g;
    let m;
    while ((m = re.exec(str))) out[m[1]] = (m[2] ?? m[3] ?? m[4] ?? '').trim();
    return out;
  };

  const parseRangos = (str) => {
    const s = new Set();
    if (!str) return s;
    for (const b of String(str).split(',')) {
      const [a, z] = b.trim().split('-');
      const i = parseInt(a, 10);
      const f = z !== undefined ? parseInt(z, 10) : i;
      if (Number.isFinite(i) && Number.isFinite(f))
        for (let x = Math.min(i, f); x <= Math.max(i, f); x++) s.add(x);
    }
    return s;
  };

  const alturaSegura = (v) =>
    typeof v === 'string' && /^\d+(?:\.\d+)?(?:rem|em|px|vh|%|ch)$/.test(v.trim())
      ? v.trim()
      : null;

  const tokenizar = (texto, rx, reglas) => {
    if (!rx) return texto.split('\n').map(l => [{ t: 'plano', c: l }]);
    const tokens = [];
    let ultimo = 0, m;
    rx.lastIndex = 0;
    while ((m = rx.exec(texto))) {
      if (m.index === rx.lastIndex) { rx.lastIndex++; continue; }
      if (m.index > ultimo) tokens.push({ t: 'plano', c: texto.slice(ultimo, m.index) });
      let tipo = 'plano';
      for (const k in m.groups)
        if (m.groups[k] !== undefined) { tipo = reglas[+k.slice(1)].tipo; break; }
      tokens.push({ t: tipo, c: m[0] });
      ultimo = rx.lastIndex;
    }
    if (ultimo < texto.length) tokens.push({ t: 'plano', c: texto.slice(ultimo) });

    const lineas = [[]];
    for (const tok of tokens) {
      const partes = tok.c.split('\n');
      partes.forEach((p, i) => {
        if (i > 0) lineas.push([]);
        lineas[lineas.length - 1].push({ t: tok.t, c: p });
      });
    }
    return lineas;
  };

  const inyectarEstilos = () => {
    if (document.getElementById('ps-estilos')) return;
    const style = document.createElement('style');
    style.id = 'ps-estilos';
    style.textContent = `
      pre[data-sintaxis-listo] {
        background:#111827; color:#e5e7eb; border:1px solid #1f2937;
        border-radius:8px; padding:.75rem 0; font:.875rem/1.5 monospace;
        overflow:hidden; position:relative; margin:1rem 0; tab-size:4;
        display:flex; flex-direction:column;
      }
      pre[data-sintaxis-listo]:focus-visible { outline:2px solid #38bdf8; outline-offset:2px; }
      pre[data-sintaxis-listo][data-header]::before {
        content:attr(data-header); flex:0 0 auto;
        padding:0 1rem .5rem; color:#9ca3af; font-size:.75rem;
        border-bottom:1px solid #1f2937; margin-bottom:.5rem; font-weight:bold;
      }
      .ps-contenido { flex:1 1 auto; overflow-x:auto; overflow-y:visible; min-height:0; }
      pre[data-scroll-vertical] .ps-contenido {
        max-height:var(--ps-max-altura,24rem); overflow-y:auto;
      }
      .ps-btn-bar {
        position:absolute; top:.4rem; right:.75rem;
        display:flex; gap:.3rem; z-index:3;
      }
      .ps-btn {
        background:#1f2937; border:1px solid #374151; color:#9ca3af;
        padding:4px 6px; border-radius:4px; cursor:pointer;
        display:flex; align-items:center; justify-content:center;
        transition:all .2s;
      }
      .ps-btn:hover { background:#374151; color:#f3f4f6; }
      .ps-btn:focus-visible { outline:2px solid #38bdf8; outline-offset:2px; }
      pre.ps-con-lineas .ps-linea { counter-increment:ps-linea; display:table-row; }
      pre.ps-con-lineas .ps-linea::before {
        content:counter(ps-linea); display:table-cell; text-align:right;
        padding:0 .75rem 0 1rem; color:#4b5563; user-select:none; width:1%;
      }
      .ps-linea { display:block; padding-right:1rem; }
      pre[data-sintaxis-listo]:not(.ps-con-lineas) .ps-linea { padding-left:1rem; }
      .ps-resaltada {
        background:rgba(56,189,248,.15); border-left:3px solid #38bdf8;
      }
      pre[data-scroll-vertical] .ps-contenido::-webkit-scrollbar { width:8px; height:8px; }
      pre[data-scroll-vertical] .ps-contenido::-webkit-scrollbar-track { background:transparent; }
      pre[data-scroll-vertical] .ps-contenido::-webkit-scrollbar-thumb {
        background:#374151; border-radius:4px;
      }
      pre[data-scroll-vertical] .ps-contenido::-webkit-scrollbar-thumb:hover { background:#4b5563; }
      pre[data-scroll-vertical] .ps-contenido { scrollbar-width:thin; scrollbar-color:#374151 transparent; }
      .ps-clave { color:#f472b6; font-weight:600; }
      .ps-texto { color:#a3e635; }
      .ps-comentario { color:#6b7280; font-style:italic; }
      .ps-numero { color:#fbbf24; }
      .ps-funcion { color:#38bdf8; }
    `;
    document.head.appendChild(style);
  };

  const SVG = {
    copiar: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    exito:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    desc:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`
  };

  const copiar = async (txt) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(txt);
        return true;
      }
    } catch (_) {}
    try {
      const ta = document.createElement('textarea');
      ta.value = txt; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (_) { return false; }
  };

  const descargar = (texto, nombre) => {
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = nombre; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const procesarBloque = (pre) => {
    if (pre.hasAttribute('data-sintaxis-listo')) return;
    const code = pre.querySelector('code');
    if (!code) return;

    const lenguaje = (code.getAttribute('data-sintaxis') || 'texto').toLowerCase().trim();
    const nombre = (pre.getAttribute('data-nombre') || '').trim();
    const ajustes = parseAjustes(pre.getAttribute('data-ajuste'));
    const resaltados = parseRangos(ajustes.resaltar);

    let maxLineas = config.maxLineas;
    if ('maxlineas' in ajustes) {
      const n = parseInt(ajustes.maxlineas, 10);
      if (Number.isFinite(n)) maxLineas = n;
    }
    const altura = alturaSegura(ajustes.altura) || config.alturaMaxima;

    const lineas = code.textContent
      .replace(/\r\n?/g, '\n')
      .replace(/^\n/, '')
      .replace(/\n[ \t]*$/, '')
      .split('\n');
    const minIndent = lineas.reduce((m, l) => l.trim() ? Math.min(m, l.search(/\S/)) : m, Infinity);
    const texto = minIndent > 0 && minIndent < Infinity
      ? lineas.map(l => l.slice(minIndent)).join('\n')
      : lineas.join('\n');

    const rx = compilar(lenguaje);
    const reglas = reglasSintaxis[lenguaje] || [];
    const lineasTokens = tokenizar(texto, rx, reglas);

    const html = lineasTokens.map((tks, i) => {
      const contenido = tks.map(t =>
        t.t === 'plano' ? escapar(t.c) : `<span class="ps-${t.t}">${escapar(t.c)}</span>`
      ).join('');
      const res = resaltados.has(i + 1) ? ' ps-resaltada' : '';
      return `<span class="ps-linea${res}">${contenido}</span>`;
    }).join('');

    pre.setAttribute('data-sintaxis-listo', 'true');
    pre.setAttribute('role', 'region');
    pre.setAttribute('tabindex', '0');
    pre.setAttribute('aria-label', nombre ? `Código: ${nombre}` : `Bloque de código ${lenguaje}`);
    if (nombre) pre.setAttribute('data-header', nombre);
    if (ajustes.lineas === 'true') pre.classList.add('ps-con-lineas');

    if (maxLineas > 0 && lineasTokens.length > maxLineas) {
      pre.setAttribute('data-scroll-vertical', 'true');
      pre.style.setProperty('--ps-max-altura', altura);
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'ps-contenido';
    wrapper.innerHTML = html;
    pre.innerHTML = '';
    pre.appendChild(wrapper);

    const btnCopiar = ajustes.copiar === 'true';
    const btnDescargar = ajustes.descargar === 'true';
    if (!btnCopiar && !btnDescargar) return;

    const bar = document.createElement('div');
    bar.className = 'ps-btn-bar';

    if (btnCopiar) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'ps-btn';
      b.setAttribute('aria-label', 'Copiar código');
      b.innerHTML = SVG.copiar;
      b.onclick = async () => {
        const ok = await copiar(texto);
        b.innerHTML = ok ? SVG.exito : SVG.copiar;
        setTimeout(() => b.innerHTML = SVG.copiar, 2000);
      };
      bar.appendChild(b);
    }

    if (btnDescargar) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'ps-btn';
      b.setAttribute('aria-label', 'Descargar código');
      b.innerHTML = SVG.desc;
      b.onclick = () => descargar(texto, nombre || `codigo.${lenguaje || 'txt'}`);
      bar.appendChild(b);
    }

    pre.appendChild(bar);
  };

  const definirSintaxis = (lang, reglas) => {
    if (typeof lang !== 'string' || !Array.isArray(reglas)) return api;
    const k = lang.toLowerCase().trim();
    if (!k) return api;
    for (const r of reglas) {
      if (!r || typeof r.tipo !== 'string' || !(r.regex instanceof RegExp)) {
        console.warn('[preSintaxis] Regla inválida en lenguaje "' + k + '":', r);
        return api;
      }
    }
    reglasSintaxis[k] = reglas;
    cache.delete(k);
    return api;
  };

  const init = (root = document) => {
    inyectarEstilos();
    root.querySelectorAll('pre:not([data-sintaxis-listo])').forEach(procesarBloque);
    return api;
  };

  const destruir = (selector = 'pre[data-sintaxis-listo]') => {
    document.querySelectorAll(selector).forEach(pre => {
      ['data-sintaxis-listo','data-header','data-scroll-vertical','role','aria-label','tabindex']
        .forEach(a => pre.removeAttribute(a));
      pre.classList.remove('ps-con-lineas');
      pre.style.removeProperty('--ps-max-altura');
      pre.querySelector('.ps-btn-bar')?.remove();
      const w = pre.querySelector('.ps-contenido');
      if (w) pre.innerHTML = w.innerHTML;
    });
    return api;
  };

  const api = { version: '3.0.1', config, init, destruir, definirSintaxis };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init());
  } else {
    init();
  }

  global.preSintaxis = api;
})(typeof window !== 'undefined' ? window : globalThis);