# preSintaxis.js

preSintaxis.js es una librería minimalista de resaltado de sintaxis para HTML estático. Sin dependencias, sin build step, ~2 KB gzip. Soporta JavaScript, Python y CSS out-of-the-box, con API extensible para añadir más lenguajes.

---

## Instalación

### CDN

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

## Uso básico

```html
<pre data-nombre="app.js">
  <code data-sintaxis="javascript">
const saludo = "hola";
console.log(saludo);
  </code>
</pre>
```

La librería se auto-inicializa al cargar la página. No necesitas escribir JavaScript.

---

## Atributos HTML

### `<pre>`

| Atributo | Tipo | Descripción |
|---|---|---|
| `data-nombre` | string | Nombre del archivo. Se muestra como header del bloque. |
| `data-ajuste` | objeto | Configuración del bloque (ver tabla abajo). |

### `<code>`

| Atributo | Tipo | Descripción |
|---|---|---|
| `data-sintaxis` | string | Lenguaje del código: `javascript`, `python`, `css`, o uno registrado con `definirSintaxis()`. |

---

## Ajustes (`data-ajuste`)

Se pasan como objeto literal dentro del atributo:

```html
<pre data-ajuste="{copiar:'true', lineas:'true', resaltar:'2-4'}">
```

| Clave | Valores | Default | Descripción |
|---|---|---|---|
| `copiar` | `'true'` / `'false'` | `false` | Añade botón para copiar el código al portapapeles. |
| `descargar` | `'true'` / `'false'` | `false` | Añade botón para descargar el código como archivo. |
| `lineas` | `'true'` / `'false'` | `false` | Muestra numeración de líneas. |
| `resaltar` | `'1'`, `'2-4'`, `'1,3-5'` | — | Resalta líneas específicas. Acepta números, rangos y listas separadas por coma. |
| `maxlineas` | `'20'` / `'0'` | `20` | Umbral de líneas para activar scroll vertical. `'0'` desactiva el scroll. |
| `altura` | `'30rem'` | `24rem` | Altura máxima del área scrollable. Unidades: `rem`, `em`, `px`, `vh`, `%`, `ch`. |

### Ejemplo completo

```html
<pre data-nombre="ejemplo.js"
     data-ajuste="{copiar:'true', descargar:'true', lineas:'true', resaltar:'2-3', maxlineas:'15', altura:'30rem'}">
  <code data-sintaxis="javascript">
const a = 1;
const b = 2;
const c = 3;
const d = 4;
  </code>
</pre>
```

---

## API JavaScript

### `preSintaxis.init(root?)`

Procesa todos los bloques `<pre>` no procesados dentro de `root` (por defecto `document`). Se llama automáticamente al cargar la página.

```js
preSintaxis.init();                             // toda la página
preSintaxis.init(document.getElementById('x')); // solo en un contenedor
```

### `preSintaxis.destruir(selector?)`

Revierte los bloques a su estado original. Útil para SPAs que reemplazan contenido.

```js
preSintaxis.destruir();                    // todos los bloques
preSintaxis.destruir('#mi-seccion pre');   // solo los que matcheen
```

### `preSintaxis.definirSintaxis(lenguaje, reglas)`

Registra un lenguaje nuevo o redefine uno existente.

```js
preSintaxis.definirSintaxis('rust', [
  { tipo: 'comentario', regex: /\/\/[^\n]*/ },
  { tipo: 'texto',      regex: /"(?:[^"\\]|\\.)*"/ },
  { tipo: 'clave',      regex: /\b(?:fn|let|mut|const|struct|impl|trait|pub|use|mod|match|if|else|for|while|loop|return|self|as|where|async|await|dyn|in)\b/ },
  { tipo: 'funcion',    regex: /\b[A-Za-z_]\w*(?=\s*\()/ },
  { tipo: 'numero',     regex: /\b\d+(?:\.\d+)?\b/ }
]);
```

**Reglas:**

- `reglas` es un array de `{ tipo, regex }`.
- `tipo` debe ser uno de los tipos soportados (ver sección Tipos de token).
- `regex` debe ser una instancia de `RegExp`.
- **El orden importa.** Las reglas se aplican en el orden declarado. Pon primero las de mayor prioridad (comentarios antes que strings, strings antes que keywords).
- Si alguna regla es inválida, se emite un `console.warn` y no se registra el lenguaje.

### `preSintaxis.config`

Objeto con configuración global. Modificable en runtime.

```js
preSintaxis.config.maxLineas = 30;         // nuevo umbral por defecto
preSintaxis.config.alturaMaxima = '40rem'; // nueva altura por defecto
```

| Propiedad | Default | Descripción |
|---|---|---|
| `maxLineas` | `20` | Umbral global de líneas para activar scroll vertical. |
| `alturaMaxima` | `'24rem'` | Altura máxima global del área scrollable. |

### `preSintaxis.version`

Devuelve la versión actual como string.

```js
console.log(preSintaxis.version); // "3.0.1"
```

---

## Lenguajes incluidos

| Lenguaje | `data-sintaxis` |
|---|---|
| JavaScript (incluye TypeScript por proximidad) | `javascript` |
| Python | `python` |
| CSS | `css` |

Los lenguajes se registran con `definirSintaxis()`. Las reglas se aplican en orden secuencial.

---

## Tipos de token

| Tipo | Clase CSS | Color por defecto |
|---|---|---|
| Comentario | `.ps-comentario` | gris con itálica |
| Texto (string) | `.ps-texto` | verde |
| Palabra clave | `.ps-clave` | rosa con negrita |
| Función | `.ps-funcion` | azul |
| Número | `.ps-numero` | amarillo |

Para personalizar los colores, sobreescribe las clases en tu propio CSS:

```css
.ps-clave { color: #ff0000; }
.ps-texto { color: #00ff00; }
```

---

## Estructura del DOM generado

Para cada `<pre>` procesado, la librería:

1. Añade `data-sintaxis-listo="true"` al `<pre>`.
2. Añade `role="region"`, `tabindex="0"` y `aria-label` al `<pre>`.
3. Si hay `data-nombre`, añade `data-header` al `<pre>`.
4. Envuelve el contenido en un `<div class="ps-contenido">`.
5. Cada línea se convierte en `<span class="ps-linea">`.
6. Cada token se envuelve en `<span class="ps-[tipo]">`.
7. Si `copiar` o `descargar` están activos, añade `<div class="ps-btn-bar">` con los botones.
8. Si hay scroll vertical, añade `data-scroll-vertical="true"` y la variable CSS `--ps-max-altura`.

---

## CSS inyectado

La librería inyecta un `<style id="ps-estilos">` en el `<head>` la primera vez que se llama a `init()`. Solo se inyecta una vez, aunque se llame a `init()` múltiples veces.

Clases generadas:

- `pre[data-sintaxis-listo]` — contenedor principal.
- `.ps-contenido` — wrapper del código (área con scroll vertical).
- `.ps-linea` — cada línea.
- `.ps-resaltada` — línea resaltada.
- `.ps-btn-bar` — contenedor de botones.
- `.ps-btn` — botón de copiar o descargar.
- `.ps-clave`, `.ps-texto`, `.ps-comentario`, `.ps-numero`, `.ps-funcion` — tokens.

Atributos en el `<pre>`:

- `data-sintaxis-listo` — marca el bloque como procesado.
- `data-header` — nombre del archivo.
- `data-scroll-vertical` — indica que el bloque tiene scroll vertical.

---

## Compatibilidad

| Navegador | Versión mínima |
|---|---|
| Chrome / Edge | 88+ |
| Firefox | 78+ |
| Safari | 14+ |

Usa [named capture groups](https://caniuse.com/mdn-javascript_regular_expressions_named_capture_groups) en regex (ES2018).

---

## Accesibilidad

- Cada bloque tiene `role="region"` y `aria-label` descriptivo.
- `tabindex="0"` permite foco por teclado y scroll con flechas.
- Los botones tienen `aria-label` y `type="button"`.
- `:focus-visible` muestra outline en `<pre>` y botones.

---

## Limitaciones

- **No es un parser real.** Es un tokenizador de expresiones regulares aplicadas en orden. Lenguajes con contexto complejo (JSX, HTML-in-JS, plantillas anidadas) se colorean de forma aproximada.
- **Rendimiento:** para bloques >500 líneas con muchas reglas, el motor de regex puede degradarse. Divide el bloque o usa otra herramienta.
- **Sin temas predefinidos.** Solo colores por defecto. Personaliza sobreescribiendo las clases CSS.
- **Sin detección automática de lenguaje.** Requiere `data-sintaxis` explícito.

---

## Notas de implementación

### Cómo funciona el tokenizador

1. Se limpia el texto (CRLF → LF, eliminar sangría común).
2. Se compila una `RegExp` combinada a partir de las reglas del lenguaje, con grupos con nombre (`r0`, `r1`, ...) para identificar qué regla matcheó.
3. Se recorre el texto completo (no línea por línea) aplicando la `RegExp`.
4. Cada match se guarda como `{ tipo, contenido }`. El texto entre matches se marca como `plano`.
5. Los tokens se dividen por líneas (`\n`) y se distribuyen.
6. Cada token se escapa para HTML y se envuelve en su `<span>` correspondiente.

Este diseño permite multi-línea correcto (comentarios `/* */`, template strings con backticks, docstrings de Python).

### Por qué se escapa después de tokenizar

Si se escapara antes (convirtiendo `<` en `&lt;`), las regex que buscan strings o comentarios fallarían al coincidir con el contenido escapado. Al tokenizar sobre texto crudo y escapar cada token individualmente, el coloreado es correcto incluso cuando hay HTML dentro de strings.

### Caché de regex

Los `RegExp` compilados se guardan en un `Map` con política LRU (máximo 32 entradas). Si se registran muchos lenguajes dinámicamente, los más antiguos se eliminan automáticamente.

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

### Comandos

| Comando | Descripción |
|---|---|
| `npm test` | Ejecuta los tests con Vitest. |
| `npm run test:watch` | Tests en modo watch. |
| `npm run test:coverage` | Tests con cobertura. |
| `npm run serve` | Sirve la suite de casos de uso en local. |

---

## Tests

La suite de tests cubre:

- API pública (`init`, `destruir`, `definirSintaxis`, `version`, `config`).
- Renderizado básico y tipos de token.
- Escapado de HTML y strings.
- Todos los ajustes de `data-ajuste`.
- Comportamiento multi-línea.
- Normalización de CRLF.
- Accesibilidad (`role`, `aria-label`, `tabindex`).
- Validación de reglas en `definirSintaxis()`.

Ejecuta `npm test` para ver el estado actual.

---

## Changelog

Ver [CHANGELOG.md](CHANGELOG.md).

---

## License

MIT — ver [LICENSE](LICENSE).
