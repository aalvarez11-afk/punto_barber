# Barber Supply — tienda web (demo)

Tienda demo de una distribuidora de artículos de barbería: máquinas, patilleras, shavers, combos,
repuestos, styling, tijeras y capas, con carrito y pedido que se cierra por WhatsApp. **Marca
genérica**: el nombre, el logo y los textos son inventados; no corresponde a ninguna tienda real.
Sitio estático, sin build: HTML, CSS y JavaScript sin dependencias.

## Publicar en Netlify

**Add new site → Import an existing project → GitHub → este repo.** No hay que configurar nada:
`netlify.toml` ya dice que no hay build y que se publica la raíz. Cada push a `main` redespliega.
Si el sitio cambia de dirección, cambiarla también en `index.html` (og:url y og:image) y en
`assets/js/config.js`.

## El número de WhatsApp

Los pedidos llegan a la línea de demo conectada al agente de MergeOn. Se cambia en
`assets/js/config.js`, campo `whatsapp.numero`: `57` + los 10 dígitos, sin espacios. Si queda vacío,
la página muestra un aviso amarillo.

## El catálogo

`datos/productos.json` **no se edita a mano**: lo genera un script fuera de este repo. Trae **409
productos** en 16 categorías, con fotos en `assets/img/productos/` (600 px en webp).

- Los precios del catálogo son **al detal**. El stock es inventado para la demo y es el mismo que
  tiene el agente de MergeOn: vende directo con él.
- Cada producto trae un código `PB-…`, el mismo `external_id` que tiene en MergeOn, para que el agente
  lo encuentre cuando le llega un pedido desde la web.

## Reglas comerciales (de demo)

Viven en `config.js` (`ventas.mayorista` y `ventas.envio`) y el carrito las calcula solo:

- **Precio mayorista:** pedido de más de $200.000 → 10% de descuento sobre el total y envío gratis.
  El carrito muestra cuánto falta para llegar.
- **Envío:** gratis si el pedido lleva un equipo (máquinas, patilleras, shavers, secadores…) o es
  mayorista; si no, $12.000 a cualquier ciudad. `ventas.envio.local` permite cobrar distinto el
  domicilio en la ciudad de la tienda.
- **Pago:** transferencia o Nequi, con factura electrónica (por eso el formulario pide cédula o NIT
  y correo).

Son las mismas que tiene el agente de MergeOn en su prompt: si cambian aquí, hay que cambiarlas allá.

## El pedido

El formulario pide nombre o razón social, cédula o NIT, correo, ciudad, dirección y forma de pago, y
abre WhatsApp con el pedido escrito: productos con su código, subtotal, descuento mayorista, envío,
total y los datos. Prefijo del pedido `PBW-` (pedido web). El agente revisa el pedido contra el
catálogo, manda el resumen para confirmar y **no confirma el pedido**: queda confirmado cuando la
tienda recibe el pago.

## Caché

Las imágenes se guardan un día en el navegador; JS, CSS y el catálogo se revalidan en cada visita.
Además, `index.html` y `legal/` llaman al JS y al CSS con `?v=N`: si alguna vez un cambio no se ve en
un navegador que ya había abierto la página, subir ese número obliga a bajar la copia nueva.

## Dónde se cambia cada cosa

| Qué | Dónde |
|---|---|
| Nombre, número de WhatsApp, reglas de mayorista y envío, formas de pago, colores | `assets/js/config.js` |
| Productos, precios, stock (generado) | `datos/productos.json` |
| Fotos, logo, favicon e imagen al compartir el link | `assets/img/` |
| Textos legales (campos entre corchetes por completar) | `legal/` |

Está marcada `noindex` y `robots.txt` bloquea buscadores.

## Local

```bash
python -m http.server 5514
```
