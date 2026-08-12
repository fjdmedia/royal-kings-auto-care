import { SITE, TERMS, CONTACT, money, priceFrom, primaryPhone } from '../data.mjs';
import { page, ctaBand, icon, esc, breadcrumbSchema } from '../layout.mjs';
import { bookingForm } from '../components.mjs';

/* A single-task page. No section index, no scroll narrative, no second
   ask — someone who reached /book already decided. Everything on the page
   either takes the booking or removes a reason not to. */

const body = `
<section class="hero" aria-labelledby="h1" style="padding-bottom:var(--s-7)">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="wrap hero-inner">
    <nav class="crumb" aria-label="Breadcrumb" style="padding-bottom:var(--s-5);border-bottom:var(--stroke)">
      <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Book</span>
    </nav>

    <h1 class="hero-h1" id="h1" style="font-size:var(--fs-4xl)">Book your detail.</h1>

    <div class="hero-row" style="padding-bottom:var(--s-7)">
      <p class="hero-sub">
        Under two minutes. The total updates as you go, and we confirm the
        appointment inside ${esc(TERMS.confirmWindow)}.
      </p>
      <div class="hero-act">
        <span class="hero-fine">Prefer to talk it through first?</span>
        <div class="hero-act-row">
          <a class="hero-call" href="tel:${primaryPhone.tel}">${icon('phone')} ${primaryPhone.phone} — ${primaryPhone.name}</a>
          <a class="hero-call" href="${CONTACT.instagram.url}" target="_blank" rel="noopener">${icon('ig')} ${esc(CONTACT.instagram.handle)}</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:var(--s-7)" aria-labelledby="form-h">
  <div class="wrap split split-follow" style="align-items:start">

    <aside class="stack-5" style="position:sticky;top:calc(var(--nav-h) + var(--s-5))">
      <div class="card bkt">
        <h3>What happens next</h3>
        <ol class="pkg-inc" style="margin-top:var(--s-4)">
          <li>We read it and confirm your slot inside ${esc(TERMS.confirmWindow)}.</li>
          <li>You sign the service agreement — we forward you to it, already filled in.</li>
          <li>${esc(TERMS.deposit)} holds the date and comes off your total.</li>
          <li>We arrive at your place, fully equipped.</li>
        </ol>
      </div>

      <div class="card card-flat">
        <h3>Nothing is locked in yet</h3>
        <p>
          This is a request, not a charge. We confirm the final price with you
          before any work starts, and the estimate below is there so there are
          no surprises when we do.
        </p>
      </div>

      <p class="hero-fine">${esc(TERMS.travelFee)} · ${esc(CONTACT.hours)}</p>
    </aside>

    <div>
      <h2 id="form-h" class="vh">Booking form</h2>
      ${bookingForm()}
    </div>

  </div>
</section>

${ctaBand({
  heading: 'Rather just call?',
  body: `Both of us answer our own phones. ${esc(CONTACT.hours)}.`,
  primary: { href: `tel:${primaryPhone.tel}`, label: `Call ${primaryPhone.phone}` },
})}
`;

export default page({
  title: `Book a Detail in Winnipeg | ${SITE.shortName}`,
  description: `Book auto detailing in Winnipeg in under two minutes. Pick your package and vehicle class, add extras, see the total live. Packages from ${money(priceFrom)}, we come to you.`,
  path: '/book',
  schema: [breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Book', href: '/book' }])],
  body,
  dock: false,
});
