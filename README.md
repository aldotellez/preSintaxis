# preSintaxis.js

**preSintaxis.js** es una librería minimalista de resaltado de sintaxis para HTML estático. A diferencia de otros resaltadores, utiliza un sistema de **categorías semánticas** reales (palabras reservadas, identificadores, operadores, etc.) en lugar de tokens genéricos. 

Es ultra ligera (~2 KB gzip), sin dependencias, sin build step, y totalmente modular mediante plugins.

---

## 🚀 Instalación

### Opción 1: CDN (Recomendado para empezar)
Solo necesitas cargar el Core (núcleo) y el lenguaje que vayas a utilizar.

```html
<!-- 1. Core de la librería -->
<script src="https://cdn.jsdelivr.net/gh/TU-USUARIO/presintaxis@v1.0.2/dist/preSintaxis.min.js"></script>

<!-- 2. Lenguaje (ejemplo: JavaScript) -->
<script src="https://cdn.jsdelivr.net/gh/TU-USUARIO/presintaxis@v1.0.2/dist/lang/JavaScript.js"></script>
