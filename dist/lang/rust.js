preSintaxis.registrarSintaxis('rust', [
  { tipo: 'comentario',  regex: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
  { tipo: 'valor',       regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/ },
  { tipo: 'palabra',     regex: /\b(?:fn|let|mut|const|static|struct|enum|union|impl|trait|pub|use|mod|match|if|else|for|while|loop|return|self|Self|as|where|ref|move|async|await|dyn|box|in|break|continue|unsafe|extern|crate|super|Some|None|Ok|Err|true|false)\b/ },
  { tipo: 'tipo',        regex: /\b(?:i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str|String|Vec|Option|Result)\b/ },
  { tipo: 'valor',       regex: /\b\d+(?:\.\d+)?(?:[iuf](?:8|16|32|64|128|size))?\b/ },
  { tipo: 'delimitador', regex: /[(){}\[\];,.:#]/ },
  { tipo: 'operador',    regex: /[+\-*/%=<>!&|^~?]+/ },
  { tipo: 'identificador', regex: /\b[A-Za-z_]\w*\b/ }
]);