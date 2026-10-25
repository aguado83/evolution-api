# Catálogo de bloques — 100 arquetipos para no repetirse nunca

Este catálogo existe porque las tiendas generadas caían siempre en los mismos
3-4 bloques (imagen + tres tarjetas, carrusel, pasos planos). Aquí hay 100
arquetipos; los marcados con 🔥 (~70) llevan animación, efectos de scroll o
reacción al ratón y son los que hacen decir "esto parece la web de una gran
marca".

## Cómo usar el catálogo

1. **En la fase 3**, al proponer la estructura de la portada, elige **6-10
   arquetipos** que cuenten la historia de ESE producto: apertura → interés →
   prueba → cierre. Nómbralos por número en la propuesta interna y en
   `ESTADO.md` (al usuario descríbeselos con palabras, sin números).
2. **Mínimo 3-4 arquetipos 🔥 por tienda.** Una tienda sin bloques
   espectaculares es una plantilla; una tienda donde TODO es espectacular es
   un parque de atracciones. Alterna: bloque 🔥 → bloque sereno → bloque 🔥.
3. **Nunca la misma combinación dos veces.** Si la última tienda llevó
   {1, 16, 49, 40, 89}, la siguiente no puede llevar ese mismo conjunto ni
   uno casi igual. Registra en `ESTADO.md` los arquetipos usados.
4. **Adapta, no copies.** El arquetipo es la composición y la interacción; la
   piel (colores, radios, tipografía, tono) sale SIEMPRE del brief. Dos
   tiendas con el arquetipo 67 no deben parecer la misma web.
5. **Elige por producto, no por espectáculo.** Un producto técnico pide
   comparativas y specs (F); uno emocional pide narrativa (C); uno visual
   pide galerías (G). El héroe se elige según la mejor foto posible.
6. Todo arquetipo cumple las reglas de la fase 4: contrato de editabilidad,
   fondo-en-el-envoltorio (5.1), ritmo vertical (5.2), costuras (7),
   `prefers-reduced-motion`, degradación móvil y solo `transform`/`opacity`
   en animaciones. Los que llevan fotos, cumplen el guion fotográfico de la
   fase 3b (y los banners, su contrato).
7. **Inventa a partir del catálogo.** Los arquetipos se pueden cruzar (un 27
   con las tarjetas del 16; un 67 con el cursor del 84). Si inventas uno
   nuevo que funcione, anótalo en `ESTADO.md` como candidato a catálogo.

---

## A. Aperturas / héroes (1-14)

1. 🔥 **Héroe panorámico con zona de aire** — Imagen banner (contrato del
   banner) con el producto a un tercio y texto sobre el espacio negativo.
   Entrada: imagen con zoom-out sutil, texto en reveal escalonado.
   *Úsalo cuando:* hay una foto de producto potente. *Nota:* posición focal
   expuesta en el schema; imagen móvil vertical propia (fase 4, 6b).
2. 🔥 **Héroe de vídeo en bucle** — Vídeo silencioso `cover` de fondo +
   claim + CTA. Degradado oscuro inferior para legibilidad. *Úsalo cuando:*
   el producto se entiende mejor en movimiento. *Nota:* `muted playsinline
   loop autoplay`; póster para móvil/ahorro de datos.
3. 🔥 **Split 50/50 asimétrico** — Mitad color de marca con titular gigante,
   mitad foto; la divisoria inclinada (clip-path) o curva. Hover: la foto
   escala 1.03. *Úsalo cuando:* marca con color fuerte. *Nota:* trampa nº 3
   de la fase 4 (clip-path y apilamiento); en móvil, apilado vertical.
4. 🔥 **Héroe editorial tipográfico** — Titular enorme (`clamp` hasta ~9vw)
   sobre fondo plano; una palabra clave lleva la foto DENTRO de las letras
   (`background-clip: text`). Foto panorámica debajo. *Úsalo cuando:* la
   marca es más concepto que objeto. *Nota:* fallback de color donde no haya
   soporte.
5. 🔥 **Producto flotante 3D** — Producto recortado grande que se inclina
   siguiendo al cursor (`rotateX/rotateY` ≤ 8º) con sombra que reacciona.
   Fondo radial de marca. *Úsalo cuando:* el producto es el héroe absoluto y
   hay foto limpia sobre fondo del color exacto de la sección (gpt-image-2 no
   hace transparencias — fondo igualado, fase 3b). *Nota:* en móvil la
   inclinación pasa a animación autónoma suave.
6. 🔥 **Héroe carrusel de claims** — 2-4 slides con crossfade automático,
   cada slide su texto/CTA editable (blocks del schema). *Úsalo cuando:* hay
   varios mensajes de peso equivalente. *Nota:* pausa al hover; puntos de
   navegación accesibles.
7. **Héroe minimal de lujo** — Mucho aire, titular serif contenido, UNA foto
   perfecta, fade lento. Sin más. *Úsalo cuando:* gama alta; la contención ES
   el lujo.
8. 🔥 **Héroe con marquesina integrada** — Banner + banda de
   beneficios/reseñas en marquesina infinita PEGADA a su borde inferior
   (costura deliberada: mismo fondo o continuación de la imagen). *Úsalo
   cuando:* quieres prueba social inmediata. *Nota:* resuelve de serie la
   franja héroe→siguiente; la marquesina duplica contenido con animación de
   `transform`.
9. 🔥 **Héroe spotlight** — Fondo oscuro; un foco radial (gradiente que sigue
   suavemente al cursor) ilumina el producto. *Úsalo cuando:* producto
   premium/tech. *Nota:* en móvil el foco queda fijo sobre el producto.
10. 🔥 **Héroe typewriter** — Imagen o color de fondo fijo; parte del titular
    se escribe y borra rotando 3 beneficios ("Respira mejor / Rinde más /
    Recupera antes"). *Úsalo cuando:* el producto tiene varios beneficios de
    igual rango. *Nota:* los 3 textos editables; cursor parpadeante CSS.
11. 🔥 **Héroe de doble variante** — Dos mitades verticales, cada una un
    color/uso/variante del producto; el hover expande la mitad activa
    (`flex-grow` animado). *Úsalo cuando:* 2 variantes o 2 públicos claros.
    *Nota:* en móvil, dos bandas apiladas sin expansión.
12. 🔥 **Héroe zoom-out cinematográfico** — La imagen carga a `scale(1.15)` y
    se asienta a 1.0 en ~1,2 s; el texto entra después, escalonado. *Úsalo
    cuando:* foto ambiental potente. *Nota:* solo `transform`; una vez, no en
    bucle.
13. **Héroe badge + estrellas** — Claim + valoración (★ 4,8 · 2.300 clientes)
    + foto lateral. *Úsalo cuando:* la prueba social real es fuerte. *Nota:*
    cifras editables; no inventes reseñas que el usuario no tenga.
14. 🔥 **Héroe sticky-shrink** — Al hacer scroll, el héroe se encoge y
    redondea esquinas hasta quedar como tarjeta antes de ceder el paso.
    *Úsalo cuando:* landing narrativa premium. *Nota:* scroll-driven con
    transform + border-radius; degrada a héroe estático bajo 990px y con
    reduced-motion.

## B. Beneficios y características (15-26)

15. **Grid clásico de 3-4 tarjetas con iconos** — Reveals escalonados. La
    base honesta de toda landing. *Nota:* iconos SVG inline editables por
    bloque del schema.
16. 🔥 **Tarjetas magnéticas** — Cada tarjeta se inclina hacia el cursor y un
    brillo radial lo sigue por dentro (variables CSS actualizadas por JS).
    *Úsalo cuando:* público joven/tech. *Nota:* inclinación ≤ 6º; sin efecto
    en táctil.
17. 🔥 **Hotspots sobre el producto** — Foto grande con puntos pulsantes
    anclados a partes del producto; hover/tap abre mini-tarjeta explicando
    esa parte. *Úsalo cuando:* el valor está en los detalles físicos
    (válvulas, costuras, materiales). *Nota:* posiciones de los puntos en %
    editables; en móvil, tap y tarjeta inferior fija.
18. **Lista editorial numerada** — Beneficios en filas con 01/02/03
    tipográficos gigantes semitransparentes detrás. *Úsalo cuando:* estética
    editorial/minimal.
19. 🔥 **Acordeón con imagen viva** — Acordeón de beneficios a un lado; abrir
    uno cambia con crossfade la imagen del otro lado. *Úsalo cuando:* 3-5
    beneficios con foto propia (guion fotográfico: una escena por beneficio).
    *Nota:* precarga las imágenes; primera abierta por defecto.
20. **Bandas alternas imagen/texto** — El zig-zag clásico, reveals entrando
    desde el lado correspondiente. *Úsalo cuando:* hay 2-4 historias con
    foto. *Nota:* variar respecto al resto de la página; no más de 3 bandas.
21. 🔥 **Marquesina doble de beneficios** — Dos filas infinitas en
    direcciones opuestas con chips ("✓ Envío 24h", "✓ 3 min al día"); pausa
    al hover. *Úsalo cuando:* muchos micro-beneficios sueltos. *Nota:*
    contenido duplicado + animación transform; velocidad en el schema.
22. **Specs en dos columnas compactas** — Icono + dato breve, 6-8 ítems.
    *Úsalo cuando:* producto técnico y público informado.
23. 🔥 **Tarjeta protagonista + satélites** — Un beneficio estrella en
    tarjeta grande (con cifra count-up o mini-animación) y 2-4 menores
    alrededor. *Úsalo cuando:* hay UN diferencial claro. *Nota:* jerarquía
    visible: la grande 2x en área.
24. 🔥 **Tarjetas con vídeo-loop** — Cada tarjeta un mini-vídeo/`webm` en
    bucle silencioso mostrando el beneficio; hover lo reproduce/acelera.
    *Úsalo cuando:* beneficios demostrables en 2 segundos de movimiento.
    *Nota:* vídeos < 1 MB; póster de respaldo.
25. 🔥 **Nube de chips** — Beneficios como píldoras de tamaños distintos (los
    importantes más grandes), entrada escalonada, hover eleva. *Úsalo
    cuando:* tono fresco, muchos beneficios pequeños.
26. **Franja de garantías** — Envío, devolución, pago seguro, en línea sobria
    con iconos. *Úsalo cuando:* siempre viene bien cerca del CTA; también
    funciona como costura entre bloques.

## C. Narrativa / storytelling de producto (27-38)

27. 🔥 **Escena sticky tipo Apple** — El producto fijo (sticky) mientras 3-4
    párrafos pasan a su lado; cada párrafo activa un cambio en la imagen
    (crossfade o paso de giro). *Úsalo cuando:* producto con 3-4 ideas que
    contar en orden. *Nota:* IntersectionObserver sobre los párrafos; bajo
    990px pasa a bandas normales.
28. 🔥 **Zoom macro scroll-driven** — Una foto macro que se acerca ligada al
    scroll hasta revelar el detalle (material, textura). *Úsalo cuando:* la
    calidad física del producto es el argumento. *Nota:* `scale` sobre
    imagen `sticky`; degrada a imagen fija.
29. 🔥 **Capítulos horizontales** — Panel que traduce el scroll vertical a
    desplazamiento horizontal de 3-4 escenas (`translateX` en contenedor
    sticky). *Úsalo cuando:* historia con capítulos claros y fotos fuertes.
    *Nota:* de los efectos más "wow"; matemática simple: progreso vertical →
    porcentaje de translateX. En móvil: carrusel deslizable.
30. 🔥 **Manifiesto con subrayado vivo** — Párrafo grande centrado; las
    palabras clave se subrayan con un trazo que se dibuja al entrar en
    pantalla. *Úsalo cuando:* la marca tiene un porqué. *Nota:* subrayado =
    `background-size` animado o SVG `stroke-dashoffset`.
31. 🔥 **Frase que se ilumina palabra a palabra** — Texto grande gris que va
    pasando a color pleno palabra a palabra según avanza el scroll. *Úsalo
    cuando:* quieres un respiro editorial premium entre bloques densos.
    *Nota:* palabras en `<span>`; umbrales por índice.
32. 🔥 **Origen y materiales con líneas dibujadas** — Ilustración/mapa +
    hitos conectados por líneas SVG que se dibujan al entrar
    (`stroke-dashoffset`). *Úsalo cuando:* la procedencia o el proceso de
    fabricación venden.
33. **Problema → solución** — Dos paneles contrastados (oscuro/claro) con
    transición diagonal; el problema en tono apagado, la solución con el
    producto y color de marca. *Úsalo cuando:* el producto resuelve un dolor
    concreto y reconocible.
34. 🔥 **Producto explotado (exploded view)** — El producto se "desmonta" en
    3-4 capas/piezas al entrar en pantalla (PNG recortados con translateY
    escalonado) con etiquetas. *Úsalo cuando:* el interior/las capas son el
    argumento. *Nota:* fotos por pieza del guion fotográfico; fondo igualado
    al de la sección.
35. **Cita del fundador** — Retrato pequeño, cita en serif grande, firma.
    Fade suave. *Úsalo cuando:* marca personal o artesanal.
36. 🔥 **Antes/después con deslizador** — Comparador con asa arrastrable.
    *Úsalo cuando:* el resultado es visual. *Nota:* el par de fotos se genera
    ENCADENADO con el mismo encuadre (fase 3b); trampa nº 3 de la fase 4
    (clip-path); asa manejable con teclado.
37. 🔥 **Timeline de la experiencia** — Línea vertical que se dibuja al hacer
    scroll con hitos "Día 1 / Semana 1 / Mes 1". *Úsalo cuando:* el beneficio
    se despliega en el tiempo (hábitos, entrenamiento, cuidado).
38. 🔥 **Collage "cómo se hace"** — 3-5 fotos de proceso estilo polaroid con
    rotaciones sutiles; hover endereza y eleva la foto activa. *Úsalo
    cuando:* producción propia o artesanal (guion: una foto por paso real).

## D. Prueba social y confianza (39-48)

39. **Carrusel de reseñas** — Tarjetas con avatar, estrellas y texto;
    autoplay suave, pausa al hover. La opción por defecto — evita usarla si
    ya hay otro carrusel en la página.
40. 🔥 **Muro masonry de reseñas** — 6-9 tarjetas de alturas variadas en
    columnas, reveals escalonados; una destacada más grande con foto de
    cliente. *Úsalo cuando:* hay volumen de reseñas variadas.
41. 🔥 **Marquesina de reseñas** — Frases cortas + estrellas en banda
    infinita. *Úsalo cuando:* quieres prueba social sin gastar un bloque
    entero; también funciona como costura (ver 97).
42. **Banda "visto en"** — Logos de medios/marcas en gris; hover a color.
    *Úsalo cuando:* hay menciones reales (no inventes logos).
43. 🔥 **Reseña en vídeo (UGC)** — Vídeo vertical enmarcado en un mockup de
    móvil + cita destacada al lado. *Úsalo cuando:* el usuario tiene vídeos
    de clientes. *Nota:* play al clic, nunca con sonido automático.
44. 🔥 **Cifras de confianza** — 3-4 números grandes con count-up al entrar
    (clientes, países, valoración media, años). *Nota:* count-up una sola
    vez; cifras editables; no inventar datos.
45. **Testimonio a pantalla** — UNA reseña épica en tipografía enorme con
    comillas decorativas gigantes. *Úsalo cuando:* existe LA reseña perfecta.
46. 🔥 **Chat simulado** — Conversación estilo WhatsApp cuyos mensajes
    aparecen uno a uno al entrar en pantalla (con "escribiendo..."). *Úsalo
    cuando:* tono cercano; testimonios reales de chat. *Nota:* burbujas
    editables como blocks; máximo 4-6 mensajes.
47. 🔥 **Galería de clientes** — Grid de fotos tipo Instagram; hover revela
    @nombre y su frase. *Úsalo cuando:* comunidad visual real (o fotos
    lifestyle generadas claramente ilustrativas — sin inventar identidades).
48. **Garantía + reseña** — Tarjeta "30 días de garantía" con sello + una
    reseña que la respalda al lado. *Úsalo cuando:* el miedo a equivocarse es
    la objeción principal.

## E. Cómo se usa / proceso (49-56)

49. 🔥 **Pasos 1-2-3 encadenados** — Tres tarjetas cuyas fotos se generan EN
    SERIE (fase 3b: cada paso con la foto anterior como referencia — mismo
    set, acción distinta), conectadas por una línea/flecha que se dibuja al
    entrar. *Úsalo cuando:* el uso tiene pasos claros. *Nota:* test de la
    serie: sin números se distingue qué foto es cada paso.
50. 🔥 **Pasos con pestañas verticales** — Lista de pasos a la izquierda;
    clic (o autoplay con barra de progreso) cambia la foto grande derecha con
    slide. *Úsalo cuando:* más de 3 pasos o pasos con detalle.
51. 🔥 **Vídeo de uso con capítulos** — Un vídeo demostrativo con marcadores
    clicables que saltan a cada paso. *Úsalo cuando:* el usuario aporta un
    vídeo real de uso. *Nota:* `currentTime` por marcador; capítulos
    editables.
52. **Pasos en acordeón numerado** — Compacto, móvil-first. *Úsalo cuando:*
    los pasos necesitan texto largo.
53. 🔥 **Demostración sticky con tarjetas apiladas** — El producto fijo y los
    pasos llegan como tarjetas que se apilan encima al hacer scroll
    (stacking cards). *Úsalo cuando:* landing narrativa con pocos bloques.
    *Nota:* `position: sticky` + `top` escalonado; degrada a lista.
54. 🔥 **"X minutos al día"** — Círculo de progreso animado
    (stroke-dashoffset) con el tiempo de uso + 2-3 momentos del día con
    iconos. *Úsalo cuando:* la rutina corta es el argumento de venta.
55. **Do's & Don'ts** — Dos columnas ✓/✗ con microfotos; entrada alterna.
    *Úsalo cuando:* el mal uso es un problema real o hay comparación de
    hábitos.
56. 🔥 **Rutina en calendario** — Semana con días marcados; hover/tap en cada
    día muestra tooltip con la pauta. *Úsalo cuando:* productos de hábito
    (entrenamiento, cuidado personal).

## F. Datos, comparativas y especificaciones (57-66)

57. 🔥 **Tabla "nosotros vs. genérico"** — Columna propia destacada (elevada,
    color de marca) contra 1-2 alternativas; los checks aparecen fila a fila
    al entrar. *Úsalo cuando:* mercado con competencia barata. *Nota:* filas
    editables como blocks; honesto, sin inventar debilidades ajenas.
58. **Grid de especificaciones** — Pares etiqueta/valor en tipografía
    monoespaciada o tabular. *Úsalo cuando:* comprador técnico.
59. 🔥 **Barras comparativas animadas** — Barras que crecen (`scaleX`) al
    entrar, comparando 2-4 métricas. *Nota:* anima transform, no width;
    valores y etiquetas editables.
60. 🔥 **Medidores circulares** — Anillos de progreso con porcentaje count-up
    ("92% nota mejoría"). *Úsalo cuando:* hay datos de satisfacción o
    resultados. *Nota:* datos reales del usuario.
61. **Ficha técnica plegable** — Specs completas en desplegable para no
    ensuciar la landing. *Úsalo cuando:* el detalle importa a una minoría.
62. 🔥 **Comparador de variantes** — Botones de variante que cambian foto +
    specs con crossfade. *Úsalo cuando:* 2-4 variantes reales del producto.
63. 🔥 **"Qué hay en la caja"** — Bodegón cenital del set completo con
    etiquetas conectadas por líneas que se dibujan. *Nota:* foto de bodegón
    del guion fotográfico; etiquetas en % editables.
64. 🔥 **Dimensiones a escala** — Silueta del producto junto a un objeto
    cotidiano (mano, botella) con cotas que se dibujan. *Úsalo cuando:* el
    tamaño (grande o pequeño) es argumento o duda frecuente.
65. 🔥 **Calculadora de ahorro/beneficio** — 1-2 controles (rango) y un
    resultado en vivo ("ahorras ~X €/año", "Y sesiones/mes"). *Úsalo cuando:*
    el beneficio es cuantificable. *Nota:* fórmula y textos editables en el
    schema; count-up del resultado.
66. **Banda de certificaciones** — Sellos (CE, eco, cruelty-free...) con
    tooltip al hover. *Úsalo cuando:* existan certificaciones REALES.

## G. Galerías, mosaicos y medios (67-76)

67. 🔥 **Mosaico de usos con hover revelador** — Grid asimétrico (bento) de
    contextos de uso; al pasar el ratón la celda se oscurece y aparece
    "Ideal para X — porque Y". *Úsalo cuando:* el producto vive en varios
    escenarios. *Nota:* una foto POR celda con su propio prompt (guion
    fotográfico); en móvil el texto va siempre visible.
68. 🔥 **Bento box de características** — Cuadrícula tipo Apple/Linear con
    tarjetas de tamaños mixtos: una con cifra animada, otra con mini-loop,
    otra tipográfica. *Úsalo cuando:* producto tech o digital. *Nota:* cada
    celda un block del schema.
69. **Galería con lightbox** — Grid limpio; clic amplía con fondo oscurecido
    y navegación. *Úsalo cuando:* las fotos son el producto (decoración,
    arte).
70. 🔥 **Carrusel 3D coverflow** — Tarjetas en perspectiva que rotan al
    navegar; la central al frente. *Úsalo cuando:* pocas imágenes muy buenas.
    *Nota:* trampa nº 12 de la fase 4 (colchón para sombras con
    `perspective`).
71. 🔥 **Galería arrastrable** — Banda horizontal de fotos con drag-to-scroll
    con inercia y cursor personalizado "⟷ arrastra". *Úsalo cuando:* muchas
    fotos lifestyle. *Nota:* scroll nativo con `scroll-snap` + cursor CSS;
    en táctil ya es natural.
72. 🔥 **Collage editorial superpuesto** — 3-4 fotos solapadas con
    rotaciones sutiles y parallax entre capas al hacer scroll + un texto.
    *Úsalo cuando:* estética magazine/artesanal.
73. **Grid de Instagram** — Enlaza al perfil real; hover muestra el icono.
    *Úsalo cuando:* el usuario tiene Instagram activo (pide el @).
74. 🔥 **Producto 360º por pasos** — Secuencia de 6-12 fotos del producto
    girando, arrastrable con el ratón (se cambia el frame según el arrastre).
    *Úsalo cuando:* la forma 3D importa y se pueden generar los ángulos
    (serie encadenada con la misma luz). *Nota:* precarga; degrada a carrusel.
75. 🔥 **Panorámica de respiro** — UNA foto full-bleed ancha (contrato del
    banner) con parallax suave entre dos bloques densos; opcionalmente una
    frase. *Úsalo cuando:* la página necesita aire entre secciones cargadas.
76. 🔥 **Mosaico vivo** — Grid donde las celdas intercambian posiciones
    suavemente cada pocos segundos (FLIP con transform). *Úsalo cuando:*
    transmitir variedad/comunidad. *Nota:* pausa al hover y con
    reduced-motion.

## H. Interactivos y juguetes (77-88)

77. 🔥 **Selector de escenario** — Botones "En casa / En el gimnasio / De
    viaje" que cambian la escena completa (foto + titular + texto) con
    transición. *Úsalo cuando:* producto multi-contexto. *Nota:* una foto
    por escenario (guion fotográfico); escenarios como blocks.
78. 🔥 **Configurador visual de variante** — Swatches de color/talla que
    cambian la foto del producto al instante. *Úsalo cuando:* variantes con
    diferencia visual real. *Nota:* en la landing es narrativo; el selector
    de compra real vive en la página de producto (fase 5).
79. 🔥 **Quiz de recomendación** — 2-3 preguntas con chips y un resultado que
    recomienda modo de uso/variante. *Úsalo cuando:* el comprador duda entre
    opciones. *Nota:* preguntas, opciones y resultados 100% editables
    (blocks); sin datos personales.
80. 🔥 **FAQ desplegable animado** — Apertura suave (`grid-template-rows:
    0fr→1fr`), icono que rota. *Úsalo cuando:* siempre que haya objeciones —
    casi toda tienda lo lleva; por eso gana con detalles de animación.
81. 🔥 **Mapa de puntos de dolor** — Silueta (cuerpo, objeto, espacio) con
    zonas pulsantes clicables que explican dónde/cómo ayuda el producto.
    *Úsalo cuando:* salud, deporte, ergonomía, hogar.
82. 🔥 **Slider de intensidad** — Un control deslizante que el visitante
    arrastra y cambia foto + texto ("nivel principiante → pro", "día 1 → día
    30"). *Úsalo cuando:* el producto escala o progresa. *Nota:* estados
    como blocks (2-5); `input[type=range]` estilizado.
83. 🔥 **Rasca y revela** — Una capa (patrón/color) que se "limpia" con el
    ratón revelando un código de descuento o la foto (canvas + mask). *Úsalo
    cuando:* promo puntual y tono juguetón. Con moderación. *Nota:* botón
    "revelar" accesible como alternativa.
84. 🔥 **Cursor personalizado de sección** — Dentro de una galería el cursor
    se convierte en "Ver +"/lupa que sigue al ratón. *Úsalo cuando:* quieres
    rematar una galería premium. *Nota:* solo desktop; el cursor real nunca
    se oculta sin sustituto visible.
85. 🔥 **Fondo de partículas reactivo** — Partículas/burbujas/líneas en
    canvas que se apartan suavemente del cursor, tras el héroe o el CTA.
    *Úsalo cuando:* marca tech/energética. *Nota:* ≤ 60 partículas, pausado
    fuera de viewport (IntersectionObserver), apagado en móvil y
    reduced-motion.
86. 🔥 **A/B morph por pestañas** — Dos modos del producto alternables
    (día/noche, casa/exterior) con las cifras y la foto en transición
    animada. *Úsalo cuando:* dos modos de uso claros.
87. 🔥 **Estimador de envío** — Selector de país/zona que muestra la fecha
    estimada ("Llega el martes 12"). *Úsalo cuando:* el envío es ventaja
    competitiva. *Nota:* fechas calculadas en JS (hoy + días editables por
    zona); sin promesas que el usuario no pueda cumplir.
88. 🔥 **CTA magnético con brillo** — El botón principal se desplaza 2-6px
    hacia el cursor cuando se acerca y un brillo lo recorre cada pocos
    segundos. *Úsalo cuando:* cualquier CTA importante. *Nota:*
    desplazamiento sutil (nada de perseguir al ratón); normal en táctil.

## I. Cierres y conversión (89-96)

89. 🔥 **CTA a pantalla con fondo vivo** — Titular grande + botón sobre
    degradado animado lento o imagen con parallax. *Úsalo cuando:* cierre por
    emoción. *Nota:* degradado con `background-position` animado.
90. **Tarjeta de compra resumen** — Foto + precio + 3 bullets + botón en una
    tarjeta elevada. *Úsalo cuando:* cierre por claridad: todo lo importante
    en un vistazo.
91. 🔥 **Urgencia honesta** — Oferta/stock con barra de progreso animada o
    cuenta atrás editable. *Úsalo cuando:* hay una promoción REAL con fecha
    real. *Nota:* nunca inventes escasez falsa; el usuario configura fecha y
    texto.
92. **Bundle/packs** — 2-3 opciones de pack con la central destacada ("más
    popular"). *Úsalo cuando:* existe descuento por cantidad real.
93. 🔥 **CTA rodeado de marquesina** — Botón grande con banda infinita
    ("compra ahora ✦ envío 24h ✦ garantía 30 días ✦") rodeándolo o
    subrayándolo. *Úsalo cuando:* cierre con energía, marcas jóvenes.
94. **Garantía como cierre** — La garantía de devolución como protagonista
    (sello grande, texto claro) y el botón debajo. *Úsalo cuando:* producto
    nuevo o caro: elimina el último miedo.
95. **FAQ corto + CTA** — Las 3 objeciones típicas resueltas en desplegables
    justo encima del botón final. *Úsalo cuando:* producto que genera dudas
    prácticas (tallas, compatibilidad, uso).
96. **Newsletter con incentivo** — Email + promesa concreta ("10% en tu
    primer pedido"). SOLO si el usuario lo pide (necesita tener el email
    marketing montado).

## J. Bandas, transiciones y costuras (97-100)

97. 🔥 **Marquesina separadora** — Banda infinita de texto/iconos entre dos
    bloques de colores distintos: la transición SE COME la costura. *Úsalo
    cuando:* dos bloques consecutivos chocan de color (checklist de costuras,
    fase 4.7). *Nota:* dirección y velocidad en el schema.
98. **Divisor de onda/diagonal** — SVG de onda o diagonal entre bloques; su
    `fill` es EXACTAMENTE el color del bloque siguiente (variable CSS, no
    hardcodeado). *Úsalo cuando:* marcas orgánicas/suaves. *Nota:* el SVG
    pertenece al bloque de arriba y va pegado sin margen.
99. 🔥 **Banda de logos deslizante** — Variante sobria de marquesina para
    logos de prensa/certificaciones, monocroma. *Úsalo cuando:* necesitas
    autoridad y una costura elegante a la vez.
100. **Franja de anuncio editable** — Texto corto + enlace con fondo de
    acento (promo, envío gratis desde X). *Úsalo cuando:* hay un mensaje
    operativo temporal; el usuario la edita/oculta desde el editor.

---

## Recordatorios finales

- **Ritmo de página**: alterna densidad (bloque cargado → respiro), color
  (claro → oscuro con costura resuelta) y movimiento (🔥 → sereno). Una
  página bien ritmada con 7 bloques gana a una con 12 amontonados.
- **Cada foto de cada arquetipo sale del guion fotográfico** (fase 3b) — si
  montas un arquetipo con 4 fotos, son 4 llamadas con 4 prompts distintos.
- **Los banners de los arquetipos 1, 8, 12, 75 (y cualquier full-bleed
  apaisado) cumplen el contrato del banner** de la fase 3b, sin excepciones.
- Si un arquetipo interactivo no encaja con el tono del usuario (p. ej. 83 en
  una marca de lujo sobrio), no lo fuerces: el catálogo sirve al brief, no al
  revés.
