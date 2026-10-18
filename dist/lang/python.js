preSintaxis.registrarSintaxis('python', [
  { tipo: 'comentario',  regex: /#[^\n]*|"""[\s\S]*?"""|'''[\s\S]*?'''/ },
  { tipo: 'valor',       regex: /[rbfu]?"(?:[^"\\]|\\.)*"|[rbfu]?'(?:[^'\\]|\\.)*'/ },
  { tipo: 'palabra',     regex: /\b(?:def|return|if|else|elif|for|while|in|as|class|import|from|with|try|except|finally|raise|lambda|yield|pass|break|continue|and|or|not|is|None|True|False|async|await|global|nonlocal|assert|del|match|case)\b/ },
  { tipo: 'tipo',        regex: /\b(?:int|float|str|bool|list|dict|tuple|set|bytes|complex|type|object)\b/ },
  { tipo: 'valor',       regex: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/ },
  { tipo: 'delimitador', regex: /[(){}\[\];,.:]/ },
  { tipo: 'operador',    regex: /[+\-*/%=<>!&|^~]+/ },
  { tipo: 'identificador', regex: /\b[A-Za-z_]\w*\b/ }
]);