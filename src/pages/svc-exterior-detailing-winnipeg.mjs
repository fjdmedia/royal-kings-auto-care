import { SITE, ADDONS, TERMS, addonRange, money } from '../data.mjs';
import { page, secHead, ctaBand, icon, esc, faqSchema } from '../layout.mjs';
import { serviceHero, relatedServices, serviceSchema, serviceCrumbs } from '../service.mjs';

const SLUG = 'exterior-detailing-winnipeg';
const FROM = 50;

/* Angle: order of operations. Exterior work is a sequence and doing it out
   of order wastes money — that is the whole page. Opens on a sequence,
   closes on the honest note that there is no exterior package. */

const pick = f => ADDONS.find(a => a.field === f);
const EXT = ['addon_iron_remover', 'addon_clay_bar', 'addon_headlight', 'addon_engine_bay', 'addon_spray_ceramic', 'addon_ceramic_coat', 'addon_buffing'].map(pick);

const SEQUENCE = [
  { n: '01', t: 'Wash and dry',        b: 'Two buckets, clean media, top down. Most swirl marks in Winnipeg paint were put there by a wash, not by the road.' },
  { n: '02', t: 'Iron and fallout',    b: 'A chemical decontamination that dissolves brake dust and rail dust out of the clear coat. It runs purple as it works. This is the step that makes paint feel clean rather than look clean.' },
  { n: '03', t: 'Clay',                b: 'Mechanical decontamination for what the chemicals cannot lift — tar, overspray, tree sap, road grit that has bonded on.' },
  { n: '04', t: 'Correct, if it needs it', b: 'Only now can you see what the paint is actually doing. Swirls and light scratches get machine-polished out. Skipping straight to this step just grinds contamination into the finish.' },
  { n: '05', t: 'Protect',             b: 'Spray ceramic for months of gloss and beading, or true ceramic bonded to the prepped paint for years. Protection goes on last and locks in whatever is underneath it.' },
];

const faqs = [
  { q: 'Do you offer an exterior package like the interior tiers?',
    a: 'No, and that is deliberate. Interior work is predictable enough to package. Exterior work is not — two cars the same age can need completely different amounts of decontamination and correction. We price the exterior by the services your paint actually needs, so you are not paying for a step you can skip.' },
  { q: 'Do you need my water and power?',
    a: 'We come fully equipped with our own tools and supplies. We just need access to a standard outdoor outlet and water spigot for exterior work. Interior-only jobs don’t need either.' },
  { q: 'Can you do exterior work through a Winnipeg winter?',
    a: 'Decontamination and coating need temperature and a dry surface, so deep winter is not the season for it. Late spring through fall is when exterior work is worth paying for. Book the interior in winter and the paint in the warm months.' },
  { q: 'What order should I book things in if I can only do some of it?',
    a: 'Iron removal and clay first — they cost the least and change the most. Correction next if the paint is swirled. Coating last, and only on paint that has been decontaminated, because a coating seals in whatever is underneath it.' },
];

const body = `
${serviceHero({
  slug: SLUG,
  eyebrow: 'Exterior Detailing',
  h1: 'Exterior detailing<br class="br-desk">in Winnipeg',
  sub: 'Decontamination, correction and protection — in the order that actually works. Priced per service, because no two cars need the same steps.',
  specs: [
    { k: 'Services from', v: money(FROM),   n: 'Iron removal, flat rate', num: true },
    { k: 'Steps',         v: '5 stage',     n: 'Wash → decon → clay → correct → protect', num: true },
    { k: 'Season',        v: 'Spring–fall', n: 'Coating needs temperature' },
    { k: 'Where',         v: 'Your place',  n: 'Outdoor tap and outlet needed' },
  ],
})}

<section class="sec sec-tight band-deep pool" aria-labelledby="ord-h">
  <div class="wrap split split-lead">
    <div>
      <span class="kicker">Why order matters</span>
      <h2 id="ord-h" style="font-size:var(--fs-2xl);line-height:var(--lh-tight);letter-spacing:var(--tr-display);text-transform:uppercase;font-stretch:110%">
        Polish contaminated paint and you polish the contamination in.
      </h2>
    </div>
    <div class="prose">
      <p>
        Most of the money wasted on exterior detailing is spent doing the right steps in the
        wrong sequence. Wax over embedded iron traps it. A coating over unclayed paint locks
        the grit under a layer built to last years.
      </p>
      <p>
        Below is the sequence we work in and what each stage is actually for.
        You do not need all five on every car — you do need them in this order.
      </p>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="seq-h">
  <div class="wrap">
    ${secHead({
      index: '01',
      kicker: 'The sequence',
      title: '<span id="seq-h">Five stages,<br>bottom to top.</span>',
      meta: 'Skip steps, not order',
    })}
    <div class="matrix">
      ${SEQUENCE.map(s => `
      <div class="mrow mrow-2">
        <span class="mrow-name"><span class="num" style="color:var(--text-3);margin-right:var(--s-3)">${s.n}</span>${esc(s.t)}</span>
        <span class="mrow-what">${esc(s.b)}</span>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="sec band" id="pricing" aria-labelledby="pr-h">
  <div class="wrap">
    ${secHead({
      index: '02',
      kicker: 'Exterior pricing',
      title: '<span id="pr-h">Priced per service,<br>not per package.</span>',
      meta: `${EXT.length} exterior services`,
      lede: 'Ranges move with the size of the vehicle and the state of the paint. We look at the car and confirm the number with you before anything starts.',
    })}
    <div class="matrix">
      ${EXT.map(a => `
      <div class="mrow">
        <span class="mrow-name">${esc(a.name)}</span>
        <span class="mrow-what">${esc(a.what)}${a.note ? ` <em>${esc(a.note)}.</em>` : ''}</span>
        <span class="mrow-price num">${esc(addonRange(a))}<span class="mrow-basis">${esc(a.basis)}</span></span>
      </div>`).join('')}
    </div>
    <p class="notice" style="margin-top:var(--s-6)">
      <strong>Pairing it with an interior tier is the cheaper way to do it.</strong>
      We are already at your place with everything out of the van — booking exterior work
      alongside an interior package saves a second visit.
      <a class="gold" href="/pricing">See interior pricing →</a>
    </p>
  </div>
</section>

<section class="sec" aria-labelledby="faq-h">
  <div class="wrap split split-offer" style="align-items:start">
    <div>
      ${secHead({ index: '03', kicker: 'Exterior questions', title: '<span id="faq-h">Asked and answered</span>' })}
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

${relatedServices(SLUG)}

${ctaBand({
  heading: 'Tell us what<br class="br-desk">the paint is doing.',
  body: `Book a slot and note the condition — swirls, tar, water spots, dull finish. We confirm the exact number before we start. ${esc(TERMS.travelFee)}`,
})}
`;

export default page({
  title: `Exterior Car Detailing Winnipeg | ${SITE.shortName}`,
  description: `Exterior detailing in Winnipeg from ${money(FROM)} — iron removal, clay decontamination, paint correction and ceramic protection, done in the right order at your place.`,
  path: `/services/${SLUG}`,
  schema: [
    serviceSchema({ slug: SLUG, name: 'Exterior Car Detailing', from: FROM,
      description: 'Exterior car detailing in Winnipeg — wash, iron and fallout decontamination, clay bar, machine paint correction and ceramic protection, performed at the customer’s location.' }),
    serviceCrumbs('Exterior Detailing', SLUG),
    faqSchema(faqs),
  ],
  body,
});
