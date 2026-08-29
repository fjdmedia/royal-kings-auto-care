import { SITE, CONTACT, TERMS, PACKAGES, ADDONS, SERVICES, PROCESS, FAQS, LIVE_HERO, taglineLead, taglineTail, priceFrom, money, primaryPhone } from '../data.mjs';
import { page, secHead, ctaBand, icon, esc, localBusinessSchema, faqSchema } from '../layout.mjs';
import { packageBlock, faqAccordion, beforeAfterPair, photoPlate, svcKey } from '../components.mjs';
import { GALLERY } from '../gallery-data.mjs';
import { countWord } from '../components.mjs';

const teaserFaqs = FAQS.slice(0, 4);

/* No team photograph yet. Wire a real file here and the section regains its
   two-column split; until then it renders as text and reserves no black box. */
const TEAM_PHOTO = null;

/* Hero copy is the LIVE site's, pulled off their sitemap — see LIVE_HERO. */
const H = LIVE_HERO.home;

/* Lead with a slider pair if one exists — a wipe is the more arresting of the
   two treatments — then fill up to two. */
const homePairs = [...GALLERY.pairs]
  .sort((a, b) => (a.layout === 'slider' ? -1 : 1) - (b.layout === 'slider' ? -1 : 1))
  .slice(0, 2);
const hasSlider = homePairs.some(p => p.layout === 'slider');

const body = `
<!-- ── Hero — five hairline-separated bands, not a headline in space ── -->
<section class="hero" aria-labelledby="h1">
  <div class="hero-bg" aria-hidden="true" style="--hero-img:url('/assets/Gallery/2026-08-17%20rogue-blue/a2.jpg');--hero-pos:center 42%"></div>
  <div class="wrap hero-inner">

    <p class="hero-crumb">
      <span class="dot" aria-hidden="true"></span>
      ${esc(H.eyebrow)}
      <span class="sep" aria-hidden="true">/</span>
      <span>${esc(CONTACT.hours)}</span>
    </p>

    <h1 class="hero-h1" id="h1"><span class="wm-a">${esc(H.h1Lead)}</span><br><em class="wm-b">${esc(H.h1Tail)}</em></h1>

    <p class="hero-tagline">${esc(taglineLead)}</p>

    <div class="hero-row">
      <p class="hero-sub">
        ${esc(taglineTail)} ${esc(H.subTail)}
      </p>
      <div class="hero-act">
        <div class="hero-act-row">
          <a class="btn btn-primary" href="/book">Book a detail ${icon('right')}</a>
          <a class="hero-call" href="tel:${primaryPhone.tel}">${icon('phone')} ${primaryPhone.phone}</a>
        </div>
        <span class="hero-fine">Free estimates · No obligation · ${esc(TERMS.travelFeeShort)}</span>
      </div>
    </div>

    <div class="spec">
      <div class="spec-cell bkt">
        <span class="spec-k">Packages from</span>
        <p class="spec-v num">${money(priceFrom)}<small>Interior, per vehicle class</small></p>
      </div>
      <div class="spec-cell">
        <span class="spec-k">Where</span>
        <p class="spec-v">Your place<small>Home, work, wherever it sits</small></p>
      </div>
      <div class="spec-cell">
        <span class="spec-k">Booking takes</span>
        <p class="spec-v num">2 min<small>Confirmed inside ${esc(TERMS.confirmWindow)}</small></p>
      </div>
      <div class="spec-cell">
        <span class="spec-k">Travel fee</span>
        <p class="spec-v num">$0<small>Anywhere inside city limits</small></p>
      </div>
    </div>

  </div>
</section>

<!-- ── The enemy. This is the section a template would not write. ── -->
<section class="sec sec-tight band-deep pool" aria-labelledby="why-h">
  <div class="wrap split split-lead">
    <div>
      <span class="kicker">The problem</span>
      <h2 id="why-h" style="font-size:var(--fs-2xl);line-height:var(--lh-tight);letter-spacing:var(--tr-display);text-transform:uppercase;font-stretch:110%">
        Salt, gravel, and six months of it.
      </h2>
    </div>
    <div class="prose">
      <p>
        A Winnipeg winter puts salt in your carpets, sand in your seat rails, and a film on your paint
        that a drive-through wash will not touch. Spring adds pollen and the first hatch of bugs.
        By June most cars in this city are carrying eight months of road on them.
      </p>
      <p>
        We deal with the parts you can see and the parts you can only smell. Not a rinse —
        extraction, decontamination, and treatment, done in the order that actually works.
      </p>
    </div>
  </div>
</section>

<!-- ── Before / after — only rendered when real pairs exist ── -->
${GALLERY.pairs.length ? `
<section class="sec band" aria-labelledby="ba-h">
  <div class="wrap">
    ${secHead({
      index: '01',
      kicker: 'Proof',
      title: '<span id="ba-h">This is what comes<br class="br-desk">out of a car.</span>',
      meta: hasSlider ? 'Drag the handle' : 'Before · after',
      /* Derived, never typed. This sentence named "One blue Nissan Rogue" and
         stayed on the page after a second and third car were photographed —
         true when written, false the moment the folder grew. */
      lede: `${countWord(GALLERY.jobs.length)} vehicle${GALLERY.jobs.length === 1 ? '' : 's'}, photographed before we started and again when we finished. Every frame is a real car we were paid to clean.`,
    })}
    <div class="ba-list">${homePairs.map(p => beforeAfterPair(p)).join('')}</div>
    ${GALLERY.pairs.length > homePairs.length ? `<div style="margin-top:var(--s-6)"><a class="btn btn-ghost" href="/gallery">See all ${GALLERY.pairs.length} ${icon('right')}</a></div>` : ''}
  </div>
</section>` : ''}

<!-- ── Packages ── -->
<section class="sec" id="packages" aria-labelledby="pkg-h">
  <div class="wrap">
    ${secHead({
      index: '02',
      kicker: 'Interior packages',
      title: '<span id="pkg-h">Pick the tier,<br>the price is the price.</span>',
      meta: 'Fixed per vehicle class.',
      lede: 'Choose your class and every price on this page updates. No quote request, no callback, no surprise at the end.',
    })}
    ${packageBlock({
      note: '<strong>Not sure which one?</strong> The Standard is the annual clean. Premium is the one for after a winter, before a sale, or when something has soaked into the fabric.',
    })}
  </div>
</section>

<!-- ── Add-ons ── -->
<section class="sec band" aria-labelledby="add-h">
  <div class="wrap">
    ${secHead({
      index: '03',
      kicker: 'Add-ons',
      title: '<span id="add-h">Everything else<br>we can do to it.</span>',
      meta: `${'Priced per vehicle'}`,
      lede: 'Add any of these to a package or book one on its own. Ranges are honest — where the price moves, it moves with the size of the vehicle or the state it is in.',
    })}
    <p class="prose" style="max-width:60ch">
      ${ADDONS.length} of them, from ${money(Math.min(...ADDONS.map(a => a.min)))} to ${money(Math.max(...ADDONS.map(a => a.max || a.min)))} —
      ${esc(ADDONS.slice(0, 6).map(a => a.name.replace(/\s*\(.*\)$/, '').toLowerCase()).join(', '))},
      and ${ADDONS.length - 6} more. Where a price is a range it moves with the size of the
      vehicle or the state it arrives in, and the final number is confirmed with you before
      any work starts.
    </p>
    <div class="hero-act-row" style="margin-top:var(--s-6)">
      <a class="btn btn-ghost" href="/pricing#addons">Every add-on and its price ${icon('right')}</a>
    </div>
  </div>
</section>

<!-- ── Services ── -->
<section class="sec" aria-labelledby="svc-h">
  <div class="wrap">
    ${secHead({
      index: '04',
      kicker: 'What we do',
      title: '<span id="svc-h">Four services,<br>one visit.</span>',
      meta: 'Interior · Exterior · Coating · Correction',
    })}
    <div class="cols-4">
      ${SERVICES.map(s => `
      <a class="card card-flat" href="/services/${s.slug}">
        ${photoPlate(GALLERY.services[svcKey(s.slug)], { cls: 'plate-square bkt', style: 'margin:calc(var(--s-6) * -1) calc(var(--s-6) * -1) var(--s-5)' })}
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.short)}</p>
        <p class="pkg-meta" style="margin-top:var(--s-4)">From ${money(s.from)} · <span class="gold" style="white-space:nowrap">See the service ${'→'}</span></p>
      </a>`).join('')}
    </div>
  </div>
</section>

<!-- ── Process ── -->
<section class="sec band" aria-labelledby="proc-h">
  <div class="wrap">
    ${secHead({
      index: '05',
      kicker: 'How it runs',
      title: '<span id="proc-h">Four steps,<br>and one of them is us driving.</span>',
      meta: 'Book → confirm → we arrive',
    })}
    <div class="steps">
      ${PROCESS.map(s => `
      <article class="step">
        <span class="step-n num">${s.n}</span>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.body)}</p>
      </article>`).join('')}
    </div>
  </div>
</section>

<!-- ── The two of them ── -->
<section class="sec pool-r" aria-labelledby="who-h">
  <div class="wrap${TEAM_PHOTO ? ' split split-story' : ''}" style="align-items:center">
    ${photoPlate(TEAM_PHOTO, { cls: 'plate-tall bkt bkt-br', tag: 'div' })}
    <div>
      ${secHead({
        index: '06',
        kicker: 'Who shows up',
        title: '<span id="who-h">Two people.<br>Both of them show up.</span>',
      })}
      <div class="prose">
        <p>
          Royal Kings is Patrick and Justin. The person who answers the phone is the person
          who arrives at your place and does the work. No crew, no dispatcher, nobody to hand
          the blame to if something gets missed.
        </p>
        <p>
          Before we pack up we walk the car with you. If something is not right, we deal with
          it while we are still standing there — not on a follow-up call.
        </p>
      </div>
      <div class="hero-act-row" style="margin-top:var(--s-6)">
        <a class="btn btn-ghost" href="/about">Read more about us ${icon('right')}</a>
        <a class="hero-call" href="${CONTACT.instagram.url}" target="_blank" rel="noopener">${icon('ig')} ${esc(CONTACT.instagram.handle)}</a>
      </div>
    </div>
  </div>
</section>

<!-- ── FAQ teaser ── -->
<section class="sec band" aria-labelledby="faq-h">
  <div class="wrap split split-offer" style="align-items:start">
    <div>
      ${secHead({
        index: '07',
        kicker: 'Before you book',
        title: '<span id="faq-h">The questions<br>we get asked most.</span>',
      })}
      <a class="btn btn-ghost" href="/faq">All questions ${icon('right')}</a>
    </div>
    ${faqAccordion(teaserFaqs)}
  </div>
</section>

${ctaBand({
  heading: 'Book it now,<br class="br-desk">not next spring.',
  body: `Pick a package, pick a day, and we will confirm inside ${esc(TERMS.confirmWindow)}. A ${esc(TERMS.deposit)} deposit holds the slot and comes off your total.`,
})}
`;

export default page({
  title: `Premium Auto Detailing Winnipeg | ${SITE.name}`,
  description: `Interior and exterior auto detailing in Winnipeg. Packages from ${money(priceFrom)}, we come to you, no travel fee in the city. Book online in two minutes.`,
  path: '/',
  schema: [localBusinessSchema(), faqSchema(teaserFaqs)],
  body,
});
