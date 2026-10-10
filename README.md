# preSintaxis.js

> librería minimalista de resaltado de sintaxis para HTML estático. Sin dependencias, sin build step, ~2 KB gzip. Soporta JavaScript, Python y CSS out-of-the-box, con API extensible para añadir más lenguajes.

[![npm version](https://img.shields.io/badge/npm-3.0.1-blue)](https://www.npmjs.com/package/presintaxis)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://github.com/TU-USUARIO/presintaxis/actions/workflows/ci.yml/badge.svg)](https://github.com/TU-USUARIO/presintaxis/actions)

---

## ¿Por qué otro resaltador?

Si solo necesitas **resaltar bloques `<pre><code>` en HTML estático** sin build step, sin config, sin sorpresas, este framework es para ti.

| Característica | preSintaxis | Prism | highlight.js |
|---|---|---|---|
| Tamaño (gzip) | **~2 KB** | ~2 KB core | ~10 KB core |
| Dependencias | **0** | 0 | 0 |
| Multi-línea | ✅ | ✅ | ✅ |
| Temas | ❌ | ✅ | ✅ |
| Lenguajes | 3 + custom | 200+ | 190+ |
| Build step | **No** | Opcional | Opcional |

---

## Instalación

### CDN (recomendado)

```html
<script src="https://cdn.jsdelivr.net/gh/TU-USUARIO/presintaxis@v3.0.1/dist/preSintaxis.js" defer></script>
```

### npm

```bash
npm install presintaxis
```

```js
import preSintaxis from 'presintaxis';
preSintaxis.init();
```

### Descarga directa

Descarga [`dist/preSintaxis.js`](dist/preSintaxis.js) y añádelo a tu proyecto.

---

## Uso

### Básico

```html
<pre data-nombre="app.js">
  <code data-sintaxis="javascript">
const saludo = "hola";
console.log(saludo);
  </code>
</pre>
```

Auto-inicializa al cargar. **No necesitas escribir JavaScript.**

### Con botones de copiar y descargar

```html
<pre data-nombre="app.js"
     data-ajuste="{copiar:'true', descargar:'true'}">
  <code data-sintaxis="javascript">
const x = 42;
  </code>
</pre>
```

### Con numeración y líneas resaltadas

```html
<pre data-ajuste="{lineas:'true', resaltar:'2-4'}">
  <code data-sintaxis="javascript">
const a = 1;
const b = 2;
const c = 3;
const d = 4;
  </code>
</pre>
```

### Con scroll vertical para bloques largos

```html
<pre data-ajuste="{maxlineas:'15', altura:'30rem'}">
  <code data-sintaxis="javascript">
// ... más de 15 líneas → scroll vertical
  </code>
</pre>
```

---

## Atributos HTML

### En el `<pre>`

| Atributo | Descripción |
|---|---|
| `data-nombre` | Nombre del archivo (se muestra como header) |
| `data-ajuste` | Objeto de configuración (ver abajo) |

### En el `<code>`

| Atributo | Descripción |
|---|---|
| `data-sintaxis` | Lenguaje del código (`javascript`, `python`, `css`, ...) |

### Ajustes disponibles en `data-ajuste`

| Clave | Valores | Descripción |
|---|---|---|
| `copiar` | `'true'` / `'false'` | Añade botón de copiar al portapapeles |
| `descargar` | `'true'` / `'false'` | Añade botón de descargar como archivo |
| `lineas` | `'true'` / `'false'` | Numeración de líneas |
| `resaltar` | `'1,3-5'` | Líneas a resaltar (soporta rangos) |
| `maxlineas` | `'20'` / `'0'` | Umbral para activar scroll (`0` = off) |
| `altura` | `'30rem'` | Altura máxima del scroll (`rem`, `em`, `px`, `vh`, `%`, `ch`) |

---

## API JavaScript

```js
preSintaxis.init();                            // Inicializa bloques
preSintaxis.init(document.getElementById('x'));// Solo en un contenedor
preSintaxis.destruir();                        // Revierte bloques
preSintaxis.definirSintaxis('rust', [...]);    // Registra lenguaje

preSintaxis.config.maxLineas = 30;             // Config global
preSintaxis.config.alturaMaxima = '40rem';

console.log(preSintaxis.version);              // "3.0.1"
```

### Ejemplo: registrar Rust

```js
preSintaxis.definirSintaxis('rust', [
  { tipo: 'comentario', regex: /\/\/[^\n]*/ },
  { tipo: 'texto',      regex: /"(?:[^"\\]|\\.)*"/ },
  { tipo: 'clave',      regex: /\b(?:fn|let|mut|const|struct|impl|trait|pub|use|mod|match|if|else|for|while|loop|return|self|as|where|async|await|dyn|in)\b/ },
  { tipo: 'funcion',    regex: /\b[A-Za-z_]\w*(?=\s*\()/ },
  { tipo: 'numero',     regex: /\b\d+(?:\.\d+)?\b/ }
]);
```

---

## Lenguajes incluidos

- **JavaScript** (incluye TypeScript por proximidad)
- **Python**
- **CSS**

Extiende con `definirSintaxis()`. Las reglas se aplican **en orden**: pon primero las de mayor prioridad (comentarios, strings, luego keywords).

---

## Tipos de token

| Tipo | Clase CSS | Default |
|---|---|---|
| Comentario | `.ps-comentario` | gris itálica |
| Texto (string) | `.ps-texto` | verde |
| Palabra clave | `.ps-clave` | rosa negrita |
| Función | `.ps-funcion` | azul |
| Número | `.ps-numero` | amarillo |

Puedes sobreescribir estos estilos en tu propio CSS.

---

## Compatibilidad

| Navegador | Versión mínima |
|---|---|
| Chrome / Edge | 88+ |
| Firefox | 78+ |
| Safari | 14+ |

Usa [named capture groups](https://caniuse.com/mdn-javascript_regular_expressions_named_capture_groups) (ES2018).

---

## Accesibilidad

- `role="region"` en cada bloque.
- `aria-label` descriptivo (usa `data-nombre` si está disponible).
- `tabindex="0"` permite foco por teclado y scroll con flechas.
- `:focus-visible` para el outline.

---

## Limitaciones conocidas

- **No es un parser real.** Tokenizador de regex ordenadas. Lenguajes con contexto complejo (JSX, HTML-in-JS, plantillas anidadas) se colorean de forma aproximada.
- **Rendimiento:** para bloques >500 líneas con muchas reglas puede degradarse. Divide el bloque o usa otra herramienta.
- **Sin temas predefinidos.** Solo el tema dark por defecto.

---

## Desarrollo

```bash
git clone https://github.com/TU-USUARIO/presintaxis.git
cd presintaxis
npm install
npm test
npx serve examples
# → http://localhost:3000/casos-de-uso.html
```

---

## Contribuir

1. Fork el repo.
2. Crea una rama (`git checkout -b feature/mi-feature`).
3. Commit (`git commit -am 'Add feature'`).
4. Push (`git push origin feature/mi-feature`).
5. Abre un Pull Request.

Asegúrate de que `npm test` pasa.

---

## License

MIT — ver [LICENSE](LICENSE).
