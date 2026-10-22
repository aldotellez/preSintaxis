preSintaxis.registrarSintaxis('bash', [
  { tipo: 'comentario',  regex: /#[^\n]*/ },
  { tipo: 'valor',       regex: /"(?:[^"\\]|\\.)*"|'[^']*'/ },
  { tipo: 'palabra',     regex: /\b(?:if|then|else|elif|fi|for|while|until|do|done|case|esac|function|in|select|time|return|break|continue|export|local|readonly|declare|unset|set|shift|source|alias|echo|printf|cd|pwd|ls|mkdir|rm|cp|mv|cat|grep|sed|awk|curl|wget|npm|npx|node|git|sudo|chmod|chown|exit|true|false)\b/ },
  { tipo: 'tipo',        regex: /\$\{[A-Za-z_]\w*\}|\$[A-Za-z_]\w*|\$[0-9@*#?$!-]/ },
  { tipo: 'valor',       regex: /\b\d+(?:\.\d+)?\b/ },
  { tipo: 'operador',    regex: /&&|\|\||>>|<<|==|!=|[|&;<>()$`\\]+/ },
  { tipo: 'delimitador', regex: /[{}[\]]/ },
  { tipo: 'identificador', regex: /\b[A-Za-z_][\w-]*\b/ }
]);
