import {
  PACKAGES, VEHICLE_CLASSES, ADDONS, FAQS, TIME_SLOTS, TERMS, CONTACT,
  GAS_URL, addonRange, money, primaryPhone,
} from './data.mjs';
import { icon, esc } from './layout.mjs';

/* ── Vehicle-class segmented control ─────────────────────────────── */
export const vehicleSeg = () => `
  <div class="stack-4">
    <span class="kicker" id="segLabel">Your vehicle class</span>
    <div class="seg" id="vehicleSeg" role="group" aria-labelledby="segLabel">
      ${VEHICLE_CLASSES.map((v, i) => `
      <button class="seg-btn" type="button" aria-pressed="${i === 0}" data-class="${esc(v.formValue)}" data-surcharge="${v.surcharge}">
        <span class="seg-l">${esc(v.label)}</span>
        <span class="seg-s num">${v.surcharge ? `+$${v.surcharge}` : 'Base price'}</span>
      </button>`).join('')}
    </div>
    <p class="seg-note" id="segNote">Base price — no surcharge</p>
  </div>`;

/* Vehicle control sits ABOVE the package rows, full width. It was in a
   side rail first and squeezed the rows into a column too narrow for the
   includes lists — every bullet wrapped to one word per line. */
export const packageBlock = ({ note, ctaHref = '/book' } = {}) => `
  <div class="pkg-control">
    ${vehicleSeg()}
    ${note ? `<p class="notice">${note}</p>` : ''}
  </div>
  ${packageRows({ ctaHref })}`;

/* ── Package rows ────────────────────────────────────────────────── */
export const packageRows = ({ ctaHref = '/book' } = {}) => `
  <div class="pkgs">
    ${PACKAGES.map(p => `
    <article class="pkg${p.featured ? ' pkg-featured bkt' : ''}">
      ${p.badge ? `<span class="pkg-badge">${esc(p.badge)}</span>` : ''}
      <div>
        <span class="pkg-name">${esc(p.name)}</span>
        <p class="pkg-price num"><span class="cur">$</span><span class="price-val" data-base="${p.price}">${p.price}</span></p>
        <p class="pkg-meta">${esc(p.duration)}</p>
      </div>
      <div>
        <p class="pkg-line">${esc(p.line)}</p>
        <ul class="pkg-inc">
          ${p.includes.map(i => `<li>${esc(i)}</li>`).join('\n          ')}
        </ul>
      </div>
      <a class="btn ${p.featured ? 'btn-primary' : 'btn-ghost'}" href="${ctaHref}?package=${p.id}">
        Book ${esc(p.name)}${p.featured ? ` ${icon('right')}` : ''}
      </a>
    </article>`).join('')}
  </div>`;

/* ── Add-on capability matrix (read-only display) ────────────────── */
export const addonMatrix = () => `
  <div class="matrix">
    ${ADDONS.map(a => `
    <div class="mrow">
      <span class="mrow-name">${esc(a.name)}</span>
      <span class="mrow-what">${esc(a.what)}${a.note ? ` <em>${esc(a.note)}.</em>` : ''}</span>
      <span class="mrow-price num">${esc(addonRange(a))}<span class="mrow-basis">${esc(a.basis)}</span></span>
    </div>`).join('')}
  </div>`;

/* ── FAQ accordion ───────────────────────────────────────────────── */
export const faqAccordion = (list = FAQS) => `
  <div class="acc">
    ${list.map(f => `
    <details>
      <summary>${esc(f.q)}<span class="acc-ic" aria-hidden="true"></span></summary>
      <div class="acc-body">${esc(f.a)}</div>
    </details>`).join('')}
  </div>`;

/* ── Booking form ─────────────────────────────────────────────────
   Every name/value here is a live contract with the Apps Script backend
   and with waiver.html's prefill map. Renaming a field silently breaks
   the Bookings sheet, the notification email, or the waiver handoff. */
export const bookingForm = () => `
  <div class="booking">
    <iframe name="gas-sink" title="Submission target" style="display:none" aria-hidden="true" tabindex="-1"></iframe>

    <form id="bookingForm" data-endpoint="${GAS_URL}" novalidate>
      <input type="hidden" name="form_type" value="booking">
      <input type="text" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">

      <div class="form-grid">
        <div class="field">
          <label for="name">Full name <span class="req" aria-hidden="true">*</span></label>
          <input class="input" type="text" id="name" name="name" autocomplete="name" placeholder="Jordan Reyes" required>
          <span class="help" data-hint=""></span>
        </div>
        <div class="field">
          <label for="email">Email <span class="req" aria-hidden="true">*</span></label>
          <input class="input" type="email" id="email" name="email" autocomplete="email" placeholder="you@email.com" required>
          <span class="help" data-hint=""></span>
        </div>
        <div class="field">
          <label for="phone">Phone <span class="req" aria-hidden="true">*</span></label>
          <input class="input" type="tel" id="phone" name="phone" autocomplete="tel" placeholder="(204) 000-0000" required>
          <span class="help" data-hint=""></span>
        </div>
        <div class="field">
          <label for="service">Package <span class="req" aria-hidden="true">*</span></label>
          <select class="select" id="service" name="service" required>
            <option value="" disabled selected>Select a package</option>
            ${PACKAGES.map(p => `<option value="${esc(p.formValue)}" data-id="${p.id}" data-price="${p.price}">${esc(p.name)} — from ${money(p.price)}</option>`).join('\n            ')}
          </select>
          <span class="help" data-hint=""></span>
        </div>
        <div class="field">
          <label for="vehicle_make_model">Vehicle make &amp; model <span class="req" aria-hidden="true">*</span></label>
          <input class="input" type="text" id="vehicle_make_model" name="vehicle_make_model" placeholder="2020 Honda Civic" required>
          <span class="help" data-hint=""></span>
        </div>
        <div class="field">
          <label for="vehicle_size">Vehicle class <span class="req" aria-hidden="true">*</span></label>
          <select class="select" id="vehicle_size" name="vehicle_size" required>
            <option value="" disabled selected>Select vehicle class</option>
            ${VEHICLE_CLASSES.map(v => `<option value="${esc(v.formValue)}" data-surcharge="${v.surcharge}">${esc(v.label)}${v.surcharge ? ` (+$${v.surcharge})` : ''}</option>`).join('\n            ')}
          </select>
          <span class="help" data-hint=""></span>
        </div>
      </div>

      <hr class="form-rule">

      <span class="kicker">Add-ons — optional</span>
      <div class="addons">
        ${ADDONS.map(a => `
        <label class="addon">
          <input type="checkbox" name="${a.field}" value="${esc(a.value)}" data-min="${a.min}" data-max="${a.max}">
          <span class="addon-box" aria-hidden="true"></span>
          <span>
            <span class="addon-name">${esc(a.name)}</span>
            <span class="addon-price num">${esc(addonRange(a))}</span>
            <span class="addon-basis">${esc(a.note || a.basis)}</span>
          </span>
        </label>`).join('')}
      </div>

      <div class="estimate" style="margin-top:var(--s-6)">
        <div>
          <span class="estimate-k">Estimated total</span>
          <p class="estimate-sub" id="estimateSub">Select a package to see your estimate</p>
        </div>
        <p class="estimate-v num" id="estimateTotal" aria-live="polite">—</p>
      </div>

      <p class="notice" style="margin-top:var(--s-4)">
        <strong>Deposit:</strong> ${esc(TERMS.deposit)} secures the booking and comes off your total.
        Reschedule at least 24 hours ahead or the deposit is forfeited. Final price is confirmed with you before we start.
      </p>

      <hr class="form-rule">

      <div class="form-grid">
        <div class="field">
          <label for="preferred_date">Preferred date <span class="req" aria-hidden="true">*</span></label>
          <input class="input" type="date" id="preferred_date" name="preferred_date" required>
          <span class="help" data-hint="Earliest is tomorrow.">Earliest is tomorrow.</span>
        </div>
        <div class="field">
          <label for="preferred_time">Preferred time <span class="req" aria-hidden="true">*</span></label>
          <select class="select" id="preferred_time" name="preferred_time" required>
            <option value="" disabled selected>Select a window</option>
            ${TIME_SLOTS.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('\n            ')}
          </select>
          <span class="help" data-hint=""></span>
        </div>
        <div class="field span-2">
          <label for="notes">Anything we should know</label>
          <textarea class="textarea" id="notes" name="notes" placeholder="Pet hair, heavy stains, the address we're coming to, where to park."></textarea>
          <span class="help" data-hint="Optional.">Optional.</span>
        </div>
      </div>

      <div style="margin-top:var(--s-6);display:flex;align-items:center;gap:var(--s-5);flex-wrap:wrap">
        <button class="btn btn-primary" type="submit">
          <span class="btn-spin" aria-hidden="true"></span>Send booking request ${icon('right')}
        </button>
        <span class="hero-fine">We confirm inside ${esc(TERMS.confirmWindow)}</span>
      </div>
    </form>

    <div class="sent" id="formSent">
      <span class="sent-mark" aria-hidden="true">${icon('check')}</span>
      <h3>Request received</h3>
      <p>Thanks — we have your details. We'll confirm your appointment within ${esc(TERMS.confirmWindow)}.</p>
      <p>One step left: your service agreement. We've already filled in what you just told us, so it takes a moment. Taking you there now.</p>
      <a class="btn btn-primary" href="/waiver">Continue to the agreement ${icon('right')}</a>
    </div>
  </div>`;

/* ── Small proof strip — facts only, nothing invented ────────────── */
export const reassure = () => `
  <ul class="cols-3" style="margin-top:var(--s-6)">
    <li class="tile"><span class="tile-k">${icon('pin')} Where</span><span class="tile-n">We come to you, anywhere in Winnipeg. ${esc(TERMS.travelFee)}</span></li>
    <li class="tile"><span class="tile-k">${icon('clock')} When</span><span class="tile-n">${esc(CONTACT.hours)}. Booking confirmed inside ${esc(TERMS.confirmWindow)}.</span></li>
    <li class="tile"><span class="tile-k">${icon('shield')} Deposit</span><span class="tile-n">${esc(TERMS.deposit)} holds the slot and comes off the total.</span></li>
  </ul>`;

export const callLine = () => `
  <a class="hero-call" href="tel:${primaryPhone.tel}">${icon('phone')} ${primaryPhone.phone} — ${primaryPhone.name}</a>`;

/* ── Before / after slider ────────────────────────────────────────────
   One <input type=range> drives the reveal, which means it is keyboard
   operable and screen-reader announced for free — a div with drag handlers
   is neither. Both photos carry their own true alt text (G51b). */
export const beforeAfter = p => `
  <figure class="ba">
    <div class="ba-stage" style="aspect-ratio:${p.ratio || (16/9)}">
      <img class="ba-before" src="${p.before}" alt="${esc(p.altBefore)}" width="${p.w}" height="${p.h}" loading="lazy" decoding="async">
      <div class="ba-after" style="--pos:50%">
        <img src="${p.after}" alt="${esc(p.altAfter)}" width="${p.w}" height="${p.h}" loading="lazy" decoding="async">
      </div>
      <span class="ba-line" aria-hidden="true"></span><span class="ba-grip" aria-hidden="true"></span>
      <input class="ba-range" type="range" min="0" max="100" value="50" step="1"
             aria-label="Reveal the after photo — ${esc(p.altAfter)}">
    </div>
    <figcaption>${esc(p.label || p.altAfter)}</figcaption>
  </figure>`;

/* Side-by-side pair, for photographs that were not shot from a locked
   position. A wipe between two different camera positions makes the car
   appear to jump, which reads as a trick; showing them as two labelled
   frames is what the trade publishes and what the photos can actually
   support. Portrait phone shots also fill this slot properly instead of
   being cropped to a letterbox. */
export const beforeAfterDiptych = p => `
  <figure class="ba-dip">
    <div class="ba-dip-grid">
      <div class="ba-dip-half" data-label="Before">
        <img src="${p.before}" alt="${esc(p.altBefore)}" width="${p.w}" height="${p.h}" loading="lazy" decoding="async">
      </div>
      <div class="ba-dip-half ba-dip-after" data-label="After">
        <img src="${p.after}" alt="${esc(p.altAfter)}" width="${p.w}" height="${p.h}" loading="lazy" decoding="async">
      </div>
    </div>
    <figcaption>${esc(p.label || p.altAfter)}</figcaption>
  </figure>`;

/* Picks the treatment the scan decided this pair can actually support. */
export const beforeAfterPair = p =>
  p.layout === 'slider' ? beforeAfter(p) : beforeAfterDiptych(p);

/* A plate renders ONLY when there is a photograph for it.

   An empty plate is a black rectangle, and a visitor reads a black rectangle as
   a broken image, not as a slot awaiting content. On a client preview that is
   survivable; on the live site it says "unfinished" on every scroll. So a
   missing photo REMOVES the element rather than reserving space for it, and the
   card degrades to a deliberate text layout until the file lands. Same stance
   the gallery page already takes by unlisting itself when the folder is empty. */
export const photoPlate = (photo, { cls = '', style = '', tag = 'span' } = {}) =>
  photo
    ? `<${tag} class="plate ${cls}"${style ? ` style="${style}"` : ''}><img src="${photo.src}" alt="${esc(photo.alt)}" width="${photo.w}" height="${photo.h}" loading="lazy" decoding="async"></${tag}>`
    : '';

/* Slug -> the key gallery-scan files service headers under. */
export const svcKey = slug => ['interior', 'exterior', 'ceramic', 'paint'].find(k => slug.includes(k));

/* Work grid — real photographs only; the grid does not exist without them. */
export const workGrid = shots => `
  <div class="work-grid">
    ${shots.map(s => `
    <figure class="plate work-tile">
      <img src="${s.src}" alt="${esc(s.alt)}" width="${s.w}" height="${s.h}" loading="lazy" decoding="async">
    </figure>`).join('')}
  </div>`;
