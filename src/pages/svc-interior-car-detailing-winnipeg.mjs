import { SITE, PACKAGES, TERMS, money, priceFrom } from '../data.mjs';
import { page, secHead, ctaBand, icon, esc, faqSchema } from '../layout.mjs';
import { serviceHero, relatedServices, serviceSchema, serviceCrumbs } from '../service.mjs';
import { packageBlock } from '../components.mjs';

const SLUG = 'interior-car-detailing-winnipeg';

/* Angle: what actually comes out of a car. Concrete, physical, a list of
   the things nobody wants to name. Opens on an inventory, closes on smell. */
const faqs = [
  { q: 'What is the difference between a car wash vacuum and interior detailing?',
    a: 'A vacuum lifts what is loose on top. Detailing gets what has bonded to the fibre — salt that has dried into the carpet, grit worked into the seat foam, and the film on every hard surface. We use extraction, not suction alone.' },
  { q: 'Can you get salt stains out of carpets and mats?',
    a: 'Usually, yes. Dried road salt leaves a white bloom that re-appears after a surface clean because the salt is still in the fibre. Hot-water extraction pulls it out rather than redistributing it. Badly set-in salt on light carpet can leave a faint shadow — we will tell you before we start if we think that is the case.' },
  { q: 'Do you clean the trunk and the third row?',
    a: 'Yes. Trunk and every row of seating are part of the interior on all three packages. Vehicle class pricing exists because a 7-seater is genuinely more work than a Civic, not as a surcharge for the sake of one.' },
  { q: 'How long should I leave the car after an interior detail?',
    a: 'Give fabric a few hours with the windows cracked if the weather allows. Extraction leaves the material damp, not wet. In winter we will run it dry as far as we can before we finish.' },
];

const body = `
${serviceHero({
  slug: SLUG,
  eyebrow: 'Interior Detailing',
  h1: 'Interior car detailing<br class="br-desk">in Winnipeg',
  sub: 'The side of the car you actually sit in. Vacuum, extraction, fabric, surfaces and odor — done at your place, priced by vehicle class.',
  specs: [
    { k: 'Packages from', v: money(priceFrom), n: 'Three tiers, fixed per class', num: true },
    { k: 'Time on site',  v: '1 – 5 hrs',      n: 'Depends on tier and condition', num: true },
    { k: 'Where',         v: 'Your place',     n: 'Home, work, parking spot' },
    { k: 'Deposit',       v: TERMS.deposit,    n: 'Comes off the total', num: true },
  ],
})}

<section class="sec sec-tight band-deep pool" aria-labelledby="in-h">
  <div class="wrap split split-lead">
    <div>
      <span class="kicker">What comes out</span>
      <h2 id="in-h" style="font-size:var(--fs-2xl);line-height:var(--lh-tight);letter-spacing:var(--tr-display);text-transform:uppercase;font-stretch:110%">
        Salt, sand, dog hair, spilled coffee, and whatever is under the seat.
      </h2>
    </div>
    <div class="prose">
      <p>
        An interior gets dirty in layers. Loose debris sits on top. Under it, grit works into
        the carpet pile and the seat foam. Under that, liquid has already soaked through —
        coffee, pop, melted snow, whatever the kids were holding.
      </p>
      <p>
        A vacuum only ever reaches the first layer. That is why a car can be vacuumed on
        Saturday and smell the same on Monday. We work down through all three.
      </p>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="cov-h">
  <div class="wrap">
    ${secHead({
      index: '01',
      kicker: 'Covered on every tier',
      title: '<span id="cov-h">Every surface, every row.</span>',
      meta: 'Front, rear, trunk',
    })}
    <div class="cols-3">
      <article class="card"><h3>Carpets and mats</h3><p>Vacuumed, then extracted where the tier calls for it. Mats come out of the car — cleaning around them is how salt survives a detail.</p></article>
      <article class="card"><h3>Seats and upholstery</h3><p>Cloth gets shampooed and extracted. Leather and vinyl get cleaned and conditioned so they do not dry and crack through a Winnipeg winter.</p></article>
      <article class="card"><h3>Hard surfaces</h3><p>Dash, console, door cards, cupholders, vents, and the door jambs. The jambs are the part most places skip and the first thing you touch.</p></article>
      <article class="card"><h3>Glass, inside</h3><p>Interior glass and mirrors, streak-free. The haze on the inside of a windshield is off-gassing from the dash — cleaning the dash is half the fix.</p></article>
      <article class="card"><h3>Trunk and cargo</h3><p>Full vacuum and wipe-down including under the load floor. Spare-tire wells collect more than people expect.</p></article>
      <article class="card"><h3>Odor at the source</h3><p>Included on Premium, available as an add-on to any tier. We treat what is causing the smell rather than covering it with scent.</p></article>
    </div>
  </div>
</section>

<section class="sec band" id="pricing" aria-labelledby="pr-h">
  <div class="wrap">
    ${secHead({
      index: '02',
      kicker: 'Interior pricing',
      title: '<span id="pr-h">Three tiers.<br>Pick your vehicle class.</span>',
      meta: 'Prices update below',
      lede: 'Tier sets how deep we go. Vehicle class sets the price, because a 7-seater takes longer than a coupe and pretending otherwise would just mean charging the coupe too much.',
    })}
    ${packageBlock({
      note: `<strong>${esc(PACKAGES[2].name)} is the one to book</strong> after a winter, before you sell, or when something has soaked in. ${esc(PACKAGES[0].name)} is upkeep for a car that is already in decent shape.`,
    })}
  </div>
</section>

<section class="sec" aria-labelledby="faq-h">
  <div class="wrap split split-offer" style="align-items:start">
    <div>
      ${secHead({ index: '03', kicker: 'Interior questions', title: '<span id="faq-h">Asked and answered</span>' })}
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
  heading: 'Get the salt out.<br class="br-desk">And the smell.',
  body: `Pick a tier, pick a day, and we come to you. ${esc(TERMS.deposit)} holds the slot and comes off the total.`,
})}
`;

export default page({
  title: `Interior Car Detailing Winnipeg | ${SITE.shortName}`,
  description: `Interior car detailing in Winnipeg from ${money(priceFrom)}. Extraction, fabric care, odor and salt removal on all three rows — done at your home or work. Book online.`,
  path: `/services/${SLUG}`,
  schema: [
    serviceSchema({ slug: SLUG, name: 'Interior Car Detailing', from: priceFrom,
      description: 'Interior car detailing in Winnipeg — vacuum, hot-water extraction, fabric and leather care, hard surfaces, glass and odor treatment, performed at the customer’s location.' }),
    serviceCrumbs('Interior Detailing', SLUG),
    faqSchema(faqs),
  ],
  body,
});
