/* Scans assets/Gallery/ at build time and turns whatever is in there into
   the gallery, the homepage before/after section, and the service page
   headers. Dropping files in the folder is the whole workflow — no arrays
   to edit, no page to touch.

   FOLDERS
     assets/Gallery/            before/after pairs + finished-work shots
     assets/Gallery/Services/   one header image per service page

   NAMING — before/after pairs
     Two files sharing a stem, one ending -before, one -after:
       civic-interior-before.jpg   civic-interior-after.jpg
     Case and extension do not matter. A stem with only one half is
     reported and skipped rather than shipped half-broken.

   NAMING — finished work
     Anything else in assets/Gallery/ becomes a work-grid shot.

   NAMING — service headers
     assets/Gallery/Services/<page-slug>.jpg, or any filename containing
     the service keyword (interior / exterior / ceramic / paint).

   CAPTIONS ARE REQUIRED, and that is deliberate.
   Alt text has to describe what is actually in the frame, which means
   somebody opened the file. Deriving it from a filename is how you end up
   captioning a customer's truck as "a car". So the build writes
   assets/Gallery/captions.json with a blank entry for every new photo and
   FAILS until they are filled in. The failure message lists exactly which.
*/
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const IMG = /\.(jpe?g|png|webp|avif)$/i;

/* Real pixel dimensions, straight out of the file header. Needed for the
   width/height attributes (CLS) and for the resolution floor check. No
   dependency — these are the only four container formats we accept. */
function dimensions(buf) {
  // PNG
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  // WebP (VP8 / VP8L / VP8X)
  if (buf.length > 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const c = buf.toString('ascii', 12, 16);
    if (c === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    if (c === 'VP8L') {
      const b = buf.readUInt32LE(21);
      return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
    }
    if (c === 'VP8X') {
      return { w: (buf.readUIntLE(24, 3) & 0xffffff) + 1, h: (buf.readUIntLE(27, 3) & 0xffffff) + 1 };
    }
  }
  // JPEG — walk the segments to the first SOF
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

const listImages = async dir => {
  try {
    return (await readdir(dir, { withFileTypes: true }))
      .filter(e => e.isFile() && IMG.test(e.name))
      .map(e => e.name)
      .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  } catch { return []; }
};

export async function scanGallery(root) {
  const dir = join(root, 'assets', 'Gallery');
  const svcDir = join(dir, 'Services');
  const capPath = join(dir, 'captions.json');

  const files = await listImages(dir);
  const svcFiles = await listImages(svcDir);

  let captions = {};
  try { captions = JSON.parse(await readFile(capPath, 'utf8')); } catch { /* first run */ }

  const notes = [];
  const meta = async (folder, name) => {
    const p = join(folder, name);
    const buf = await readFile(p);
    const d = dimensions(buf) || { w: 0, h: 0 };
    const bytes = (await stat(p)).size;
    return { d, bytes };
  };

  /* ── before / after pairs ── */
  const stems = new Map();
  const singles = [];
  for (const f of files) {
    const base = basename(f, extname(f));
    const m = /^(.*?)[-_ ]?(before|after)$/i.exec(base);
    if (m) {
      const stem = m[1].replace(/[-_ ]+$/, '');
      if (!stems.has(stem)) stems.set(stem, {});
      stems.get(stem)[m[2].toLowerCase()] = f;
    } else singles.push(f);
  }

  const pairs = [];
  for (const [stem, half] of stems) {
    if (!half.before || !half.after) {
      notes.push(`  ! "${stem}" has only the ${half.before ? 'before' : 'after'} half — skipped. A pair needs both.`);
      continue;
    }
    const b = await meta(dir, half.before);
    const a = await meta(dir, half.after);
    if (b.d.w && a.d.w && Math.abs(b.d.w / b.d.h - a.d.w / a.d.h) > 0.06) {
      notes.push(`  ! "${stem}" before/after are different shapes (${b.d.w}x${b.d.h} vs ${a.d.w}x${a.d.h}) — the slider will crop one.`);
    }
    if (Math.min(b.d.w, a.d.w) < 1200) {
      notes.push(`  ! "${stem}" is only ${Math.min(b.d.w, a.d.w)}px wide — soft in a full-width slider. 2000px+ is the target.`);
    }
    pairs.push({ stem, before: `/assets/Gallery/${half.before}`, after: `/assets/Gallery/${half.after}`, w: b.d.w, h: b.d.h });
  }

  /* ── finished-work shots ── */
  const shots = [];
  for (const f of singles) {
    const { d } = await meta(dir, f);
    shots.push({ stem: basename(f, extname(f)), src: `/assets/Gallery/${f}`, w: d.w, h: d.h });
  }

  /* ── service headers ── */
  const KEYS = ['interior', 'exterior', 'ceramic', 'paint'];
  const services = {};
  for (const f of svcFiles) {
    const base = basename(f, extname(f)).toLowerCase();
    const key = KEYS.find(k => base.includes(k));
    if (!key) { notes.push(`  ! Services/${f} does not name a service (interior/exterior/ceramic/paint) — skipped.`); continue; }
    if (services[key]) { notes.push(`  ! Services/${f} is a second image for "${key}" — only the first is used.`); continue; }
    const { d } = await meta(svcDir, f);
    if (d.w && d.w < 1600) notes.push(`  ! Services/${f} is ${d.w}px wide; a full-bleed header wants 1600px+.`);
    services[key] = { stem: basename(f, extname(f)), src: `/assets/Gallery/Services/${f}`, w: d.w, h: d.h };
  }

  /* ── captions: scaffold the file, then require every entry ── */
  const needed = [
    ...pairs.flatMap(p => [`${p.stem}-before`, `${p.stem}-after`]),
    ...shots.map(s => s.stem),
    ...Object.values(services).map(s => s.stem),
  ];
  let scaffolded = false;
  for (const k of needed) {
    if (!(k in captions)) { captions[k] = ''; scaffolded = true; }
  }
  if (needed.length && (scaffolded || !Object.keys(captions).length)) {
    await writeFile(capPath, JSON.stringify(captions, null, 2) + '\n', 'utf8');
  }
  const missing = needed.filter(k => !String(captions[k] || '').trim());

  const alt = k => String(captions[k] || '').trim();
  pairs.forEach(p => { p.altBefore = alt(`${p.stem}-before`); p.altAfter = alt(`${p.stem}-after`); });
  shots.forEach(s => { s.alt = alt(s.stem); });
  Object.values(services).forEach(s => { s.alt = alt(s.stem); });

  return { pairs, shots, services, notes, missing, capPath, hasPhotos: pairs.length > 0 || shots.length > 0 };
}
