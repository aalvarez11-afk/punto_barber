/**
 * whatsapp.js — Cierre de la venta por WhatsApp
 *
 * Arma el mensaje del pedido y abre el chat de la tienda con ese texto
 * ya escrito. El cliente siempre tiene que pulsar "enviar": WhatsApp no
 * permite mandar mensajes automáticamente, y así debe ser.
 */

const WhatsApp = (() => {

  // Límite prudente para el largo de la URL. Algunos celulares y
  // navegadores cortan enlaces muy largos sin avisar, y el pedido
  // llegaría incompleto. Si nos pasamos, resumimos el mensaje.
  const LARGO_MAXIMO_URL = 1800;

  // Intl deja un espacio duro entre el signo y el número ("$ 89.000").
  // En Colombia se escribe pegado, así que lo quitamos.
  const pesos = n => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: CONFIG.ventas.moneda,
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(n).replace(/\s/g, '\u00a0').replace(/\$\u00a0/, '$');

  // Código corto para que la tienda pueda referirse al pedido.
  // No es un identificador único global: es una referencia de conversación.
  function numeroDePedido() {
    const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';  // sin I, O, 0, 1
    let codigo = '';
    for (let i = 0; i < 4; i++) {
      codigo += letras[Math.floor(Math.random() * letras.length)];
    }
    return `PBW-${codigo}`;   // PBW: pedido web (PB- son las referencias de producto)
  }

  // Limpia el número: deja solo dígitos. wa.me no acepta +, espacios ni guiones.
  function numeroLimpio() {
    return String(CONFIG.whatsapp.numero || '').replace(/\D/g, '');
  }

  // Las cuentas (subtotal, mayorista, envío, total) se hacen una sola vez con
  // el pedido COMPLETO: si la lista se recorta por longitud, el cliente sigue
  // viendo el total real que va a pagar.
  function armarMensaje(renglones, datosCliente, pedido, cuentas, { resumido = false } = {}) {
    const L = [];

    L.push(`¡Hola ${CONFIG.tienda.nombre}! Quiero hacer un pedido 💈`);
    L.push(`Pedido: ${pedido}`);
    L.push('');

    renglones.forEach((r, i) => {
      const opcion = Carrito.opcion(r);
      if (resumido) {
        // Versión compacta: una línea por producto
        const detalle = [opcion, `x${r.cantidad}`].filter(Boolean).join(' ');
        L.push(`${i + 1}. ${r.nombre} (${r.referencia}) ${detalle} · ${pesos(r.precio * r.cantidad)}`);
      } else {
        L.push(`${i + 1}. ${r.nombre} (${r.referencia})`);
        L.push('   ' + [opcion, `x${r.cantidad}`, pesos(r.precio * r.cantidad)].filter(Boolean).join(' · '));
      }
    });

    const c = cuentas;
    L.push('');
    L.push(`Subtotal: ${pesos(c.subtotal)}`);
    if (c.esMayorista) L.push(`Precio mayorista -${Math.round(CONFIG.ventas.mayorista.descuento * 100)}%: -${pesos(c.descuento)}`);
    L.push(`Envío: ${textoEnvio(c)}`);
    L.push(`Total: ${pesos(c.total)}`);

    if (datosCliente && Object.values(datosCliente).some(Boolean)) {
      L.push('');
      if (datosCliente.nombre)    L.push(`Nombre: ${datosCliente.nombre}`);
      if (datosCliente.documento) L.push(`Cédula o NIT: ${datosCliente.documento}`);
      if (datosCliente.correo)    L.push(`Correo: ${datosCliente.correo}`);
      if (datosCliente.ciudad)    L.push(`Ciudad: ${datosCliente.ciudad}`);
      if (datosCliente.direccion) L.push(`Dirección: ${datosCliente.direccion}`);
      if (datosCliente.pago)      L.push(`Pago: ${datosCliente.pago}`);
      if (datosCliente.notas)     L.push(`Notas: ${datosCliente.notas}`);
    }

    return L.join('\n');
  }

  function textoEnvio(c) {
    if (c.envioGratis) return 'Gratis';
    if (c.envio === null) return 'por confirmar';
    return c.enCali ? `${pesos(c.envio)} (domicilio Cali)` : pesos(c.envio);
  }

  /**
   * Genera el enlace wa.me con el pedido dentro.
   * Si el mensaje completo no cabe en la URL, usa la versión resumida;
   * si aun así no cabe, corta la lista e indica cuántos productos faltan.
   */
  function enlaceDePedido(renglones, datosCliente) {
    const numero = numeroLimpio();
    const pedido = numeroDePedido();
    const base   = `https://wa.me/${numero}?text=`;
    const cuentas = Carrito.cuentas(datosCliente.ciudad || '', renglones);
    const cabe = m => base.length + encodeURIComponent(m).length <= LARGO_MAXIMO_URL;

    let mensaje = armarMensaje(renglones, datosCliente, pedido, cuentas);
    if (!cabe(mensaje)) mensaje = armarMensaje(renglones, datosCliente, pedido, cuentas, { resumido: true });

    // Último recurso: un pedido enorme. Recortamos y dejamos constancia.
    if (!cabe(mensaje)) {
      let visibles = renglones.length;
      while (visibles > 1) {
        visibles--;
        mensaje = armarMensaje(renglones.slice(0, visibles), datosCliente, pedido, cuentas, { resumido: true })
          + `\n\n(+ ${renglones.length - visibles} producto(s) más — se los detallo por aquí)`;
        if (cabe(mensaje)) break;
      }
    }

    return { url: base + encodeURIComponent(mensaje), pedido, mensaje };
  }

  // Enlace del botón flotante, para consultas sin pedido
  function enlaceGeneral(textoPersonalizado) {
    const texto = textoPersonalizado || CONFIG.whatsapp.saludoGeneral;
    return `https://wa.me/${numeroLimpio()}?text=${encodeURIComponent(texto)}`;
  }

  // Enlace para preguntar por un producto concreto
  function enlaceProducto(producto) {
    const texto = `¡Hola ${CONFIG.tienda.nombre}! Me interesa: `
      + `${producto.nombre} (${producto.referencia}). ¿Me dan más información?`;
    return `https://wa.me/${numeroLimpio()}?text=${encodeURIComponent(texto)}`;
  }

  // Avisa si el número quedó sin configurar, para no descubrirlo con un cliente real
  function numeroConfigurado() {
    const n = numeroLimpio();
    return n.length >= 10 && n !== '573001234567';
  }

  return { enlaceDePedido, enlaceGeneral, enlaceProducto, numeroConfigurado, pesos, textoEnvio };
})();

window.WhatsApp = WhatsApp;
