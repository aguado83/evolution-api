# Solución de problemas — consulta ante CUALQUIER error

Filosofía: el usuario nunca ve un error en crudo. Tú diagnosticas con esta
guía, arreglas, y solo si necesitas algo de él (una contraseña, un clic), se
lo pides masticado. Si un error no está aquí, lee el mensaje con calma: los
errores del Shopify CLI suelen decir archivo y causa.

## Comandos que "no existen"

| Síntoma | Diagnóstico | Arreglo |
|---|---|---|
| `node`/`npm`/`shopify` no se reconoce (Windows) | PATH de la sesión sin refrescar tras instalar | `$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")` y reintentar. Si persiste, probar ruta absoluta (`C:\Program Files\nodejs\node.exe`); si la absoluta funciona, seguir con PATH recargado por comando |
| Igual pero en Mac | PATH de zshrc no cargado en la sesión | `export PATH=~/.npm-global/bin:/usr/local/bin:$PATH` y reintentar |
| `shopify` existe pero PowerShell se niega a ejecutarlo (ExecutionPolicy) | Política de scripts | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force` |
| `npm install -g` falla con EACCES (Mac) | Permisos de /usr/local | Prefix propio: ver fase 0, sección Mac. NO usar sudo npm |
| `npm install -g` falla con EEXIST/EPERM (Windows) | Restos de instalación anterior o antivirus | `--force`; si persiste, esperar 1 min (antivirus) y reintentar |
| winget no existe | Windows antiguo o sin App Installer | Método B de la fase 0 (MSI silencioso) |
| Todo comando de red falla | Proxy corporativo, VPN, cortafuegos | Preguntar por VPN/red de empresa; probar con otra red (móvil) |

## Login y conexión

| Síntoma | Diagnóstico | Arreglo |
|---|---|---|
| El login se abre pero el comando muere antes de que el usuario termine | Timeout corto | Relanzar con timeout de 3-5 min y avisar al usuario de que tiene tiempo |
| Bucle de login infinito | Sesión corrupta | `shopify auth logout`, reintentar |
| Autenticado pero "no tienes permisos en esta tienda" | Cuenta equivocada (tiene varias) | `shopify auth logout` y login con la cuenta dueña de la tienda |
| "Store not found" | Dominio mal | Pedir la URL del panel completa y extraer el nombre |
| La tienda pública pide contraseña | Protección de tienda nueva (no es un error) | Contraseña en panel: Tienda online → Preferencias |

## Datos del producto (Admin API: store auth / store execute)

| Síntoma | Diagnóstico | Arreglo |
|---|---|---|
| `store auth`/`store execute` "no existe" o desconocido | Shopify CLI antiguo (<3.93) | `npm install -g @shopify/cli@latest` (fase 0) y reintentar |
| `store execute` responde no autorizado / 401 | Token online caducado (~24 h) o falta scope | Re-ejecutar `shopify store auth --store ... --scopes ...`; los scopes ya dados se conservan (≥3.93.1) |
| Una orden de cambio "no hace nada" | Faltó `--allow-mutations` o hay `userErrors` | Añadir `--allow-mutations`; leer `userErrors`/`mediaUserErrors`, corregir variables y reintentar |
| `Unknown argument "product"` / `required argument "input"` | Versión de API antigua en la tienda | Usar la forma `input:` o fijar `--version` reciente (ver `09-admin-api.md`, "Si una orden falla por versión") |
| El JSON en línea se rompe (Windows) | PowerShell 5.1 maquea comillas | Usar `--query-file` y `--variable-file` con archivos, no `--query`/`--variables` en línea |
| La foto subida no aparece en la galería | Media se procesa en segundo plano | Esperar unos segundos; verificar `status` con una nueva lectura del producto |
| El usuario no es dueño / rechaza permisos | Sin escritura | Plan B: pegar título/descripción y asignar plantilla a mano (fase 5) |

## Fotos IA (generación y banner)

| Síntoma | Diagnóstico | Arreglo |
|---|---|---|
| El banner sale poco panorámico por mucho que lo pida el prompt | El aspect ratio NO se controla por prompt sino con el parámetro `size`, y no se fijó al ratio del banner | Contrato del banner (fase 3b): pedir el `size` exacto del hueco (p. ej. `2048x1152` para 16:9 — gpt-image-2 acepta lados múltiplos de 16 hasta ratio 3:1) |
| El producto del banner sale cortado por arriba/abajo en la web | La imagen se generó con el producto llenando el lienzo (o en un lienzo que no era el del hueco) y el `cover` del CSS lo decapita | Regenerar al ratio exacto con la cláusula 2 del contrato (producto en la banda central ~70%, aire arriba/abajo); verificar en 16:9 Y móvil (fase 6) |
| El banner se ve bien en PC y mal en móvil (o al revés) | Una sola imagen para los dos formatos | Cláusula 4 del contrato: imagen vertical propia para móvil + patrón `<picture>` (fase 4, 6b) |
| Los pasos 1-2-3 (o cualquier serie) parecen fotos aleatorias | Prompts genéricos compartidos y generación en paralelo | Guion fotográfico + series encadenadas (fase 3b): un prompt individual por foto; cada paso usa la foto del anterior como referencia |
| Todas las fotos de la tienda parecen de sesiones distintas | Sin fotos ancla de referencia común y/o sin vocabulario de set | Generar primero las fotos ancla y pasarlas como `--ref` en TODAS las llamadas + definir luz/fondo en 1-2 frases del guion y pegarlas en todos los prompts (fase 3b) |
| El producto cambia de forma/color entre fotos | Llamadas sin las anclas como referencia (el modelo se lo inventa) | Fotos ancla (fase 3b): 2-3 ángulos aprobados del producto van de referencia en cada llamada |
| Una foto está bien salvo un detalle (logo deformado, objeto raro) | Regenerarla entera es lotería | Retoque con máscara (fase 3b): PNG con canal alfa sobre la zona + `--mascara`; si no converge en 2 intentos, regenerar |
| `401` / `429` / `insufficient_quota` al generar | Clave mal / ritmo / sin créditos | Tabla de errores de la fase 3b |
| `moderation_blocked` con `safety_violations=[sexual]` en una foto inocente | Falso positivo del clasificador con persona + producto en boca/mano (boquillas, cosmética...) | Escalera de la fase 3b: reformular la acción → `--moderacion low` → cambiar la escena (sin persona); las llamadas bloqueadas no se cobran |
| El modelo pinta un damero o un fondo raro | Se pidió fondo transparente (no existe en gpt-image-2) | Pedir el color de fondo EXACTO de la sección (fase 3b, prompts) |

## Push / subida

Primera regla: lee el bloque de error de la salida — dice el archivo. Tabla de
validaciones frecuentes en `06-publicacion.md`. Además:

| Síntoma | Diagnóstico | Arreglo |
|---|---|---|
| Push "succeeded with errors" | Algunos archivos subieron, los del error no | Corregir y re-push; no informar éxito hasta push limpio |
| Push interactivo se queda esperando | Falta `--theme` y el CLI pregunta | Añadir `--theme <ID>` (sale de `shopify theme list`) |
| "You can't push to a live theme" | Tema de trabajo = tema publicado | Añadir `--allow-live` SOLO si el usuario sabe que va en vivo |
| 401/403 a mitad de push | Sesión caducada | Relanzar (re-login automático) |
| Push lentísimo o cuelga | Muchos assets pesados / antivirus / OneDrive | Comprobar que el proyecto NO está en OneDrive; usar `--only` para subir lo tocado |
| Assets que no se ven tras subir | Caché del navegador | Recargar con Ctrl+F5 / Cmd+Shift+R; verificar en ventana privada |

## Visual (la web "se ve mal")

| Síntoma | Causa típica | Dónde está documentado |
|---|---|---|
| Franja del color de la página entre dos bloques | Fondo pintado en el elemento interno en vez del envoltorio, o héroe cuya imagen no cubre el 100% con fallback blanco | Fase 4, sección 5 (regla de oro) y trampas nº 6; checklist de costuras (fase 4.7) |
| El usuario añade "Espacio superior" y crece de OTRO color | Mismo origen: el fondo no está en el envoltorio que lleva el padding | Fase 4, sección 5.1 y trampa nº 7 |
| Bloque "asfixiado": el texto arranca pegado al borde del bloque | Paddings por defecto a 0 | Fase 4, sección 5.2 (ritmo vertical) |
| Hueco/franja blanca que el usuario no puede quitar con los ajustes | Padding en el elemento interno, o margen del header de Dawn | Fase 4: sección 5.1 y trampa nº 4 |
| Sombras/zoom de tarjetas cortadas | `overflow: hidden` en algún ancestro | Fase 4, trampa nº 2 (`overflow-x: clip` + `overflow-y: visible`) |
| Un elemento con z-index alto no se ve | Contexto de apilamiento por clip-path/transform/filter | Fase 4, trampa nº 3 (pseudo-elemento del que ya está encima) |
| Saltos de línea del editor no aparecen | Falta `newline_to_br` | Fase 4, trampa nº 9 |
| Scroll horizontal en móvil | Decorativos absolutos sin recortar | Fase 4, trampa nº 11 |
| Cambios de ajustes del editor que "no hacen nada" | El CSS pisa el valor del `{% style %}` con `!important`, o el ajuste no está conectado | Conectar el ajuste en el bloque `{% style %}`; evitar `!important` en propiedades expuestas como ajustes |
| La sección no aparece para añadir en el editor | Falta `presets` en el schema | Fase 4, plantilla canónica |
| Bloques que nunca aparecen (invisibles para siempre) | Reveal cuyo IntersectionObserver no se dispara o clase inicial `opacity: 0` sin JS cargado | Revisar `mt-scripts.js` (fase 4.9); fallback: sin JS, los elementos deben ser visibles |

## Página de producto

| Síntoma | Causa típica | Arreglo |
|---|---|---|
| "Añadir al carrito" no hace nada | Falta `{% form 'product' %}` o el `input[name=id]` no tiene id de variante válido | Receta de la fase 5, paso 1.2 |
| Precio no cambia al cambiar variante | El JS no actualiza precio + input id a la vez | Fase 5, paso 1.3 |
| Aparece un selector de variantes vacío | No se comprueba `product.has_only_default_variant` | Fase 5, paso 1.3 |
| La página sale sin datos / producto de ejemplo | El producto no existe o está en borrador, o el template no está asignado | Fase 5, pasos 0 y 3 |
| El usuario no ve la plantilla "mt" en el desplegable | El desplegable lista plantillas del tema PUBLICADO y el vuestro es de trabajo | Normal: previsualizar con `?preview_theme_id=<ID>`; asignar al publicar |
| Carrito/búsqueda con colores "de otra web" | `settings_data.json` sin tematizar | Fase 4, sección "ropa global del tema" |

## Entorno roto a mitad de sesión

- **Se cerró la terminal / Claude Code se reinició**: ejecuta el diagnóstico
  (`scripts/`), lee `ESTADO.md` del proyecto y continúa donde quedó. Para
  encontrar el proyecto: busca `ESTADO.md` bajo `C:\tiendas\` (Windows) o
  `~/tiendas/` (Mac).
- **El usuario borró/movió la carpeta**: re-descarga Dawn (fase 2) y luego
  `shopify theme pull --theme <ID>` para recuperar TODO lo construido desde
  Shopify (por eso publicamos siempre: Shopify es nuestra copia de seguridad).
- **Conflicto: alguien editó desde el editor de Shopify Y nosotros en local**:
  los push machacan lo del editor (los json de settings). Si el usuario ha
  estado retocando desde Shopify, haz `shopify theme pull --theme <ID> --only
  config --only templates` ANTES de tu siguiente tanda de cambios para traerte
  sus retoques.

## Cuándo rendirse y escalar al usuario

Casi nunca. Pero si tras 2-3 intentos con métodos distintos algo sigue
fallando (p. ej. una red corporativa que bloquea npm), explica el bloqueo en
una frase sin tecnicismos, da el plan B manual más corto posible, y deja
constancia en `ESTADO.md` de qué pasó y qué falta.
