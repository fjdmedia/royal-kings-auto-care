import { SITE, ADDONS, TERMS, addonRange, money } from '../data.mjs';
import { page, secHead, ctaBand, icon, esc, faqSchema } from '../layout.mjs';
import { serviceHero, relatedServices, serviceSchema, serviceCrumbs } from '../service.mjs';

const SLUG = 'ceramic-coating-winnipeg';
const spray = ADDONS.find(a => a.field === 'addon_spray_ceramic');
const trueC = ADDONS.find(a => a.field === 'addon_ceramic_coat');
const FROM = spray.min;

/* Angle: an honest comparison. Two products, one of them is four to ten
   times the price, and most of the internet will not tell you which one
   you need. Opens on the question, closes on who should NOT buy it. */

const ROWS = [
  { k: 'What it is',        s: 'A polymer sealant you spray and level',        t: 'A liquid glass layer that cures bonded to the clear coat' },
  { k: 'How long it lasts', s: 'Several months',                               t: 'Years, not months' },
  { k: 'Prep required',     s: 'Wash and decontamination',                     t: 'Wash, decontamination, and correction if the paint is swirled' },
  { k: 'Time on site',      s: 'Part of a normal visit',                       t: 'A full day or more, depending on prep' },
  { k: 'What it costs',     s: addonRange(spray),                              t: addonRange(trueC) },
  { k: 'Best for',          s: 'A car you keep clean and re-do each season',   t: 'A car you plan to keep, or one you just bought' },
];

const faqs = [
  { q: 'Do you apply ceramic coating at my location in Winnipeg?',
    a: 'Yes. Spray ceramic fits inside a normal visit. True ceramic needs a full day and a surface that stays dry while it cures, so it works best in a garage or under cover — we will talk through your space when you book.' },
  { q: 'Which one do I actually need?',
    a: 'If you wash the car regularly and you are happy re-doing protection every season, spray ceramic is the honest answer and it costs a fraction as much. True ceramic earns its price on a vehicle you intend to keep for years, or on new paint you want to protect from day one.' },
  { q: 'Does a coating mean I never have to wash the car?',
    a: 'No. It means dirt has a much harder time bonding and comes off far easier when you do wash. Anyone telling you a coating replaces washing is selling something.' },
  { q: 'Does my paint need correcting first?',
    a: 'A coating seals in whatever is underneath it, including swirl marks. If the paint is swirled and you want it gone, correction comes first — otherwise you are locking the defects in for the life of the coating. We will tell you honestly whether yours needs it.' },
  { q: 'Is ceramic coating worth it with Winnipeg winters?',
    a: 'The winter case is the strongest case. Road salt and brine are the harshest thing your paint meets all year, and a coating gives them a sacrificial layer to sit on instead of the clear coat. Coat in the fall, before the first salt truck.' },
];

const body = `
${serviceHero({
  slug: SLUG,
  eyebrow: 'Ceramic Coating',
  h1: 'Ceramic coating<br class="br-desk">in Winnipeg',
  sub: 'Gloss, and a layer road salt has to get through before it reaches your paint. Two products at very different prices — here is which one you actually need.',
  specs: [
    { k: 'Spray ceramic', v: addonRange(spray), n: 'Months of protection', num: true },
    { k: 'True ceramic',  v: addonRange(trueC), n: 'Years, bonded to prepped paint', num: true },
    { k: 'Best timing',   v: 'Fall',            n: 'Before the first salt truck' },
    { k: 'Prep',          v: 'Required',        n: 'A coating seals in what is under it' },
  ],
})}

<section class="sec sec-tight band-deep pool" aria-labelledby="q-h">
  <div class="wrap split split-lead">
    <div>
      <span class="kicker">The real question</span>
      <h2 id="q-h" style="font-size:var(--fs-2xl);line-height:var(--lh-tight);letter-spacing:var(--tr-display);text-transform:uppercase;font-stretch:110%">
        Not whether coating works. Which one you should pay for.
      </h2>
    </div>
    <div class="prose">
      <p>
        Both products do the same job — they make the surface slick so water beads and
        contamination struggles to stick. The difference is how long it lasts and how much
        preparation it demands underneath.
      </p>
      <p>
        One of them costs ${addonRange(spray)}. The other starts at ${money(trueC.min)}.
        Plenty of shops will happily sell you the second when you needed the first.
      </p>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="cmp-h">
  <div class="wrap">
    ${secHead({
      index: '01',
      kicker: 'Side by side',
      title: '<span id="cmp-h">Spray ceramic<br>or true ceramic.</span>',
      meta: 'Same job, different commitment',
    })}
    <div style="overflow-x:auto">
      <table class="cmp">
        <caption class="vh">Spray ceramic coating compared with true ceramic coating</caption>
        <thead>
          <tr>
            <th scope="col"><span class="vh">Attribute</span></th>
            <th scope="col">Spray ceramic</th>
            <th scope="col">True ceramic</th>
          </tr>
        </thead>
        <tbody>
          ${ROWS.map(r => `
          <tr>
            <th scope="row">${esc(r.k)}</th>
            <td>${esc(r.s)}</td>
            <td>${esc(r.t)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="sec band" id="pricing" aria-labelledby="pr-h">
  <div class="wrap split split-offer" style="align-items:start">
    <div>
      ${secHead({
        index: '02',
        kicker: 'Why the range',
        title: '<span id="pr-h">The price moves<br>with the prep.</span>',
      })}
      <div class="prose">
        <p>
          Spray ceramic is priced by vehicle size — that is the only variable.
        </p>
        <p>
          True ceramic is quoted per vehicle because the coating is the last hour of a
          much longer job. Paint that needs decontaminating and correcting first sits at
          the top of the range. Paint that is already sound sits near the bottom.
          We look at the car and give you the number before anything is opened.
        </p>
      </div>
    </div>
    <div class="stack-4">
      <article class="card">
        <h3>${esc(spray.name)}</h3>
        <p class="pkg-price num" style="font-size:var(--fs-num-sm);margin:var(--s-3) 0"><span class="cur">$</span>${spray.min}<span style="font-size:0.4em;color:var(--text-3)">&nbsp;–&nbsp;$${spray.max}</span></p>
        <p>${esc(spray.what)} Priced by vehicle size.</p>
      </article>
      <article class="card bkt" style="border-color:var(--edge-gold)">
        <h3>${esc(trueC.name)}</h3>
        <p class="pkg-price num gold" style="font-size:var(--fs-num-sm);margin:var(--s-3) 0"><span class="cur">$</span>${trueC.min}<span style="font-size:0.4em">+</span></p>
        <p>${esc(trueC.what)} ${esc(trueC.basis)}.</p>
      </article>
      <a class="btn btn-primary" href="/book" style="width:100%">Book a coating ${icon('right')}</a>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="faq-h">
  <div class="wrap split split-offer" style="align-items:start">
    <div>
      ${secHead({ index: '03', kicker: 'Coating questions', title: '<span id="faq-h">Asked and answered</span>' })}
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
  heading: 'Ask us which one<br class=\"br-desk\">your car needs.',
  body: `Send a photo of the paint with your booking and we will tell you straight — including when the answer is the cheaper one. ${esc(TERMS.travelFee)}`,
})}
`;

export default page({
  title: `Ceramic Coating Winnipeg | ${SITE.shortName}`,
  description: `Ceramic coating in Winnipeg from ${money(FROM)}. Spray ceramic for a season, true ceramic for years — an honest comparison of what each costs, needs and delivers.`,
  path: `/services/${SLUG}`,
  schema: [
    serviceSchema({ slug: SLUG, name: 'Ceramic Coating', from: FROM,
      description: 'Ceramic coating in Winnipeg — spray ceramic sealant and true bonded ceramic coating, applied over decontaminated and corrected paint at the customer’s location.' }),
    serviceCrumbs('Ceramic Coating', SLUG),
    faqSchema(faqs),
  ],
  body,
});
