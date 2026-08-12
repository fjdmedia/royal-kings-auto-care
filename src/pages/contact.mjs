import { SITE, CONTACT, AREAS, TERMS, money, priceFrom } from '../data.mjs';
import { page, secHead, ctaBand, icon, esc, breadcrumbSchema } from '../layout.mjs';

const body = `
<section class="hero" aria-labelledby="h1">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="wrap hero-inner">
    <nav class="crumb" aria-label="Breadcrumb" style="padding-bottom:var(--s-5);border-bottom:var(--stroke)">
      <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Contact</span>
    </nav>

    <h1 class="hero-h1" id="h1" style="font-size:var(--fs-4xl)">Reach us<br class="br-desk">directly.</h1>

    <div class="hero-row">
      <p class="hero-sub">
        Two numbers, both answered by the people doing the work.
        Pick whichever is easiest — the DMs get read as fast as the phone.
      </p>
      <div class="hero-act">
        <div class="hero-act-row">
          <a class="btn btn-primary" href="/book">Book a detail ${icon('right')}</a>
        </div>
        <span class="hero-fine">${esc(CONTACT.hours)}</span>
      </div>
    </div>

    <div class="spec">
      <div class="spec-cell bkt"><span class="spec-k">Hours</span><p class="spec-v" style="font-size:var(--fs-base)">Mon – Sat<small>8am – 6pm</small></p></div>
      <div class="spec-cell"><span class="spec-k">Based in</span><p class="spec-v" style="font-size:var(--fs-base)">${esc(SITE.city)}<small>${SITE.region}, Canada</small></p></div>
      <div class="spec-cell"><span class="spec-k">Coverage</span><p class="spec-v" style="font-size:var(--fs-base)">All of ${esc(SITE.city)}<small>${esc(TERMS.travelFee)}</small></p></div>
      <div class="spec-cell"><span class="spec-k">Reply time</span><p class="spec-v num">${esc(TERMS.confirmWindow)}<small>On booking requests</small></p></div>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="ways-h">
  <div class="wrap">
    ${secHead({
      index: '01',
      kicker: 'Ways to reach us',
      title: '<span id="ways-h">Four channels.<br>Same two people.</span>',
      meta: 'No call centre',
    })}
    <div class="tiles">
      ${CONTACT.people.map(p => `
      <a class="tile" href="tel:${p.tel}">
        <span class="tile-k">${icon('phone')} Call or text ${esc(p.name)}</span>
        <span class="tile-v">${esc(p.phone)}</span>
        <span class="tile-n">${esc(CONTACT.hours)}</span>
      </a>`).join('')}
      <a class="tile" href="${CONTACT.instagram.url}" target="_blank" rel="noopener">
        <span class="tile-k">${icon('ig')} Instagram</span>
        <span class="tile-v">${esc(CONTACT.instagram.handle)}</span>
        <span class="tile-n">Recent work and DMs</span>
      </a>
      <a class="tile" href="mailto:${CONTACT.email}">
        <span class="tile-k">${icon('mail')} Email</span>
        <span class="tile-v">${esc(CONTACT.email)}</span>
        <span class="tile-n">Slower than a call — good for quotes with photos</span>
      </a>
    </div>
    <p class="hero-fine" style="margin-top:var(--s-5)">
      Also on TikTok — <a class="gold" href="${CONTACT.tiktok.url}" target="_blank" rel="noopener">${esc(CONTACT.tiktok.handle)}</a>
    </p>
  </div>
</section>

<section class="sec band" aria-labelledby="area-h">
  <div class="wrap split split-lead">
    <div>
      ${secHead({
        index: '02',
        kicker: 'Where we go',
        title: `<span id="area-h">All of ${esc(SITE.city)}.</span>`,
        meta: 'No travel fee',
      })}
      <div class="prose">
        <p>
          We serve the whole city. The list is here so you can see your
          neighbourhood on it, not because coverage stops at the edge of it.
        </p>
        <p>
          Outside city limits — Headingley, East and West St. Paul, the
          surrounding RMs — get in touch and we will tell you honestly whether
          the drive works for the job.
        </p>
      </div>
    </div>
    <ul class="areas">
      ${AREAS.map(a => `<li>${esc(a)}</li>`).join('\n      ')}
      <li style="border-color:var(--edge-gold);color:var(--gold)">and everywhere between</li>
    </ul>
  </div>
</section>

${ctaBand({
  heading: 'Or skip the call<br class=\"br-desk\">and book it.',
  body: `The form takes under two minutes and totals the price as you go. ${esc(TERMS.deposit)} holds the slot.`,
})}
`;

export default page({
  title: `Contact Royal Kings Auto Care | Winnipeg`,
  description: `Reach Royal Kings Auto Care in Winnipeg — call or text Patrick or Justin, DM us on Instagram, or email. Mon–Sat 8am–6pm, all of Winnipeg, no travel fee.`,
  path: '/contact',
  schema: [breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact' }])],
  body,
});
