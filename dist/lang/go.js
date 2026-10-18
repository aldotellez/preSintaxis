preSintaxis.registrarSintaxis('go', [
  { tipo: 'comentario',  regex: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
  { tipo: 'valor',       regex: /"(?:[^"\\]|\\.)*"|`[^`]*`|'(?:[^'\\]|\\.)*'/ },
  { tipo: 'palabra',     regex: /\b(?:if|else|switch|case|default|for|range|break|continue|return|goto|fallthrough|func|package|import|type|struct|interface|map|chan|go|defer|select|var|const|true|false|nil|iota)\b/ },
  { tipo: 'tipo',        regex: /\b(?:int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|float32|float64|complex64|complex128|string|bool|byte|rune|error|any)\b/ },
  { tipo: 'valor',       regex: /\b\d+(?:\.\d+)?\b/ },
  { tipo: 'delimitador', regex: /[(){}\[\];,.:]/ },
  { tipo: 'operador',    regex: /[+\-*/%=<>!&|^~?:]+/ },
  { tipo: 'identificador', regex: /\b[A-Za-z_]\w*\b/ }
]);