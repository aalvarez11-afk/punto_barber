/**
 * Barber Supply — Configuración
 * ============================================================
 *  ESTE ES EL ÚNICO ARCHIVO QUE NECESITAS EDITAR.
 *  Cambia los valores marcados con  <-- CAMBIAR
 *
 *  Demo armada sobre el motor de la tienda FabJak: catálogo,
 *  carrito y pedido que se cierra por WhatsApp.
 * ============================================================
 */

const CONFIG = {

  // ─── 1. DATOS DE LA TIENDA ──────────────────────────────────
  tienda: {
    // Marca genérica de demo: sin nombre, ciudad ni redes de una tienda real.
    nombre: 'Barber Supply',
    eslogan: 'Distribuidora de barbería 💈',
    descripcion: 'Distribuidora de artículos de barbería: máquinas, patilleras, shavers, repuestos, styling, tijeras y capas. Al detal y al por mayor, con envío a toda Colombia.',
    ciudad: '',
    direccion: '',
    instagram: '',   // vacío: el botón de Instagram no se muestra
  },

  // ─── 2. WHATSAPP ────────────────────────────────────────────
  whatsapp: {
    // Formato: 57 + los 10 dígitos del celular. SIN +, SIN espacios, SIN guiones.
    // Va la línea de demo conectada al agente de MergeOn. Mientras esté vacío,
    // la página muestra un aviso amarillo y los pedidos no llegan a ningún lado.
    numero: '573114042863',  // <-- línea de demo conectada al agente

    // Mensaje del botón flotante (consultas generales, sin pedido)
    saludoGeneral: '¡Hola Barber Supply! Vi su tienda y quiero hacer una consulta.',

    // Mensaje del botón de mayoristas
    saludoMayorista: '¡Hola Barber Supply! Tengo una barbería y quiero hacer un pedido al por mayor.',
  },

  // ─── 3. CONEXIÓN CON LA HOJA DE CÁLCULO ─────────────────────
  //
  //  Vacío a propósito: la demo lee los productos de datos/productos.json,
  //  que se genera desde el PDF del catálogo con mergeon/generar-catalogo.js.
  //
  hoja: {
    idHoja: '',
    urlProductos:  '',
    urlInventario: '',
    pestanaProductos:  'Productos',
    pestanaInventario: 'Inventario',
    cacheMinutos: 5,
  },

  // ─── 4. VENTAS Y ENVÍOS ─────────────────────────────────────
  //  Reglas INVENTADAS para la demo (por confirmar con la tienda). Son las
  //  mismas que tiene el agente de MergeOn: si cambian aquí, cambian allá.
  ventas: {
    moneda: 'COP',

    // Precio mayorista: pedido de MÁS de este monto a precio de catálogo
    mayorista: {
      minimo: 200000,
      descuento: 0.10,
    },

    // Envío: gratis si el pedido lleva un equipo o es mayorista; si no, la
    // tarifa nacional. `local` es opcional, para una tienda que cobre distinto
    // el domicilio en su ciudad: { ciudad: 'Medellín', precio: 7000 }.
    envio: {
      nacional: 12000,
      local: null,
    },

    // Formas de pago que aparecen en el formulario del pedido.
    formasDePago: [
      'Transferencia',
      'Nequi',
    ],

    // Línea bajo el precio en el detalle del producto (HTML permitido).
    notaPago: 'Paga por <strong>transferencia o Nequi</strong> · Factura electrónica',
  },

  // ─── 5. VARIANTES ───────────────────────────────────────────
  // Cada producto dice cómo se llama su opción (Color, Aroma, Tipo o Diseño).
  // Este es el nombre que se usa si no lo dice.
  variantes: {
    talla:  'Opción',
    tallas: 'opciones',
    color:  'Color',
    filtro: false,
  },

  // ─── 6. APARIENCIA ──────────────────────────────────────────
  apariencia: {
    // El dorado de su logo para botones, y uno más claro para texto sobre negro
    colorPrincipal: '#c9913a',
    colorAcento:    '#e6b969',

    imagenCompartir: 'https://puntobarber.netlify.app/assets/img/og-demo.jpg',
  },

  // ─── 7. AVANZADO ────────────────────────────────────────────
  avanzado: {
    respaldo: 'datos/productos.json',
    productosPorPagina: 12,
  },
};

// No modificar de aquí hacia abajo
window.CONFIG = CONFIG;
