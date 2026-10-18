preSintaxis.registrarSintaxis('css', [
  // 1. Comentarios
  { tipo: 'comentario',  regex: /\/\*[\s\S]*?\*\// },
  
  // 2. Directivas (como @media, @import)
  { tipo: 'palabra',     regex: /@[\w-]+/ },
  
  // 3. Propiedades CSS (deben ir ANTES que los selectores, buscando los dos puntos)
  { tipo: 'tipo',        regex: /\b[a-zA-Z-]+(?=\s*:)/ },
  
  // 4. Valores (colores, números y palabras clave comunes)
  { tipo: 'valor',       regex: /#[a-fA-F0-9]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms|deg|fr)?\b|\b(?:flex|block|inline|absolute|relative|fixed|sticky|auto|none|inherit|initial|unset|hidden|column|row|center|left|right|bold|italic)\b/ },
  
  // 5. Selectores (etiquetas, clases, IDs)
  { tipo: 'identificador', regex: /\.[a-zA-Z_][\w-]*|#[a-zA-Z_][\w-]*|\b[a-zA-Z][\w-]*\b/ },
  
  // 6. Strings
  { tipo: 'valor',       regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/ },
  
  // 7. Delimitadores
  { tipo: 'delimitador', regex: /[{}();:,]/ },
  
  // 8. Operadores
  { tipo: 'operador',    regex: /[+\-*/=<>~]/ }
]);