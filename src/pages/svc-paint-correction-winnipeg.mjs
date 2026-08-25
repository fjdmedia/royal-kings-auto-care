import { SITE, ADDONS, TERMS, addonRange, money } from '../data.mjs';
import { page, secHead, ctaBand, icon, esc, faqSchema } from '../layout.mjs';
import { serviceHero, relatedServices, serviceSchema, serviceCrumbs } from '../service.mjs';

const SLUG = 'paint-correction-winnipeg';
const buff = ADDONS.find(a => a.field === 'addon_buffing');
const FROM = buff.min;

/* Angle: diagnosis. Which marks come out, which do not, and how to tell
   the difference before you pay. Opens on a test you can run yourself in
   a parking lot, closes on the defects we will refuse to promise. */

const DEFECTS = [
  { t: 'Swirl marks',        v: 'Comes out', b: 'The fine cobweb halo you see under a gas-station light or direct sun. Almost always put there by washing. This is the defect correction exists for.' },
  { t: 'Wash and buff marks', v: 'Comes out', b: 'Straight-line scratching from a drive-through brush or a dirty towel. Sits in the same shallow layer as swirls.' },
  { t: 'Water spot etching', v: 'Usually',   b: 'Mineral rings that have started to eat into the clear coat. Shallow etching polishes out. Deep etching may leave a faint ghost.' },
  { t: 'Oxidation and dullness', v: 'Yes',   b: 'Chalky, flat-looking paint — common on older red and black cars. Correction is what brings the gloss back, not wax.' },
  { t: 'Deep scratches',     v: 'No',        b: 'If your fingernail catches in it, it is through the clear coat. Polishing it would mean removing more clear than is safe. We will say so rather than take the money.' },
  { t: 'Rock chips',         v: 'No',        b: 'Missing paint is missing paint. Correction cannot add material back. That is body-shop or touch-up work.' },
];

const faqs = [
  { q: 'How do I know if my paint needs correcting?',
    a: 'Park in direct sun or hold a phone torch a foot from the panel at night. If you see a fine web of circular scratches radiating out from the light, that is swirling, and it is what correction removes. If the panel looks clean under a hard light, save your money.' },
  { q: 'Why is paint correction a full-day booking?',
    a: 'Because it is measured in panels, not in hours of spraying. Each panel is washed, decontaminated, machine-polished in passes, then wiped and inspected under light. Rushing it is how you get holograms and burnt edges. We take one correction booking per day and that day is yours.' },
  { q: 'What makes the price range so wide?',
    a: 'The number of correction steps. Lightly swirled paint may need one polishing stage. Heavily marred paint needs a cutting stage before the polishing stage, which roughly doubles the work. Vehicle size then multiplies it. We look at the panels first and quote the actual job.' },
  { q: 'Should I coat the car after correcting it?',
    a: 'That is the right order and the reason to do both in one visit — you have just spent a day making the clear coat perfect, and a coating is what keeps it that way. Correcting and then leaving it bare means you start collecting swirls again on the next wash.' },
  { q: 'Can you correct paint in a Winnipeg winter?',
    a: 'Not well, and not outdoors. Polishing needs a controlled surface temperature and somewhere the car can stay clean and dry. Book correction from late spring through fall, or in a heated garage.' },
];

const body = `
${serviceHero({
  slug: SLUG,
  eyebrow: 'Paint Correction',
  h1: 'Paint correction<br class="br-desk">in Winnipeg',
  sub: 'Machine polishing that cuts swirls, wash marks and oxidation out of the clear coat. One booking per day, because it cannot be rushed.',
  specs: [
    { k: 'From',      v: money(FROM),   n: 'Rises with correction steps', num: true },
    { k: 'Booking',   v: 'Full day',    n: 'Exclusive — one car per day' },
    { k: 'Removes',   v: 'Swirls',      n: 'Wash marks, etching, oxidation' },
    { k: 'Will not',  v: 'Fill chips',  n: 'Missing paint is body work' },
  ],
})}

<section class="sec sec-tight band-deep pool" aria-labelledby="test-h">
  <div class="wrap split split-lead">
    <div>
      <span class="kicker">Check it yourself first</span>
      <h2 id="test-h" style="font-size:var(--fs-2xl);line-height:var(--lh-tight);letter-spacing:var(--tr-display);text-transform:uppercase;font-stretch:110%">
        Hold a phone torch against the paint at night.
      </h2>
    </div>
    <div class="prose">
      <p>
        A foot away, straight at the panel, in the dark. If a fine web of circular
        scratches lights up around the beam, your paint is swirled — and swirling is
        what makes a dark car look flat and grey in the sun.
      </p>
      <p>
        If the panel comes back clean under that light, you do not need correction and
        we will tell you so. It is the most expensive thing we sell and the easiest one
        to talk somebody out of.
      </p>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="def-h">
  <div class="wrap">
    ${secHead({
      index: '01',
      kicker: 'What comes out and what does not',
      title: '<span id="def-h">Some marks polish out.<br>Some are through the clear.</span>',
      meta: 'Honest before you book',
    })}
    <div class="matrix">
      ${DEFECTS.map(d => `
      <div class="mrow">
        <span class="mrow-name">${esc(d.t)}</span>
        <span class="mrow-what">${esc(d.b)}</span>
        <span class="mrow-price num" style="color:${d.v === 'No' ? 'var(--text-3)' : 'var(--gold)'}">${esc(d.v)}</span>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="sec band" id="pricing" aria-labelledby="pr-h">
  <div class="wrap split split-offer" style="align-items:start">
    <div>
      ${secHead({
        index: '02',
        kicker: 'What it costs',
        title: `<span id="pr-h">${esc(addonRange(buff))}<br>and here is why.</span>`,
      })}
      <div class="prose">
        <p>
          The variable is how many machine stages the paint needs.
          One polishing stage on lightly marred paint sits at the bottom of the range.
          A cutting stage followed by a refining stage on heavily swirled paint sits at
          the top, and a large vehicle moves it further.
        </p>
        <p>
          ${esc(buff.note)}. We do not stack a correction on top of other bookings
          and we do not quote it blind.
        </p>
      </div>
    </div>
    <div class="stack-4">
      <article class="card bkt" style="border-color:var(--edge-gold)">
        <h3>${esc(buff.name)}</h3>
        <p class="pkg-price num gold" style="font-size:var(--fs-num-sm);margin:var(--s-3) 0"><span class="cur">$</span>${buff.min}<span style="font-size:0.4em;color:var(--text-3)">&nbsp;–&nbsp;$${buff.max}</span></p>
        <p>${esc(buff.what)}</p>
        <p class="pkg-meta" style="margin-top:var(--s-4)">${esc(buff.basis)}</p>
      </article>
      <p class="notice">
        <strong>Pair it with a coating.</strong> Correction restores the clear coat;
        a coating is what stops it swirling again on the next wash.
        <a class="gold" href="/services/ceramic-coating-winnipeg">See ceramic coating →</a>
      </p>
      <a class="btn btn-primary" href="/book" style="width:100%">Book a correction ${icon('right')}</a>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="faq-h">
  <div class="wrap split split-offer" style="align-items:start">
    <div>
      ${secHead({ index: '03', kicker: 'Correction questions', title: '<span id="faq-h">Asked and answered</span>' })}
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
  heading: 'Run the torch test.<br class="br-desk">Then call us.',
  body: `Photograph a panel under a hard light and add it to your booking notes. If the paint does not need correcting, we will say so. ${esc(TERMS.travelFee)}`,
})}
`;

export default page({
  title: `Paint Correction Winnipeg | ${SITE.shortName}`,
  description: `Paint correction in Winnipeg from ${money(FROM)}. Machine polishing that removes swirl marks, wash marks and oxidation — a full-day exclusive booking at your location.`,
  path: `/services/${SLUG}`,
  schema: [
    serviceSchema({ slug: SLUG, name: 'Paint Correction', from: FROM,
      description: 'Paint correction in Winnipeg — multi-stage machine polishing that removes swirl marks, wash marks, water-spot etching and oxidation from automotive clear coat.' }),
    serviceCrumbs('Paint Correction', SLUG),
    faqSchema(faqs),
  ],
  body,
});
