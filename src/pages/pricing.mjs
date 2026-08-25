import { SITE, PACKAGES, VEHICLE_CLASSES, ADDONS, TERMS, money, priceFrom } from '../data.mjs';
import { page, secHead, ctaBand, icon, esc, breadcrumbSchema, faqSchema } from '../layout.mjs';
import { packageBlock, addonMatrix } from '../components.mjs';

const faqs = [
  { q: 'Why does the price change with the vehicle?',
    a: `Because the work does. A 7-seater has more carpet, more seats and more glass than a coupe — pricing them the same would mean overcharging the coupe. The surcharge is ${VEHICLE_CLASSES.map(v => `${v.label} +$${v.surcharge}`).join(', ')}.` },
  { q: 'Is the price on this page the price I pay?',
    a: 'For a package on a normal car, yes — the tier price plus your vehicle class, and nothing added at the end. Add-ons with a range are confirmed with you before we start, once we have seen the vehicle.' },
  { q: 'What does the deposit do?',
    a: `${TERMS.deposit} holds the appointment and comes off your total, so it is not an extra cost. Reschedule at least 24 hours ahead and it carries to the new date. ${TERMS.depositNote}` },
  { q: 'Do you charge to drive out to me?',
    a: `No. ${TERMS.travelFee} If you are outside city limits, reach out and we will see what we can do.` },
];

const body = `
<section class="hero" aria-labelledby="h1">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="wrap hero-inner">
    <nav class="crumb" aria-label="Breadcrumb" style="padding-bottom:var(--s-5);border-bottom:var(--stroke)">
      <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Pricing</span>
    </nav>

    <h1 class="hero-h1" id="h1" style="font-size:var(--fs-4xl)">What it costs.<br class="br-desk">All of it.</h1>

    <div class="hero-row">
      <p class="hero-sub">
        Three interior tiers, three vehicle classes, ${ADDONS.length} add-ons.
        Pick your class and every number on this page updates.
      </p>
      <div class="hero-act">
        <div class="hero-act-row">
          <a class="btn btn-primary" href="/book">Book a detail ${icon('right')}</a>
          <a class="hero-call" href="#addons">Jump to add-ons →</a>
        </div>
        <span class="hero-fine">No quote request · No callback · ${esc(TERMS.travelFeeShort)}</span>
      </div>
    </div>

    <div class="spec">
      <div class="spec-cell bkt"><span class="spec-k">Interior from</span><p class="spec-v num">${money(priceFrom)}<small>Coupes and sedans</small></p></div>
      <div class="spec-cell"><span class="spec-k">Deposit</span><p class="spec-v num">${esc(TERMS.deposit)}<small>Comes off the total</small></p></div>
      <div class="spec-cell"><span class="spec-k">Travel</span><p class="spec-v num">$0<small>Inside city limits</small></p></div>
      <div class="spec-cell"><span class="spec-k">Payment</span><p class="spec-v">3 ways<small>${esc(TERMS.payment)}</small></p></div>
    </div>
  </div>
</section>

<section class="sec" id="packages" aria-labelledby="pkg-h">
  <div class="wrap">
    ${secHead({
      index: '01',
      kicker: 'Interior packages',
      title: '<span id="pkg-h">Set your class first.</span>',
      meta: 'Prices below update live',
      lede: 'The tier decides how deep we go. The class decides the price. Nothing else moves.',
    })}
    ${packageBlock({
      note: `<strong>What the class changes.</strong> ${VEHICLE_CLASSES.map(v => `${esc(v.label)} ${v.surcharge === 0 ? 'is the base price' : '+' + money(v.surcharge)}`).join(', ')}. That surcharge is the only thing that moves a package price.`,
    })}
  </div>
</section>

<section class="sec band" id="addons" aria-labelledby="add-h">
  <div class="wrap">
    ${secHead({
      index: '02',
      kicker: 'Add-ons',
      title: '<span id="add-h">Everything else,<br>and what moves the number.</span>',
      meta: `${ADDONS.length} services`,
      lede: 'A flat rate is a flat rate. A range means we need to see the vehicle first — and we confirm the exact figure with you before anything starts.',
    })}
    ${addonMatrix()}
  </div>
</section>

<section class="sec" aria-labelledby="incl-h">
  <div class="wrap split split-follow" style="align-items:start">
    <div>
      ${secHead({ index: '03', kicker: 'Included at no cost', title: '<span id="incl-h">Things other places<br>bill you for.</span>' })}
    </div>
    <ul class="stack-4">
      <li class="tile"><span class="tile-k">Travel</span><span class="tile-v">$0</span><span class="tile-n">${esc(TERMS.travelFee)} We drive to you, not the other way round.</span></li>
      <li class="tile"><span class="tile-k">Estimates</span><span class="tile-v">Free</span><span class="tile-n">Live on this page, or confirmed in writing before we start. No obligation.</span></li>
      <li class="tile"><span class="tile-k">Equipment</span><span class="tile-v">Ours</span><span class="tile-n">We arrive fully equipped. For exterior work we need an outdoor tap and outlet.</span></li>
      <li class="tile"><span class="tile-k">Walkthrough</span><span class="tile-v">Every job</span><span class="tile-n">We go over the car with you before we pack up. Anything missed gets handled there.</span></li>
    </ul>
  </div>
</section>

<section class="sec band" aria-labelledby="faq-h">
  <div class="wrap split split-offer" style="align-items:start">
    <div>
      ${secHead({ index: '04', kicker: 'Pricing questions', title: '<span id="faq-h">The money questions</span>' })}
      <a class="btn btn-ghost" href="/faq">All questions ${icon('right')}</a>
    </div>
    <div class="acc">
      ${faqs.map(f => `
      <details>
        <summary>${esc(f.q)}<span class="acc-ic" aria-hidden="true"></span></summary>
        <div class="acc-body">${esc(f.a)}</div>
      </details>`).join('')}
    </div>
  </div>
</section>

${ctaBand({
  heading: 'You have the price.<br class="br-desk">Pick a day.',
  body: `The booking form carries the same prices and totals them live as you add options. ${esc(TERMS.deposit)} holds the slot.`,
})}
`;

export default page({
  title: `Car Detailing Prices Winnipeg | ${SITE.shortName}`,
  description: `Full detailing price list for Winnipeg — interior packages from ${money(priceFrom)} by vehicle class, ${ADDONS.length} add-ons with honest ranges, no travel fee in the city and no hidden extras.`,
  path: '/pricing',
  schema: [breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Pricing', href: '/pricing' }]), faqSchema(faqs)],
  body,
});
