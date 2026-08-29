/* Royal Kings Auto Care — static page generator.
   Every page shares one layout, one nav, one footer and one facts file
   (src/data.mjs), so a price or a phone number can only be wrong in one
   place. Output is plain static HTML — Vercel serves it directly, there
   is no runtime framework.

   Run:  node build.mjs
*/
import { writeFile, mkdir, readFile, cp, rm, readdir } from 'node:fs/promises';

/* A generator must never half-finish and report success. Piping this build to
   `head` closes stdout early; the very next console.log throws EPIPE, the
   process dies partway through the page loop, and the PIPELINE still exits 0 —
   so the build "passes" while leaving pages on disk from a previous run. That
   is how a stale page ships. Swallowing the stdout error lets the writes finish
   even when nobody is reading the log. (Found 2026-08-25: `node build.mjs |
   head -8` left gallery.html eight hours stale, pointing at a renamed folder —
   it would have shipped 8 broken images to the live site.) */
process.stdout.on('error', e => { if (e.code !== 'EPIPE') throw e; });
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, SERVICES, THEMES, ADDONS, PACKAGES } from './src/data.mjs';
import { scanGallery } from './src/gallery-scan.mjs';
import { reconcileWaiver } from './src/waiver-gen.mjs';
import { setGallery, GALLERY } from './src/gallery-data.mjs';
import { setBase } from './src/site-base.mjs';
import { loadAssetVersions } from './src/asset-version.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));

/* node build.mjs                                       -> the real site, at the root
   node build.mjs --base=preview/x --out=<abs dir>       -> a staged preview

   NOTE: --base takes NO leading slash. Git Bash on Windows rewrites any
   argument that looks like a Unix absolute path into a Windows one, so
   `--base=/preview/x` silently arrives as `C:/Program Files/Git/preview/x`.
   Taking it without the slash and adding it here sidesteps the mangling
   entirely instead of relying on MSYS_NO_PATHCONV being set. */
const arg = k => (process.argv.find(a => a.startsWith(`--${k}=`)) || '').split('=').slice(1).join('=');
const rawBase = arg('base').replace(/^\/+|\/+$/g, '');
const BASE_PREFIX = rawBase ? '/' + rawBase : '';
if (/^[a-zA-Z]:/.test(arg('base'))) {
  throw new Error(`--base was path-mangled by the shell ("${arg('base')}"). Pass it without a leading slash: --base=preview/royal-kings`);
}
const OUT = arg('out') || ROOT;
setBase(BASE_PREFIX);

/* out = the file written; url = the clean URL Vercel serves it at
   (vercel.json sets cleanUrls, so foo.html is reachable as /foo and
   /foo.html 308-redirects to it). */
const PAGES = [
  { mod: './src/pages/home.mjs',          out: 'index.html',          url: '/',          sitemap: { priority: '1.0', freq: 'weekly'  } },
  { mod: './src/pages/services-index.mjs', out: 'services/index.html', url: '/services',  sitemap: { priority: '0.9', freq: 'monthly' } },
  { mod: './src/pages/pricing.mjs',       out: 'pricing.html',        url: '/pricing',   sitemap: { priority: '0.9', freq: 'monthly' } },
  { mod: './src/pages/book.mjs',          out: 'book.html',           url: '/book',      sitemap: { priority: '0.9', freq: 'monthly' } },
  { mod: './src/pages/about.mjs',         out: 'about.html',          url: '/about',     sitemap: { priority: '0.7', freq: 'yearly'  } },
  { mod: './src/pages/faq.mjs',           out: 'faq.html',            url: '/faq',       sitemap: { priority: '0.7', freq: 'monthly' } },
  { mod: './src/pages/contact.mjs',       out: 'contact.html',        url: '/contact',   sitemap: { priority: '0.8', freq: 'monthly' } },
  ...SERVICES.map(s => ({
    mod: `./src/pages/svc-${s.slug}.mjs`,
    out: `services/${s.slug}.html`,
    url: `/services/${s.slug}`,
    sitemap: { priority: '0.8', freq: 'monthly' },
  })),
  /* The gallery publishes ITSELF. While assets/Gallery/ is empty it stays
     noindex, out of the nav and out of the sitemap, because an empty
     gallery is worse than none. The moment a before/after pair or a work
     shot lands in that folder, this page indexes, joins the nav and enters
     the sitemap on the next build — no flags to remember to flip. */
  { mod: './src/pages/gallery.mjs',       out: 'gallery.html',        url: '/gallery',
    sitemap: () => GALLERY.hasPhotos ? { priority: '0.8', freq: 'monthly' } : null },
];

/* Assertions that have caught real bugs before: a title over 60 chars is
   truncated in the SERP, a meta description outside 140–160 is either cut
   or padded by Google. Fail the build, do not warn. */
function assertSeo(html, url) {
  const errs = [];
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
  const desc  = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  if (title.length < 30 || title.length > 62) errs.push(`title ${title.length} chars (want 30–62): "${title}"`);
  if (desc.length  < 130 || desc.length  > 165) errs.push(`meta description ${desc.length} chars (want 130–165)`);
  if (!html.includes('<link rel="canonical"')) errs.push('missing canonical');
  if (!/<h1[ >]/.test(html)) errs.push('missing h1');
  if ((html.match(/<h1[ >]/g) || []).length > 1) errs.push('more than one h1');
  if (html.includes('undefined')) errs.push('the literal string "undefined" is in the output');
  if (errs.length) throw new Error(`SEO assertions failed for ${url}:\n  - ${errs.join('\n  - ')}`);
}

/* G64b, made mechanical. A staged build must contain NO internal path that
   still resolves against the server root — not in markup, and not in a JS
   navigation string, which is the half no screenshot and no HTML link
   checker can see. */
function assertRebased(html, url, base) {
  if (!base) return;
  const bad = [];
  for (const a of html.match(/\b(?:href|src|action)="\/[^"]*"/g) || []) {
    if (!a.includes(`="${base}/`)) bad.push(a);
  }
  for (const j of html.match(/location\.(?:href|assign)\s*[=(]\s*['"]\/[^'"]*/g) || []) bad.push(j);
  if (!/<meta name="robots" content="noindex/.test(html)) bad.push('page is not noindex');
  if (bad.length) {
    throw new Error(`${url} is not fully rebased under "${base}":\n      - ${[...new Set(bad)].join('\n      - ')}`);
  }
}

/* fjmedia.ca has no cleanUrls rule, and adding one would change routing for
   the whole agency site just to stage a preview. So a staged build links to
   explicit .html files instead — plain static serving, no host config, no
   blast radius. The real deploy keeps its clean URLs via its own vercel.json.
   The map is built from PAGES, not guessed, and applied longest-first so
   /services never clobbers /services/ceramic-coating-winnipeg. */
function linkify(html) {
  if (!BASE_PREFIX) return html;
  const map = PAGES
    .filter(p => p.url !== '/')
    .map(p => [p.url, '/' + p.out])
    .concat([['/waiver', '/waiver.html']])
    .sort((a, b) => b[0].length - a[0].length);
  for (const [clean, file] of map) {
    html = html.split(`"${BASE_PREFIX}${clean}"`).join(`"${BASE_PREFIX}${file}"`);
    html = html.split(`"${BASE_PREFIX}${clean}?`).join(`"${BASE_PREFIX}${file}?`);
    html = html.split(`"${BASE_PREFIX}${clean}#`).join(`"${BASE_PREFIX}${file}#`);
  }
  return html.split('/services/index.html').join('/services/');
}

const sitemap = urls => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${SITE.origin}${u.url === '/' ? '/' : u.url}</loc>
    <changefreq>${u.sitemap.freq}</changefreq>
    <priority>${u.sitemap.priority}</priority>
  </url>`).join('\n')}
  <url>
    <loc>${SITE.origin}/waiver</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE.origin}/sitemap.xml
`;

const vercel = {
  cleanUrls: true,
  trailingSlash: false,
  headers: [
    {
      source: '/assets/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],
};

async function run() {
  if (BASE_PREFIX) console.log(`  staging a PREVIEW build under ${BASE_PREFIX} -> ${OUT}`);
  const g = await scanGallery(ROOT);
  setGallery(g);
  if (g.pairs.length || g.shots.length || Object.keys(g.services).length) {
    console.log(`  gallery: ${g.pairs.length} before/after pair(s) · ${g.shots.length} work shot(s) · ${Object.keys(g.services).length} service header(s)`);
  } else {
    console.log('  gallery: no photos in assets/Gallery/ yet — the section and page stay hidden');
  }
  g.notes.forEach(n => console.log(n));
  if (g.missing.length) {
    throw new Error(
      'These photos have no caption yet, so their alt text would be a guess:\n' +
      g.missing.map(k => `  - ${k}`).join('\n') +
      `\n\nOpen each image, then describe what is actually in the frame in:\n  ${g.capPath}\n` +
      'Alt text has to be true, not just present — that is the whole point of the file.');
  }
  let count = 0;
  /* Hash the linked assets BEFORE any page renders, so every emitted URL
     carries the version of the bytes actually being shipped. */
  await loadAssetVersions(ROOT, ['rk.css', 'rk.js', ...THEMES.map(t => t.sheet).filter(Boolean).map(x => x.replace('/assets/', ''))]);

  const problems = [];
  /* One source for the booking↔waiver DATA. Generates only the key map;
     asserts every price and every add-on; never touches Patrick's wording.
     See src/waiver-gen.mjs for why it deliberately generates so little. */
  {
    const wPath = join(ROOT, 'waiver.html');
    const wBefore = await readFile(wPath, 'utf8');
    const wAfter = reconcileWaiver(wBefore, { ADDONS, PACKAGES }, problems);
    if (wAfter !== wBefore) {
      await writeFile(wPath, wAfter, 'utf8');
      console.log('  waiver.html                                  → add-on map regenerated from data.mjs');
    }
  }

  for (const p of PAGES) {
    let html = (await import(p.mod)).default;
    html = linkify(html);
    try { assertSeo(html, p.url); } catch (e) { problems.push(e.message); }
    try { assertRebased(html, p.url, BASE_PREFIX); } catch (e) { problems.push(e.message); }
    const dest = join(OUT, p.out);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, html, 'utf8');
    console.log(`  ${p.out.padEnd(44)} → ${p.url}`);
    count++;
  }

  const indexed = PAGES.map(p => ({ ...p, sitemap: typeof p.sitemap === 'function' ? p.sitemap() : p.sitemap }))
    .filter(p => p.sitemap);
  /* A staged preview publishes no sitemap: it would list the LIVE client
     domain from inside the agency site, which is confusing at best. Only the
     real deploy gets one. */
  if (!BASE_PREFIX) await writeFile(join(OUT, 'sitemap.xml'), sitemap(indexed), 'utf8');
  if (!BASE_PREFIX) await writeFile(join(ROOT, 'robots.txt'), robots, 'utf8');
  /* A preview is a self-contained copy inside another site, so it needs the
     assets carried across too — HTML alone renders as unstyled text, which is
     exactly the failure the deploy playbook says a 200 will happily hide. */
  if (BASE_PREFIX) {
    /* Clear first: copying is not syncing. A theme removed from THEMES, or a
       photo deleted from the source, stays served on the preview forever if we
       only ever copy ON TOP of the last stage. */
    await rm(join(OUT, 'assets'), { recursive: true, force: true });
    await mkdir(join(OUT, 'assets'), { recursive: true });
    /* Derived from THEMES, never hand-listed. A hardcoded list silently drops
       any theme added later: the page still returns 200 and its stylesheet
       404s, which renders as unstyled text and is exactly the failure a status
       check cannot see. (Caught 2026-08-28 — rk-sign.css was missing from a
       staged preview for precisely this reason.) */
    const themeSheets = THEMES.map(t => t.sheet).filter(Boolean).map(p => p.replace('/assets/', ''));
    for (const f of ['rk.css', 'rk.js', ...new Set(themeSheets)]) {
      await cp(join(ROOT, 'assets', f), join(OUT, 'assets', f));
    }
    await cp(join(ROOT, 'assets', 'Gallery'), join(OUT, 'assets', 'Gallery'), { recursive: true });

    /* The Gallery copy carries build INPUTS as well as runtime assets, and a
       preview is a public URL. captions.json is the alt-text source — harmless
       but not something the page needs, and the staging rule is allowlist, not
       "delete what looks bad". Empty directories go too: a filtered copy still
       creates the folder, and a folder NAME alone discloses how a client files
       their work. Both checks are in fjmedia-deploy; this makes them automatic
       rather than something to remember at stage time. */
    await rm(join(OUT, 'assets', 'Gallery', 'captions.json'), { force: true });
    const pruneEmpty = async dir => {
      let entries = [];
      try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
      for (const e of entries) if (e.isDirectory()) await pruneEmpty(join(dir, e.name));
      try { if (!(await readdir(dir)).length) await rm(dir, { recursive: true, force: true }); } catch {}
    };
    await pruneEmpty(join(OUT, 'assets'));
    await cp(join(ROOT, 'Logo.jpg'), join(OUT, 'Logo.jpg'));

    /* waiver.html is hand-maintained rather than generated, so it gets the
       same rebase treatment applied to its own paths. Its only local refs
       are "/" and "Logo.jpg". */
    let w = await readFile(join(ROOT, 'waiver.html'), 'utf8');
    w = w.replace(/\bhref="\/"/g, `href="${BASE_PREFIX}/"`)
         .replace(/\b(href|src)="Logo\.jpg"/g, `$1="${BASE_PREFIX}/Logo.jpg"`);
    if (!/<meta name="robots"/.test(w)) {
      w = w.replace('</title>', '</title><meta name="robots" content="noindex, nofollow">');
    }
    await writeFile(join(OUT, 'waiver.html'), w, 'utf8');
    console.log('  assets + waiver.html copied into the preview');
  }

  /* robots.txt and vercel.json belong to the real deploy only — a preview
     lives inside another site that has its own. */
  if (!BASE_PREFIX) await writeFile(join(ROOT, 'vercel.json'), JSON.stringify(vercel, null, 2) + '\n', 'utf8');

  console.log(BASE_PREFIX
    ? `\n  ${count} pages staged · noindex · no sitemap · no robots.txt`
    : `\n  ${count} pages · sitemap (${indexed.length} indexed + waiver) · robots · vercel.json`);
  if (problems.length) throw new Error(problems.join('\n'));
}

run().catch(err => { console.error('\nBUILD FAILED\n' + err.message + '\n'); process.exit(1); });
