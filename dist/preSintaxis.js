/**
 * preSintaxis.js v1.0.2 — Core
 * Resaltado de sintaxis semántico optimizado.
 * 
 * @version 1.0.2
 * @license MIT
 */
(function (global) {
  'use strict';

  const reglasSintaxis = {};
  const pluginsCargados = {};
  const config = {};
  
  const HOOKS = ['antesDeTokenizar', 'despuesDeTokenizar', 'antesDeRenderizar', 'despuesDeRenderizar'];
  const hooks = {};
  HOOKS.forEach(h => hooks[h] = []);

  const ejecutarHook = (nombre, data) => {
    for (const fn of hooks[nombre]) {
      const out = fn(data);
      if (out !== undefined) data = out;
    }
    return data;
  };

  const ENTIDADES = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' };
  const escapar = (s) => s.replace(/[&<>"']/g, c => ENTIDADES[c]);

  const parseAjustes = (str) => {
    const out = {};
    if (!str) return out;
    const re = /([A-Za-z_]\w*)\s*:\s*(?:'([^']*)'|"([^"]*)"|([^,}]+?))\s*(?=,|}|$)/g;
    for (let m; (m = re.exec(str));) out[m[1]] = (m[2] ?? m[3] ?? m[4] ?? '').trim();
    return out;
  };

  const normalizarTexto = (raw) => {
    const lineas = raw.replace(/\r\n?/g, '\n').replace(/^\n/, '').replace(/\n[ \t]*$/, '').split('\n');
    const min = lineas.reduce((m, l) => l.trim() ? Math.min(m, l.search(/\S/)) : m, Infinity);
    return min > 0 && min < Infinity ? lineas.map(l => l.slice(min)).join('\n') : lineas.join('\n');
  };

  const tokenizar = (texto, rx, reglas) => {
    if (!rx) return texto.split('\n').map(l => [{ t:'plano', c:l }]);
    const tokens = [];
    let ultimo = 0, m;
    rx.lastIndex = 0;
    while ((m = rx.exec(texto))) {
      if (m.index === rx.lastIndex) { rx.lastIndex++; continue; }
      if (m.index > ultimo) tokens.push({ t:'plano', c: texto.slice(ultimo, m.index) });
      let tipo = 'plano';
      for (const k in m.groups) {
        if (m.groups[k] !== undefined) { tipo = reglas[+k.slice(1)].tipo; break; }
      }
      tokens.push({ t:tipo, c:m[0] });
      ultimo = rx.lastIndex;
    }
    if (ultimo < texto.length) tokens.push({ t:'plano', c: texto.slice(ultimo) });

    const lineas = [[]];
    for (const tok of tokens) {
      if (!tok.c.includes('\n')) {
        lineas[lineas.length - 1].push(tok);
      } else {
        const partes = tok.c.split('\n');
        for (let i = 0; i < partes.length; i++) {
          if (i > 0) lineas.push([]);
          if (partes[i] || i === 0) lineas[lineas.length - 1].push({ t: tok.t, c: partes[i] });
        }
      }
    }
    while (lineas.length > 1 && !lineas[lineas.length - 1].some(t => t.c)) lineas.pop();
    return lineas;
  };

  const CSS_BASE = `
    :root {
      --ps-encabezado:#1f2937;--ps-contenido:#111827;--ps-texto:#e5e7eb;
      --ps-palabra:#f472b6;--ps-identificador:#e5e7eb;--ps-operador:#94a3b8;
      --ps-delimitador:#6b7280;--ps-tipo:#38bdf8;--ps-valor:#a3e635;--ps-comentario:#6b7280;
    }
    pre[data-sintaxis-listo] { background:var(--ps-contenido);color:var(--ps-texto);border:1px solid color-mix(in srgb,var(--ps-encabezado) 60%,transparent);border-radius:8px;margin:1rem 0;padding:0;font:.875rem/1.5 monospace;overflow:hidden;position:relative;display:flex;flex-direction:column; }
    pre[data-sintaxis-listo][data-encabezado]::before { content:attr(data-encabezado);display:block;flex:0 0 auto;padding:.5rem 1rem;color:var(--ps-texto);font-size:.75rem;font-weight:bold;border-bottom:1px solid color-mix(in srgb,var(--ps-encabezado) 60%,transparent);background:var(--ps-encabezado); }
    pre[data-sintaxis-listo] > code { display:block;flex:1 1 auto;min-height:0;margin:0;padding:0;font:inherit;color:inherit;background:transparent;overflow:hidden; }
    pre[data-sintaxis-listo] > code > .ps-contenido { display:block;padding:.25rem 0;overflow-x:auto;overflow-y:visible; }
    .ps-linea { display:block;padding:.125rem 1rem;margin:0;font-size:.875rem;line-height:1.5;min-height:calc(1.5em + .25rem);white-space:pre-wrap; }
    .ps-linea:empty::after { content:"\\200B"; }
    pre.ps-con-lineas .ps-linea { counter-increment:ps-linea; display:table-row; }
    pre.ps-con-lineas .ps-linea::before { content:counter(ps-linea);display:table-cell;text-align:right;padding:0 .75rem 0 1rem;color:color-mix(in srgb,var(--ps-texto) 40%,transparent);user-select:none;width:1%;font-size:.875rem;line-height:1.5;vertical-align:top; }
    .ps-btn-bar { position:absolute;top:.4rem;right:.75rem;display:flex;gap:.3rem;z-index:2; }
    .ps-btn { background:color-mix(in srgb,var(--ps-texto) 15%,transparent);border:1px solid color-mix(in srgb,var(--ps-encabezado) 60%,transparent);color:var(--ps-texto);padding:4px 6px;border-radius:4px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:background .2s; }
    .ps-btn:hover { background:color-mix(in srgb,var(--ps-texto) 25%,transparent); }
    .ps-btn:focus-visible { outline:2px solid var(--ps-tipo);outline-offset:2px; }
    .ps-palabra{color:var(--ps-palabra);font-weight:600} .ps-identificador{color:var(--ps-identificador)} .ps-operador{color:var(--ps-operador)} .ps-delimitador{color:var(--ps-delimitador)} .ps-tipo{color:var(--ps-tipo);font-weight:500} .ps-valor{color:var(--ps-valor)} .ps-comentario{color:var(--ps-comentario);font-style:italic}
  `;

  const inyectarEstilosBase = () => {
    if (document.getElementById('ps-estilos')) return;
    const style = document.createElement('style');
    style.id = 'ps-estilos';
    style.textContent = CSS_BASE;
    document.head.appendChild(style);
  };

  const SVG = {
    copiar: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    exito:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
  };

  const copiarAlPortapapeles = async (txt) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(txt);
        return true;
      }
    } catch (_) {}
    try {
      const ta = document.createElement('textarea');
      ta.value = txt; ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (_) { return false; }
  };

  const crearBotonCopiar = (texto) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ps-btn'; b.setAttribute('aria-label', 'Copiar código'); b.innerHTML = SVG.copiar;
    b.onclick = async () => {
      if (await copiarAlPortapapeles(texto)) {
        b.innerHTML = SVG.exito; setTimeout(() => { b.innerHTML = SVG.copiar; }, 2000);
      }
    };
    return b;
  };

  const procesarBloque = (pre) => {
    if (pre.hasAttribute('data-sintaxis-listo')) return;
    const code = pre.querySelector('code');
    if (!code) return;

    const lenguaje = (code.getAttribute('data-sintaxis') || code.getAttribute('data-lang') || 'texto').toLowerCase().trim();
    if (!pre.dataset.psEnc) pre.dataset.psEnc = (pre.getAttribute('data-encabezado') || '').trim();
    const encabezado = pre.dataset.psEnc;

    const ajustes = parseAjustes(pre.getAttribute('data-ajuste'));
    let texto = normalizarTexto(code.dataset.psOriginal || code.textContent);
    code.dataset.psOriginal = texto;

    const ctx1 = ejecutarHook('antesDeTokenizar', { lenguaje, texto, code, pre, ajustes });
    const lenguajeFinal = ctx1.lenguaje || lenguaje;
    const textoFinal = ctx1.texto !== undefined ? ctx1.texto : texto;

    const reglas = reglasSintaxis[lenguajeFinal];
    const rx = reglas ? new RegExp(reglas.map((r, i) => `(?<r${i}>${r.regex.source})`).join('|'), 'g') : null;
    
    let lineas = tokenizar(textoFinal, rx, reglas || []);
    const ctx2 = ejecutarHook('despuesDeTokenizar', { lineas, lenguaje: lenguajeFinal, code, pre, ajustes });
    if (ctx2.lineas) lineas = ctx2.lineas;

    let html = lineas.map(tks => {
      const c = tks.map(t => t.t === 'plano' ? escapar(t.c) : `<span class="ps-${t.t}">${escapar(t.c)}</span>`).join('&#8203;'); 
      return `<span class="ps-linea">${c}</span>`;
    }).join('');

    const ctx3 = ejecutarHook('antesDeRenderizar', { html, lineas, lenguaje: lenguajeFinal, code, pre, ajustes });
    if (ctx3.html !== undefined) html = ctx3.html;

    pre.setAttribute('data-sintaxis-listo', 'true');
    pre.setAttribute('role', 'region');
    pre.setAttribute('tabindex', '0');
    pre.setAttribute('aria-label', encabezado ? `Código: ${encabezado}` : `Bloque de código ${lenguajeFinal}`);
    if (encabezado) pre.setAttribute('data-encabezado', encabezado);
    pre.classList.toggle('ps-con-lineas', ajustes.lineas === 'true');

    code.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'ps-contenido';
    wrapper.innerHTML = html;
    code.appendChild(wrapper);

    pre.querySelector('.ps-btn-bar')?.remove();
    if (ajustes.copiar === 'true') {
      const bar = document.createElement('div');
      bar.className = 'ps-btn-bar';
      bar.appendChild(crearBotonCopiar(textoFinal));
      pre.appendChild(bar);
    }
    ejecutarHook('despuesDeRenderizar', { code, wrapper, pre, lineas, lenguaje: lenguajeFinal, ajustes, texto: textoFinal });
  };

  const registrarSintaxis = (lang, reglas) => {
    if (typeof lang !== 'string' || !Array.isArray(reglas)) return api;
    const k = lang.toLowerCase().trim();
    if (!k) return api;
    reglasSintaxis[k] = reglas;
    return api;
  };

  const registrarPlugin = (nombre, fn) => {
    if (!pluginsCargados[nombre] && typeof fn === 'function') {
      pluginsCargados[nombre] = true;
      fn(api);
    }
    return api;
  };

  const hook = (nombre) => ({
    registrar: (fn) => {
      if (!hooks[nombre]) hooks[nombre] = [];
      if (typeof fn === 'function') hooks[nombre].push(fn);
      return api;
    }
  });

  const init = (root = document) => {
    inyectarEstilosBase();
    root.querySelectorAll('pre:not([data-sintaxis-listo])').forEach(procesarBloque);
    return api;
  };

  const destruir = (selector = 'pre[data-sintaxis-listo]') => {
    document.querySelectorAll(selector).forEach(pre => {
      ['data-sintaxis-listo','role','aria-label','tabindex'].forEach(a => pre.removeAttribute(a));
      pre.classList.remove('ps-con-lineas');
      pre.querySelector('.ps-btn-bar')?.remove();
      const code = pre.querySelector('code');
      if (code?.dataset.psOriginal !== undefined) code.textContent = code.dataset.psOriginal;
    });
    return api;
  };

  const api = { version: '1.0.2', config, registrarSintaxis, registrarPlugin, hook, init, destruir };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();

  global.preSintaxis = api;
})(typeof window !== 'undefined' ? window : globalThis);