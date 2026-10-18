preSintaxis.registrarSintaxis('markdown', [
  { tipo: 'comentario',  regex: /^\s*>.*$/m },
  { tipo: 'palabra',     regex: /^#{1,6}\s.*$|^\s*[-*+]\s|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`|\[[^\]]+\]\([^)]+\)/m },
  { tipo: 'valor',       regex: /```[\s\S]*?```|~~~[\s\S]*?~~~/ },
  { tipo: 'identificador', regex: /\|.*\|/ },
  { tipo: 'valor',       regex: /^\s*\d+\.\s/m }
]);