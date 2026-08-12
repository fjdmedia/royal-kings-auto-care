/* Royal Kings Auto Care — shared behaviour.
   No framework, no CDN. Every block guards its own elements so a page
   without a booking form never throws and kills the nav. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ── Year ─────────────────────────────────────────────────────── */
  var yr = $('#yr');
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* ── Nav ──────────────────────────────────────────────────────── */
  var nav = $('#nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var drawer = $('#drawer'), toggle = $('#navToggle'), closeBtn = $('#navClose');
  if (drawer && toggle) {
    var setDrawer = function (open) {
      drawer.setAttribute('data-open', open ? 'true' : 'false');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
      if (open) { var f = drawer.querySelector('a'); if (f) f.focus(); } else { toggle.focus(); }
    };
    toggle.addEventListener('click', function () { setDrawer(drawer.getAttribute('data-open') !== 'true'); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setDrawer(false); });
    drawer.addEventListener('click', function (e) { if (e.target.tagName === 'A') setDrawer(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.getAttribute('data-open') === 'true') setDrawer(false);
    });
  }

  /* ── Toast ────────────────────────────────────────────────────── */
  var toastEl = $('#toast'), toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.setAttribute('data-show', 'true');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.setAttribute('data-show', 'false'); }, 3200);
  }

  /* ── Number tick ──────────────────────────────────────────────── */
  var ticks = new WeakMap();
  function tickTo(el, to, prefix, dur) {
    if (!el) return;
    if (ticks.has(el)) cancelAnimationFrame(ticks.get(el));
    var from = typeof el._v === 'number' ? el._v : 0;
    el._v = to;
    if (reduced || from === to) { el.textContent = prefix + to; return; }
    var t0 = performance.now();
    (function step(t) {
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(from + (to - from) * e);
      if (p < 1) ticks.set(el, requestAnimationFrame(step));
    })(t0);
  }

  /* ── Vehicle class control ────────────────────────────────────────
     Drives the package prices anywhere .price-val appears, and keeps the
     booking form's <select> in sync so the estimate and the submitted
     record can never disagree. */
  var VEHICLE_KEY = 'rk_vehicle_class';
  var seg = $('#vehicleSeg');
  var state = { className: '', surcharge: 0 };

  /* Declared before the vehicle control runs — applyVehicle() calls
     calcEstimate() on init and these must already be resolved. */
  var form = $('#bookingForm');
  var estTotal = $('#estimateTotal'), estSub = $('#estimateSub');

  function applyVehicle(surcharge, className, quiet) {
    state.surcharge = surcharge;
    state.className = className;
    $$('.price-val').forEach(function (el) {
      tickTo(el, parseInt(el.getAttribute('data-base'), 10) + surcharge, '', 320);
    });
    var note = $('#segNote');
    if (note) note.textContent = surcharge === 0
      ? 'Base price — no surcharge'
      : '+$' + surcharge + ' for ' + className;
    var sizeSel = $('#vehicle_size');
    if (sizeSel && className) {
      for (var i = 0; i < sizeSel.options.length; i++) {
        if (sizeSel.options[i].value === className) { sizeSel.value = className; break; }
      }
    }
    try { if (!quiet) sessionStorage.setItem(VEHICLE_KEY, className); } catch (e) { /* private mode */ }
    calcEstimate();
  }

  if (seg) {
    var buttons = $$('.seg-btn', seg);
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        applyVehicle(parseInt(btn.getAttribute('data-surcharge'), 10), btn.getAttribute('data-class'));
      });
    });
    /* Carry the choice across pages — someone who picked "Truck" on
       /pricing should not have to pick it again on /book. */
    var saved = null;
    try { saved = sessionStorage.getItem(VEHICLE_KEY); } catch (e) { /* ignore */ }
    var match = saved && buttons.filter(function (b) { return b.getAttribute('data-class') === saved; })[0];
    if (match) { match.click(); }
    else {
      var pressed = buttons.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; })[0] || buttons[0];
      if (pressed) applyVehicle(parseInt(pressed.getAttribute('data-surcharge'), 10), pressed.getAttribute('data-class'), true);
    }
  } else {
    /* /book has no segmented control — the form's own <select> is the
       control there — so restore the carried choice directly onto it. */
    var sizeEl = $('#vehicle_size');
    if (sizeEl) {
      var carried = null;
      try { carried = sessionStorage.getItem(VEHICLE_KEY); } catch (e) { /* ignore */ }
      if (carried) {
        for (var j = 0; j < sizeEl.options.length; j++) {
          if (sizeEl.options[j].value === carried) { sizeEl.selectedIndex = j; break; }
        }
      }
    }
  }

  /* ── Booking form ─────────────────────────────────────────────── */
  function selectedAddons() {
    return $$('.addon input[type="checkbox"]:checked');
  }

  function calcEstimate() {
    if (!estTotal) return;
    var svc = $('#service'), size = $('#vehicle_size');
    var pkgBase = 0, pkgName = '';
    if (svc && svc.selectedOptions[0]) {
      pkgBase = parseInt(svc.selectedOptions[0].getAttribute('data-price') || '0', 10);
      pkgName = svc.value;
    }
    var sur = 0, sizeName = '';
    if (size && size.selectedOptions[0]) {
      sur = parseInt(size.selectedOptions[0].getAttribute('data-surcharge') || '0', 10);
      sizeName = size.value;
    }
    var lo = 0, hi = 0;
    selectedAddons().forEach(function (cb) {
      lo += parseInt(cb.getAttribute('data-min'), 10);
      hi += parseInt(cb.getAttribute('data-max'), 10);
    });
    if (!pkgBase && lo === 0) {
      if (ticks.has(estTotal)) cancelAnimationFrame(ticks.get(estTotal));
      estTotal.textContent = '—'; estTotal._v = 0;
      if (estSub) estSub.textContent = 'Select a package to see your estimate';
      return;
    }
    var min = pkgBase + sur + lo, max = pkgBase + sur + hi;
    tickTo(estTotal, min, min === max ? '$' : 'from $', 520);
    if (estSub) {
      estSub.textContent = pkgName
        ? pkgName + (sizeName ? ' · ' + sizeName : '') + (lo > 0 ? ' + add-ons' : '') + ' · Final price confirmed before we start'
        : 'Add-ons only — select a package for the full estimate';
    }
  }

  /* `.addon:has(input:checked)` carries the visual state; the class is the
     belt-and-braces so the selection never looks unset if :has() is absent. */
  $$('.addon input[type="checkbox"]').forEach(function (cb) {
    var sync = function () { cb.closest('.addon').classList.toggle('is-on', cb.checked); };
    cb.addEventListener('change', function () { sync(); calcEstimate(); });
    sync();
  });
  var svcSel = $('#service'), sizeSel2 = $('#vehicle_size');
  if (svcSel)  svcSel.addEventListener('change', calcEstimate);
  if (sizeSel2) sizeSel2.addEventListener('change', calcEstimate);

  /* Deep link: /book?package=premium preselects the tier the visitor
     clicked on /pricing or the homepage. */
  (function preselect() {
    if (!svcSel) return;
    var want = new URLSearchParams(window.location.search).get('package');
    if (!want) return;
    for (var i = 0; i < svcSel.options.length; i++) {
      if (svcSel.options[i].getAttribute('data-id') === want) { svcSel.selectedIndex = i; break; }
    }
    calcEstimate();
  })();

  /* Date bounds: 24 hours out, 90 day cap. */
  var dateEl = $('#preferred_date');
  if (dateEl) {
    var iso = function (d) { return d.toISOString().slice(0, 10); };
    var min = new Date(Date.now() + 24 * 3600 * 1000);
    var max = new Date(Date.now() + 90 * 24 * 3600 * 1000);
    dateEl.min = iso(min); dateEl.max = iso(max);
  }

  /* Validate on blur after first touch, then on input (GI7). */
  if (form) {
    $$('.input, .select, .textarea', form).forEach(function (el) {
      var touched = false;
      var validate = function () {
        if (!touched) return;
        var ok = el.checkValidity();
        el.setAttribute('aria-invalid', ok ? 'false' : 'true');
        var help = el.parentElement.querySelector('.help');
        if (help) {
          if (ok) { help.removeAttribute('data-error'); help.textContent = help.getAttribute('data-hint') || ''; }
          else { help.setAttribute('data-error', ''); help.textContent = el.validationMessage; }
        }
      };
      el.addEventListener('blur', function () { touched = true; validate(); });
      el.addEventListener('input', validate);
      el.addEventListener('change', validate);
    });
  }

  if (form) {
    var GAS_URL = form.getAttribute('data-endpoint');
    var sent = $('#formSent');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.setAttribute('data-state', 'loading'); btn.disabled = true; }

      /* Roll the checked add-ons into one field for the sheet + email. */
      var picked = selectedAddons();
      var joined = form.querySelector('input[name="add_ons"]');
      if (!joined) {
        joined = document.createElement('input');
        joined.type = 'hidden'; joined.name = 'add_ons';
        form.appendChild(joined);
      }
      joined.value = picked.length
        ? picked.map(function (cb) { return cb.value; }).join(' | ')
        : 'None';

      /* Carry the details to the waiver so the customer never retypes them.
         Key + shape are the contract waiver.html already reads. */
      try {
        sessionStorage.setItem('rk_booking', JSON.stringify({
          name:         (($('#name') || {}).value || ''),
          phone:        (($('#phone') || {}).value || ''),
          email:        (($('#email') || {}).value || ''),
          vehicle:      (($('#vehicle_make_model') || {}).value || ''),
          service:      (($('#service') || {}).value || ''),
          vehicle_size: (($('#vehicle_size') || {}).value || ''),
          addons:       picked.map(function (cb) { return cb.name; })
        }));
      } catch (err) { /* private mode — the waiver just starts blank */ }

      /* POST through a hidden iframe: no CORS, no third-party form vendor. */
      if (GAS_URL) {
        form.method = 'POST';
        form.action = GAS_URL;
        form.target = 'gas-sink';
        form.submit();
      }

      toast('Booking request sent');
      setTimeout(function () {
        form.style.display = 'none';
        if (sent) sent.setAttribute('data-visible', 'true');
      }, 500);
      setTimeout(function () { window.location.href = '/waiver'; }, 2600);
    });
  }

  /* ── Before / after sliders ───────────────────────────────────── */
  $$('.ba-stage').forEach(function (stage) {
    var range = $('.ba-range', stage);
    var after = $('.ba-after', stage);
    var line  = $('.ba-line', stage);
    var grip  = $('.ba-grip', stage);
    if (!range || !after) return;
    var paint = function () {
      var pos = range.value + '%';
      after.style.setProperty('--pos', pos);
      if (line) line.style.setProperty('--pos', pos);
      if (grip) grip.style.setProperty('--pos', pos);
    };
    range.addEventListener('input', paint);
    paint();
  });

  calcEstimate();
})();
