# Fase 4 — Construir secciones personalizadas 100% editables

Este es el corazón técnico de la skill. Cada sección que crees debe cumplir un
contrato: **el usuario puede cambiar después cualquier texto, imagen, tamaño,
alineación y espaciado desde el editor visual de Shopify, sin tocar código.**

## Índice

1. Arquitectura de archivos
2. Anatomía de una sección (plantilla canónica)
3. El contrato de editabilidad (checklist por sección)
4. Patrón de estilos por sección (`{% style %}` + schema)
5. LA REGLA DE ORO DEL ESPACIADO Y DEL FONDO (la causa nº 1 de webs feas)
6. Imágenes: image_picker con respaldo en assets
6b. Héroes full-bleed: imagen de escritorio + imagen de móvil
7. Montar la portada: templates/index.json + CHECKLIST DE COSTURAS
8. CSS global: tokens de diseño
8b. El listón visual y el catálogo de bloques
9. JavaScript: patrones seguros
10. TRAMPAS CONOCIDAS (leer antes de escribir la primera sección)

---

## 1. Arquitectura de archivos

- Un prefijo corto para todo lo tuyo, derivado de la marca (2-4 letras).
  Ejemplos abajo usan `mt-` (mi tienda). Aplica a archivos, clases CSS e IDs.
- `sections/mt-hero.liquid`, `sections/mt-resenas.liquid`, ... — una sección
  por bloque visual de la landing.
- `assets/mt-styles.css` — TODO el CSS propio en un único archivo.
- `assets/mt-scripts.js` — TODO el JS propio en un único archivo (si hay
  interactividad).
- No edites los archivos originales de Dawn (excepto `sections/header.liquid`
  y `sections/footer.liquid`, ver fase 5). No edites `layout/theme.liquid`
  salvo que sea imprescindible; las hojas de estilo se cargan desde cada
  sección (ver plantilla).

## 2. Anatomía de una sección (plantilla canónica)

Fíjate en el detalle MÁS importante de la plantilla: el padding **y el fondo** viven
los dos en el envoltorio `#shopify-section-...`. Ver sección 5 para el porqué.

```liquid
{{ 'mt-styles.css' | asset_url | stylesheet_tag }}

{% style %}
  #shopify-section-{{ section.id }} {
    padding-top: {{ section.settings.padding_top }}px;
    padding-bottom: {{ section.settings.padding_bottom }}px;
    background-color: {{ section.settings.color_fondo }};
  }
  #shopify-section-{{ section.id }} .mt-h2 {
    font-size: {{ section.settings.heading_size }}px;
    text-align: {{ section.settings.text_align }};
  }
  #shopify-section-{{ section.id }} .mt-body {
    font-size: {{ section.settings.body_size }}px;
    text-align: {{ section.settings.text_align }};
  }
{% endstyle %}

<section class="mt-bloque mt-section">
  <div class="mt-container">
    <h2 class="mt-h2">{{ section.settings.headline }}</h2>
    <p class="mt-body">{{ section.settings.body | newline_to_br }}</p>
  </div>
</section>

{% schema %}
{
  "name": "MT – Bloque",
  "tag": "section",
  "settings": [
    { "type": "text", "id": "headline", "label": "Título", "default": "..." },
    { "type": "textarea", "id": "body", "label": "Texto", "default": "..." },
    { "type": "header", "content": "Tipografía" },
    { "type": "select", "id": "text_align", "label": "Alineación",
      "options": [
        {"value": "left", "label": "Izquierda"},
        {"value": "center", "label": "Centro"},
        {"value": "right", "label": "Derecha"}
      ], "default": "left" },
    { "type": "range", "id": "heading_size", "label": "Tamaño del título (px)",
      "min": 20, "max": 80, "step": 2, "unit": "px", "default": 44 },
    { "type": "range", "id": "body_size", "label": "Tamaño del texto (px)",
      "min": 13, "max": 26, "step": 1, "unit": "px", "default": 17 },
    { "type": "header", "content": "Color y espaciado" },
    { "type": "color", "id": "color_fondo", "label": "Color de fondo del bloque",
      "default": "#FFFFFF" },
    { "type": "range", "id": "padding_top", "label": "Espacio superior (px)",
      "min": 0, "max": 160, "step": 8, "unit": "px", "default": 80 },
    { "type": "range", "id": "padding_bottom", "label": "Espacio inferior (px)",
      "min": 0, "max": 160, "step": 8, "unit": "px", "default": 80 }
  ],
  "presets": [ { "name": "MT – Bloque" } ]
}
{% endschema %}
```

Puntos no negociables de la plantilla:
- `presets` con `name`: sin esto la sección NO aparece en el editor para
  añadirla.
- Etiquetas (`label`) y nombres en el idioma del usuario, claros para no
  técnicos ("Espacio superior", no "padding-top").
- `newline_to_br` en TODOS los textarea: el usuario escribirá saltos de línea
  en el editor y espera verlos en la web.
- Agrupa ajustes con `{ "type": "header", "content": "..." }` para que el
  panel del editor sea navegable.
- El `default` de `color_fondo` se fija AL CONSTRUIR con el color real del
  brief para ese bloque (no dejes `#FFFFFF` si el bloque es oscuro).

## 3. El contrato de editabilidad (checklist por sección)

Antes de dar una sección por terminada, comprueba que el schema expone:

- [ ] Todos los textos visibles (text/textarea/richtext)
- [ ] Todas las imágenes (image_picker) y vídeos si los hay
- [ ] Tamaño de letra de título y cuerpo (range)
- [ ] Alineación del texto (select izquierda/centro/derecha)
- [ ] **Color de fondo del bloque** (conectado al ENVOLTORIO, ver sección 5)
- [ ] Espacio superior e inferior de la sección (range 0-160, con default ≠ 0
  salvo costura deliberada)
- [ ] Enlaces de los botones (url) y su texto (text)
- [ ] Cualquier parámetro visual decisivo de ESA sección (velocidad de un
  carrusel, separación entre tarjetas, tamaño de los iconos...) — si dudas de
  si exponerlo, exponlo
- [ ] Otros colores SOLO si la sección lo pide (color de texto/acento como
  `color`), con los colores de marca como default

## 4. Patrón de estilos por sección

Todo lo que dependa de un ajuste vive en el bloque `{% style %}` con el
selector `#shopify-section-{{ section.id }} ...`. Todo lo estructural
(layout, animaciones, hover...) vive en `mt-styles.css` con clases `mt-*`.
Así dos instancias de la misma sección pueden tener ajustes distintos sin
pisarse, y el CSS global se mantiene limpio.

## 5. LA REGLA DE ORO DEL ESPACIADO Y DEL FONDO

Esta sección corrige el error visual nº 1 de las tiendas generadas hasta
ahora: **franjas del color de la página entre bloques** y **márgenes que al
ampliarlos desde el editor crecen "del color equivocado"**.

### 5.1 Padding y fondo, JUNTOS en el envoltorio

**Todo el relleno vertical de una sección vive EXCLUSIVAMENTE en el div
envoltorio `#shopify-section-...` (controlado por padding_top /
padding_bottom), Y el fondo del bloque (color, degradado o imagen) se pinta
en ESE MISMO envoltorio.** El elemento interno (`<section class="mt-...">`)
tiene relleno vertical CERO y fondo transparente.

Por qué las dos mitades de la regla:

- **Padding en el envoltorio**: si el interno trae padding propio, el usuario
  pone "Espacio superior: 0" en el editor y sigue viendo un hueco imposible
  de quitar.
- **Fondo en el envoltorio**: si el fondo está en el interno, el padding del
  envoltorio se pinta del color de la PÁGINA. Consecuencias reales: (a) el
  bloque parece "asfixiado" (su color solo llega hasta donde llega el
  contenido), (b) entre dos bloques de colores distintos aparece una franja
  del color de la página que nadie pidió, y (c) cuando el usuario intenta
  arreglarlo añadiendo "Espacio superior" desde el editor, el espacio nuevo
  sale del color de la página en vez del color del bloque — no arregla nada.
  Con el fondo en el envoltorio, añadir espacio = el bloque respira EN SU
  color. Es lo que cualquiera espera.

Refuerzo en `mt-styles.css` por si algún estilo de Dawn interfiere:

```css
.mt-section { padding-top: 0 !important; padding-bottom: 0 !important; background: transparent; }
```

### 5.2 Defaults de espaciado: NUNCA cero por pereza (ritmo vertical)

Un bloque cuyo texto arranca exactamente en su borde superior queda feo
SIEMPRE. Los `default` de padding se eligen con esta escala de ritmo:

| Tipo de bloque | default arriba/abajo |
|---|---|
| Bloque normal de contenido | 80 / 80 |
| Bloque denso (tablas, specs, FAQ) | 64 / 64 |
| Bloque protagonista (manifiesto, CTA final) | 96-120 |
| Héroe full-bleed con imagen | 0 / 0 (la imagen ES el bloque) |
| Costura deliberada (marquesina pegada al héroe, banda separadora) | 0 en el lado pegado |

"Costura deliberada" significa que TÚ decides que dos bloques van pegados
(p. ej. héroe + marquesina): entonces el lado pegado va a 0 y **ambos bloques
comparten color de fondo en esa línea o el de abajo continúa la imagen del de
arriba** — nunca un 0 accidental con colores distintos.

### 5.3 Bloques con imagen de fondo full-bleed

Para héroes/bandas cuya "piel" es una imagen:

- La imagen debe cubrir el 100% del bloque: interno con `position: relative`
  y la imagen `position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover;` (o `background-image` con `cover` en el envoltorio).
- **El envoltorio lleva ADEMÁS un `background-color` del color dominante de
  la imagen** (ajuste "Color de fondo" con default elegido por ti mirando la
  foto). Así, si por cualquier motivo la imagen no cubre un píxel (carga,
  ratios raros, padding añadido por el usuario), lo que asoma es un color
  hermano de la imagen y no una franja del color de la página. NUNCA dejes
  el fallback en blanco/por defecto.
- El recorte de la imagen se controla con un ajuste de posición focal
  (select "Parte de la foto que debe verse: arriba/centro/abajo" conectado a
  `object-position`). Y el banner en sí cumple el contrato del banner de la
  fase 3b (generado al ratio exacto del hueco + zona segura), para que este
  `cover` solo haga microajustes.

## 6. Imágenes: image_picker con respaldo en assets

Las imágenes del usuario copiadas a `assets/` son el VALOR POR DEFECTO; el
editor permite sustituirlas. Patrón:

```liquid
{%- if section.settings.imagen != blank -%}
  <img src="{{ section.settings.imagen | image_url: width: 2000 }}"
       alt="{{ section.settings.imagen.alt | escape }}" loading="lazy">
{%- else -%}
  <img src="{{ 'mt-hero-fondo.jpg' | asset_url }}" alt="" loading="lazy">
{%- endif -%}
```

- `image_picker` NO admite `default` en el schema — por eso existe el patrón
  if/else con asset.
- La primera imagen visible de la página: `loading="eager"` y
  `fetchpriority="high"`; el resto `loading="lazy"`.

## 6b. Héroes full-bleed: imagen de escritorio + imagen de móvil

Todo héroe/banner con imagen lleva **DOS selectores de imagen**: la
panorámica de escritorio (generada o recortada al ratio final según el
contrato del banner, fase 3b) y una vertical para móvil.

**El contenido debe respetar el aire de cada foto.** Si la foto vertical de
móvil se generó con el aire arriba y el producto abajo (lo normal), el bloque
de texto va alineado ARRIBA en móvil (`align-items: flex-start`), no abajo —
si no, el texto pisa el producto. Y si en móvil no cabe todo el contenido en
la zona de aire, recorta contenido en ese breakpoint (p. ej. ocultar los
mini-argumentos si una marquesina contigua repite esos mensajes) en vez de
dejar que solape la foto. Patrón:

```liquid
<picture class="mt-hero-media">
  {%- assign movil = section.settings.imagen_movil -%}
  {%- if movil != blank -%}
    <source media="(max-width: 749px)" srcset="{{ movil | image_url: width: 1100 }}">
  {%- elsif section.settings.imagen == blank -%}
    <source media="(max-width: 749px)" srcset="{{ 'mt-hero-movil.jpg' | asset_url }}">
  {%- endif -%}
  {%- if section.settings.imagen != blank -%}
    <img src="{{ section.settings.imagen | image_url: width: 2400 }}"
         alt="{{ section.settings.imagen.alt | escape }}"
         loading="eager" fetchpriority="high">
  {%- else -%}
    <img src="{{ 'mt-hero-fondo.jpg' | asset_url }}" alt=""
         loading="eager" fetchpriority="high">
  {%- endif -%}
</picture>
```

En el schema: `imagen` ("Foto de fondo (ordenador)") e `imagen_movil`
("Foto de fondo (móvil)"), más el ajuste de posición focal de la sección 5.3.
Si no hay foto vertical generada, la de escritorio sirve de único fallback —
pero con clave de imágenes disponible, la vertical se genera SIEMPRE
(contrato del banner, cláusula 4).

## 7. Montar la portada: templates/index.json + CHECKLIST DE COSTURAS

La portada es `templates/index.json`: declara qué secciones aparecen y con qué
valores. Escríbelo entero con tus secciones en el orden acordado:

```json
{
  "sections": {
    "mt-hero": { "type": "mt-hero", "settings": { "headline": "..." } },
    "mt-beneficios": { "type": "mt-beneficios", "settings": { } }
  },
  "order": ["mt-hero", "mt-beneficios"]
}
```

- `type` = nombre del archivo de la sección sin `.liquid`.
- Los `settings` del JSON SOBREESCRIBEN los defaults del schema. Pon aquí los
  textos reales del usuario y deja los defaults del schema como genéricos
  razonables.
- Todo id que pongas en `order` debe existir en `sections` (y viceversa) o la
  subida falla.
- Valida el JSON mentalmente o con una herramienta antes de subir: una coma
  de más rompe toda la portada.

### La checklist de costuras (pásala SIEMPRE tras montar/retocar la portada)

Una "costura" es la línea donde termina un bloque y empieza el siguiente.
Recorre `order` de arriba abajo y, por cada PAR de bloques consecutivos
(header→1º incluido y último→footer incluido), responde:

1. **¿De qué color termina el de arriba y de qué color empieza el de abajo?**
   (color de fondo del envoltorio; si termina en imagen, el borde de la
   imagen).
2. La costura solo puede ser una de estas tres cosas:
   - **Continua**: mismo color de fondo a ambos lados → puede ir pegada.
   - **Contraste con aire**: colores distintos → AMBOS bloques tienen padding
     ≥ 48px en el lado de la costura (cada uno pintado de SU color, regla 5.1),
     de modo que el cambio de color es una línea limpia entre dos zonas que
     respiran.
   - **Transición diseñada**: un elemento hace el puente (marquesina,
     divisor de onda/diagonal SVG cuyo `fill` es EXACTAMENTE el color del
     bloque siguiente, degradado, solape). Ver arquetipos 97-100 del catálogo.
3. **Prohibido**: hueco del color de la página entre dos bloques que no lo
   usan (la franja fantasma). Si lo ves en la vista previa: el fondo de algún
   bloque está en el interno en vez del envoltorio (regla 5.1) o hay un
   margin externo perdido (los bloques no llevan margin vertical, solo
   padding).
4. Caso especial héroe-con-imagen → bloque siguiente: la imagen debe terminar
   EXACTAMENTE donde empieza el siguiente bloque (sin depender de alturas
   mágicas). Si el diseño pide que algo se solape (una tarjeta que "muerde"
   el héroe), hazlo con margin-top negativo del bloque siguiente documentado,
   no con huecos.

Anota en `ESTADO.md` el resultado: lista de costuras y qué tipo es cada una.
La auto-revisión de la fase 6 vuelve a mirarlas sobre la web real.

## 8. CSS global: tokens de diseño

Arranca `mt-styles.css` con variables derivadas del brief y úsalas en todo:

```css
:root {
  --mt-color-fondo: #...;
  --mt-color-texto: #...;
  --mt-color-acento: #...;
  --mt-fuente: 'X', -apple-system, sans-serif;
  --mt-radio: 16px;       /* esquinas */
  --mt-margen: 24px;      /* gutter lateral */
  --mt-ease: cubic-bezier(0.22, 1, 0.36, 1);
}
.mt-section { font-family: var(--mt-fuente); color: var(--mt-color-texto); }
.mt-container { max-width: 1200px; margin: 0 auto; padding: 0 var(--mt-margen); }
```

Responsive: diseña desktop y añade breakpoints a 990px y 540px como mínimo.
Las composiciones de columnas pasan a una columna en móvil; los tamaños de
letra grandes bajan con `clamp()` o en el breakpoint.

Si el brief pide una fuente de Google Fonts, cárgala en el `<head>` vía
`layout/theme.liquid` con `preconnect` — es de los pocos motivos válidos para
tocar ese archivo.

### No te olvides de la "ropa" global del tema

Tus secciones visten la marca, pero las partes NATIVAS de Dawn (carrito,
cajón del carrito, búsqueda, página 404, cuenta de cliente, avisos) siguen
con los colores y fuentes por defecto si no tocas la configuración global.
Edita `config/settings_data.json` (bloque `current`) para alinear:

- **Esquemas de color** (`color_schemes`): pon los colores de marca del brief
  en scheme-1 (fondo, texto, botón, etc.). Las secciones de Dawn los usan.
- **Tipografía** (`type_header_font`, `type_body_font`): elige de la librería
  de fuentes de Shopify la más parecida a la del brief (formato
  `nombre_n4`/`nombre_n7`; si dudas del identificador, busca la fuente en la
  documentación de Shopify Fonts en vez de inventarlo).
- Radios de botones/inputs/tarjetas si Dawn los expone y el brief tiene
  esquinas marcadas.

Así el usuario no se encuentra un carrito "de otra web" al comprar. OJO: si
el usuario ya retocó ajustes desde el editor, haz `pull` de `config/` antes
de tocar este archivo (ver guía de problemas, sección de conflictos).

## 8b. El listón visual y el catálogo de bloques

Shopify usa Liquid, no React — pero eso NO limita el resultado visual: todo
lo que un usuario admira en una web moderna de React se consigue igual con
CSS moderno + JS vanilla, que es exactamente lo que usamos. No entregues una
plantilla plana: el objetivo es que el usuario diga "esto parece la web de
una gran marca".

**El repertorio visual completo vive en `references/10-catalogo-bloques.md`:
100 arquetipos de bloque, ~70 con animaciones, efectos de scroll y reacciones
al ratón.** Cómo se usa está
explicado en su cabecera (elegir 6-10 por tienda, mínimo 3-4 espectaculares,
sin repetir combinaciones entre tiendas). Léelo al diseñar la estructura
(fase 3) y al construir cada bloque.

Reglas técnicas para que la locura no se vuelva en contra (aplican a TODOS
los arquetipos):
- Rendimiento: anima solo `transform` y `opacity` (van por GPU); jamás
  `width/height/top/left` en bucle. Un solo IntersectionObserver compartido.
- Accesibilidad: envuelve TODO en `@media (prefers-reduced-motion: reduce)`
  desactivando animaciones.
- Móvil: cada efecto debe degradar con elegancia (los sticky/parallax
  complejos pueden simplificarse bajo 990px).
- Cada efecto paramétrico expone sus diales en el schema (velocidad de la
  marquesina, intensidad del parallax...) — contrato de editabilidad.
- Reveals al hacer scroll (`opacity` + `translateY` escalonados vía
  IntersectionObserver) son el MÍNIMO de cualquier bloque — una web sin
  reveals parece muerta.

## 9. JavaScript: patrones seguros

- Un solo archivo `mt-scripts.js`, cargado con `defer` desde las secciones que
  lo necesiten: `<script src="{{ 'mt-scripts.js' | asset_url }}" defer></script>`.
- **GUARD de ejecución única (obligatorio).** Cada sección incluye su etiqueta
  `<script>` y el navegador ejecuta CADA etiqueta aunque el `src` sea el mismo
  (solo deduplica la descarga, no la ejecución). Con 10 secciones, todo se
  inicializa 10 veces: observers duplicados, canvas con 10 bucles de
  animación, y cualquier init que TRANSFORMA el DOM (p. ej. trocear un texto
  en spans) se re-aplica sobre su propio resultado y lo corrompe en silencio.
  Primera línea del IIFE, siempre:

  ```js
  if (window.__mtInit) return;
  window.__mtInit = true;
  ```
- Estructura: una función `init` por componente (`initCarrusel`,
  `initComparador`...), todas llamadas desde un único listener de
  `DOMContentLoaded`, y cada una empieza comprobando si su elemento existe
  (`if (!el) return;`) — así el mismo archivo sirve para todas las páginas.
- Animaciones de entrada: `IntersectionObserver` que añade una clase
  `.mt-visible` a los elementos `.mt-reveal`. CSS hace el resto. Respeta
  `prefers-reduced-motion`.
- Nada de librerías externas (ni jQuery, ni Swiper): todo vanilla. Un carrusel
  infinito se hace con animación CSS de `transform` y contenido duplicado.

## 10. TRAMPAS CONOCIDAS — léelas antes de escribir la primera sección

Errores reales encontrados construyendo tiendas así. Cada uno costó tiempo:

1. **`"type": "url"` NO admite `"default"`.** La subida falla con «default
   debe ser una cadena o una ruta de acceso de fuente de datos». Los enlaces
   por defecto van en el código con `| default: '#'` al renderizar, o en
   `templates/*.json`, nunca como default del schema.

2. **`box-shadow` cortada dentro de carruseles.** Un carrusel necesita
   recortar horizontalmente su contenido, pero `overflow: hidden` (u
   `overflow-x: hidden`) fuerza el eje vertical a comportarse como `auto` y
   corta las sombras/zoom de las tarjetas al hacer hover. Solución:

   ```css
   .mt-carrusel-wrap { overflow-x: clip; overflow-y: visible; }
   ```

   `clip` recorta sin crear contenedor de scroll, así `visible` en el otro
   eje funciona de verdad. Revisa TODOS los ancestros: basta uno con
   `overflow: hidden` para que se corte igual.

3. **`clip-path` crea contextos de apilamiento.** En un comparador
   antes/después (imagen recortada con `clip-path`), un elemento hermano con
   z-index alto puede quedar tapado igualmente. Solución robusta: dibujar la
   línea/elemento como `::before` del asa que ya está por encima (hereda su
   contexto de apilamiento). En general: si un z-index "no funciona",
   sospecha de un ancestro con `clip-path`, `transform`, `filter` u `opacity`.

4. **Franja blanca entre el header y la primera sección.** Dawn aplica un
   margen inferior al header. Fix en el CSS global:
   `.section-header { margin-bottom: 0 !important; }` (y/o poner a 0 el
   ajuste de margen del header en el editor).

5. **Padding interno no anulable** → ver sección 5.1.

6. **Franja del color de la página entre dos bloques** → el fondo está en el
   interno en vez del envoltorio (sección 5.1), o el héroe con imagen no la
   cubre al 100% y su fallback es blanco (sección 5.3). Pásale la checklist
   de costuras (sección 7).

7. **"Añado espacio desde el editor y crece de otro color"** → mismo origen:
   fondo en el interno. Sección 5.1. Es el síntoma que más confunde al
   usuario cuando ocurre, porque parece que el editor "no funciona".

8. **Los `range` tienen límite de pasos Y el default debe caer en un paso:**
   (max − min) / step debe ser ≤ 101, o la subida falla. Y el `default` debe
   ser alcanzable con el step («default debe ser un paso en el rango»): con
   min 0 y step 5, un default de 22 revienta la subida — usa 20.

8b. **NO se pueden usar filtros dentro de `{% for %}`.** `{% for x in
   'a,b,c' | split: ',' %}` falla con «Expected end_of_string but found
   pipe». Haz el `{% assign lista = 'a,b,c' | split: ',' %}` en una línea
   previa y luego `{% for x in lista %}`.

8d. **El mismo `<script src>` en N secciones se ejecuta N veces** → guard de
   ejecución única (sección 9). El síntoma es traicionero: efectos que
   funcionan "a medias" o DOM transformado que pierde sus clases, porque la
   segunda pasada procesa el resultado de la primera.

8e. **Cuidado con los espacios no separables invisibles en el código.** Un
   NBSP (U+00A0) colado en un literal JS/CSS parece un espacio normal pero
   rompe el salto de línea (o un selector) sin ningún error. Si un texto
   generado por JS no envuelve líneas, busca NBSP: `grep -nP '\xC2\xA0'`.

8c. **Dawn pinta `h1`–`h6` Y `blockquote` con su propio color.** Si tu sección
   o tarjeta oscura confía en heredar el color del envoltorio, esos elementos
   saldrán del color del esquema global (texto oscuro sobre fondo oscuro =
   invisible). Pon `color: inherit` en tus clases de titular (`.mt-h1`,
   `.mt-h2`, h3/h4 dentro de `.mt-section`) y en cualquier `blockquote`
   propio (reseñas). En general: cada elemento semántico que Dawn estiliza
   (blockquote, figure, summary...) necesita su reset.

8f. **El editor de Shopify re-renderiza secciones SIN recargar la página.**
   Tus inits de `DOMContentLoaded` no vuelven a correr y la sección recién
   renderizada queda "muerta" (o muestra el estado sin procesar). Dos reglas:
   (1) escucha también `document.addEventListener('shopify:section:load',
   initTodo)`; (2) haz cada init IDEMPOTENTE con un guard por elemento
   (`if (el.dataset.mtInit) return; el.dataset.mtInit = "1";`) para que
   re-ejecutar no duplique timers/observers ni re-procese DOM ya
   transformado. Corolario: cualquier transformación de texto que haga el JS
   (p. ej. convenciones tipo *asteriscos*) debe tener su versión en LIQUID
   como base — si el JS no corre, el usuario no debe ver sintaxis cruda.

9. **`newline_to_br` olvidado** en textareas: el usuario escribe párrafos en
   el editor y salen pegados en una línea.

10. **JSON del schema inválido** (coma final, comillas sin cerrar): el error
    del CLI dice el archivo pero no siempre la línea. Reescribe el schema con
    cuidado; los comentarios NO existen en JSON.

11. **Texturas/elementos absolutos que se salen**: toda sección con elementos
    `position: absolute` decorativos debe recortarlos (`overflow-x: clip` en
    la sección) o causarán scroll horizontal en móvil.

12. **Sombras/elementos que asoman por el borde inferior de una escena con
    altura fija**: deja colchón (padding-bottom interno + altura suficiente)
    en contenedores con `perspective` o alturas fijas; las sombras de los
    hijos transformados no expanden la caja.

## Flujo de trabajo de la fase

1. Escribe `mt-styles.css` (tokens + base) y `mt-scripts.js` (esqueleto).
2. Crea las secciones de una en una siguiendo la plantilla + checklist,
   con su arquetipo del catálogo anotado en `ESTADO.md`.
3. Monta `templates/index.json` y pásale la **checklist de costuras**.
4. Sube y previsualiza (fase 6) ANTES de enseñar nada — con la verificación
   en 16:9 y móvil. Enseña siempre el enlace de previsualización real, no
   descripciones.
5. Itera con el feedback del usuario. Cada tanda de cambios termina con una
   subida automática (fase 6).
6. Registra cada sección creada en `ESTADO.md` (archivo + arquetipo + qué hace).
