# Punto Barber — tienda web (demo)

Catálogo de Punto Barber, distribuidora de artículos de barbería en Cali: máquinas, patilleras,
shavers, combos, repuestos, styling, tijeras y capas, con carrito y pedido que se cierra por
WhatsApp. Sitio estático, sin build: HTML, CSS y JavaScript sin dependencias. Construido sobre el
motor de la tienda FabJak.

En vivo en **https://puntobarber.netlify.app** (si el sitio cambia de nombre, cambiarlo también en
`index.html`, `assets/js/config.js` y en los prompts de MergeOn).

## Publicar en Netlify

**Add new site → Import an existing project → GitHub → este repo.** No hay que configurar nada:
`netlify.toml` ya dice que no hay build y que se publica la raíz. Cada push a `main` redespliega.

## El número de WhatsApp

Los pedidos llegan a la línea de demo **311 404 2863**, la que se conecta al agente de MergeOn (#318).
Se cambia en `assets/js/config.js`, campo `whatsapp.numero`: `57` + los 10 dígitos, sin espacios. Si
queda vacío, la página muestra un aviso amarillo. La línea real de la tienda es 323 512 1551.

## De dónde sale el catálogo

`datos/productos.json` **no se edita a mano**: lo genera `mergeon/generar-catalogo.js` (en la
carpeta de la demo, fuera de este repo) desde el PDF del catálogo de la tienda. Trae **409
productos** en 16 categorías con los **nombres, precios, marcas y fotos del PDF**. Las fotos están
en `assets/img/productos/` (recortadas de cada página, 600 px en webp).

- Los precios del catálogo son **al detal**.
- El stock es inventado para la demo (el PDF no lo trae) y es el mismo que tiene MergeOn: el agente
  de WhatsApp vende directo con él. Agotados a propósito: Wahl Magic Clip inalámbrica y cera
  Nish Man 03.
- Cada producto trae el código `PB-<página del PDF>`, el mismo `external_id` que tiene en MergeOn,
  para que el agente lo encuentre cuando le llega un pedido desde la web.

## Reglas comerciales (INVENTADAS para la demo, por confirmar con la tienda)

Viven en `config.js` (`ventas.mayorista` y `ventas.envio`) y el carrito las calcula solo:

- **Precio mayorista:** pedido de más de $200.000 → 10% de descuento sobre el total y envío gratis.
  El carrito muestra cuánto falta para llegar.
- **Envío:** gratis si el pedido lleva un equipo (máquinas, patilleras, shavers, secadores…) o es
  mayorista; si no, $7.000 de domicilio en Cali o $12.000 al resto del país.
- **Pago:** transferencia o Nequi, con factura electrónica (por eso el formulario pide cédula o NIT
  y correo).

Son las mismas que tiene el agente de MergeOn en su prompt: si cambian aquí, hay que cambiarlas allá.

## El pedido

El formulario pide nombre o razón social, cédula o NIT, correo, ciudad, dirección y forma de pago, y
abre WhatsApp con el pedido escrito: productos con su código, subtotal, descuento mayorista, envío,
total y los datos. Prefijo del pedido `PBW-` (pedido web; `PB-` son los códigos de producto). El
agente revisa el pedido contra el catálogo, manda el resumen para confirmar y **no confirma el
pedido**: queda confirmado cuando la tienda recibe el pago.

## Dónde se cambia cada cosa

| Qué | Dónde |
|---|---|
| Número de WhatsApp, reglas de mayorista y envío, formas de pago, colores | `assets/js/config.js` |
| Productos, precios, stock (generado) | `datos/productos.json` |
| Fotos, logo, favicon e imagen al compartir el link (generadas con `herramientas/web-assets.py`) | `assets/img/` |
| Textos legales (campos entre corchetes por completar) | `legal/` |

## Pendiente antes de usarla con clientes reales

- Confirmar las reglas comerciales, la garantía y los envíos.
- Completar razón social, NIT, dirección y correo en `legal/`.
- Está marcada `noindex` y `robots.txt` bloquea buscadores: abrirla cuando sea cliente.

## Local

```bash
python -m http.server 5514
```
