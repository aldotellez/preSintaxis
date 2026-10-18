preSintaxis.registrarSintaxis('c', [
  { tipo: 'comentario',  regex: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
  { tipo: 'valor',       regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/ },
  { tipo: 'palabra',     regex: /\b(?:if|else|switch|case|default|for|while|do|break|continue|return|goto|try|catch|throw|new|delete|this|class|struct|union|enum|namespace|using|template|typename|public|private|protected|virtual|override|final|static|const|constexpr|extern|inline|volatile|friend|operator)\b/ },
  { tipo: 'tipo',        regex: /\b(?:int|float|double|char|void|bool|short|long|signed|unsigned|size_t|auto|wchar_t|string|vector|map|set|pair)\b/ },
  { tipo: 'valor',       regex: /\b\d+(?:\.\d+)?[fFuUlL]?\b|0x[0-9a-fA-F]+\b/ },
  { tipo: 'delimitador', regex: /[(){}\[\];,.:#]/ },
  { tipo: 'operador',    regex: /[+\-*/%=<>!&|^~?:]+/ },
  { tipo: 'identificador', regex: /\b[A-Za-z_]\w*\b/ }
]);