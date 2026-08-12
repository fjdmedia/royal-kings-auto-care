/* Royal Kings Auto Care — static page generator.
   Every page shares one layout, one nav, one footer and one facts file
   (src/data.mjs), so a price or a phone number can only be wrong in one
   place. Output is plain static HTML — Vercel serves it directly, there
   is no runtime framework.

   Run:  node build.mjs
*/
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, SERVICES } from './src/data.mjs';
import { scanGallery } from './src/gallery-scan.mjs';
import { setGallery, GALLERY } from './src/gallery-data.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));

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
  const problems = [];
  for (const p of PAGES) {
    const html = (await import(p.mod)).default;
    try { assertSeo(html, p.url); } catch (e) { problems.push(e.message); }
    const dest = join(ROOT, p.out);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, html, 'utf8');
    console.log(`  ${p.out.padEnd(44)} → ${p.url}`);
    count++;
  }

  const indexed = PAGES.map(p => ({ ...p, sitemap: typeof p.sitemap === 'function' ? p.sitemap() : p.sitemap }))
    .filter(p => p.sitemap);
  await writeFile(join(ROOT, 'sitemap.xml'), sitemap(indexed), 'utf8');
  await writeFile(join(ROOT, 'robots.txt'), robots, 'utf8');
  await writeFile(join(ROOT, 'vercel.json'), JSON.stringify(vercel, null, 2) + '\n', 'utf8');

  console.log(`\n  ${count} pages · sitemap (${indexed.length} indexed + waiver) · robots · vercel.json`);
  if (problems.length) throw new Error(problems.join('\n'));
}

run().catch(err => { console.error('\nBUILD FAILED\n' + err.message + '\n'); process.exit(1); });
