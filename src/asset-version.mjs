/* CACHE BUSTING — the reason this file exists.

   vercel.json serves everything under /assets/ with
   `Cache-Control: public, max-age=31536000, immutable` — cached for a YEAR and
   explicitly never revalidated. That is the correct header for a versioned
   asset and a trap for an unversioned one, because the URL `/assets/rk.css`
   never changed. The HTML is `max-age=0, must-revalidate`, so a returning
   visitor got today's markup paired with a stylesheet from whenever they last
   visited.

   It shipped invisibly for weeks: every automated check runs a cold browser
   with an empty cache, so the tooling could never see it. It surfaced the day
   the markup changed shape — new elements, old CSS, so the gallery's radio
   inputs rendered as raw dots and the vehicle heading lost its formatting.

   Appending a content hash makes the `immutable` header honest: change the
   file and the URL changes with it, so the browser fetches. Leave the file
   alone and the year-long cache is exactly what you want. */
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const versions = new Map();

/* Hash every asset the pages link to, once per build. Short is fine — this
   defeats a cache, it does not defend against anything. */
export async function loadAssetVersions(root, files) {
  for (const f of files) {
    try {
      const buf = await readFile(join(root, 'assets', f));
      versions.set(f, createHash('sha256').update(buf).digest('hex').slice(0, 8));
    } catch {
      /* A missing asset is the build's problem to report elsewhere, not a
         reason to fail here — an unversioned URL still works, it just caches. */
    }
  }
  return versions;
}

/* `/assets/rk.css` -> `/assets/rk.css?v=1a2b3c4d`. Paths that are not hashed
   (or that already carry a query) come back untouched. */
export function v(path) {
  const m = /^\/assets\/([^?#]+)$/.exec(path);
  if (!m) return path;
  const hash = versions.get(m[1]);
  return hash ? `${path}?v=${hash}` : path;
}
