preSintaxis.registrarSintaxis('sql', [
  { tipo: 'comentario',  regex: /--[^\n]*|\/\*[\s\S]*?\*\// },
  { tipo: 'valor',       regex: /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/ },
  { tipo: 'palabra',     regex: /\b(?:SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|DROP|INDEX|VIEW|JOIN|INNER|LEFT|RIGHT|OUTER|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|AS|AND|OR|NOT|NULL|IS|IN|BETWEEN|LIKE|CASE|WHEN|THEN|ELSE|END|PRIMARY|KEY|FOREIGN|REFERENCES|DEFAULT|CONSTRAINT|UNIQUE|CHECK|AUTO_INCREMENT|WITH|ASC|DESC)\b/i },
  { tipo: 'tipo',        regex: /\b(?:INT|VARCHAR|TEXT|DATE|DATETIME|TIMESTAMP|BOOLEAN|DECIMAL|FLOAT|DOUBLE|CHAR|BLOB)\b/i },
  { tipo: 'valor',       regex: /\b\d+(?:\.\d+)?\b/ },
  { tipo: 'delimitador', regex: /[();,.]/ },
  { tipo: 'operador',    regex: /[+\-*/%=<>!]+/ },
  { tipo: 'identificador', regex: /\b[A-Za-z_]\w*\b/ }
]);