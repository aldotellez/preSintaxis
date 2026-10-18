preSintaxis.registrarSintaxis('java', [
  { tipo: 'comentario',  regex: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
  { tipo: 'valor',       regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/ },
  { tipo: 'palabra',     regex: /\b(?:if|else|switch|case|default|for|while|do|break|continue|return|try|catch|finally|throw|throws|new|this|super|class|interface|enum|extends|implements|package|import|public|private|protected|static|final|abstract|synchronized|volatile|transient|native|instanceof|true|false|null)\b/ },
  { tipo: 'tipo',        regex: /\b(?:int|long|short|byte|float|double|boolean|char|void|String|Object|Integer|Double|Boolean|List|Map|Set|ArrayList|HashMap)\b/ },
  { tipo: 'valor',       regex: /\b\d+(?:\.\d+)?[fFdDlL]?\b/ },
  { tipo: 'delimitador', regex: /[(){}\[\];,.]/ },
  { tipo: 'operador',    regex: /[+\-*/%=<>!&|^~?]+/ },
  { tipo: 'identificador', regex: /\b[A-Za-z_]\w*\b/ }
]);