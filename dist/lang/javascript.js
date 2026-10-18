preSintaxis.registrarSintaxis('javascript', [
  { tipo: 'comentario',  regex: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
  { tipo: 'valor',       regex: /`[\s\S]*?`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/ },
  { tipo: 'palabra',     regex: /\b(?:const|let|var|function|return|if|else|for|while|class|new|import|export|async|await|try|catch|throw|switch|case|break|continue|typeof|instanceof|this|super|extends|static|get|set|default|do|in|of|delete|void|yield|true|false|null|undefined)\b/ },
  { tipo: 'tipo',        regex: /\b(?:string|number|boolean|any|unknown|never|void|object|symbol|bigint|interface|type|enum|implements|public|private|protected|readonly|declare|namespace|abstract)\b/ },
  { tipo: 'valor',       regex: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/ },
  { tipo: 'delimitador', regex: /[(){}\[\];,.]/ },
  { tipo: 'operador',    regex: /[+\-*/%=<>!&|^~?]+/ },
  { tipo: 'identificador', regex: /\b[A-Za-z_$][\w$]*\b/ }
]);