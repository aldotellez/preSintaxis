preSintaxis.registrarPlugin('sanitizar', (api) => {
  api.hook('antesDeTokenizar').registrar(({ texto, ajustes }) => {
    if (ajustes.sanitizar !== 'true') return;
    // Elimina caracteres de control invisibles y normaliza Unicode
    let limpio = texto.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
    limpio = limpio.normalize('NFC');
    return { texto: limpio };
  });
});