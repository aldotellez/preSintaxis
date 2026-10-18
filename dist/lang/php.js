preSintaxis.registrarSintaxis('php', [
  { tipo: 'comentario',  regex: /\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\// },
  { tipo: 'valor',       regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/ },
  { tipo: 'palabra',     regex: /\b(?:if|else|elseif|switch|case|default|for|foreach|while|do|break|continue|return|function|class|interface|trait|extends|implements|new|clone|public|private|protected|static|abstract|final|const|var|global|namespace|use|as|try|catch|finally|throw|echo|print|include|require|isset|empty|unset|true|false|null)\b/ },
  { tipo: 'tipo',        regex: /\b(?:int|float|string|bool|array|object|callable|iterable|mixed|void|never)\b/ },
  { tipo: 'valor',       regex: /\b\d+(?:\.\d+)?\b|\$[A-Za-z_]\w*/ },
  { tipo: 'delimitador', regex: /[(){}\[\];,.:]/ },
  { tipo: 'operador',    regex: /[+\-*/%=<>!&|^~?.]+/ },
  { tipo: 'identificador', regex: /\b[A-Za-z_]\w*\b/ }
]);