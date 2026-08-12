import { SITE, CONTACT, TERMS, PROCESS, money, priceFrom } from '../data.mjs';
import { page, secHead, ctaBand, icon, esc, breadcrumbSchema } from '../layout.mjs';

/* The honesty page. Everything here is verifiable: two named operators,
   two real phone numbers, a real Instagram. Nothing about founding years,
   cars detailed, or awards, because none of that has been supplied. */

const body = `
<section class="hero" aria-labelledby="h1">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="wrap hero-inner">
    <nav class="crumb" aria-label="Breadcrumb" style="padding-bottom:var(--s-5);border-bottom:var(--stroke)">
      <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">About</span>
    </nav>

    <h1 class="hero-h1" id="h1" style="font-size:var(--fs-4xl)">Patrick and Justin.<br class="br-desk">That is the company.</h1>

    <div class="hero-row">
      <p class="hero-sub">
        No crew, no call centre, no franchise. The person who picks up the
        phone is the person who cleans your car.
      </p>
      <div class="hero-act">
        <div class="hero-act-row">
          <a class="btn btn-primary" href="/book">Book a detail ${icon('right')}</a>
        </div>
        <span class="hero-fine">${esc(SITE.city)}, ${SITE.region} · ${esc(CONTACT.hours)}</span>
      </div>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="who-h">
  <div class="wrap">
    <div class="split split-offer" style="align-items:start">
      <div>
        ${secHead({
          index: '01',
          kicker: 'Who you are dealing with',
          title: '<span id="who-h">Two people who both<br class="br-desk">do the work.</span>',
        })}
      </div>
      <div class="prose">
        <p>
          Royal Kings Auto Care is a two-person operation in ${esc(SITE.city)}.
          Patrick and Justin take the calls, quote the jobs, load the van and
          do the detailing. There is nobody in between.
        </p>
        <p>
          That is the whole reason we can come to you. A shop needs you to
          drive in, drop off, and arrange a ride home, because a shop has a
          bay it has to keep full. We do not have a bay. We have the van, the
          equipment, and your driveway.
        </p>
        <p>
          It also means you always know who did the work. If something gets
          missed, you are not filing a complaint with a company — you are
          telling Patrick or Justin, and one of us comes back.
        </p>
      </div>
    </div>

    <div class="cols-2" style="margin-top:var(--s-8)">
      ${CONTACT.people.map(p => `
      <article class="card">
        <span class="plate plate-wide bkt" aria-hidden="true" style="margin:calc(var(--s-6) * -1) calc(var(--s-6) * -1) var(--s-5)"></span>
        <h3>${esc(p.name)}</h3>
        <p class="pkg-meta" style="margin-bottom:var(--s-3)">Owner · Detailer</p>
        <a class="hero-call" href="tel:${p.tel}">${icon('phone')} ${p.phone}</a>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="sec band" aria-labelledby="how-h">
  <div class="wrap">
    ${secHead({
      index: '02',
      kicker: 'How we work',
      title: '<span id="how-h">Four steps,<br>no waiting room.</span>',
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

<section class="sec" aria-labelledby="stand-h">
  <div class="wrap split split-follow" style="align-items:start">
    <div>
      ${secHead({ index: '03', kicker: 'What we will not do', title: '<span id="stand-h">The short list.</span>' })}
    </div>
    <ul class="stack-4">
      <li class="tile"><span class="tile-k">01</span><span class="tile-v">Quote you blind</span><span class="tile-n">Where a price is a range, we look at the vehicle and confirm the number before anything is opened.</span></li>
      <li class="tile"><span class="tile-k">02</span><span class="tile-v">Sell you the expensive one</span><span class="tile-n">If spray ceramic is the right call, we will say spray ceramic. If your paint does not need correcting, we will tell you that too.</span></li>
      <li class="tile"><span class="tile-k">03</span><span class="tile-v">Promise what paint will not do</span><span class="tile-n">Scratches through the clear coat and rock chips are body work. We say so rather than take the money and disappoint you.</span></li>
      <li class="tile"><span class="tile-k">04</span><span class="tile-v">Leave without showing you</span><span class="tile-n">Every job ends with a walkthrough. Anything wrong gets handled while we are standing there.</span></li>
    </ul>
  </div>
</section>

<section class="sec band" aria-labelledby="see-h">
  <div class="wrap split split-offer" style="align-items:center">
    <div>
      ${secHead({ index: '04', kicker: 'See the work', title: '<span id="see-h">Fresh jobs go up<br>on Instagram.</span>' })}
      <p class="prose">
        Before-and-afters, in-progress shots, and whatever came out of the
        carpet that day. It updates faster than this website does.
      </p>
      <div class="hero-act-row" style="margin-top:var(--s-6)">
        <a class="btn btn-ghost" href="${CONTACT.instagram.url}" target="_blank" rel="noopener">${icon('ig')} ${esc(CONTACT.instagram.handle)}</a>
        <a class="hero-call" href="${CONTACT.tiktok.url}" target="_blank" rel="noopener">${icon('tiktok')} ${esc(CONTACT.tiktok.handle)}</a>
      </div>
    </div>
    <div class="plate plate-wide bkt bkt-br" role="img" aria-label="Recent detailing work — photographs coming soon"></div>
  </div>
</section>

${ctaBand({
  heading: 'Now you know who<br class=\"br-desk\">is showing up.',
  body: `Pick a package and a day. ${esc(TERMS.deposit)} holds the slot and comes off your total.`,
})}
`;

export default page({
  title: `About Royal Kings Auto Care | Winnipeg Detailing`,
  description: `Royal Kings Auto Care is Patrick and Justin — a two-person detailing outfit in Winnipeg. Whoever answers the phone is the one who cleans your car, in your driveway.`,
  path: '/about',
  schema: [breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }])],
  body,
});
