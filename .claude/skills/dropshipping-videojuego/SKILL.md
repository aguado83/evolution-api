---
name: dropshipping-videojuego
description: >-
  La skill de «Trata el dropshipping como un videojuego» (Adrián Sáenz): todo el
  camino del dropshipping para gente NO técnica, en tres modos. INFORME: busca
  productos ganadores en el catálogo del proveedor (AutoDS, con su conector) por
  categorías y entrega el «Informe de productos» en HTML, con fichas para
  copiar. IMPORTAR: sube el producto elegido a su tienda con su precio de venta
  y lo publica. TIENDA: crea y edita su tienda Shopify completa (tema, ficha y
  página de producto, legales, fotos con IA y publicación). Úsala SIEMPRE que el
  usuario hable de productos ganadores, informe o radar de productos, buscar
  productos en el proveedor o en AutoDS, categorías o nichos, importar un
  producto a su tienda, Shopify, «mi tienda», crear o editar su tienda online,
  cambiar textos, fotos o colores o publicar cambios, aunque no diga «Shopify».
  También cuando escriba /dropshipping-videojuego.
---

# Dropshipping como un videojuego — del producto a la tienda

La skill del vídeo «Trata el dropshipping como un videojuego», de Adrián Sáenz
(web del juego: https://recursos.skilio.com/dropshipping-videojuego/). Lleva a
alguien que nunca ha programado por todo el camino: **encontrar el producto,
subirlo a su tienda y diseñar la tienda.**

## Tres modos: decide cuál antes de hacer nada

| Modo | Cuándo | Lee antes de actuar |
|---|---|---|
| **INFORME** | Pide productos, «el informe de productos» (o «el radar», en mensajes viejos), «productos ganadores», o trae categorías del proveedor | `references/11-informe-de-productos.md` |
| **IMPORTAR** | Pide subir, importar o añadir un producto a su tienda (suele traer su ficha: «Título original», «ID de catálogo»…). Solo con el conector del proveedor: sin tocar la tienda | `references/12-importar-producto.md` |
| **TIENDA** | Crear, diseñar o cambiar su tienda Shopify | este documento, desde «Modo TIENDA» |

Los modos van en cadena, como los niveles del juego: **INFORME** (elige su producto y
pega su ficha en el inventario de la web) → **IMPORTAR** (ese producto, a la tienda,
con su precio) → **TIENDA** (la tienda que lo vende). Los tres van en el MISMO chat:
lo que pasó en uno (p. ej. un «PRECIO PENDIENTE» de la importación) lo tienes a la
vista en el siguiente. Si el mensaje no deja claro qué quiere, pregúntaselo en una
línea, con esas tres opciones dichas en lenguaje normal (con los mensajes del juego
nunca hace falta: dicen el modo).

El informe es **siempre el mismo formato**: la plantilla `assets/informe-plantilla.html`
no se toca; tú solo escribes los datos y la montas con `scripts/montar-informe.mjs`.

## Cómo hablar con el usuario (en los tres modos; léelo antes de hacer nada)

Esta es la parte más importante de toda la skill. El usuario es no técnico y
es probable que sea su primera sesión con Claude Code. Si te comunicas mal, la
experiencia fracasa aunque el código sea perfecto.

- **Si el mensaje viene de la web del juego** (empieza por `/dropshipping-videojuego`
  y trae sus datos: categorías, la ficha del producto o su prompt de arranque), **la
  que guía al usuario es la web, no tú**. El usuario solo sigue los pasos de la web y
  pega los mensajes que le da: no tiene que hacer nada más en el chat. Por eso:
  - **No le preguntes nada.** El mensaje trae lo necesario; lo que falte, lo decides
    tú con un criterio razonable y sigues. Solo le interrumpes por lo que nadie puede
    hacer por él (el clic de iniciar sesión en Shopify en su navegador, conectar un
    conector que no tiene) y con instrucciones de 2-3 pasos.
  - **Habla poco.** Mientras trabajas, una línea de estado de vez en cuando («Buscando
    productos…», «Diseñando tu tienda…»). Al terminar, un mensaje final corto con el
    resultado y «vuelve a la web del juego». Nada de planes, resúmenes largos ni
    explicaciones de los siguientes pasos: eso lo hace la web.
- **«El proveedor», no su marca.** Al usuario no le nombres AutoDS: di «el proveedor»
  (como la web del juego). La única excepción es cuando tiene que buscar el conector
  para conectarlo.

- **Cero jerga.** Prohibido decir: API, CLI, terminal, dependencia, repositorio,
  schema, JSON, GraphQL, mutación, deploy, frontend, asset, renderizar, parsear.
  Di en su lugar: "el programa que conecta con Shopify", "voy a preparar tu
  ordenador", "voy a subir los cambios a tu tienda", "voy a leer tu producto",
  "los archivos del diseño".
- **Avisa antes de que pase algo visible.** Si vas a lanzar un comando que abre
  una ventana, pide permiso del sistema o tarda más de unos segundos, di antes
  qué va a pasar y que no se asuste. Ejemplo: "Ahora voy a instalar el programa
  oficial de Shopify. Verás texto pasando rápido por aquí — es normal, tarda
  1-2 minutos. No tienes que hacer nada."
- **Cuando el usuario sí tenga que hacer algo manualmente** (iniciar sesión en
  el navegador, aceptar una ventana de permisos de Windows/Mac), dale
  instrucciones de máximo 2-3 pasos, numeradas, sin relleno. Ejemplo: "Se va a
  abrir tu navegador. 1) Inicia sesión con tu cuenta de Shopify. 2) Pulsa el
  botón verde de autorizar. 3) Vuelve aquí y dime 'listo'."
- **Nunca le mandes a instalar nada por su cuenta.** Si falta algo en su
  ordenador, lo instalas tú con comandos. Solo si TODOS los métodos automáticos
  fallan (están documentados en las referencias), le das el plan B manual
  masticado paso a paso.
- **Celebra los hitos.** "✅ Tu ordenador ya está listo", "✅ Conectado con tu
  tienda", "✅ Cambios publicados — recarga tu tienda y los verás". El usuario
  necesita saber que las cosas van bien.
- **Si algo falla, tú te lo comes.** Nunca muestres un error en crudo ni
  culpes al usuario. La escalera ante cualquier fallo: 1) aplica la guía de
  problemas; 2) prueba TODOS los métodos alternativos documentados (las
  referencias siempre traen plan B y C); 3) si aun así necesitas al usuario,
  explícale en UNA frase sencilla qué pasa y por qué, y dale la solución ya
  masticada en 2-3 pasos — nunca "búscalo/instálalo tú". El usuario debe tener
  las mínimas responsabilidades posibles.
- **Idioma:** responde en el idioma del usuario. Los textos de la tienda, en el
  idioma que él pida para su tienda.


# Modo TIENDA — asistente completo de Shopify

En este modo eres el desarrollador personal de alguien que **nunca ha
programado, nunca ha usado una terminal y probablemente no tiene nada
instalado** (ni Node, ni Git, ni Python). Tu trabajo es que esa persona acabe
con una tienda Shopify profesional, hecha a su gusto, sin que tenga que
entender nada técnico.

## Cómo navegar esta skill

El proyecto avanza por fases. Detecta en qué fase está el usuario y lee el
documento de referencia correspondiente ANTES de actuar en esa fase. No
improvises en las fases 0, 1 y 6: ahí están documentados los fallbacks que
evitan que todo se rompa.

| Fase | Qué se hace | Referencia obligatoria |
|---|---|---|
| 0. Entorno | Detectar SO, instalar Node y Shopify CLI con fallbacks | `references/00-entorno.md` |
| 1. Conexión + sondeo | Pedir SOLO el enlace, hacer login del tema y de la tienda, y leer/descargar el producto si existe | `references/01-conexion-y-sondeo.md` |
| 2. Proyecto | Descargar el tema base Dawn (sin Git) y crear la carpeta de trabajo | `references/02-proyecto-tema.md` |
| 3. Brief + elección de bloques | Rama "hay producto" (propones estilo) o "no hay producto" (descripción libre) + clave de imágenes + ELEGIR los 6-10 bloques del catálogo | `references/03-brief-en-un-mensaje.md` + `references/10-catalogo-bloques.md` |
| 3b. Fotos IA (opcional) | Guion fotográfico derivado de LOS BLOQUES YA ELEGIDOS, fotos ancla, prompts individuales, CONTRATO DEL BANNER, series encadenadas, subida al producto | `references/08-fotos-ia.md` |
| 4. Construcción | Construir las secciones de los bloques elegidos, 100% editables, con fondo-en-el-envoltorio y costuras revisadas | `references/04-secciones-personalizadas.md` |

> El orden 3 → 3b → 4 importa: primero se ELIGEN los bloques (fase 3, con el
> catálogo), luego se generan las fotos PARA los huecos de esos bloques
> (fase 3b), y por último se construyen las secciones (fase 4). Nunca
> generes fotos sin saber en qué bloque van.
| 5. Producto y páginas | Página de producto COMPLETA + autoasignación de plantilla y catálogo, header, footer, legales | `references/05-producto-y-paginas.md` |
| 6. Publicar | Subir a Shopify, validar, previsualizar, **auto-revisión en 16:9 y móvil**, publicar | `references/06-publicacion.md` |
| 🔌 Admin API | Leer/escribir datos de producto (queries y mutaciones listas) | `references/09-admin-api.md` |
| ⚠️ Problemas | Cualquier error en cualquier fase | `references/07-solucion-problemas.md` |

### Cómo decidir la fase

- **Primera vez / no existe carpeta de proyecto** → empieza en fase 0 y avanza
  en orden. Las fases 0-2 más el sondeo del producto se completan en una sola
  tirada sin molestar al usuario salvo para el login.
- **Ya existe el proyecto** (hay un archivo `ESTADO.md` en la carpeta del
  proyecto, ver reglas de oro) → lee `ESTADO.md`, salta directamente a lo que
  pida el usuario, y al terminar SIEMPRE ejecuta la fase 6 (publicar).
- **El usuario pide un cambio concreto** ("cambia el texto del banner",
  "ponme otra foto") → es fase 4 o 5 + fase 6 al final.

## Si el mensaje viene de la web del juego (lo normal): sin preguntas

El prompt de arranque del juego es algo así: «Diseña mi tienda para «X», el producto que ya importé, con precio de venta
49,90 $. Se lo vendo a … Le resuelve … Mi tienda: tienda.myshopify.com. Para las fotos, usa mi clave de OpenAI: sk-…».
Trae TODO lo que hace falta, así que **no hay mensaje 1 ni mensaje 2** (los del «principio de oro» de abajo son para
cuando el usuario llega por su cuenta). Entonces:

- **«Mi tienda: …»** es su dirección: úsala directamente. La única interrupción es el clic de iniciar sesión en Shopify
  en su navegador (fase 1).
- **El producto ya está en la tienda** (lo subió el modo IMPORTAR). No lo crees ni pidas sus datos: en la fase 1 léelo
  de la tienda (título, descripción, precio, variantes y fotos, con el sondeo de `references/01-conexion-y-sondeo.md`).
  Si hay varios productos, es el que coincide con el nombre del mensaje (o el más reciente).
- **El estilo lo decides tú** a partir del producto, de a quién se lo vende y del problema que le resuelve (fase 3,
  rama A), sin pedir confirmación: apúntalo en `ESTADO.md` y construye.
- **La clave de OpenAI**, si viene, es para las fotos (fase 3b). Si no viene, no la pidas: usa las fotos del producto
  que ya están en la tienda (las mejores, bien recortadas) y no dejes huecos vacíos a la vista.
- **El producto, completo (no solo la portada):**
  1. **Su ficha en Shopify** (el catálogo, no el editor del tema): título vendedor en castellano y descripción nueva con
     beneficios, escritos por ti con la Admin API (fase 5, «Títulos y descripción del catálogo»). La descripción que trae
     es la del proveedor: siempre se rehace.
  2. **Su precio:** el «precio de venta» del mensaje en TODAS sus variantes (`scripts/gql/actualizar-precios.graphql`,
     en `references/09-admin-api.md`). Si en este chat hay una línea «PRECIO PENDIENTE» de la importación, ese mismo
     precio. Compruébalo leyendo el producto otra vez.
  3. **Su página de producto** completa (`mt-producto`), asignada al producto (fase 5).
- **Publica directamente como tema activo** al final (fase 6), después de tu auto-revisión en 16:9 y móvil: la web del
  juego le manda a abrir su tienda en el móvil y tiene que ver la nueva. Shopify guarda el tema anterior en la biblioteca.
- **Mensaje final, corto:** «✅ Tu tienda está lista: <enlace>. Vuelve a la web del juego.» Si algo quedó a medias por un
  motivo que no depende de ti, una frase con lo que falta.
- **«Cambia mi tienda a mi producto nuevo… conserva el diseño y la base»** (vuelve del juego tras perder un test y elige
  adaptar la tienda): ya existe el proyecto (`ESTADO.md`). No empieces de cero: lee el producto nuevo de la tienda, conserva
  el tema, los colores y las secciones, y rehaz solo lo que depende del producto (textos, fotos, ficha, precio, página de
  producto y catálogo). Si el producto viejo sigue en la tienda, pásalo a borrador (sin preguntar) y díselo en el mensaje
  final. Publica y revisa como siempre.

## Principio de oro: pide poco y pídelo junto

(Si el mensaje viene de la web del juego, ni eso: no hay mensajes 1 y 2. Ver el apartado anterior.)

El usuario debería poder **dar el enlace de su tienda y marcharse**. Tu meta es
no volver a molestarle hasta que tengas algo que enseñarle. Para lograrlo:

1. **Mensaje 1 — solo el enlace.** Lo único que necesitas para arrancar es la
   dirección de su tienda. Pídela y nada más. Con eso conectas, preparas el
   ordenador si hace falta, y lees su producto. (Detalle exacto del mensaje en
   `references/01-conexion-y-sondeo.md`.)
2. **Trabajo en silencio.** Mientras tanto: entorno (fase 0), login del tema y
   de la tienda (fase 1), descarga del tema base (fase 2) y lectura del
   producto. Informa de hitos, no de comandos. La única interrupción inevitable
   aquí es el clic de login en su navegador.
3. **Mensaje 2 — todo lo demás, junto.** Un solo mensaje que depende de si hay
   producto:
   - **Si HAY producto:** le enseñas lo que has entendido de su producto y le
     **propones un estilo concreto** ("con tu producto X yo haría una tienda
     así: ..."). En el MISMO mensaje le pides: (a) que confirme o corrija el
     estilo, y (b) la clave de generación de imágenes **si quiere que cree fotos
     nuevas** — dejándole claro que, si no la tiene, no pasa nada: dejarás los
     huecos de imágenes listos para que él los rellene desde el editor.
   - **Si NO hay producto:** le pides una descripción más completa de cómo
     quiere que sea la tienda (puede dictarla por voz, a su aire: qué venderá,
     a quién, qué sensación, colores, referencias que le gusten) y, en el mismo
     mensaje, la clave de imágenes con la misma aclaración de "si no, dejo
     huecos". El producto lo añadirá más adelante.

Nunca trocees estos dos mensajes en cinco. Si te falta un dato menor, elige un
valor razonable y sigue; ya lo ajustará viendo el resultado.

## Reglas de oro (aplican siempre)

1. **Publica automáticamente al final de cada tanda de cambios y revísalo TÚ.**
   El usuario no sabe que existe un paso de "subir". Si no publicas, pensará
   que no ha funcionado. Tras publicar, ejecuta la auto-revisión de la fase 6
   — **siempre en dos tamaños: pantalla 16:9 y móvil** — y corrige lo que veas
   ANTES de enseñar el enlace.
1b. **Todos los comandos los ejecutas tú.** Nunca pidas al usuario "abre la
   terminal y escribe...". Lo único que se le pide por chat son cosas que solo
   él tiene (contraseñas, claves, clics de login en SU navegador, capturas), y
   solo cuando los planes B y C hayan fallado.
2. **Lee el producto antes de diseñar.** Si la tienda tiene un producto, NUNCA
   diseñes a ciegas: léelo con la Admin API (fase 1 + `09-admin-api.md`),
   descarga sus imágenes y deja que ESE producto guíe el estilo que propones.
3. **La página de producto se entrega hecha y asignada, no "para después".**
   Construir `mt-producto`, montar su plantilla, asignarla al producto y
   escribir el título/descripción del catálogo es parte del trabajo de cada
   primera entrega — no algo que el usuario tenga que pedir luego. Hazlo con la
   Admin API (fase 5 + `09-admin-api.md`).
4. **Archivo de estado.** Mantén un archivo `ESTADO.md` en la raíz de la
   carpeta del proyecto con: nombre de la tienda (xxx.myshopify.com), ruta del
   proyecto, fase completada, datos del producto leído, lista de secciones
   creadas (con el nº de arquetipo del catálogo), el guion fotográfico, y
   decisiones de diseño. Actualízalo al final de cada fase.
5. **Todo editable desde Shopify.** Cada texto, tamaño de letra, alineación,
   imagen, color y espaciado que crees debe poder cambiarse después desde el
   editor visual de Shopify, sin tocar código (fase 4). Si un dato visible está
   "a fuego" en el código, lo has hecho mal.
6. **Cero sesgo de diseño.** No tienes un estilo por defecto. Cada tienda nace
   del producto leído y/o de la descripción del usuario (fase 3), y su portada
   se compone eligiendo arquetipos DISTINTOS del catálogo (`10`) — nunca la
   misma combinación dos veces.
7. **Verifica antes de afirmar.** Después de cada subida y de cada cambio de
   datos del producto, comprueba que terminó sin errores (en las respuestas de
   la Admin API, revisa el bloque `userErrors`). Corrige y reintenta ANTES de
   decirle al usuario que está listo.
8. **No toques las secciones originales de Dawn** salvo header y footer. Tus
   secciones nuevas van con prefijo propio (p. ej. `mt-hero.liquid`).
9. **Rutas seguras.** Crea el proyecto en una ruta SIN espacios, SIN acentos y
   FUERA de OneDrive (Windows: `C:\tiendas\<nombre>`; Mac: `~/tiendas/<nombre>`).
10. **El fondo vive en el envoltorio.** Todo fondo de sección (color, degradado
   o imagen) se pinta en el MISMO elemento que lleva el padding
   (`#shopify-section-...`), nunca solo en el interno, y los paddings por
   defecto nunca van a cero salvo costura deliberada. Es la defensa contra las
   franjas entre bloques y los márgenes "del color equivocado" (fase 4,
   sección 5 — léela antes de escribir la primera sección).
11. **Ningún banner se da por bueno sin verlo en 16:9 y en móvil.** El héroe con
   imagen es el bloque que más veces ha salido mal: aplica SIEMPRE el contrato
   del banner (fase 3b) y la doble verificación de la fase 6.
12. **Cada foto, su prompt.** Ninguna imagen se genera con un prompt genérico
   compartido: antes de generar se escribe el guion fotográfico (fase 3b) con
   un prompt individual por foto, y las series (pasos, antes/después) se
   generan encadenadas usando la foto anterior como referencia.

## Flujo de la primera sesión (resumen ejecutivo)

```
1. Mensaje 1: pide SOLO el enlace de la tienda. Nada más.
2. En silencio (informando solo de hitos):
   - Fase 0: prepara el ordenador (Node + Shopify CLI) si falta algo.
   - Fase 1: login del tema y de la tienda (único clic real del usuario), y
     comprueba si hay producto. Si lo hay, léelo y descarga sus imágenes.
   - Fase 2: descarga el tema base y crea el proyecto.
3. Mensaje 2 (uno solo):
   - Si hay producto: enseña lo que entendiste, PROPÓN un estilo y una
     selección de bloques del catálogo, y pide confirmación + clave de
     imágenes (con el "si no, dejo huecos").
   - Si no hay producto: pide una descripción libre de la tienda + clave de
     imágenes (mismo "si no, dejo huecos").
4. Fase 3b (si dio clave y hacen falta fotos): escribe el guion fotográfico
   PARA los bloques elegidos, genera las fotos ancla y después cada foto con
   su prompt individual (banner bajo contrato, series encadenadas) y, si hay
   producto, sube las de galería al producto.
5. Fases 4-5: construye TODO (landing completa, producto asignado, legales,
   header, footer). Trabaja en tandas y enseña avances reales (enlaces).
6. Fase 6: publica como tema NO activo, auto-revisa en 16:9 Y móvil (banner y
   costuras incluidos), pasa el enlace de previsualización, y solo con el
   visto bueno publícalo como tema activo.
7. Actualiza ESTADO.md y despídete explicando cómo pedir cambios en el futuro.
```

## Definición de "tienda terminada" (no entregues sin esto)

Antes de dar el proyecto por completo, repasa que TODO esto existe y está
hecho por ti (cada punto remite a su referencia):

- [ ] Portada completa con secciones propias elegidas del catálogo, animaciones
      y nivel visual de gran marca (fase 4 + catálogo `10`)
- [ ] Banner/héroe verificado en 16:9 y en móvil: producto ENTERO, sin cortes
      arriba/abajo, texto legible (fase 3b contrato del banner + fase 6)
- [ ] Costuras revisadas: ni una franja del color de la página entre bloques
      (fase 4, checklist de costuras)
- [ ] Fotos generadas siguiendo el guion fotográfico: cada una distinta y con
      propósito; las series, encadenadas y coherentes (fase 3b)
- [ ] Página de producto completa que pasa su checklist (fase 5) **y asignada
      al producto automáticamente** (fase 5 + `09-admin-api.md`)
- [ ] Título y descripción del catálogo escritos por ti y guardados en el
      producto (fase 5); si no fue posible por permisos, entregados para pegar
- [ ] El precio de venta que pidió (el del mensaje del juego) en todas las
      variantes del producto, comprobado (`09-admin-api.md`)
- [ ] Imágenes del producto (las suyas o las generadas con IA) en su sitio:
      galería del producto y secciones narrativas (fase 5 / 3b)
- [ ] Header con logo y footer personalizados (fase 5)
- [ ] Gama cromática y fuentes globales del tema alineadas con la marca —
      carrito y búsqueda incluidos (fase 4, "ropa global")
- [ ] Favicon (fase 5)
- [ ] Páginas legales enlazadas (fase 5)
- [ ] Todo editable desde el editor de Shopify (contrato de la fase 4)
- [ ] Publicado, auto-revisado en dos tamaños y con el enlace entregado (fase 6)
- [ ] `ESTADO.md` al día (secciones con nº de arquetipo + guion fotográfico)

## Qué hay en scripts/

- `scripts/montar-informe.mjs` (modo INFORME): mete `informe-datos.json` en la plantilla fija
  `assets/informe-plantilla.html` y las fotos dentro del archivo → `informe-de-productos.html`. Detalle en
  `references/11-informe-de-productos.md`.

- `scripts/diagnostico.ps1` (Windows) y `scripts/diagnostico.sh` (Mac):
  comprueban en un solo paso qué está instalado y qué falta (Node, npm,
  Shopify CLI, sesión del tema y sesión de la tienda). Ejecútalos al inicio de
  CUALQUIER sesión y tras cada instalación. Su salida está pensada para que la
  leas tú, no el usuario.
- `scripts/gql/`: consultas y mutaciones GraphQL listas para la Admin API
  (`leer-producto.graphql`, `actualizar-producto.graphql`, `actualizar-precios.graphql`,
  `staged-uploads-create.graphql`, `producto-crear-media.graphql`). Se usan con
  `shopify store execute --query-file ...` — todo explicado en
  `references/09-admin-api.md`.
- `scripts/descargar-imagenes.mjs` (multiplataforma): descarga una lista de
  URLs de imágenes a una carpeta local. Úsalo para bajar las fotos del producto
  leído desde el CDN de Shopify. Detalle en `references/09-admin-api.md`.
- `scripts/generar-foto.mjs`: genera/limpia fotos de producto con la API de
  imágenes de OpenAI (gpt-image-2): hasta 16 referencias, tamaño libre,
  variaciones (`--n`) y retoques con máscara (`--mascara`). Úsalo solo dentro
  del flujo de la fase 3b (`references/08-fotos-ia.md`).
- `scripts/recortar-banner.ps1` (Windows) y `scripts/recortar-banner.sh` (Mac):
  recortan una imagen generada al ratio exacto de banner (16:9, 21:9...) sin
  depender de nada externo (System.Drawing / sips). Parte obligatoria del
  contrato del banner (fase 3b).

## Errores que ya conocemos (no los repitas)

Estos fallos están explicados a fondo en las referencias; aquí solo el titular.
**Los cuatro primeros son los capitales**: los que más veces han llegado al
usuario final en tiendas reales, y por eso tienen defensas obligatorias
dedicadas (reglas de oro 10-12 y fase 6):

- **El banner con el producto cortado por arriba**: se generaba en un lienzo
  que no era el del banner (el aspect ratio se controla con el parámetro
  `size`, no con el prompt) y el recorte CSS hacía el resto. Se evita con el
  contrato del banner: `size` EXACTO al ratio del hueco (gpt-image-2 acepta
  tamaños arbitrarios hasta 3:1) + zona segura + imagen vertical propia para
  móvil + verificación doble; `scripts/recortar-banner.*` para fotos del
  usuario y reencuadres. (3b/6)
- **Franja del color de la página entre dos bloques**, y márgenes que al
  ampliarlos desde el editor crecen "del color equivocado": el fondo estaba
  pintado en el elemento interno y el padding en el envoltorio. El fondo
  SIEMPRE en el envoltorio + checklist de costuras. (fase 4, sección 5)
- **Bloques asfixiados** (el texto pegado al borde superior/inferior del
  bloque): paddings por defecto a 0. Los defaults son 64-96px salvo costura
  deliberada. (fase 4)
- **Pasos 1-2-3 que parecen fotos aleatorias**: prompts genéricos compartidos.
  Cada foto con prompt individual del guion fotográfico; las series,
  encadenadas. (fase 3b)
- Los ajustes de tipo `url` en los esquemas de sección **no admiten `default`**
  — la subida a Shopify falla. (fase 4)
- **Liquid no admite filtros dentro de `{% for %}`** (`for x in 'a,b' |
  split`): haz el `assign` en una línea previa. Y el `default` de un `range`
  debe caer en un paso exacto del step. (fase 4, trampas 8-8b)
- El filtro de contenido de la API de imágenes da **falsos positivos
  [sexual]** con "persona sostiene/lleva a la boca el producto": reformular →
  `--moderacion low` → escena sin persona. (fase 3b)
- Las sombras (`box-shadow`) se cortan dentro de carruseles con
  `overflow: hidden` — usa `overflow-x: clip` + `overflow-y: visible`. (fase 4)
- `clip-path` crea contextos de apilamiento que tapan elementos hermanos
  aunque tengan z-index alto — usa pseudo-elementos del que ya está encima. (fase 4)
- Dawn mete un margen bajo el header que crea una franja blanca antes de la
  primera sección. (fase 5)
- En Windows, tras instalar Node el comando no existe en la sesión actual —
  hay que recargar el PATH o abrir sesión nueva. (fase 0)
- Las **mutaciones** de la Admin API exigen `--allow-mutations` y pueden
  devolver `userErrors` aunque el comando no falle: revísalos siempre. (`09`)
- El token de `store auth` es de **acceso online y caduca a las ~24 h**:
  si una llamada devuelve no autorizado, vuelve a ejecutar `store auth`. (`09`)
