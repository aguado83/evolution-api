# Modo IMPORTAR — subir el producto elegido a la tienda con el conector del proveedor

El usuario ya eligió su producto (en el informe) y quiere tenerlo en su tienda. Llega con el mensaje que le monta la web
del juego, en el MISMO chat en el que le hiciste el informe, con los datos exactos de su ficha. El precio de venta puede
ser distinto del del informe: la web le deja cambiarlo (misión 2.4) y **manda el suyo**.

```
/dropshipping-videojuego Importa a mi tienda este producto de mi informe:
Nombre: Pelota antiestrés de dedos
Título original: Finger Grip Strengthener Ball Hand Exerciser
ID de catálogo: 67523ce8dbf199e45c8ce5b2
Coste: 4,20 $
Envío: 2,10 $
Precio de venta: 24,99 $
```

El mensaje no trae el origen ni su ID: el informe ya no los enseña (pedido de Adrián, 10/10/2026). Los sacas tú del
proveedor con el ID de catálogo (punto 2). Si un mensaje viejo los trae («Origen», «ID de origen»), úsalos tal cual.

Las fichas de antes usaban otras claves para lo mismo: «Título AutoDS» = título original, «Proveedor» = origen,
«ID del proveedor» = ID de origen, «ID AutoDS» = ID de catálogo.

## En este paso, SOLO el conector del proveedor (léelo antes de nada)

- **No conectes con la tienda.** Nada de iniciar sesión en Shopify, ni de instalar su programa, ni de leer o tocar el tema,
  ni de nada del modo TIENDA. El proveedor ya está enlazado con su tienda (lo hizo al registrarse: «I have a Shopify Store»)
  y es el proveedor quien sube el producto. La tienda se diseña después, en otro paso del juego (nivel 3), con el modo
  TIENDA.
- **Sin preguntas.** Todo lo que necesitas viene en el mensaje. Si la cuenta tiene varias tiendas de Shopify, usa la
  marcada como `selected` (o la más reciente) sin preguntar. El único caso en el que necesitas al usuario: que no haya
  ninguna tienda de Shopify enlazada (ver el punto 1).
- **Mensajes cortos.** Como mucho una línea de estado mientras trabajas («Subiendo tu producto a la tienda…») y el mensaje
  final del punto 6. Al usuario, «el proveedor»: no le nombres la marca.
- **Título mejor:** no subas el título original tal cual. Escribe uno en castellano, claro y vendedor (máx. 70 caracteres,
  sin marcas, sin mayúsculas sueltas ni símbolos raros) y súbelo en `title`.
- **Precio:** el «Precio de venta» del mensaje (el que eligió en la web), en `price`.
- **Descripción:** el conector no tiene un campo documentado para la descripción (solo `title` y `price`). No inventes
  campos: el producto entra con la descripción del proveedor y la reescribe el modo TIENDA cuando diseñe la página del
  producto (no hace falta decírselo).

Todo se hace con el conector. **Antes de empezar, lee su guía**: `get_playbook` con `name: "product_import"` (son 3 pasos:
subir, esperar y comprobar). Lo de abajo es cómo aplicarla aquí. Donde la guía dice «pregunta si borrador o activo», aquí
no se pregunta: borrador primero y se publica en el punto 4, cuando ya sabes que entró bien.

## 1. La tienda

`list_stores_api` → quédate con la tienda de Shopify (`site` = 3). Apunta su `id` y su `region`.

Si no hay ninguna tienda de Shopify: dile en una frase que enlace su tienda en el proveedor (en su panel, «Add store» ›
Shopify) y que vuelva a pegarte el mismo mensaje. No busques otro camino.

## 2. Subirlo como borrador

`upload_products` con:

- `store_ids`: el id de la tienda;
- `body.region`: la región de la tienda (entero; si viene vacía, 1);
- `body.status`: **1** (borrador);
- `body.buy_site_id`: el origen (ver abajo), como número: `aliexpress` = **2**, `private_suppliers` (marketplace del proveedor) =
  **27**, `cjdropshipping` = 15, `amazon` = 1 (el resto, en la descripción de la herramienta);
- `body.new_products`: `[{ "asin": "<ID de origen>", "title": "<tu título mejorado>", "price": <precio de venta> }]`.

**El origen y su ID, del ID de catálogo** (antes de subir):

1. `get_product_by_id` con el ID de catálogo → `siteName` (el origen) e `idOnSite` (el ID de origen).
2. Si da el error de «redirección inesperada» (un ganador sin el complemento *Product Finding Hub*: no reintentes) o el
   mensaje no trae ID de catálogo, usa `search_products` con `search_query` = el título original. Quédate con el resultado
   que tenga ese mismo `_id` (sin ID de catálogo, el que coincida del todo con el título) y saca de él `site_name` e
   `id_on_site`.

Al usuario no le digas de dónde viene el producto (ni el origen ni su ID): para él, «el proveedor».

Guarda el `bulk_action.id` de la respuesta: la subida sigue en marcha cuando te contesta.

## 3. Esperar y comprobar

- `get_bulk_action_items` con ese id: primera consulta a los ~10 s y luego cada ~15 s, como mucho 10 veces. Se acaba cuando
  ningún elemento está en 1 o 2. 3 = entró; 4 = cancelado; 99 = error (lee su `error_reason` y explícaselo en una frase).
- `list_products` (borradores, `product_status` 1) filtrando por el título: confirma que está **y con el precio pedido**.

Si `upload_products` falla con un error ambiguo (tiempo agotado, error del servidor), **no lo repitas a ciegas**: mira antes
con `list_products` si el borrador ya existe; repetir duplicaría el producto. Si de verdad hay que repetir, díselo antes.

## 4. Publicarlo en Shopify

`publish_drafts_to_marketplace` con `product_status` 1 y un filtro por el id del producto en el proveedor (el
`autods_product_id` que te dio la espera del paso 3: `{name: "id", op: "=", value_type: "object_id", value: "<id>"}`).
**Nunca sin filtro**: publicaría todos sus borradores. Vuelve a esperar con `get_bulk_action_items` igual que antes.

## 5. Si el precio no ha quedado bien

Si en el paso 3 el precio no es el pedido (o el conector no lo aceptó), **no le pidas nada al usuario**: déjalo apuntado en
el chat, en una línea propia, para que lo veas al diseñar la tienda (el modo TIENDA va en este mismo chat y sí puede
cambiar precios en Shopify):

```
PRECIO PENDIENTE · <título nuevo> · <precio de venta> $ (lo pongo al diseñar la tienda)
```

## 6. Cuéntaselo

Corto: «✅ Ya está en tu tienda: *<título nuevo>* a <precio>. Vuelve a la web del juego para el siguiente paso.» Nada más:
no le expliques el nivel 3 ni empieces a diseñar por tu cuenta.
