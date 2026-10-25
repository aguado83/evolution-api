# Modo INFORME — encontrar productos ganadores con el conector del proveedor

El usuario quiere productos para vender. Tú buscas en el catálogo del proveedor (AutoDS) con su conector, eliges los 50
mejores y le entregas **el informe de productos**: una página HTML con el diseño del juego que se abre como artefacto a la
derecha del chat. Siempre el mismo formato: la plantilla es fija (`assets/informe-plantilla.html`) y tú solo pones los datos.

En cada producto del informe hay un botón: **COPIAR FICHA** (nombre, título original, coste, envío y su destino, precio
de venta, ID de catálogo, enlace y foto). **Nunca el origen del producto (AliExpress…) ni su ID**: ni en las casillas ni en
la ficha (pedido de Adrián; `montar-informe.mjs` los quita y no monta el informe si se cuelan en algún texto). La persona pega la ficha en su inventario de la web del juego (misión 2.4), donde
puede cambiar su precio de venta, y la web le monta el mensaje para importarlo (modo IMPORTAR) con los datos exactos.

## Antes de nada: este paso es solo del proveedor

- **Solo el conector del proveedor** (AutoDS). Nada de la tienda: ni Shopify, ni su programa, ni el tema. La tienda se
  diseña más adelante, en otro paso del juego (modo TIENDA).
- **Sin preguntas.** El mensaje de la web trae todo lo que necesitas (las categorías). No le pidas nada más al usuario:
  si algo es dudoso, decide tú con un criterio razonable y sigue.
- **Mensajes cortos.** Mientras trabajas, como mucho una línea de estado («Buscando en el catálogo del proveedor…»). Al
  final, el mensaje del punto 6. La que guía al usuario es la web del juego, no el chat.
- **Al usuario, «el proveedor».** No le nombres la marca (AutoDS) en tus mensajes; la única excepción es el punto 0, si
  tiene que conectar el conector y necesita buscarlo por su nombre.

## 0. Lo que necesitas

- **El conector del proveedor activado** en Claude (herramientas `get_categories`, `get_winning_products`,
  `search_products`, `get_product_by_id`, `list_stores_api`). Si no aparecen: dile en 3 pasos cómo conectarlo:
  1) *Personalizar* › *Conectores*; 2) busca *AutoDS* y pulsa *Conectar*; 3) inicia sesión y elige *Permitir siempre*.
  Luego, que te vuelva a pegar el mismo mensaje.
- **Node** para montar el HTML (el mismo que usa el modo TIENDA; si falta, instálalo como en `00-entorno.md`).
- Rinde mejor con **Opus 5.5 y esfuerzo medio** (es lo que recomienda la web del juego). No hace falta comentarlo.

## 1. Las categorías

El mensaje trae las categorías **tal como las llama el proveedor** (con la traducción delante):
`Belleza y cuidado personal (Beauty & Personal Care)`. Llama **una vez** a `get_categories` y quédate con el `value` de
los nodos de **primer nivel** cuyo `label` coincida exactamente. Nunca busques una etiqueta por todo el árbol: hay
etiquetas repetidas en ramas distintas (`Clothing`, `Shoes`, `Mirrors`…).

Las 11 de primer nivel, comprobadas con el conector el 7 de octubre de 2026 (el árbol cambia pocas veces al año: fíate de
la llamada si algo no cuadra):

| En la web del juego | Etiqueta del proveedor | id |
|---|---|---|
| Juguetes y hobbies | Toys & Hobbies | 6169735494f2b1708dccda2d |
| Hogar y jardín | Home & Garden | 6169735594f2b1708dccdae9 |
| Bricolaje y herramientas | Home Improvements & Tools | 6169735694f2b1708dccdd63 |
| Aire libre | Outdoors | 6169735694f2b1708dccde2d |
| Deporte y fitness | Sports & Fitness | 6169735694f2b1708dccde7c |
| Mascotas | Pets | 6169735794f2b1708dccdfb8 |
| Electrónica y gadgets | Electronics & Gadgets | 6169735794f2b1708dcce0db |
| Ropa, calzado y joyería | Clothing, Shoes & Jewelry | 6169735894f2b1708dcce22c |
| Belleza y cuidado personal | Beauty & Personal Care | 6751af14611cd6c8f1be08e8 |
| Coche y moto | Automotive & Motorcycle | 6751af15611cd6c8f1be0c7c |
| Otras | Other Category | 618423b2262213c127667c74 |

«Todas las categorías» (*All Categories*) no es un nodo del árbol: significa **sin filtro de categoría**.
Filtrar por un id de primer nivel ya incluye todas sus subcategorías.

## 2. El destino del envío

El coste de envío que da el catálogo es el de **la región de la cuenta del proveedor** (no hay precios por país). Para que
la ficha diga a dónde es ese envío, llama **una vez** a `list_stores_api` (solo lee) y mira el `region` de la tienda de
Shopify (`site` = 3):

| `region` | `envio_a` |
|---|---|
| 1 | Estados Unidos |
| 2 | Reino Unido |
| 3 | Alemania |
| 4 | Francia |
| 5 | Italia |
| 9 | España |
| 10 | Australia |
| 11 | Canadá |
| 12 | Polonia |
| 14 | Bélgica |
| 21 | Brasil |
| 22 | Irlanda |

Si viene vacío (`null`), no hay tienda o es otro código: **Estados Unidos** (la región por defecto del proveedor, la de
los precios en dólares). No lo comentes con el usuario.

## 3. Buscar candidatos (sin reventar el contexto)

Cada resultado ocupa unos 2 KB. Objetivo: **150-300 candidatos en total** y 50 finalistas. Más no mejora el informe y llena
el contexto.

1. **Fuente principal: `get_winning_products`.** Trae lo que necesita el informe: `orders_count`, `competitors`,
   `saturation`, `sell_price` (precio de venta sugerido) y `profit`. Por cada categoría elegida:
   `category=<id>`, `item_cost` = `5-15` y luego `15-30`, `sort=-orders_count`, `limit=50` (si una categoría da mucho,
   una segunda página con `offset=50`). Sin el complemento *Product Finding Hub* devuelve un conjunto gratis más pequeño:
   úsalo igual, sin comentarlo como un error.
2. **Si salen pocos** (menos de ~60 por categoría), completa con `search_products`:
   - `categories.autods_category_id.$id` = id (objectId, `=`);
   - `variations.variation_details.price` entre `5,30` (float, `between`);
   - `site_name` en `aliexpress,private_suppliers` (list, `in`): proveedores de dropshipping. Amazon, Walmart… son
     tiendas, no proveedores: fuera;
   - `order_by` = `view_count` desc, `limit` 50.
   Estos no traen pedidos ni competencia: ponles `pedidos` 0 y juzga la demanda por su relevancia.
3. Apunta cuántos candidatos has mirado: es el **«analizados»** del informe.

## 4. Filtrar con los criterios del juego

Quédate solo con los que:

- **resuelven un problema real** (dolor, molestia, ahorro de tiempo, cuidado…), no decoración ni moda sin función;
- **no se encuentran** en un supermercado o en cualquier tienda física;
- tienen **valor percibido alto**: se pueden vender por **al menos 3 veces su coste**;
- **cuestan entre 5 y 30 dólares** y son **pequeños y fáciles de enviar**: nada voluminoso, frágil, líquido o con
  baterías grandes; nada de marcas registradas, réplicas, medicamentos ni nada que pida certificación;
- **ya venden** (pedidos > 0 en los ganadores).

Fuera duplicados: si el mismo producto aparece con dos orígenes, quédate con el más barato y rápido.

## 5. Los 50 finalistas: datos y textos

De cada uno, sin llamadas extra (usa `get_product_by_id` solo si falta algo clave, y como mucho en 10 productos):

| Campo | De dónde sale |
|---|---|
| `id` | `_id` (el «ID de catálogo» de la ficha) |
| `titulo` | `title` **tal cual**: sin traducir, sin recortar. Es el «Título original» de la ficha y lo que usa la importación |
| `proveedor` | `site_name` (`aliexpress`, `private_suppliers`…): solo para ti, para quitar duplicados. **No sale en el informe** |
| `id_proveedor` | `id_on_site`: igual, solo para ti. No sale en el informe; la importación lo saca del ID de catálogo |
| `coste` | `product_details.min_price` |
| `envio` | `product_details.min_shipping_cost` (el de la región de la cuenta: punto 2) |
| `envio_dias` | `product_details.min_shipping_time` |
| `almacen` | `product_details.min_price_warehouse` (`US`, `CN`…) |
| `venta` | `sell_price` del ganador; si no hay, coste × 3 redondeado a ,99 |
| `pedidos`, `competidores`, `saturacion` | `orders_count`, `competitors`, `saturation` (ganadores; si no hay, 0) |
| `imagen`, `imagenes` | la primera foto de `images` y hasta 4 más |
| `enlace` | el `link` del bloque de fotos de la respuesta (`platform.autods.com/marketplace/…/<_id>`) |

Y tres textos tuyos, **cortos y en español**, para gente no técnica:

- `nombre`: **máx. 40 caracteres**, qué es, sin marca («Lima eléctrica de durezas»). Es lo que va al inventario.
- `problema`: **máx. 60 caracteres**, qué le resuelve al cliente, en positivo («Quita durezas sin ir a la pedicura.»).
- `categoria`: tipo corto (2-3 palabras: «Cuidado de pies», «Postura y espalda»). Repite el mismo en productos parecidos:
  la plantilla lo usa como filtro.

Más tu nota de **`valor` (0-100)**: valor percibido y diferenciación (efecto «¡anda!», se entiende en un vídeo de 3
segundos, no parece barato, no está en todas partes).

**No calcules la nota ni el ranking**: la plantilla los calcula siempre con la misma fórmula
(24 % margen · 24 % ventas · 20 % poca competencia · 14 % envío rápido · 18 % valor percibido).

## 6. El archivo de datos

Carpeta de trabajo sin espacios ni acentos y fuera de OneDrive (como en el modo TIENDA): Windows `C:\tiendas\informe\`,
Mac `~/tiendas/informe/`. Escribe ahí **`informe-datos.json`**:

```json
{
  "categorias": ["Beauty & Personal Care", "Pets"],
  "categorias_es": ["Belleza y cuidado personal", "Mascotas"],
  "analizados": 286,
  "fecha": "7 de octubre de 2026",
  "envio_a": "Estados Unidos",
  "productos": [
    {
      "id": "67523ce8dbf199e45c8ce5b2",
      "proveedor": "aliexpress",
      "id_proveedor": "3256804144107369",
      "titulo": "Rubber Silicone Shower Barrier Water Stopper Bathroom Waterproof Strip Water Retaining Strip Bendable Door Bottom Sealing Strip",
      "nombre": "Burlete de ducha flexible",
      "categoria": "Baño",
      "problema": "Que el agua no salga de la ducha.",
      "coste": 5.42, "envio": 1.99, "venta": 24.99,
      "pedidos": 4000, "competidores": 5, "saturacion": 40,
      "envio_dias": 13, "almacen": "US", "valor": 72,
      "imagen": "https://ae01.alicdn.com/kf/S2e836d74f3e3479699ea12b280bc3932H.jpg",
      "imagenes": ["https://ae01.alicdn.com/kf/Scd089fd25a9f4ec79a535d0b7b41b338j.jpg"],
      "enlace": "https://platform.autods.com/marketplace/hand-picked-products/67523ce8dbf199e45c8ce5b2"
    }
  ]
}
```

Números con punto decimal; textos sin HTML. Los campos que no tengas, fuera. El `id` (ID de catálogo) es **imprescindible**:
con él la importación encuentra el producto y su origen.

## 7. Montarlo, abrirlo y avisar

1. Monta el HTML (mete las fotos dentro del archivo para que se vean en el artefacto):
   `node <carpeta de la skill>/scripts/montar-informe.mjs C:\tiendas\informe\informe-datos.json`
   → crea **`informe-de-productos.html`** en la misma carpeta y te dice cuántas fotos ha metido y si falta algo (corrígelo
   y vuelve a montar).
2. **Ábrelo como artefacto**: si tienes la herramienta de artefactos (*Artifact*), publica `informe-de-productos.html`
   con ella y se abre a la derecha del chat. Si no la tienes, ábrelo en el navegador (`start informe-de-productos.html`
   en Windows, `open informe-de-productos.html` en Mac). El documento se llama siempre **«Informe de productos»** (lo pone
   la plantilla).
3. **Nunca toques la plantilla ni escribas el HTML a mano.** El formato es siempre el mismo; si algo no cuadra, corrige
   `informe-datos.json` y vuelve a montar.
4. Al usuario, un mensaje corto y nada más: «✅ Tu informe está listo: <N> productos con su nota. Lo tienes a la derecha.
   Pulsa **COPIAR FICHA** en el que elijas y vuelve a la web del juego.» Sin el top 3, sin explicaciones: la web le dice
   qué hacer.

## Errores que ya conocemos

- `get_product_by_id` de un ganador sin el complemento *Product Finding Hub* da un error de «redirección inesperada»: no es
  un fallo ni un id malo. No reintentes: usa los datos del listado.
- `search_products` no ordena por `title` (falla): usa `view_count`, `created_at` o `product_details.min_price`.
- `search_products` sin la clave `filters` falla: para «sin filtros» manda `filters: []`.
- Las fotos de Amazon y de AliExpress grandes pesan mucho: `montar-informe.mjs` ya pide las miniaturas. Si alguna no baja,
  se queda con su enlace (en el artefacto puede no verse: no pasa nada).
- Mensajes viejos del juego decían «Hazme el radar de productos…»: es lo mismo, el informe.
