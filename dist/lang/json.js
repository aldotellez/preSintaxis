preSintaxis.registrarSintaxis('json', [
  { tipo: 'valor',       regex: /"(?:[^"\\]|\\.)*"/ },
  { tipo: 'palabra',     regex: /\b(?:true|false|null)\b/ },
  { tipo: 'tipo',        regex: /"(?:[^"\\]|\\.)*"(?=\s*:)/ },
  { tipo: 'valor',       regex: /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/ },
  { tipo: 'delimitador', regex: /[{}[\],:]/ }
]);