preSintaxis.registrarSintaxis('html', [
  { tipo: 'comentario',  regex: /<!--[\s\S]*?-->/ },
  { tipo: 'valor',       regex: /"[^"]*"|'[^']*'/ },
  { tipo: 'palabra',     regex: /<\/?[a-zA-Z][\w-]*|\/?>/ },
  { tipo: 'identificador', regex: /\s[a-zA-Z-]+(?==)/ },
  { tipo: 'valor',       regex: /&[a-zA-Z]+;|&#\d+;/ },
  { tipo: 'delimitador', regex: /[=]/ }
]);