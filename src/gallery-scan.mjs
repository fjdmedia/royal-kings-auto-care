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

/* Walks the folder AND its subfolders (except Services/, which has its own
   job). Returns paths relative to the scan root so any organisation works —
   photos straight in Gallery/, or tidied into "Before and After/". */
const listImages = async (dir, prefix = '') => {
  let out = [];
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return []; }
  for (const e of entries) {
    if (e.isFile() && IMG.test(e.name)) out.push(prefix + e.name);
    else if (e.isDirectory() && e.name !== 'Services') {
      out = out.concat(await listImages(join(dir, e.name), prefix + e.name + '/'));
    }
  }
  return out.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
};

/* A folder name can contain spaces, so every path that becomes a URL has to
   be encoded segment by segment — encodeURI would leave the space. */
const toUrl = rel => '/assets/Gallery/' + rel.split('/').map(encodeURIComponent).join('/');

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
    const dir = f.includes('/') ? f.slice(0, f.lastIndexOf('/') + 1) : '';
    let stem = null, half = null;

    // 1. explicit: <name>-before / <name>-after
    let m = /^(.*?)[-_ ]?(before|after)$/i.exec(base);
    if (m) { stem = dir + m[1].replace(/[-_ ]+$/, ''); half = m[2].toLowerCase(); }

    // 2. shorthand: b1/a1, b_2/a_2 — b is the BEFORE, a is the AFTER.
    //    Verified against the actual photographs before enabling this, and the
    //    build prints every assignment so a mistake is visible rather than
    //    quietly shipping a dirty car as the result.
    if (!half) {
      m = /^([ab])[-_ ]?(\d+)$/i.exec(base);
      if (m) { stem = dir + 'pair-' + m[2]; half = m[1].toLowerCase() === 'b' ? 'before' : 'after'; }
    }

    if (half) {
      if (!stems.has(stem)) stems.set(stem, {});
      stems.get(stem)[half] = f;
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
    const ratio = b.d.h ? b.d.w / b.d.h : 1;

    /* LAYOUT IS DECIDED HERE, and it is the whole reason this is not one
       component. A wipe slider only tells the truth when both halves were
       shot from the same spot — otherwise the car appears to jump and the
       comparison reads as a trick. And a portrait phone photo cannot fill a
       wide slider stage without being cropped to nothing.

       So: landscape pairs get the slider; portrait pairs get a side-by-side
       diptych, which is honest about being two separate photographs, is what
       the trade actually publishes, and looks deliberate rather than
       shoehorned. */
    /* THE WIPE IS OPT-IN, NEVER INFERRED. A slider only tells the truth when
       both halves came from ONE camera position, and nothing in the files says
       whether the photographer moved. Matching aspect ratios do NOT say it:
       Royal Kings' engine-bay pair matched to within 0.06 and the scene still
       shifted ~6% of frame width between frames, so dragging made the engine
       appear to move rather than to get clean — and the page said "shot from a
       fixed position" underneath it. Landscape is a prerequisite, not
       permission. Mark "<stem>-slider": "yes" in captions.json once you have
       LOOKED at the two frames and confirmed the camera held still. */
    const optedIn = /^(y|yes|true|1)$/i.test(String(captions[`${stem}-slider`] || '').trim());
    const layout = optedIn && ratio >= 1.15 ? 'slider' : 'diptych';
    if (optedIn && ratio < 1.15) {
      notes.push(`  ! "${stem}" is marked slider but is portrait (${b.d.w}x${b.d.h}) — kept as a diptych.`);
    }

    if (b.d.w && a.d.w && Math.abs(ratio - a.d.w / a.d.h) > 0.06) {
      notes.push(`  ! "${stem}" halves are different shapes (${b.d.w}x${b.d.h} vs ${a.d.w}x${a.d.h})`
        + (layout === 'slider' ? ' — the slider would crop one.' : ' — fine for a diptych.'));
    }

    /* The resolution floor depends on the slot the photo actually fills, not
       on one flat number: a diptych half is about a third of the page width,
       a slider is the full width. Judging a portrait phone shot against a
       full-bleed threshold produces a warning nobody can act on. */
    const floor = layout === 'slider' ? 1200 : 800;
    const minW = Math.min(b.d.w, a.d.w);
    if (minW < floor) {
      notes.push(`  ! "${stem}" is ${minW}px wide; a ${layout} slot wants ${floor}px+.`);
    }

    notes.push(`    ${layout.padEnd(7)} ${stem}  before=${half.before.split('/').pop()}  after=${half.after.split('/').pop()}`);

    pairs.push({
      stem, layout, ratio: +ratio.toFixed(4),
      before: toUrl(half.before), after: toUrl(half.after),
      w: b.d.w, h: b.d.h,
    });
  }

  /* NEWEST JOB FIRST. Folders are date-prefixed (YYYY-MM-DD vehicle-colour), so
     sorting the folder segment DESCENDING puts the most recent visit at the top
     of /gallery and into the homepage's two featured slots. Without this the
     folders sort ascending and the site leads with its oldest work.

     Within one job the pairs keep their natural order (pair-1, pair-2, …) —
     that is the order they were shot in, and reversing it tells the story
     backwards. Pairs sitting loose in Gallery/ carry no date to sort on, so
     they fall to the end rather than jumping the queue. */
  const jobOf = stem => (stem.includes('/') ? stem.slice(0, stem.lastIndexOf('/')) : '');
  const byJob = (x, y) => {
    const a = jobOf(x.stem), b = jobOf(y.stem);
    if (a !== b) {
      if (!a) return 1;
      if (!b) return -1;
      return b.localeCompare(a, 'en', { numeric: true });
    }
    return x.stem.localeCompare(y.stem, 'en', { numeric: true });
  };
  pairs.sort(byJob);

  /* ── finished-work shots ── */
  const shots = [];
  for (const f of singles) {
    const { d } = await meta(dir, f);
    /* Folder-prefixed, exactly like a pair's stem. The basename alone is not
       unique once photos live in per-job folders — two jobs each with a
       "main.jpg" would silently share one caption, and the second would be
       described by the first one's words. */
    const dir = f.includes('/') ? f.slice(0, f.lastIndexOf('/') + 1) : '';
    shots.push({ stem: dir + basename(f, extname(f)), src: toUrl(f), w: d.w, h: d.h });
  }

  shots.sort(byJob);

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
    services[key] = { stem: basename(f, extname(f)), src: toUrl('Services/' + f), w: d.w, h: d.h };
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
  pairs.forEach(p => {
    p.altBefore = alt(`${p.stem}-before`);
    p.altAfter = alt(`${p.stem}-after`);
    /* Optional: a short visible caption. Falls back to the after-alt, which
       is true but reads like alt text, so a label is worth writing. */
    p.label = alt(`${p.stem}-label`);
  });
  shots.forEach(s => { s.alt = alt(s.stem); });
  Object.values(services).forEach(s => { s.alt = alt(s.stem); });

  return { pairs, shots, services, notes, missing, capPath, hasPhotos: pairs.length > 0 || shots.length > 0 };
}
