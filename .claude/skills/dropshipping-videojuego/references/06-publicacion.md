# Fase 6 — Publicar (subir los cambios a Shopify)

Regla central de la skill: **toda tanda de cambios termina con una subida
automática, sin que el usuario la pida.** Si no subes, el usuario mira su
tienda, no ve nada nuevo y concluye que "no ha funcionado".

La auto-revisión tras cada subida se hace **SIEMPRE en dos tamaños**
(escritorio 16:9 y móvil) e incluye la checklist del banner y la de costuras.
El banner cortado y las franjas entre bloques son los dos errores que más
veces llegan al usuario final: esta fase es el último filtro.

## El comando

```
shopify theme push --store NOMBRE.myshopify.com --path <carpeta> --theme <ID>
```

- Usa SIEMPRE el `--theme <ID>` del tema de trabajo (el que creaste en la fase
  2 con `--unpublished`). El ID sale en `shopify theme list --store ...` o en
  la salida del primer push. Guárdalo en `ESTADO.md` para no volver a
  preguntarlo.
- Sin `--theme`, el CLI pregunta interactivamente a qué tema subir — evítalo,
  los menús interactivos se llevan mal con la automatización y con el usuario.
- Para acelerar iteraciones puedes subir solo lo tocado:
  `--only sections/mt-hero.liquid --only assets/mt-styles.css` (repite el flag
  por archivo). Ante la duda, sube todo.
- NUNCA uses `--allow-live` para subir directamente al tema publicado mientras
  iteráis, salvo que el tema de trabajo YA sea el publicado (tienda lanzada) y
  el usuario quiera los cambios en vivo.

## Leer el resultado (no des nada por hecho)

El push puede terminar "con errores" y aun así subir parte. Trata cualquier
bloque `error` de la salida como bloqueante:

1. Lee el archivo y el mensaje (suelen venir claros:
   `sections/mt-footer.liquid - Invalid schema: ...`).
2. Corrige el archivo.
3. Vuelve a subir.
4. Repite hasta push limpio.
5. Solo entonces pasa a la auto-revisión.

Errores de validación frecuentes y su causa (detalle en la fase 4, sección de
trampas):

| Mensaje (aprox.) | Causa | Arreglo |
|---|---|---|
| `default debe ser una cadena o ruta de fuente de datos` en un setting url | `"default"` en un `"type": "url"` | Quitar el default del schema |
| `Invalid schema: ... JSON` | Coma final, comillas, comentario en el JSON | Reescribir el schema con JSON válido |
| `range` inválido | (max−min)/step > 101 | Ajustar step |
| `Section type 'xxx' does not exist` en un template | `type` del JSON no coincide con el nombre de archivo | Igualar nombres |
| `liquid syntax error` | Tag sin cerrar, filtro inexistente | Revisar el Liquid indicado |

## Previsualizar

Tras cada push limpio, el enlace de previsualización del tema de trabajo es:

```
https://NOMBRE.myshopify.com/?preview_theme_id=<ID>
```

(También sirve el botón "Vista previa" junto al tema en el panel.) Pero OJO:
**este enlace se enseña al usuario DESPUÉS de la auto-revisión, no antes.**

Alternativa para sesiones largas de diseño: `shopify theme dev --store ...`
levanta una vista en `http://127.0.0.1:9292` que se refresca sola con cada
cambio de archivo. Útil mientras iteras mucho; pero recuerda que dev NO
publica nada: al terminar la sesión de dev, haz el push normal igualmente.

## AUTO-REVISIÓN tras cada subida (el último filtro — no entregues sin esto)

Tú ejecutas TODOS los comandos (push, list, dev...) — nunca le pidas al
usuario que "tire un comando". Y tras cada push limpio, revisa tú mismo el
resultado desplegado ANTES de enseñarlo. Escalera de auto-revisión, de mejor
a peor:

### Nivel 1 — Con herramientas de navegador (captura de pantalla)

Abre la URL de previsualización y revisa la portada y la página de producto
**en DOS tamaños de ventana, siempre los dos**:

1. **Escritorio 16:9 — 1920×1080** (o el preset desktop de tu herramienta).
2. **Móvil — 390×844** (o el preset mobile).

En cada tamaño, captura la página COMPLETA (desplázate: los errores viven
también a mitad de página) y revísala como diseñador con esta checklist:

**Checklist del banner/héroe (el error nº 1 histórico):**
- [ ] El producto de la imagen se ve ENTERO: ni un píxel cortado por arriba
      ni por abajo, en 16:9 Y en móvil.
- [ ] La imagen cubre todo el héroe: sin franjas del color de la página por
      ningún borde.
- [ ] El texto superpuesto es legible (contraste suficiente, no pisa al
      producto).
- [ ] En móvil se está usando la imagen vertical (no la panorámica aplastada
      o recortada sin criterio) — contrato del banner, fase 3b.
- Si algo falla: regenera/recorta la imagen (otro `-CentroY`, más zona
  segura) o ajusta la posición focal del schema, vuelve a subir y REPITE la
  revisión. No "compenses" un banner malo con CSS.

**Checklist de costuras (el error nº 2 histórico):**
- [ ] Recorre las uniones entre bloques consecutivos (las anotaste en
      `ESTADO.md`, fase 4.7): ninguna franja del color de la página entre dos
      bloques.
- [ ] Ningún bloque "asfixiado": todo bloque con fondo propio respira por
      arriba y por abajo EN SU color.
- [ ] Los divisores/marquesinas de transición casan exactamente con el color
      del bloque siguiente.

**Checklist general:**
- [ ] ¿Textos cortados o solapados? ¿Imágenes sin cargar (iconos rotos)?
- [ ] ¿Scroll horizontal en móvil? (trampa nº 11 de la fase 4)
- [ ] ¿Las animaciones de entrada se disparan (no hay bloques invisibles que
      nunca aparecen)?
- [ ] ¿Se parece a lo acordado en el brief?

Corrige lo que veas y vuelve a subir. Solo cuando las dos capturas (16:9 y
móvil) pasen las tres checklists, enseña el enlace al usuario.

### Nivel 2 — Sin navegador (tienda protegida por contraseña)

Levanta `shopify theme dev --store ... --theme <ID>` en segundo plano — sirve
la web en `http://127.0.0.1:9292` SIN pedir la contraseña de la tienda (usa tu
sesión del CLI). Descarga ese HTML (curl/Invoke-WebRequest o tu herramienta de
lectura de páginas) y comprueba: que responden 200 la home y
`/products/<handle>`, que aparecen tus secciones (busca `mt-`), que no hay
errores Liquid en el HTML (busca "Liquid error"), y que los assets
(`mt-styles.css`, `mt-scripts.js`, imágenes) responden 200. Comprueba también
que la imagen del héroe referenciada en el HTML está al ratio final del
banner (generada o recortada a ese ratio) y que existe la variante móvil. Cierra el proceso dev al terminar. En este
nivel no puedes "ver" el banner: sé el doble de estricto aplicando el contrato
del banner en la fase 3b (revisión de la imagen recortada en local).

### Nivel 3 — Último recurso

Pide al usuario una captura ("ábreme este enlace y mándame una foto de cómo se
ve — una desde el ordenador y otra desde el móvil, si puedes") — solo si los
niveles 1 y 2 fallaron. Sus dos capturas pasan por las mismas checklists.

La contraseña de la tienda, si hiciera falta para la URL pública, pídesela
por chat ("está en tu panel: Tienda online → Preferencias, el cuadro de
contraseña — pégamela aquí") — nunca le digas que configure nada él.

## Antes de previsualizar: asigna la plantilla de producto

En cuanto el primer push limpio incluya `templates/product.mt.json`, asigna esa
plantilla al producto con la Admin API (no esperes a publicar):
`shopify store execute ... actualizar-producto.graphql` con
`templateSuffix: "mt"` (ver `references/09-admin-api.md`, apartado 4, y la fase
5). Así el enlace de previsualización del producto ya muestra TU diseño, sin
pedirle clics al usuario.

## Publicar en vivo (solo con OK explícito)

Cuando el usuario confirme que quiere ese diseño como SU web pública:

```
shopify theme publish --store NOMBRE.myshopify.com --theme <ID>
```

o desde el panel (Tienda online → Temas → ⋯ → Publicar). Pide confirmación
explícita antes ("¿La publico como tu web definitiva? Tu tema actual queda
guardado y se puede volver atrás."). Después de publicar, recuerda que el
tema de trabajo y el publicado son ahora el mismo: los push siguientes
necesitarán `--allow-live` (avisa al usuario de que sus cambios serán
visibles al instante).

## Después de cada publicación

1. Actualiza `ESTADO.md`: fecha, hora, qué se cambió, ID del tema, resultado
   de la auto-revisión (dos tamaños ✓).
2. Si quedó algo pendiente del lado del usuario (rellenar políticas, crear el
   producto, quitar la contraseña), recuérdaselo en una lista corta de ✅/⬜.

## Si viene de la web del juego: publícalo como tema activo

Con los mensajes del juego no se espera el visto bueno: tras la auto-revisión en 16:9 y móvil (y sus correcciones),
publícalo directamente como tema activo (`shopify theme publish --store … --theme <ID>`). La web le manda a abrir su tienda
en el móvil y tiene que ver la nueva; el tema anterior se queda en la biblioteca de temas de Shopify por si acaso.
