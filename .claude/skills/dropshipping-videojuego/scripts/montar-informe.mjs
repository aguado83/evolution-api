#!/usr/bin/env node
/*
 * Monta el informe de productos: mete los datos en la plantilla fija (assets/informe-plantilla.html)
 * y las fotos dentro del archivo, para que se vea igual como artefacto, en el navegador o sin internet.
 *
 * Uso:   node scripts/montar-informe.mjs <informe-datos.json> [salida.html]
 * Por defecto escribe informe-de-productos.html al lado del .json.
 *
 * Formato de informe-datos.json: ver references/11-informe-de-productos.md («El archivo de datos»).
 * La nota y el ranking los calcula la plantilla (misma fórmula siempre); aquí solo se valida y se empaqueta.
 * El informe NUNCA enseña el origen del producto (AliExpress…) ni su ID: aquí se quitan y, si aun así se cuela, no se monta.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const PLANTILLA = path.join(here, '..', 'assets', 'informe-plantilla.html');
const MAX_FOTOS = 5;            // fotos por producto que se meten en el archivo
const LIMITE_BYTES = 12e6;      // tope del archivo final (los artefactos admiten 16 MB)
const MAX_FOTO = 450e3;         // una miniatura más grande que esto no se mete (se deja el enlace)

const [, , entrada, salidaArg] = process.argv;
if (!entrada) {
  console.error('Uso: node scripts/montar-informe.mjs <informe-datos.json> [salida.html]');
  process.exit(1);
}
const salida = salidaArg || path.join(path.dirname(entrada), 'informe-de-productos.html');

const datos = JSON.parse(await fs.readFile(entrada, 'utf8'));
if (!Array.isArray(datos.productos) || !datos.productos.length) {
  console.error('✗ informe-datos.json no tiene "productos" (una lista con al menos uno).');
  process.exit(1);
}

/* ---- Validación suave: se corrige lo que se pueda y se avisa ---- */
const avisos = [];
const ocultos = new Set();   // los orígenes y sus IDs que se quitan: no pueden aparecer en ninguna parte del archivo
const sinOrigen = (s) => s.replace(/\s*\bali\s*-?\s*express\b\s*/gi, ' ').replace(/\s{2,}/g, ' ').trim();
const numero = (v) => (v == null || v === '' ? null : Number(String(v).replace(',', '.')));
datos.productos = datos.productos.map((p, i) => {
  const q = { ...p };
  for (const k of ['coste', 'envio', 'venta', 'pedidos', 'competidores', 'saturacion', 'envio_dias', 'valor']) {
    if (q[k] != null) q[k] = numero(q[k]);
  }
  if (!q.titulo) avisos.push(`#${i + 1}: falta "titulo" (el título original EXACTO del catálogo)`);
  if (!q.coste) avisos.push(`#${i + 1}: falta "coste"`);
  if (!q.venta) avisos.push(`#${i + 1}: falta "venta"`);
  if (q.envio == null) q.envio = 0;
  if (!q.nombre) q.nombre = String(q.titulo || 'Producto').slice(0, 40);
  if (q.nombre.length > 40) { avisos.push(`#${i + 1}: "nombre" pasa de 40 caracteres (lo recorto)`); q.nombre = q.nombre.slice(0, 40).trim(); }
  if (q.problema && q.problema.length > 80) avisos.push(`#${i + 1}: "problema" es largo (${q.problema.length} caracteres); mejor menos de 70`);
  if (!q.id) avisos.push(`#${i + 1}: falta "id" (el ID de catálogo: con él la importación encuentra el producto)`);
  /* Nunca el origen ni su ID (ni en las casillas ni en la ficha): la importación los saca del ID de catálogo */
  for (const k of ['proveedor', 'id_proveedor']) {
    if (q[k] != null && q[k] !== '') ocultos.add(String(q[k]));
    delete q[k];
  }
  for (const k of ['nombre', 'titulo', 'problema', 'categoria']) if (typeof q[k] === 'string') q[k] = sinOrigen(q[k]);
  /* «VER EN EL PROVEEDOR» siempre a su página en el proveedor (AutoDS), nunca a la tienda de origen */
  if (q.id && !/^https:\/\/platform\.autods\.com\//.test(q.enlace || '')) q.enlace = `https://platform.autods.com/marketplace/all-products/${q.id}`;
  if (!q.id && q.enlace && !/^https:\/\/platform\.autods\.com\//.test(q.enlace)) delete q.enlace;
  return q;
});

/* ---- Fotos: miniaturas, dentro del archivo ---- */
function miniatura(url) {
  if (!url || url.startsWith('data:')) return url;
  if (/alicdn\.com/.test(url) && !/_\d+x\d+\.(jpg|png|webp)$/i.test(url)) {
    const ext = /\.png$/i.test(url) ? 'png' : 'jpg';
    return `${url}_350x350.${ext}`;
  }
  if (/media-amazon\.com/.test(url)) return url.replace(/\._[A-Z]{2}\d+_\./, '._SS350_.');
  return url;
}
async function aDataURI(url) {
  const tries = [miniatura(url), url].filter((u, k, a) => u && a.indexOf(u) === k);
  for (const u of tries) {
    try {
      const r = await fetch(u, { signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'Mozilla/5.0 (informe dropshipping-videojuego)' } });
      if (!r.ok) continue;
      const tipo = (r.headers.get('content-type') || '').split(';')[0];
      if (!tipo.startsWith('image/')) continue;
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length > MAX_FOTO) continue;
      return `data:${tipo};base64,${buf.toString('base64')}`;
    } catch { /* se prueba la siguiente */ }
  }
  return null;
}
const tareas = [];
datos.productos.forEach((p) => {
  const lista = [p.imagen, ...(p.imagenes || [])].filter(Boolean).filter((u, k, a) => a.indexOf(u) === k).slice(0, MAX_FOTOS);
  p.imagen = lista[0] || '';
  p.imagenes = lista.slice(1);
  /* El enlace original de la foto principal se guarda aparte: la ficha (COPIAR FICHA) lo lleva para la web del juego */
  if (/^https?:\/\//.test(p.imagen)) p.foto = p.imagen;
  lista.forEach((u, k) => tareas.push({ p, k, u }));
});
let hechas = 0, fallidas = 0, peso = 0;
async function trabajador() {
  while (tareas.length) {
    const t = tareas.shift();
    if (peso > LIMITE_BYTES && t.k > 0) { fallidas++; continue; }
    const d = await aDataURI(t.u);
    if (d) {
      peso += d.length;
      if (t.k === 0) t.p.imagen = d; else t.p.imagenes[t.k - 1] = d;
      hechas++;
    } else fallidas++;
  }
}
await Promise.all(Array.from({ length: 8 }, trabajador));
/* Si alguna foto de galería no se pudo meter, fuera (mejor que un hueco roto); la principal se queda con su enlace */
datos.productos.forEach((p) => { p.imagenes = p.imagenes.filter((u) => u && u.startsWith('data:')); });

/* ---- Empaquetar (el título del documento es siempre «Informe de productos», el de la plantilla) ---- */
if (!datos.envio_a) avisos.push('falta "envio_a" (el país de la región de la cuenta del proveedor, p. ej. «Estados Unidos»): la ficha sale sin «Destino del envío»');
const plantilla = await fs.readFile(PLANTILLA, 'utf8');
const json = JSON.stringify(datos).replace(/</g, '\\u003c');
const html = plantilla.replace('__DATOS__', () => json);
/* Comprobación final: ni el origen ni su ID en el archivo (fuera de los enlaces de las fotos, que no se ven) */
const visible = json.replace(/data:[^"]*/g, '').replace(/https?:\/\/[^"\s]*/g, '');
const cuela = [...ocultos].filter((v) => v.length > 3 && (/^\d+$/.test(v) ? html.includes(v) : visible.toLowerCase().includes(v.toLowerCase())));
if (/ali\s*-?\s*express/i.test(visible) || cuela.length) {
  console.error(`✗ No lo monto: el informe enseñaría el origen del producto (${cuela.join(', ') || 'AliExpress'}). Quítalo de informe-datos.json y vuelve a montar.`);
  process.exit(1);
}
await fs.writeFile(salida, html, 'utf8');

const kb = Math.round(Buffer.byteLength(html) / 1024);
console.log(`✓ Informe listo: ${path.resolve(salida)}`);
console.log(`  ${datos.productos.length} productos · ${hechas} fotos dentro del archivo${fallidas ? ` (${fallidas} sin poder bajar: se quedan con su enlace o fuera de la galería)` : ''} · ${kb} KB`);
if (avisos.length) {
  console.log('  Avisos:');
  avisos.slice(0, 20).forEach((a) => console.log('   - ' + a));
  if (avisos.length > 20) console.log(`   … y ${avisos.length - 20} más`);
}
