import { SITE, SERVICES, ADDONS, TERMS, LIVE_HERO, money, priceFrom } from '../data.mjs';
import { page, secHead, ctaBand, icon, esc, breadcrumbSchema } from '../layout.mjs';
import { addonMatrix, photoPlate, svcKey } from '../components.mjs';
import { GALLERY } from '../gallery-data.mjs';

const body = `
<section class="hero" aria-labelledby="h1">
  <div class="hero-bg" aria-hidden="true" style="--hero-img:url('/assets/Gallery/2026-08-28%204runner-black/passenger-a1.jpg');--hero-pos:center 46%"></div>
  <div class="wrap hero-inner">
    <nav class="crumb" aria-label="Breadcrumb" style="padding-bottom:var(--s-5);border-bottom:var(--stroke)">
      <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Services</span>
    </nav>

    <span class="kicker" style="margin-top:var(--s-6)">${esc(LIVE_HERO.services.eyebrow)}</span>
    <h1 class="hero-h1" id="h1" style="font-size:var(--fs-4xl)">${LIVE_HERO.services.h1}</h1>

    <div class="hero-row">
      <p class="hero-sub">${esc(LIVE_HERO.services.sub)}</p>
      <div class="hero-act">
        <div class="hero-act-row">
          <a class="btn btn-primary" href="/book">Book a detail ${icon('right')}</a>
          <a class="hero-call" href="/pricing">See full pricing →</a>
        </div>
        <span class="hero-fine">${esc(TERMS.travelFee)}</span>
      </div>
    </div>

    <div class="spec">
      <div class="spec-cell bkt"><span class="spec-k">Services</span><p class="spec-v num">${SERVICES.length}<small>Interior, exterior, coating, correction</small></p></div>
      <div class="spec-cell"><span class="spec-k">Add-ons</span><p class="spec-v num">${ADDONS.length}<small>Bookable alone or alongside</small></p></div>
      <div class="spec-cell"><span class="spec-k">Packages from</span><p class="spec-v num">${money(priceFrom)}<small>Interior, per vehicle class</small></p></div>
      <div class="spec-cell"><span class="spec-k">Where</span><p class="spec-v">Your place<small>Anywhere in ${SITE.city}</small></p></div>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="svc-h">
  <div class="wrap">
    ${secHead({
      index: '01',
      kicker: 'The four services',
      title: '<span id="svc-h">Start with the one<br>your car actually needs.</span>',
      meta: 'Each page prices itself',
    })}
    <div class="cols-2">
      ${SERVICES.map(s => `
      <a class="card" href="/services/${s.slug}">
        ${photoPlate(GALLERY.services[svcKey(s.slug)], { cls: 'plate-wide bkt', style: 'margin:calc(var(--s-6) * -1) calc(var(--s-6) * -1) var(--s-5)' })}
        <h3 style="font-size:var(--fs-xl)">${esc(s.title)}</h3>
        <p>${esc(s.short)}</p>
        <p class="pkg-meta" style="margin-top:var(--s-5)">From ${money(s.from)} · <span class="gold" style="white-space:nowrap">See the service →</span></p>
      </a>`).join('')}
    </div>
  </div>
</section>

<section class="sec band" aria-labelledby="add-h">
  <div class="wrap">
    ${secHead({
      index: '02',
      kicker: 'Add-ons',
      title: '<span id="add-h">Ten things you can<br>bolt onto any booking.</span>',
      meta: `${ADDONS.length} services`,
      lede: 'Add any of these to a package, or book one on its own. Where a price is a range, it moves with the size of the vehicle or the state it arrives in.',
    })}
    ${addonMatrix()}
  </div>
</section>

${ctaBand({
  heading: 'Not sure which<br class=\"br-desk\">one you need.',
  body: 'Tell us what is bothering you about the car and we will point you at the right service — including when the answer is the cheap one.',
})}
`;

export default page({
  title: `Car Detailing Services in Winnipeg | ${SITE.shortName}`,
  description: `Every service we offer in Winnipeg — interior packages from ${money(priceFrom)}, exterior decontamination, ceramic coating, paint correction and ${ADDONS.length} add-ons. We come to you.`,
  path: '/services',
  schema: [breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }])],
  body,
});
