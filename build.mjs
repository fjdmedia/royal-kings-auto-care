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
  /* Built, wired, and deliberately NOT in the nav or the sitemap: the
     gallery holds a before/after slider and a work grid that have no real
     photographs yet. It ships noindex until Patrick and Justin supply them
     (shot list in PHOTOS.md). Publishing an empty gallery is worse than
     not having one. */
  { mod: './src/pages/gallery.mjs',       out: 'gallery.html',        url: '/gallery',   sitemap: null },
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

  await writeFile(join(ROOT, 'sitemap.xml'), sitemap(PAGES.filter(p => p.sitemap)), 'utf8');
  await writeFile(join(ROOT, 'robots.txt'), robots, 'utf8');
  await writeFile(join(ROOT, 'vercel.json'), JSON.stringify(vercel, null, 2) + '\n', 'utf8');

  console.log(`\n  ${count} pages · sitemap (${PAGES.filter(p => p.sitemap).length} indexed + waiver) · robots · vercel.json`);
  if (problems.length) throw new Error(problems.join('\n'));
}

run().catch(err => { console.error('\nBUILD FAILED\n' + err.message + '\n'); process.exit(1); });
