import { SITE, CONTACT, TERMS } from '../data.mjs';
import { page, secHead, ctaBand, icon, esc, breadcrumbSchema } from '../layout.mjs';
import { GALLERY } from '../gallery-data.mjs';
import { beforeAfterPair, workGrid } from '../components.mjs';

/* Renders entirely from assets/Gallery/. Drop photos in that folder, run
   `node build.mjs`, and this page fills itself, indexes itself and joins
   the nav. While the folder is empty it stays unlisted and says why. */

const { pairs, shots, hasPhotos } = GALLERY;
const sliders = pairs.filter(p => p.layout === 'slider').length;
const dips = pairs.length - sliders;

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
        Every frame here is a real ${esc(SITE.city)} vehicle, photographed before
        we started and again when we finished. Nothing is stock.
      </p>
      <div class="hero-act">
        <div class="hero-act-row">
          <a class="btn btn-primary" href="/book">Book a detail ${icon('right')}</a>
          <a class="hero-call" href="${CONTACT.instagram.url}" target="_blank" rel="noopener">${icon('ig')} ${esc(CONTACT.instagram.handle)}</a>
        </div>
      </div>
    </div>

    ${hasPhotos ? `
    <div class="spec">
      <div class="spec-cell bkt"><span class="spec-k">Before / after</span><p class="spec-v num">${pairs.length}<small>${pairs.length === 1 ? 'Area' : `Areas across ${GALLERY.jobs.length} vehicle${GALLERY.jobs.length === 1 ? '' : 's'}`}</small></p></div>
      ${sliders
        ? `<div class="spec-cell"><span class="spec-k">Draggable</span><p class="spec-v num">${sliders}<small>${sliders === 1 ? 'Shot from a locked-off position' : 'Shot from locked-off positions'}</small></p></div>`
        : `<div class="spec-cell"><span class="spec-k">Shown</span><p class="spec-v">Side by side<small>Same area, before and after</small></p></div>`}
      <div class="spec-cell"><span class="spec-k">Shot in</span><p class="spec-v">${esc(SITE.city)}<small>No stock photography</small></p></div>
      <div class="spec-cell"><span class="spec-k">Your car</span><p class="spec-v">We ask first<small>Nothing photographed without permission</small></p></div>
    </div>` : ''}
  </div>
</section>

${!hasPhotos ? `
<section class="sec" aria-labelledby="hold-h">
  <div class="wrap">
    <div class="notice bkt" style="padding:var(--s-7)">
      <h2 id="hold-h" style="font-size:var(--fs-xl);margin-bottom:var(--s-4)">This page is not published yet</h2>
      <p style="margin-bottom:var(--s-4)">
        The slider and the work grid are built and working. They are waiting on
        real photographs — nothing here is stock and nothing is invented, so the
        page stays unlisted until there are real cars to put in it.
      </p>
      <p>
        Drop files into <code>assets/Gallery/</code> and run the build. A pair is
        two files sharing a name, one ending <code>-before</code> and one
        <code>-after</code>. Everything else in the folder becomes a work shot.
        The page then indexes itself and joins the navigation.
        Framing and lighting notes are in <code>PHOTOS.md</code>.
      </p>
    </div>
  </div>
</section>` : ''}

${pairs.length ? `
<section class="sec band" aria-labelledby="ba-h">
  <div class="wrap">
    ${secHead({
      index: '01',
      kicker: 'Before and after',
      title: '<span id="ba-h">Before, and after.</span>',
      meta: `${pairs.length} area${pairs.length === 1 ? '' : 's'}`,
      lede: `${sliders ? `${sliders === 1 ? 'One pair was' : `${sliders} pairs were`} shot from a locked-off camera position, so you can drag straight across ${sliders === 1 ? 'it' : 'them'}. ` : ''}${dips ? `${sliders ? 'The rest are' : 'Each comparison is'} shown side by side. They were taken by hand, and wiping between two camera positions makes the car look like it moved rather than like it got clean.` : ''}`,
    })}
    <div class="ba-list">${pairs.map(p => beforeAfterPair(p)).join('')}</div>
  </div>
</section>` : ''}

${shots.length ? `
<section class="sec" aria-labelledby="grid-h">
  <div class="wrap">
    ${secHead({
      index: pairs.length ? '02' : '01',
      kicker: 'Finished work',
      title: '<span id="grid-h">Cars we have<br class="br-desk">handed back.</span>',
      meta: `${shots.length} shot${shots.length === 1 ? '' : 's'}`,
    })}
    ${workGrid(shots)}
  </div>
</section>` : ''}

${ctaBand({
  heading: 'Want yours<br class="br-desk">on this page?',
  body: `Book a detail and we will ask before we photograph anything. ${esc(TERMS.travelFee)}`,
})}
`;

export default page({
  title: `Our Work — Before and After | ${SITE.shortName}`,
  description: `Before and after photographs of interior and exterior detailing carried out by Royal Kings Auto Care across Winnipeg. Drag the handle to compare each vehicle.`,
  path: '/gallery',
  noindex: !hasPhotos,
  schema: hasPhotos
    ? [breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Our work', href: '/gallery' }])]
    : [],
  body,
});
