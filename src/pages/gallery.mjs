import { SITE, CONTACT, TERMS } from '../data.mjs';
import { page, secHead, ctaBand, icon, esc } from '../layout.mjs';

/* ─────────────────────────────────────────────────────────────────────
   GATED PAGE — built, wired, and deliberately unpublished.

   It is noindex, it is not in the nav, and it is not in the sitemap,
   because there are no real photographs of Royal Kings' work on this
   site yet. A gallery with nothing in it is worse than no gallery.

   To publish:
     1. Drop the files named in PHOTOS.md into /assets/work/
     2. Fill the PAIRS and SHOTS arrays below
     3. Delete `noindex: true` at the bottom of this file
     4. Add { href: '/gallery', label: 'Our work' } to NAV in src/data.mjs
     5. Add the page back to the sitemap block in build.mjs
     6. node build.mjs
   ───────────────────────────────────────────────────────────────────── */

/* Each entry: { before, after, alt, caption } — alt text must describe what
   is actually in the frame, which means opening the file first (G51b). */
const PAIRS = [];
const SHOTS = [];

const empty = PAIRS.length === 0 && SHOTS.length === 0;

const body = `
<section class="hero" aria-labelledby="h1">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="wrap hero-inner">
    <nav class="crumb" aria-label="Breadcrumb" style="padding-bottom:var(--s-5);border-bottom:var(--stroke)">
      <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Our work</span>
    </nav>

    <h1 class="hero-h1" id="h1" style="font-size:var(--fs-4xl)">Before,<br class="br-desk">and after.</h1>

    <div class="hero-row">
      <p class="hero-sub">
        Real cars from around ${esc(SITE.city)}. Drag the handle to see what
        came out of them.
      </p>
      <div class="hero-act">
        <div class="hero-act-row">
          <a class="btn btn-primary" href="/book">Book a detail ${icon('right')}</a>
          <a class="hero-call" href="${CONTACT.instagram.url}" target="_blank" rel="noopener">${icon('ig')} ${esc(CONTACT.instagram.handle)}</a>
        </div>
      </div>
    </div>
  </div>
</section>

${empty ? `
<section class="sec" aria-labelledby="hold-h">
  <div class="wrap">
    <div class="notice bkt" style="padding:var(--s-7)">
      <h2 id="hold-h" style="font-size:var(--fs-xl);margin-bottom:var(--s-4)">This page is not published yet</h2>
      <p style="margin-bottom:var(--s-4)">
        The before/after slider and the work grid below are built and working.
        They are waiting on real photographs — nothing here is stock and nothing
        here is invented, so the page stays unlisted until Patrick and Justin
        supply the shots.
      </p>
      <p><strong>What is needed:</strong> 3–6 before/after pairs shot from the same
      angle and distance, plus 6–10 finished shots. The full list, including
      framing and lighting notes, is in <code>PHOTOS.md</code> in the repository.</p>
    </div>
  </div>
</section>` : ''}

<section class="sec${empty ? '' : ' band'}" aria-labelledby="ba-h">
  <div class="wrap">
    ${secHead({
      index: '01',
      kicker: 'Before and after',
      title: '<span id="ba-h">Drag the handle.</span>',
      meta: PAIRS.length ? `${PAIRS.length} vehicles` : 'Awaiting photographs',
    })}
    ${PAIRS.length ? PAIRS.map((p, i) => `
    <figure class="ba" style="margin-bottom:var(--s-6)">
      <div class="ba-stage">
        <img class="ba-before" src="${p.before}" alt="${esc(p.alt)} — before" width="1600" height="900" loading="lazy">
        <div class="ba-after" style="--pos:50%"><img src="${p.after}" alt="${esc(p.alt)} — after" width="1600" height="900" loading="lazy"></div>
        <span class="ba-line" aria-hidden="true"></span><span class="ba-grip" aria-hidden="true"></span>
        <input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Reveal the after photo for ${esc(p.alt)}">
      </div>
      <figcaption>${esc(p.caption)}</figcaption>
    </figure>`).join('') : `
    <figure class="ba">
      <div class="ba-stage">
        <span class="plate ba-before" aria-hidden="true"></span>
        <div class="ba-after" style="--pos:50%"><span class="plate" style="background-image:linear-gradient(116deg,transparent 26%,rgba(255,255,255,.11) 44%,rgba(255,255,255,.03) 58%,transparent 74%),radial-gradient(118% 88% at 16% 0%,rgba(201,162,39,.16),transparent 58%),linear-gradient(168deg,#232B39 0%,#0A0D13 88%)"></span></div>
        <span class="ba-line" aria-hidden="true"></span><span class="ba-grip" aria-hidden="true"></span>
        <input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Before and after slider — demonstration only, photographs pending">
      </div>
      <figcaption>Demonstration of the slider. Real pairs drop straight into this component.</figcaption>
    </figure>`}
  </div>
</section>

<section class="sec${empty ? ' band' : ''}" aria-labelledby="grid-h">
  <div class="wrap">
    ${secHead({
      index: '02',
      kicker: 'Finished work',
      title: '<span id="grid-h">Cars we have<br>handed back.</span>',
      meta: SHOTS.length ? `${SHOTS.length} shots` : 'Awaiting photographs',
    })}
    <div class="cols-3">
      ${SHOTS.length
        ? SHOTS.map(s => `<figure class="plate plate-square"><img src="${s.src}" alt="${esc(s.alt)}" width="900" height="900" loading="lazy"></figure>`).join('')
        : Array.from({ length: 6 }, (_, i) => `<span class="plate plate-square${i === 0 ? ' bkt' : ''}" aria-hidden="true"></span>`).join('')}
    </div>
  </div>
</section>

${ctaBand({
  heading: 'Want yours<br class=\"br-desk\">on this page?',
  body: `Book a detail and we will ask before we photograph anything. ${esc(TERMS.travelFee)}`,
})}
`;

export default page({
  title: `Our Work — Before and After | ${SITE.shortName}`,
  description: `Before and after photographs of interior and exterior detailing carried out by Royal Kings Auto Care across Winnipeg. Drag the handle to compare each vehicle.`,
  path: '/gallery',
  noindex: true,
  body,
});
