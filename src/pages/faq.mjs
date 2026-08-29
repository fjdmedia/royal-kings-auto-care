import { SITE, FAQS, CONTACT, TERMS, VEHICLE_CLASSES, money, priceFrom, primaryPhone } from '../data.mjs';
import { page, secHead, ctaBand, icon, esc, breadcrumbSchema, faqSchema } from '../layout.mjs';

/* Grouped rather than one long list — a visitor arriving from a search for
   "do detailers need my water" should not scroll past nine pricing answers
   to reach it. Every question here is one somebody has actually asked. */

const GROUPS = [
  {
    id: 'booking', kicker: 'Booking and scheduling', index: '01',
    items: [
      FAQS[0],
      FAQS[1],
      FAQS[2],
      { q: 'How far ahead do I need to book?',
        a: `The form takes dates from tomorrow onward and up to 90 days out. We confirm your slot inside ${TERMS.confirmWindow}. Paint correction needs a full day set aside, so it usually books further ahead than a package.` },
      { q: 'Can I change or cancel my appointment?',
        a: `Yes — reschedule at least 24 hours ahead and the deposit carries to the new date. ${TERMS.depositNote}` },
    ],
  },
  {
    id: 'onsite', kicker: 'On the day', index: '02',
    items: [
      FAQS[3],
      { q: 'Where should the car be parked?',
        a: 'Anywhere we can walk around it — a driveway, a garage, a parking spot at your work. For exterior work we need room to move and access to an outdoor tap and outlet. Underground parkades usually do not work for exterior jobs.' },
      { q: 'Do I need to empty the car first?',
        a: 'It helps. We will work around belongings, but anything loose in the footwells or the trunk slows the job down and we would rather spend that time on the carpet. Take valuables out — we would rather you did not have to think about it.' },
      { q: 'What happens at the end?',
        a: 'We walk the car with you before we pack up. If something got missed or is not right, we deal with it there — not on a callback the next day.' },
    ],
  },
  {
    id: 'pricing', kicker: 'Pricing and payment', index: '03',
    items: [
      FAQS[5],
      { q: 'Why does the price change with the vehicle?',
        a: `Because the work does. Bigger vehicles have more carpet, more seats and more glass. The surcharges are ${VEHICLE_CLASSES.map(v => `${v.label} +$${v.surcharge}`).join(', ')}.` },
      { q: 'Are the add-on ranges real, or does everyone pay the top?',
        a: 'They are real. A flat-rate add-on is flat. A range moves with vehicle size or how bad the problem is, and we confirm the exact figure with you after looking at the car and before starting. Nothing gets added at the end.' },
      { q: 'Do you charge for travel?',
        a: `No. ${TERMS.travelFee} For locations outside Winnipeg, reach out and we will see what we can do.` },
    ],
  },
  {
    id: 'area', kicker: 'Area and coverage', index: '04',
    items: [
      FAQS[4],
      { q: 'Do you do fleet or multiple vehicles?',
        a: 'Yes. If you have more than one vehicle at the same address, call rather than filling the form in twice — it is easier to schedule properly and we can look at the timing across all of them.' },
      { q: 'Can you detail in winter?',
        a: 'Interior work, yes, year-round. Exterior decontamination, correction and coating need temperature and a dry surface, so those run late spring through fall unless you have a heated garage.' },
    ],
  },
];

const ALL = GROUPS.flatMap(g => g.items);

const body = `
<section class="hero" aria-labelledby="h1">
  <div class="hero-bg" aria-hidden="true" style="--hero-img:url('/assets/Gallery/2026-08-28%204runner-black/rear-a1.jpg');--hero-pos:center 48%"></div>
  <div class="wrap hero-inner">
    <nav class="crumb" aria-label="Breadcrumb" style="padding-bottom:var(--s-5);border-bottom:var(--stroke)">
      <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">FAQ</span>
    </nav>

    <h1 class="hero-h1" id="h1" style="font-size:var(--fs-4xl)">Questions,<br class="br-desk">answered properly.</h1>

    <div class="hero-row">
      <p class="hero-sub">
        ${ALL.length} of them, grouped so you can find yours. If the answer you
        need is not here, call — it is quicker than email.
      </p>
      <div class="hero-act">
        <div class="hero-act-row">
          <a class="btn btn-primary" href="/book">Book a detail ${icon('right')}</a>
          <a class="hero-call" href="tel:${primaryPhone.tel}">${icon('phone')} ${primaryPhone.phone}</a>
        </div>
        <span class="hero-fine">${esc(CONTACT.hours)}</span>
      </div>
    </div>

    <div class="spec">
      ${GROUPS.map((g, i) => `
      <div class="spec-cell${i === 0 ? ' bkt' : ''}">
        <span class="spec-k">${g.index}</span>
        <p class="spec-v" style="font-size:var(--fs-base)"><a href="#${g.id}">${esc(g.kicker)}</a><small>${g.items.length} questions</small></p>
      </div>`).join('')}
    </div>
  </div>
</section>

${GROUPS.map((g, gi) => `
<section class="sec${gi % 2 === 1 ? ' band' : ''}" id="${g.id}" aria-labelledby="${g.id}-h">
  <div class="wrap split split-offer" style="align-items:start">
    <div>
      ${secHead({ index: g.index, kicker: g.kicker, title: `<span id="${g.id}-h">${esc(g.kicker)}</span>` })}
    </div>
    <div class="acc">
      ${g.items.map(f => `
      <details>
        <summary>${esc(f.q)}<span class="acc-ic" aria-hidden="true"></span></summary>
        <div class="acc-body">${esc(f.a)}</div>
      </details>`).join('')}
    </div>
  </div>
</section>`).join('')}

${ctaBand({
  heading: 'Still not sure?<br class=\"br-desk\">Ask us directly.',
  body: `Call, text, or DM — whichever is easiest. Both of us answer our own phones, ${esc(CONTACT.hoursShort)}.`,
  primary: { href: '/contact', label: 'Ways to reach us' },
})}
`;

export default page({
  title: `Detailing FAQ — Winnipeg | ${SITE.shortName}`,
  description: `Answers on booking, what happens on the day, pricing, deposits and coverage across Winnipeg. ${ALL.length} questions about come-to-you auto detailing, answered plainly.`,
  path: '/faq',
  schema: [breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'FAQ', href: '/faq' }]), faqSchema(ALL)],
  body,
});
