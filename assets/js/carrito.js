/**
 * carrito.js — Carrito de compras de Punto Barber
 *
 * Guarda el pedido en el navegador del cliente (localStorage), así que
 * si cierra la página y vuelve más tarde, su pedido sigue ahí.
 *
 * Cada renglón del carrito es un producto + opción concretos:
 * el mismo sacudidor en negro y en rojo son dos renglones.
 */

const Carrito = (() => {

  const CLAVE = 'puntobarber_carrito_v1';
  let renglones = [];
  const suscriptores = [];

  // ── Persistencia ───────────────────────────────────────────

  function cargar() {
    try {
      renglones = JSON.parse(localStorage.getItem(CLAVE)) || [];
      if (!Array.isArray(renglones)) renglones = [];
    } catch { renglones = []; }
    return renglones;
  }

  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(renglones)); }
    catch { /* modo incógnito: el carrito solo dura la sesión */ }
    suscriptores.forEach(fn => fn(renglones));
  }

  function alCambiar(fn) { suscriptores.push(fn); fn(renglones); }

  // ── Identidad de un renglón ────────────────────────────────

  function idRenglon(referencia, talla, color) {
    return `${referencia}||${talla || ''}||${color || ''}`;
  }

  // ── Operaciones ────────────────────────────────────────────

  function agregar(producto, talla, color, cantidad = 1) {
    const id = idRenglon(producto.referencia, talla, color);
    const existente = renglones.find(r => r.id === id);
    const tope = topeDisponible(producto, talla, color);

    if (existente) {
      existente.cantidad = Math.min(existente.cantidad + cantidad, tope);
    } else {
      renglones.push({
        id,
        referencia: producto.referencia,
        nombre:     producto.nombre,
        precio:     producto.precio,
        envioGratis: !!producto.envioGratis,
        imagen:     producto.imagenes[0],
        talla:      talla || '',
        color:      color || '',
        cantidad:   Math.min(cantidad, tope),
      });
    }
    guardar();
  }

  // Cuánto se puede pedir de esta combinación. Si no conocemos el stock
  // (no hay pestaña Inventario), permitimos hasta 10 y se confirma por WhatsApp.
  function topeDisponible(producto, talla, color) {
    if (producto.stockDesconocido) return 10;
    const v = producto.variantes.find(v =>
      v.talla === talla && (color ? v.color === color : true)
    );
    return v ? Math.max(1, v.stock) : 1;
  }

  function cambiarCantidad(id, cantidad) {
    const r = renglones.find(r => r.id === id);
    if (!r) return;
    r.cantidad = Math.max(1, Math.min(cantidad, 99));
    guardar();
  }

  function quitar(id) {
    renglones = renglones.filter(r => r.id !== id);
    guardar();
  }

  function vaciar() { renglones = []; guardar(); }

  // ── Consultas ──────────────────────────────────────────────

  const obtener   = () => renglones;
  const total     = () => renglones.reduce((s, r) => s + r.precio * r.cantidad, 0);
  const unidades  = () => renglones.reduce((s, r) => s + r.cantidad, 0);
  const estaVacio = () => renglones.length === 0;

  // "Única" es el nombre de la variante en MergeOn cuando el producto no tiene
  // opciones: al cliente no le dice nada, así que no se muestra.
  const opcion = r => (r.talla && r.talla !== 'Única') ? r.talla : '';

  /**
   * Las cuentas del pedido con las reglas de config.js, las mismas que usa el
   * agente: más de $200.000 es precio mayorista (10% menos y envío gratis), y
   * el envío también es gratis si el pedido lleva un equipo.
   * Sin ciudad no se sabe el envío: queda en null.
   */
  function cuentas(ciudad = '', lista = renglones) {
    const { mayorista, envio } = CONFIG.ventas;
    const subtotal = lista.reduce((s, r) => s + r.precio * r.cantidad, 0);
    const esMayorista = subtotal > mayorista.minimo;
    const descuento = esMayorista ? Math.round(subtotal * mayorista.descuento) : 0;
    const llevaEquipo = lista.some(r => r.envioGratis);
    const envioGratis = esMayorista || llevaEquipo;
    const enCali = /\bcali\b/i.test(ciudad.normalize('NFD').replace(/[̀-ͯ]/g, ''));
    const costoEnvio = envioGratis ? 0 : (ciudad.trim() ? (enCali ? envio.cali : envio.nacional) : null);
    return {
      subtotal, esMayorista, descuento, llevaEquipo, envioGratis, enCali,
      envio: costoEnvio,
      total: subtotal - descuento + (costoEnvio || 0),
      // Lo que falta para llegar al mínimo (hay que pasarlo: con justo $200.000 todavía no)
      faltaMayorista: esMayorista ? 0 : mayorista.minimo - subtotal,
    };
  }

  cargar();

  return {
    agregar, quitar, vaciar, cambiarCantidad,
    obtener, total, unidades, estaVacio,
    alCambiar, topeDisponible, cuentas, opcion,
  };
})();

window.Carrito = Carrito;
