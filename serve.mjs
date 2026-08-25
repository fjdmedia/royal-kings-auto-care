/* Local preview server for Royal Kings Auto Care.
   Node built-ins only — no install, no dependencies.

     node serve.mjs           → http://localhost:4200
     node serve.mjs 5000      → pick another port

   It emulates the two vercel.json settings that change routing, so what you
   see here is what the live domain serves:
     cleanUrls: true       /pricing        -> pricing.html
                           /services       -> services/index.html
                           /pricing.html   -> 308 to /pricing
     trailingSlash: false  /pricing/       -> 308 to /pricing

   It also refuses to serve anything in .vercelignore, so if a file is
   reachable here it is reachable in production — and vice versa.
*/
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.argv[2]) || 4200;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
};

/* Mirror .vercelignore so the dev server cannot show you a file production hides. */
const BLOCKED = (await readFile(join(ROOT, '.vercelignore'), 'utf8').catch(() => ''))
  .split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => l.replace(/\/$/, ''));

const isBlocked = rel => {
  const parts = rel.split(sep);
  return BLOCKED.some(b => (b.startsWith('*.') ? rel.endsWith(b.slice(1)) : parts.includes(b) || rel === b));
};

const exists = async f => { try { return (await stat(f)).isFile(); } catch { return false; } };

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let p = decodeURIComponent(url.pathname);

  // trailingSlash: false
  if (p.length > 1 && p.endsWith('/')) {
    res.writeHead(308, { Location: p.slice(0, -1) + url.search });
    return res.end();
  }
  // cleanUrls: strip .html and redirect
  if (p.endsWith('.html')) {
    const clean = p === '/index.html' ? '/' : p.slice(0, -5);
    res.writeHead(308, { Location: clean + url.search });
    return res.end();
  }

  const candidates = p === '/'
    ? [join(ROOT, 'index.html')]
    : [join(ROOT, p), join(ROOT, p + '.html'), join(ROOT, p, 'index.html')];

  for (const f of candidates) {
    const rel = relative(ROOT, f);
    if (rel.startsWith('..')) break;                       // no traversal
    if (isBlocked(rel)) continue;                          // hidden in production too
    if (!(await exists(f))) continue;
    try {
      const body = await readFile(f);
      res.writeHead(200, {
        'Content-Type': MIME[extname(f)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      });
      return res.end(body);
    } catch {
      res.writeHead(500); return res.end('500');
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end(`404  ${p}\n\nTry: /  /services  /pricing  /book  /about  /faq  /contact  /gallery  /waiver`);
}).listen(PORT, () => {
  console.log(`\n  Royal Kings — local preview\n  http://localhost:${PORT}\n`);
  console.log('  /                                            home');
  console.log('  /services                                    services hub');
  console.log('  /services/interior-car-detailing-winnipeg');
  console.log('  /services/exterior-detailing-winnipeg        (new)');
  console.log('  /services/ceramic-coating-winnipeg');
  console.log('  /services/paint-correction-winnipeg');
  console.log('  /pricing                                     (new)');
  console.log('  /book                                        (new)');
  console.log('  /about                                       (new)');
  console.log('  /faq                                         (new)');
  console.log('  /contact                                     (new)');
  console.log('  /gallery                                     (built, unpublished)');
  console.log('  /waiver\n');
  console.log('  Ctrl-C to stop. Re-run `node build.mjs` after editing anything in src/.\n');
});
