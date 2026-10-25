# Fase 3b — Fotos de producto profesionales con IA (opcional)

Muchos usuarios solo tienen las fotos del proveedor: con textos feos
superpuestos, flechas, medidas, collages, fondos sucios. Esta fase convierte
esas fotos malas en fotos de producto limpias y profesionales (estilo "tienda
de Apple") usando la API de imágenes de OpenAI (**modelo gpt-image-2**), sin
que el usuario tenga que usar ninguna herramienta de diseño.

**Requisito de orden: esta fase va DESPUÉS de elegir los bloques** (fase 3 +
catálogo `10`). Las fotos se generan PARA los huecos de los bloques elegidos,
nunca al revés.

**Los cuatro pilares de esta fase (no te saltes ninguno):**

1. **El guion fotográfico**: cada foto se pide en una llamada individual con
   un prompt escrito para ESE hueco concreto. Prohibido el prompt genérico
   reutilizado.
2. **Las fotos ancla**: las 2-3 primeras fotos limpias del producto se
   convierten en la referencia común de TODAS las llamadas siguientes — así
   el producto y la estética no bailan entre fotos.
3. **El contrato del banner**: los banners se generan al ratio EXACTO del
   hueco (gpt-image-2 acepta tamaños arbitrarios), con zona segura, y se
   verifican en 16:9 y móvil. Es el error nº 1 histórico de esta skill.
4. **Series encadenadas**: pasos 1-2-3, antes/después y storyboards se generan
   en cadena, cada foto usando la anterior como referencia.

## Cuándo y cómo ofrecerlo

Durante la entrevista de diseño (fase 3), cuando veas las fotos del usuario:
si son material de proveedor (textos promocionales encima, infografías,
fondos inconsistentes), ofrécelo así:

> "Tus fotos sirven para que yo vea el producto, pero para la web quedarían
> mejor unas fotos limpias y profesionales. Puedo generarlas yo con
> inteligencia artificial a partir de las tuyas. Cuesta unos 2-3 € en
> créditos de OpenAI (una empresa de IA) y necesitarías crearte una cuenta
> ahí — te guío en 3 minutos. ¿Quieres?"

Si dice que no, sigue con sus fotos tal cual. Si dice que sí:

## Alta en OpenAI y clave (guía para el usuario)

Instrucciones cortas, sin la palabra "API" (di "clave"):

> 1. Entra en **platform.openai.com** y crea una cuenta (vale la de Google).
> 2. Dentro, ve a **Settings → Billing** (Facturación) y pulsa "Add to credit
>    balance" para añadir **10 $** de saldo (es el gasto máximo; las fotos nos
>    costarán solo una parte).
> 3. Ve a **API keys** (en el menú) y pulsa "Create new secret key". Dale un
>    nombre cualquiera y pulsa crear.
> 4. Copia la clave que aparece (empieza por `sk-`) y pégamela aquí en el chat.

Si el usuario se pierde, pídele una captura de lo que ve y guíale sobre ella
(la web de OpenAI cambia de vez en cuando; si algo no coincide, búscalo tú en
la documentación actual en vez de insistir con rutas viejas).

### Manejo de la clave

- Guárdala en un archivo `clave-openai.txt` en la **raíz** de la carpeta del
  proyecto (la subida del tema solo envía las carpetas del tema, así que este
  archivo nunca se sube a Shopify). Lee siempre la clave desde ese archivo;
  no la escribas en `ESTADO.md`, ni en ningún archivo dentro de `assets/`,
  `sections/`, etc., ni la imprimas en pantalla.
- Si una llamada devuelve 401, la clave está mal copiada: pide al usuario que
  la pegue de nuevo (puede crear otra, las claves solo se ven una vez).

## El modelo y la API (verificado contra la documentación oficial, julio 2026)

- **Modelo: `gpt-image-2`** — el más potente de OpenAI para foto de producto;
  destaca en edición a partir de imágenes de referencia y texto dentro de la
  imagen en varios idiomas.
- **Endpoints:**
  - Generar desde cero: `POST https://api.openai.com/v1/images/generations`
    (cuerpo JSON).
  - Generar a partir de referencias: `POST https://api.openai.com/v1/images/edits`
    (formulario multipart con `image[]` repetido por cada referencia, **hasta
    16 imágenes** por llamada). **Este es el que usarás casi siempre**: las
    referencias enseñan al modelo el producto y la estética, y el prompt
    describe la foto deseada.
- **Autenticación:** cabecera `Authorization: Bearer <clave>`.
- **`size` — apréndete esto, decide el banner:** gpt-image-2 acepta
  **cualquier tamaño** `ANCHOxALTO` que cumpla: ambos lados múltiplos de 16,
  lado mayor ≤ 3840, proporción máxima 3:1 entre lados, y total de píxeles
  entre 655.360 y 8.294.400. Es decir: **puedes (y debes) pedir el ratio
  EXACTO del hueco de destino**. Tamaños de cabecera para esta skill:
  - `1024x1024` — tarjetas, cuadrículas.
  - `1024x1536` — columnas verticales (2:3).
  - **`2048x1152` — banner 16:9 exacto** (borrador barato: `1280x720`).
  - **`2688x1152` — banner 21:9** (borrador: `1680x720`).
  - **`1152x2048` — héroe MÓVIL 9:16 exacto** (borrador: `720x1280`).
  - El aspect ratio se controla SOLO con `size`: pedir "más panorámica" en el
    prompt no cambia el lienzo. Y ojo al mínimo de píxeles: no existe
    "1024x576" (queda por debajo del mínimo); el borrador 16:9 barato es
    `1280x720`.
- **Otros parámetros:** `quality` (`low`/`medium`/`high`/`auto`), `n` (1-10
  variaciones del MISMO prompt en una llamada), `background` (solo
  `auto`/`opaque` — **gpt-image-2 NO soporta fondo transparente**),
  `output_format` (`jpeg` para la web) + `output_compression` (0-100),
  `mask` (ver "Retoques con máscara"), `moderation` (`auto`/`low`).
  **NO envíes `input_fidelity`**: en gpt-image-2 no se admite el parámetro
  porque el modelo ya procesa toda imagen de entrada en alta fidelidad
  automáticamente.
- **Respuesta:** JSON con `data[N].b64_json` (imagen en base64 — hay que
  decodificarla a archivo; el script de abajo lo hace).
- **Límites:** en cuentas nuevas (~Tier 1), unas 5 imágenes por minuto. Si
  recibes 429, espera 30-60 s entre llamadas.
- **Errores típicos:** `401` clave mal; `429` ritmo demasiado alto;
  `insufficient_quota` = sin créditos (que recargue saldo); `400` con mención
  de política de contenido = reformula el prompt; `400` por `size` = revisa
  las reglas de arriba (múltiplos de 16, ratio ≤ 3:1, mínimo de píxeles).
- **Falsos positivos del filtro de seguridad (`moderation_blocked`):** con
  productos que van a la boca o se sostienen cerca del cuerpo (boquillas,
  entrenadores respiratorios, cosmética...), el clasificador puede bloquear
  con `safety_violations=[sexual]` prompts totalmente inocentes — visto en
  producción con "la mujer sostiene/muestra el dispositivo sonriendo".
  Escalera de salida (en orden, las llamadas bloqueadas NO se cobran):
  1) reformula la ACCIÓN en lenguaje clínico y neutro; 2) añade
  `--moderacion low` (parámetro oficial `moderation: low`, filtrado menos
  estricto); 3) si persiste, cambia la escena: mismo mensaje narrativo sin la
  combinación persona+producto que dispara el filtro (p. ej. un bodegón de
  "rutina completada" en vez de "persona celebrando con el producto").
  No insistas más de 2-3 veces con la misma idea: quema tiempo y no converge.
- **Existe también la Batch API** (`/v1/images/generations` y
  `/v1/images/edits` en lote, 50% más barato, resultado hasta en 24 h).
  Casi nunca la usarás: la sesión con el usuario es interactiva y no puede
  esperar horas. Y NO la confundas con una herramienta de coherencia: las
  peticiones de un lote son independientes entre sí — la coherencia estética
  se consigue con las fotos ancla (abajo), no agrupando llamadas. Solo tiene
  sentido si el usuario pide un lote grande de fotos y dice explícitamente
  que no le corre prisa.

## Costes (mantén el gasto en ~2-3 $)

El precio va por tokens de salida: crece con el tamaño y la calidad. Por
imagen `1024x1024`: **low ≈ 0,006 $ · medium ≈ 0,05 $ · high ≈ 0,21 $** (las
referencias de entrada añaden ~0,01-0,03 $ por llamada). Un banner
`2048x1152` cuesta ≈ 2,25× lo que un `1024x1024` de la misma calidad — por
eso los borradores de banner se hacen en `1280x720`. Política de gasto:

- **Pruebas y variaciones: `low`**, con `--n 2` o `--n 3` en UNA llamada.
  Enseña las variaciones al usuario y solo la elegida se regenera en calidad
  buena.
- **Fotos definitivas de secciones: `medium`.** Es el punto dulce; con 30-40
  fotos medium el gasto total ronda los 2 $.
- **`high` SOLO para el hero** (la imagen grande de apertura) o impresión.
- Lleva la cuenta aproximada de lo gastado y dísela al usuario de vez en
  cuando ("llevamos unos 1,20 $ de los 10 $").

## El script incluido: `scripts/generar-foto.mjs`

La skill incluye un script de Node (ya instalado en la fase 0) que encapsula
toda la llamada y la decodificación. Úsalo SIEMPRE en lugar de montar la
petición a mano (multipart + base64 a mano falla mucho, sobre todo en
PowerShell 5.1):

```
node <ruta-skill>/scripts/generar-foto.mjs \
  --clave <proyecto>/clave-openai.txt \
  --prompt "<descripción de la foto deseada>" \
  --salida <proyecto>/assets/mt-producto-1.jpg \
  --ref <proyecto>/fotos-generadas/ancla-frontal.jpg \
  --ref <proyecto>/fotos-generadas/ancla-lateral.jpg \
  --calidad medium --tamano 1024x1024 \
  [--n 3] [--mascara <zona.png>]
```

- Sin `--ref` usa el endpoint de generación; con uno o más `--ref` (hasta 16)
  usa el de edición.
- `--n 2..10` genera variaciones del mismo prompt en una llamada; los
  archivos salen numerados (`mt-producto-1-1.jpg`, `mt-producto-1-2.jpg`...).
- `--mascara` adjunta una máscara PNG (ver "Retoques con máscara").
- `--moderacion low` relaja el filtro de contenido (para falsos positivos,
  ver "Errores típicos" arriba). No lo pongas por defecto: úsalo al reintentar.
- El script imprime `OK <ruta>` por cada imagen o `ERROR <detalle legible>`.
  Ante ERROR, consulta la tabla de errores de arriba.
- Copia las fotos originales del usuario a `<proyecto>/fotos-originales/` y
  las generadas intermedias a `<proyecto>/fotos-generadas/` (fuera de
  `assets/`, para no subir material de trabajo a Shopify).

---

## EL GUION FOTOGRÁFICO (obligatorio antes de generar nada)

El error histórico: pedir todas las fotos con el mismo prompt "foto de
producto profesional, fondo limpio..." cambiando dos palabras. Resultado:
fotos intercambiables, sin intención, que parecen elegidas al azar.

**La regla: una foto = una llamada = un prompt escrito para ese hueco.**

El guion se escribe DESPUÉS de elegir los bloques de la portada (fase 3 +
catálogo `10`): son los bloques los que dictan qué fotos hacen falta, con qué
formato y con qué intención. Antes de la primera llamada a la API, escribe en
`ESTADO.md` la tabla con TODAS las fotos que el diseño necesita:

| Campo | Qué contiene |
|---|---|
| Archivo | `mt-hero-fondo.jpg`, `mt-paso-2.jpg`... |
| Bloque de destino | Arquetipo y sección donde va (p. ej. "héroe nº1", "pasos nº49") |
| Formato | `size` exacto (p. ej. `2048x1152`) según el hueco del bloque |
| Encuadre | Qué se ve, desde dónde, qué ocupa el producto |
| **Qué la hace distinta** | La frase que la diferencia de TODAS las demás fotos del guion |
| Prompt | El prompt individual completo |

Reglas del guion:

- **Si no sabes escribir "qué la hace distinta", la foto sobra o está mal
  pensada.** Dos fotos con la misma frase diferenciadora = una de las dos se
  replantea.
- Cada prompt individual describe **una escena concreta**: lugar, luz, ángulo
  de cámara, qué hace el sujeto, dónde está el producto, qué emoción
  transmite. No "foto lifestyle del producto" sino "primer plano lateral de
  una corredora en un parque al amanecer, exhala con el entrenador en la boca,
  vaho visible, luz dorada rasante, el producto nítido y la cara en suave
  desenfoque".
- Un bloque con varias fotos (mosaico, galería, bento) = varias llamadas, una
  por celda, cada una con su escena. NUNCA "genera 4 fotos de usos variados"
  en una llamada. (`--n` no es para esto: genera variaciones de UNA escena
  para elegir, no escenas distintas.)
- Piensa el guion como un director de fotografía: variedad de planos (macro,
  medio, general), de contextos y de composición, pero **misma sesión**:
  define el vocabulario de luz/fondo/color en 1-2 frases al principio del
  guion y péganlo en todos los prompts.

## LAS FOTOS ANCLA (la coherencia del set se decide aquí)

Sin una referencia común, cada llamada "reinventa" el producto y la estética:
tonos que cambian, materiales que bailan, luz distinta en cada foto. La
defensa:

1. **Genera primero 2-3 fotos ancla del producto**: producto solo, limpio,
   sobre fondo neutro del brief, desde 2-3 ángulos distintos (frontal,
   lateral/trasera, detalle). Se generan con las fotos del usuario como
   referencia, en `medium`, y se revisan CON LUPA contra el producto real
   (forma, color exacto, válvulas, costuras, logo): son la "verdad" de la que
   copiará todo lo demás. Guárdalas en `<proyecto>/fotos-generadas/ancla-*.jpg`.
2. **Toda llamada posterior lleva las anclas como referencias** (además de lo
   que necesite: la foto del paso anterior en una serie, una foto del usuario
   con un detalle concreto...). Con hasta 16 referencias por llamada hay
   sitio de sobra.
3. **Opcional para estética fina**: cuando ya tengas 1-2 fotos de sección
   aprobadas que claven el ambiente (luz, paleta), añádelas también como
   referencia de estilo en las siguientes, pidiendo en el prompt "misma luz,
   misma paleta y mismo tratamiento que las imágenes de referencia".
4. Las anclas también sirven para la galería del producto (súbelas con la
   Admin API si son mejores que las fotos actuales del catálogo).

Así, las fotos de escenas distintas (tres personas, tres escenarios) siguen
pareciendo de la misma sesión: mismo producto exacto + mismo vocabulario de
set + mismas anclas de referencia.

## EL CONTRATO DEL BANNER (el error nº 1 de esta skill — cúmplelo entero)

Síntomas históricos: la imagen del héroe "no es lo bastante panorámica" y el
producto sale **cortado por arriba** en la web. Causas reales, en orden:

1. Se generaba en un lienzo que NO era el del banner y se dejaba que el CSS
   (`object-fit: cover`) recortara la diferencia — llevándose el producto.
2. El aspect ratio se intentaba forzar por prompt, y el prompt no cambia el
   lienzo: solo el parámetro `size` lo hace.
3. Nadie comprobaba el resultado en las proporciones reales (16:9 y móvil).

El contrato tiene cinco cláusulas. Todas obligatorias:

### Cláusula 1 — El `size` ES el ratio del banner

Todo banner/héroe se genera al ratio EXACTO de su hueco: **`2048x1152` para
16:9**, **`2688x1152` para 21:9** (borradores baratos: `1280x720` /
`1680x720`). Nunca un lienzo "parecido" que luego recorte el CSS, y nunca
cuadrado "y ya lo estirará el CSS". Si el hueco del diseño fuese más
panorámico que 3:1 (una cinta finísima), genera 3:1 y recorta en local
(cláusula 3).

### Cláusula 2 — Zona segura vertical en el prompt

Aunque el lienzo ya sea el correcto, `object-fit: cover` seguirá haciendo
microrecortes cuando la ventana real no coincida exactamente con el ratio de
la imagen (ventanas más anchas, héroes de altura fija). Por eso el prompt del
banner DEBE mantener lo importante lejos de los bordes: producto COMPLETO en
la **banda central del ~70% vertical**, y los bordes superior e inferior solo
con fondo/ambiente prescindible. Plantilla de frases que funcionan:

> "Composición panorámica de banner web. El producto aparece COMPLETO,
> ocupando como máximo dos tercios de la altura del encuadre, centrado
> verticalmente, con aire por encima y por debajo. Nada importante pegado al
> borde superior ni al inferior. Producto en el tercio [derecho/izquierdo],
> espacio negativo limpio en el resto para superponer texto."

- **Mejor producto contenido y entero que grande y decapitado**; en la web el
  texto además necesita aire.
- Pide el fondo "extendible": ambientes continuos (degradado, estudio, cielo,
  textura) que no sufran si un recorte se come unos píxeles de borde.

### Cláusula 3 — El recorte local, para lo que no salga ya al ratio

Con la cláusula 1, las fotos generadas ya nacen al ratio final. Los scripts
`recortar-banner.ps1/.sh` quedan para tres casos:

- **Fotos del usuario** usadas como banner (vienen en cualquier proporción):
  recórtalas TÚ al ratio del hueco antes de ponerlas en `assets/`.
- **Reencuadres**: si una generación quedó bien pero el motivo no está donde
  quieres, a veces sale más barato recortar (con `-CentroY`) que regenerar.
- **Ratios más panorámicos que 3:1** (límite de la API).

Uso:

```
powershell -ExecutionPolicy Bypass -File <ruta-skill>/scripts/recortar-banner.ps1 `
  -Entrada foto-original.jpg -Salida <proyecto>/assets/mt-hero-fondo.jpg -Ratio 16:9
bash <ruta-skill>/scripts/recortar-banner.sh foto-original.jpg <proyecto>/assets/mt-hero-fondo.jpg 16:9
```

**Regla invariable**: lo que entra en `assets/` como banner está SIEMPRE ya
al ratio final del hueco. Y después de generar o recortar, ABRE la imagen y
mírala: ¿producto entero, con aire arriba y abajo? Si no, regenera (en `low`
hasta que cumpla, luego calidad final). No "arregles" un banner malo
moviendo el CSS.

### Cláusula 4 — Móvil tiene SU imagen (vertical)

Un banner apaisado recortado a una pantalla de móvil (ratio ~9:19) es una
lotería. Genera para cada héroe una **segunda imagen vertical a
`1152x2048`** (borrador: `720x1280`) con su propio prompt (misma escena y
luz — pasa el banner de escritorio y las anclas como referencias —, encuadre
vertical, producto entero en la banda central, aire para el texto arriba o
abajo). La sección del héroe lleva DOS selectores de imagen (escritorio y
móvil) — el patrón `<picture>` está en la fase 4, sección 6b.

### Cláusula 5 — Verificación en dos tamaños antes de dar el héroe por bueno

Con el tema subido, la auto-revisión de la fase 6 comprueba el héroe en
**16:9 de escritorio (1920×1080) Y en móvil (390×844)**. Checklist específica
del banner: producto ENTERO (ni un píxel cortado arriba/abajo), texto legible
sobre la imagen, la imagen cubre todo el héroe sin franjas del color de la
página. Si algo falla, se corrige (regenerar / recortar con otro `-CentroY` /
ajustar la posición focal expuesta en el schema) y se vuelve a subir ANTES de
enseñar el enlace al usuario.

## SERIES ENCADENADAS (pasos, antes/después, storyboards)

Cualquier grupo de fotos que cuente una secuencia (cómo se usa en 3 pasos,
antes/después, mañana/tarde/noche, semana 1/2/3) se genera **en cadena**, no
en paralelo:

1. **Escribe la mini-historia primero**: para cada paso, UNA acción visible y
   distinta. Test: si tapas los números, ¿se distingue qué foto es el paso 1,
   cuál el 2 y cuál el 3 solo mirándolas? Si no, replantea las acciones
   (cambia el gesto, el encuadre o el estado del producto entre pasos — no
   solo "persona con producto" tres veces).
2. **Genera el paso 1** con las anclas del producto como referencia.
3. **Genera el paso 2 pasando la foto del paso 1 como referencia ADICIONAL**
   (`--ref paso-1.jpg --ref ancla-frontal.jpg ...`) y pidiendo: *"exactamente
   el mismo escenario, la misma persona, la misma cámara y la misma luz que
   la imagen de referencia; ahora [acción del paso 2]"*.
4. **El paso 3 usa la foto del paso 2** como referencia, igual.
5. **Revisa la serie en fila** (las tres juntas): mismo mundo, acciones
   claramente distintas, progresión legible. Si dos fotos se confunden,
   regenera la que menos cuente (en `low` hasta acertar la acción, luego
   calidad final).

Caso particular ya conocido — **antes/después con deslizador**: genera el
"antes"; para el "después" pasa el "antes" como referencia y pide *"el mismo
encuadre, cámara y luz exactos, cambiando únicamente X"*. Superpón el par
antes de darlo por bueno; si no cuadra el encuadre, regenera el "después".

## RETOQUES CON MÁSCARA (arreglar una zona sin tocar el resto)

El endpoint de edición acepta una **máscara**: un PNG con canal alfa y las
mismas dimensiones que la PRIMERA imagen de `image[]`. Las zonas
transparentes de la máscara marcan QUÉ se puede repintar; el resto se
conserva. Úsalo cuando una foto está bien salvo un detalle:

- El logo salió deformado → máscara sobre el logo + prompt describiendo el
  logo correcto (pasa además una ancla donde se vea bien).
- Un objeto extraño en el fondo → máscara sobre esa zona + "fondo continuo
  de estudio, sin objetos".
- Cambiar el color de UNA pieza sin regenerar la escena.

Con el script: `--mascara zona.png` (la primera `--ref` debe ser la foto a
retocar). Dos avisos: la máscara es una GUÍA (el modelo puede no respetar el
borde al píxel — revisa el resultado), y para crear el PNG con alfa sin
herramientas de diseño puedes generar el recorte con un pequeño script de
Node/PowerShell sobre la foto (rectángulo transparente sobre la zona). Si el
retoque con máscara no converge en 2 intentos, regenera la foto entera.

> Nota avanzada: la API de Responses ofrece edición multi-turno (la
> herramienta `image_generation` con `previous_response_id`), útil para
> iterar conversacionalmente sobre una imagen. Esta skill usa la Image API
> con referencias encadenadas porque el script la cubre de forma determinista
> y portable; no cambies de mecanismo salvo motivo concreto.

## Las fotos NO son copias 1:1 de las referencias

Error a evitar: tratar esto como "limpiar las fotos del usuario una a una".
Las referencias solo enseñan al modelo CÓMO ES el producto; la foto generada
debe ser lo que cada hueco del guion necesite:

- **Banner apaisado** para el hero — bajo el contrato del banner (arriba).
- **Vertical** (`1024x1536`, o `1152x2048` para héroe móvil) para columnas y
  composiciones altas.
- **Pares y series** — encadenadas (arriba).
- **Detalles/macro** (válvula, costura, material) para tarjetas de beneficios
  y hotspots.
- **Lifestyle** en los contextos reales de uso del brief — cada contexto su
  llamada y su escena, siempre con las anclas de referencia.
- **Bodegones de set** ("producto + bolsa de transporte + accesorios") para
  bloques "qué hay en la caja".

## Referencias multi-ángulo y contexto del producto (mejora el resultado)

- **En cada llamada pasa VARIAS referencias desde ángulos distintos** — las
  anclas ya te dan 2-3; añade las fotos del usuario que aporten geometría o
  detalle que las anclas no cubran. Con un solo ángulo el modelo se inventa
  el resto del producto. Si el usuario solo aportó un ángulo, pídele "un par
  de fotos más girando el producto, valen del móvil".
- **Pide al usuario una descripción del producto con sus palabras** (qué es,
  de qué material, qué tiene de especial, medidas si las sabe) y úsala para
  enriquecer los prompts de fotos Y los copies de la web. Lo que el usuario
  sabe de su producto no siempre se ve en las fotos (p. ej. "la tela es
  impermeable", "cabe en un bolsillo").

## Cómo escribir los prompts (esto decide la calidad)

1. **Describe el producto a partir de lo que VES en las referencias**, no en
   genérico: material, color exacto, forma, detalles (válvula, costuras,
   agujeros, logo). El modelo es fiel a las referencias, pero el prompt debe
   reforzar lo que no puede perderse.
2. **Especifica el fondo con intención, según dónde irá la foto:**
   - Si la foto debe FUNDIRSE con el fondo de la sección (ej. sección con
     fondo blanco y producto "flotando"): pide *"fondo blanco puro uniforme
     (#FFFFFF), sin sombra proyectada, sin viñeteado, sin degradados"* — y usa
     el MISMO color exacto que el CSS de la sección. NUNCA pidas fondo
     transparente (gpt-image-2 no lo soporta y saldrá un damero o un fondo
     inventado).
   - Si la foto va en una tarjeta/marco donde queda bien profundidad: pide
     *"fondo de estudio gris claro con sombra suave y realista bajo el
     producto"* (o el estilo del brief).
3. **Estilo fotográfico:** "fotografía de producto para e-commerce, luz de
   estudio suave, enfoque nítido, sin texto, sin marcas de agua, sin
   personas" (añade personas/contextos solo en fotos lifestyle).
4. **Fotos de contexto (lifestyle):** también puedes generarlas ("persona
   usando el producto en un avión, luz natural..."), pasando las anclas del
   producto. Para textos dentro de la imagen, indícalos entre comillas y en
   el idioma de la tienda.
5. **Coherencia de set:** define el vocabulario de luz/fondo en el guion
   fotográfico y péganlo en todas las llamadas, junto con las anclas.
6. Escribe los prompts en el idioma que prefieras (el modelo entiende
   cualquiera); lo importante es la precisión.

## Subir las fotos generadas al producto (galería del catálogo)

Si la foto debe aparecer en la **galería oficial del producto** (no solo en una
sección narrativa), súbela al producto con la Admin API. El flujo de tres pasos
(pedir destino → subir archivo → adjuntar al producto) está detallado en
`references/09-admin-api.md`, apartado 5, con el script `scripts/subir-foto.mjs`
y los archivos GraphQL `staged-uploads-create.graphql` y
`producto-crear-media.graphql`. Así la galería de la página de producto muestra
las fotos buenas sin que el usuario tenga que subirlas a mano.

- Sube al producto SOLO lo que deba salir en su galería (las anclas suelen
  ser candidatas perfectas). Lo decorativo de secciones (hero, lifestyle de
  la landing) va en `assets/` como cualquier imagen del diseño.
- Tras subir, las imágenes se procesan en segundo plano: pueden tardar unos
  segundos en verse. No es un error.

## Integración en la web (no cambia nada del contrato)

- Las fotos generadas se guardan en `assets/` con el patrón de nombres de la
  fase 3 y se usan como **valor por defecto** de cada `image_picker` (patrón
  if/else de la fase 4, sección 6). El usuario podrá sustituir cualquiera
  desde el editor de Shopify exactamente igual que antes.
- Tamaños: banners al ratio exacto del hueco (contrato); `1024x1024` para
  tarjetas y cuadrículas; verticales para columnas y héroe móvil.
- Tras integrar, sube y pasa el enlace de previsualización como siempre
  (fase 6), con la verificación en dos tamaños.

## Flujo completo recomendado

1. Usuario acepta → alta + clave → `clave-openai.txt`.
2. **Escribe el guion fotográfico completo en `ESTADO.md`** a partir de los
   bloques YA elegidos en la fase 3 (catálogo `10`): archivo, bloque, `size`
   exacto, encuadre, "qué la hace distinta" y prompt individual de cada foto.
3. **Genera y aprueba las fotos ancla** (2-3 ángulos del producto limpio).
4. Por cada foto del guion: variaciones en `low` con `--n 2` o `--n 3` → el
   usuario elige (o eliges tú si te dio carta blanca) → regenerar la elegida
   en `medium` (o `high` si es el hero). Siempre con las anclas de
   referencia. Banners: contrato completo (ratio exacto → zona segura →
   revisión). Series: encadenadas y revisadas en fila. Detalles torcidos en
   una foto por lo demás buena: retoque con máscara.
5. Integrar, subir, previsualizar y verificar en 16:9 + móvil.
6. Anota en `ESTADO.md`: qué fotos son generadas, con qué prompt (resumido),
   cuáles son las anclas, y el gasto aproximado acumulado.
