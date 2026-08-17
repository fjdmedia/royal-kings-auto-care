import { SITE, SERVICES, TERMS, CONTACT, LIVE_HERO, money, primaryPhone } from './data.mjs';
import { icon, esc, breadcrumbSchema, faqSchema } from './layout.mjs';

/* Shared furniture for the four service pages. Structure repeats on
   purpose — a reader scanning three services should find the breadcrumb,
   the spec strip and the CTA in the same place every time. The PROSE is
   written per page and shares no skeleton (G40b). */

export const serviceHero = ({ slug, eyebrow, h1, sub, specs }) => {
  /* The live site's H1, eyebrow and sub win over anything written here —
     they are client-approved and already indexed. */
  const L = LIVE_HERO[slug] || {};
  const useH1 = L.h1 || h1;
  const useSub = L.sub || sub;
  const useEyebrow = L.eyebrow || eyebrow;
  return `
<section class="hero" aria-labelledby="h1">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="wrap hero-inner">
    <nav class="crumb" aria-label="Breadcrumb" style="padding-bottom:var(--s-5);border-bottom:var(--stroke)">
      <a href="/">Home</a><span aria-hidden="true">/</span>
      <a href="/services">Services</a><span aria-hidden="true">/</span>
      <span aria-current="page">${esc(eyebrow)}</span>
    </nav>

    <span class="kicker" style="margin-top:var(--s-6)">${esc(useEyebrow)}</span>
    <h1 class="hero-h1" id="h1" style="font-size:var(--fs-4xl)">${useH1}</h1>

    <div class="hero-row">
      <p class="hero-sub">${useSub}</p>
      <div class="hero-act">
        <div class="hero-act-row">
          <a class="btn btn-primary" href="/book">Book a detail ${icon('right')}</a>
          <a class="hero-call" href="tel:${primaryPhone.tel}">${icon('phone')} ${primaryPhone.phone}</a>
        </div>
        <span class="hero-fine">${esc(TERMS.travelFeeShort)} · Free estimates</span>
      </div>
    </div>

    <div class="spec">
      ${specs.map((s, i) => `
      <div class="spec-cell${i === 0 ? ' bkt' : ''}">
        <span class="spec-k">${esc(s.k)}</span>
        <p class="spec-v${s.num ? ' num' : ''}">${esc(s.v)}<small>${esc(s.n)}</small></p>
      </div>`).join('')}
    </div>
  </div>
</section>`;
};

export const relatedServices = current => {
  const others = SERVICES.filter(s => s.slug !== current);
  return `
<section class="sec band" aria-labelledby="rel-h">
  <div class="wrap">
    <div class="sec-head">
      <span class="kicker">Keep going</span>
      <div class="sec-head-row">
        <h2 id="rel-h">The rest of what we do</h2>
        <span class="sec-head-meta">${others.length} more services</span>
      </div>
    </div>
    <div class="cols-3">
      ${others.map(s => `
      <a class="card card-flat" href="/services/${s.slug}">
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.short)}</p>
        <p class="pkg-meta" style="margin-top:var(--s-4)">From ${money(s.from)} · <span class="gold">See the service →</span></p>
      </a>`).join('')}
    </div>
  </div>
</section>`;
};

export const serviceSchema = ({ slug, name, description, from }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: `${name} ${SITE.city}`,
  description,
  serviceType: name,
  url: `${SITE.origin}/services/${slug}`,
  provider: { '@id': `${SITE.origin}/#business` },
  areaServed: { '@type': 'City', name: SITE.city },
  offers: {
    '@type': 'Offer', priceCurrency: 'CAD', availability: 'https://schema.org/InStock',
    priceSpecification: { '@type': 'PriceSpecification', minPrice: from, priceCurrency: 'CAD' },
  },
});

export const serviceCrumbs = (label, slug) => breadcrumbSchema([
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label, href: `/services/${slug}` },
]);

export { faqSchema, CONTACT };
