import { SITE, CONTACT, NAV, TERMS, SERVICES, THEMES, THEME_SWITCHER, primaryPhone, priceFrom, money } from './data.mjs';
import { GALLERY } from './gallery-data.mjs';
import { BASE } from './site-base.mjs';

/* Inline SVG only. No icon CDN — a whole library downloaded to draw
   twelve glyphs is a render-blocking dependency and a FOUC source. */
const ICONS = {
  menu:   '<path d="M2 5h16M2 10h16M2 15h16"/>',
  close:  '<path d="M4 4l12 12M16 4L4 16"/>',
  right:  '<path d="M3 10h13M11 5l5 5-5 5"/>',
  phone:  '<path d="M17 13.9v2.3a1.5 1.5 0 0 1-1.6 1.5 15 15 0 0 1-6.5-2.3 14.7 14.7 0 0 1-4.5-4.5A15 15 0 0 1 2 4.3 1.5 1.5 0 0 1 3.5 2.7h2.3a1.5 1.5 0 0 1 1.5 1.3c.1.7.3 1.4.5 2.1a1.5 1.5 0 0 1-.3 1.6l-1 1a12 12 0 0 0 4.5 4.5l1-1a1.5 1.5 0 0 1 1.6-.3c.7.2 1.4.4 2.1.5a1.5 1.5 0 0 1 1.3 1.5z"/>',
  mail:   '<path d="M2.5 4.5h15v11h-15z"/><path d="m2.5 5.5 7.5 5.5 7.5-5.5"/>',
  pin:    '<path d="M16.5 8.3c0 4.6-6.5 9.2-6.5 9.2s-6.5-4.6-6.5-9.2a6.5 6.5 0 0 1 13 0z"/><circle cx="10" cy="8.3" r="2.2"/>',
  clock:  '<circle cx="10" cy="10" r="7.5"/><path d="M10 5.5V10l3 1.8"/>',
  check:  '<path d="M4 10.5 8 14.5 16 5.5"/>',
  shield: '<path d="M10 2.5 3.8 5v4.4c0 3.9 2.6 6.9 6.2 8.1 3.6-1.2 6.2-4.2 6.2-8.1V5z"/><path d="m7.4 9.9 1.9 1.9 3.4-3.6"/>',
  car:    '<path d="M3 12.5h14M4.6 12.5V9.3l1.7-4h7.4l1.7 4v3.2"/><circle cx="6.6" cy="14.6" r="1.5"/><circle cx="13.4" cy="14.6" r="1.5"/>',
  spark:  '<path d="M10 2.5 11.9 8 17.5 10 11.9 12 10 17.5 8.1 12 2.5 10 8.1 8z"/>',
  ig:     '<rect x="3" y="3" width="14" height="14" rx="4"/><circle cx="10" cy="10" r="3.4"/><circle cx="14.2" cy="5.8" r=".9" fill="currentColor" stroke="none"/>',
  tiktok: '<path d="M12.4 2.5v9.2a3 3 0 1 1-2.6-3"/><path d="M12.4 4.6a4 4 0 0 0 3.7 2.7"/>',
};

export const icon = (n, cls = '') =>
  `<svg class="ic${cls ? ' ' + cls : ''}" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ── Head ────────────────────────────────────────────────────────── */
const head = ({ title, description, path, schema = [], noindex = false }) => `
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${SITE.origin}${path}">
  <meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow'}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(SITE.name)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${SITE.origin}${path}">
  <meta property="og:image" content="${SITE.origin}${SITE.logo}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${SITE.origin}${SITE.logo}">
  <meta name="theme-color" content="#06070A">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%2306070A'/%3E%3Cpath d='M5 20.5 L7 10 L12.5 15 L16 7 L19.5 15 L25 10 L27 20.5 Z' fill='%23C9A227'/%3E%3Crect x='5' y='22.5' width='22' height='3' fill='%23C9A227'/%3E%3C/svg%3E">
  <link rel="apple-touch-icon" href="${SITE.logo}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=JetBrains+Mono:wght@400;500;700&display=swap">
  <link rel="stylesheet" href="/assets/rk.css">
${THEME_SWITCHER ? `
${THEMES.filter(t => t.sheet).map(t => `  <link rel="stylesheet" href="${t.sheet}">`).join('\n')}
  <script>
    /* Runs before first paint — no flash of the other theme.
       Generated from THEMES in src/data.mjs: every theme's stylesheet is
       already loaded and inert, so applying one is a single attribute; only
       a theme that needs extra fonts requests them, and only when active. */
    (function () {
      var FONTS = ${JSON.stringify(Object.fromEntries(THEMES.filter(t => t.fonts).map(t => [t.id, t.fonts])))};
      try {
        var t = localStorage.getItem('rk_theme');
        if (!t || t === 'modern' || !${JSON.stringify(THEMES.map(x => x.id))}.includes(t)) return;
        document.documentElement.setAttribute('data-theme', t);
        if (FONTS[t]) {
          var l = document.createElement('link');
          l.rel = 'stylesheet'; l.href = FONTS[t];
          l.setAttribute('data-theme-fonts', t);
          document.head.appendChild(l);
        }
      } catch (e) { /* private mode — the default theme needs nothing */ }
    })();
  </script>` : ''}
${schema.map(s => `  <script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}`;

/* ── Schema ──────────────────────────────────────────────────────── */
export const localBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'AutoDetailing',
  '@id': `${SITE.origin}/#business`,
  name: SITE.name,
  alternateName: `${SITE.name} — ${SITE.serviceTitle}`,
  slogan: SITE.tagline,
  description: `${SITE.category} in ${SITE.city}, ${SITE.region}. Interior packages from ${money(priceFrom)}. We come to you.`,
  url: `${SITE.origin}/`,
  image: `${SITE.origin}${SITE.logo}`,
  logo: `${SITE.origin}${SITE.logo}`,
  telephone: CONTACT.people.map(p => p.tel),
  email: CONTACT.email,
  address: { '@type': 'PostalAddress', addressLocality: SITE.city, addressRegion: SITE.region, addressCountry: SITE.country },
  areaServed: { '@type': 'City', name: SITE.city },
  priceRange: '$$',
  currenciesAccepted: 'CAD',
  paymentAccepted: TERMS.payment.replace(/\.$/, ''),
  sameAs: [CONTACT.instagram.url, CONTACT.tiktok.url],
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: CONTACT.days, opens: CONTACT.opens, closes: CONTACT.closes,
  }],
  makesOffer: SERVICES.map(s => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name: `${s.title} ${SITE.city}`, url: `${SITE.origin}/services/${s.slug}` },
    priceCurrency: 'CAD', priceSpecification: { '@type': 'PriceSpecification', minPrice: s.from, priceCurrency: 'CAD' },
  })),
});

export const breadcrumbSchema = trail => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem', position: i + 1, name: t.label,
    ...(t.href ? { item: `${SITE.origin}${t.href}` } : {}),
  })),
});

export const faqSchema = faqs => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question', name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});


const themeSwitch = (cls = '') => THEME_SWITCHER ? `
    <div class="theme-sw ${cls}" role="group" aria-label="Preview theme">
      ${THEMES.map(t => `<button type="button" class="theme-sw-btn" data-theme-set="${t.id}"${t.fonts ? ` data-theme-fonts="${t.fonts}"` : ''} title="${esc(t.note)}">${esc(t.label)}</button>`).join('')}
    </div>` : '';

/* ── Nav ─────────────────────────────────────────────────────────── */
const navMarkup = current => {
  /* /gallery joins the nav the moment assets/Gallery/ has something in it,
     and leaves again if it is emptied. Nothing to remember to switch on. */
  const nav = GALLERY.hasPhotos
    ? [NAV[0], { href: '/gallery', label: 'Our work' }, ...NAV.slice(1)]
    : NAV;
  const links = nav.map(l =>
    `<a href="${l.href}"${current === l.href ? ' aria-current="page"' : ''}>${l.label}</a>`).join('\n        ');
  const drawerLinks = nav.map(l =>
    `<a href="${l.href}"${current === l.href ? ' aria-current="page"' : ''}>${l.label}</a>`).join('\n        ');
  return `
<header class="nav" id="nav">
  <div class="wrap nav-inner">
    <a class="brand" href="/" aria-label="${esc(SITE.name)} — home">
      <img src="${SITE.logo}" width="34" height="34" alt="">
      <span class="brand-txt"><b>Royal Kings</b><span>Auto Care</span></span>
    </a>
    <nav class="nav-links" aria-label="Primary">
        ${links}
      ${themeSwitch()}
      <a class="btn btn-primary nav-cta" href="/book">Book a detail</a>
    </nav>
    <button class="nav-toggle" type="button" id="navToggle" aria-expanded="false" aria-controls="drawer">
      ${icon('menu')}<span class="vh">Open menu</span>
    </button>
  </div>
</header>

<div class="drawer" id="drawer" data-open="false">
  <div class="drawer-top">
    <a class="brand" href="/"><img src="${SITE.logo}" width="34" height="34" alt=""><span class="brand-txt"><b>Royal Kings</b><span>Auto Care</span></span></a>
    <button class="nav-toggle" type="button" id="navClose">${icon('close')}<span class="vh">Close menu</span></button>
  </div>
  <nav aria-label="Menu">
        ${drawerLinks}
  </nav>
  <div class="drawer-foot">
    ${themeSwitch('theme-sw-wide')}
    <a class="btn btn-primary" href="/book">Book a detail ${icon('right')}</a>
    <a class="drawer-call" href="tel:${primaryPhone.tel}">${icon('phone')} ${primaryPhone.phone} — ${primaryPhone.name}</a>
  </div>
</div>`;
};

/* ── Footer ──────────────────────────────────────────────────────── */
const footerMarkup = () => `
<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <b>${esc(SITE.name)}</b>
        <span class="foot-svc">${esc(SITE.serviceTitle)} · ${SITE.city}, ${SITE.region}</span>
        <p class="foot-slogan">${esc(SITE.tagline)}</p>
      </div>
      <div>
        <h3>Services</h3>
        <ul class="foot-list">
          ${SERVICES.map(s => `<li><a href="/services/${s.slug}">${s.nav}</a></li>`).join('\n          ')}
          <li><a href="/services">All services</a></li>
        </ul>
      </div>
      <div>
        <h3>Explore</h3>
        <ul class="foot-list">
          ${GALLERY.hasPhotos ? '<li><a href="/gallery">Our work</a></li>' : ''}
          <li><a href="/pricing">Pricing</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/faq">FAQ</a></li>
          <li><a href="/book">Book a detail</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
      <div>
        <h3>Reach us</h3>
        <ul class="foot-list">
          ${CONTACT.people.map(p => `<li><a href="tel:${p.tel}">${p.phone} — ${p.name}</a></li>`).join('\n          ')}
          <li><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></li>
          <li><a href="${CONTACT.instagram.url}" target="_blank" rel="noopener">Instagram ${CONTACT.instagram.handle}</a></li>
          <li><a href="${CONTACT.tiktok.url}" target="_blank" rel="noopener">TikTok ${CONTACT.tiktok.handle}</a></li>
          <li><span>${CONTACT.hours}</span></li>
        </ul>
      </div>
    </div>
    <div class="foot-bar">
      <span>© <span id="yr">2026</span> ${esc(SITE.name)} · ${SITE.city}, ${SITE.region}</span>
      <span><a href="/waiver">Service agreement</a> · Site by <a href="https://www.fjmedia.ca" target="_blank" rel="noopener">FJMedia.ca</a></span>
    </div>
  </div>
</footer>`;

/* Sticky mobile action bar — two real actions, nothing else. */
const dockMarkup = () => `
<div class="dock">
  <a class="btn btn-ghost" href="tel:${primaryPhone.tel}">${icon('phone')} Call</a>
  <a class="btn btn-primary" href="/book">Book a detail</a>
</div>`;


/* The original set the second line of every heading in gold ("Choose your
   PACKAGE", "Reach us DIRECTLY"). v3 deliberately does not — it keeps
   headlines white so the one gold CTA owns the viewport. Rather than write
   the accent into 20 title strings, mark it structurally here and let each
   theme decide: v3 renders <em> as plain inherited colour, classic renders it
   as the gold gradient. Same markup, two answers. */
const accentTail = html => {
  /* Matches the deliberate break whether or not it carries the desktop-only
     class — section titles use a plain <br>, heroes and CTAs use br-desk. */
  const m = /<br(?: class="br-desk")?>/.exec(html);
  if (!m) return html;
  const head = html.slice(0, m.index + m[0].length);
  const tail = html.slice(m.index + m[0].length);
  if (!tail.trim() || tail.includes('<em')) return html;
  const close = tail.lastIndexOf('</span>');
  return close === -1
    ? `${head}<em>${tail}</em>`
    : `${head}<em>${tail.slice(0, close)}</em>${tail.slice(close)}`;
};

/* ── Page shell ──────────────────────────────────────────────────── */
/* Rewrites every internal root-absolute path to sit under BASE.prefix.
   Deliberately one function over the finished HTML rather than a helper
   threaded through 12 page files: a helper only protects the paths someone
   remembered to wrap, and the ones that get forgotten are the ones that
   break. Absolute URLs, anchors, tel:, mailto: and data: are left alone. */
/* G22b: a <br> that is display:none at a breakpoint contributes NO whitespace,
   so the words either side fuse into one unbreakable token ("BOOK IT NOW,NOT
   NEXT SPRING"). Emitting a literal space after it costs nothing on desktop —
   browsers collapse leading whitespace at the start of a wrapped line — and is
   the word gap on mobile. Applied over the finished HTML for the same reason
   rebase() is: a helper only protects the breaks someone remembered to wrap. */
function spaceBreaks(html) {
  return html.replace(/<br class="br-desk">(?! )/g, '<br class="br-desk"> ');
}

function rebase(html) {
  const b = BASE.prefix;
  if (!b) return html;
  return html
    .replace(/\b(href|src|action)="\/(?!\/)/g, `$1="${b}/`)
    .replace(/\b(href|src|action)="\/"/g, `$1="${b}/"`)
    // A preview is never indexable, whatever the page asked for.
    .replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, nofollow">');
}

export function page({ title, description, path, body, schema = [], noindex = false, dock = true }) {
  body = body.replace(/(<h1[^>]*class="[^"]*hero-h1[^"]*"[^>]*>)([\s\S]*?)(<\/h1>)/g,
    (_, open, inner, close) => open + accentTail(inner) + close);
  return spaceBreaks(rebase(`<!DOCTYPE html>
<html lang="en-CA">
<head>
${head({ title, description, path, schema, noindex })}
</head>
<body${BASE.prefix ? ` data-site-base="${BASE.prefix}" data-waiver="${BASE.prefix}/waiver.html"` : ''}>
<a class="btn btn-ghost vh" href="#main">Skip to content</a>
${navMarkup(path)}
<main id="main">
${body}
</main>
${footerMarkup()}
${dock ? dockMarkup() : ''}
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script src="/assets/rk.js" defer></script>
</body>
</html>
`));
}

/* ── Shared section helpers ──────────────────────────────────────── */
export const secHead = ({ index, kicker, title, meta, lede }) => `
  <div class="sec-head">
    <span class="kicker">${index ? `${index} — ` : ''}${esc(kicker)}</span>
    <div class="sec-head-row">
      <h2>${accentTail(title)}</h2>
      ${meta ? `<span class="sec-head-meta">${esc(meta)}</span>` : ''}
    </div>
    ${lede ? `<p class="sec-lede">${lede}</p>` : ''}
  </div>`;

export const ctaBand = ({ heading, body, primary = { href: '/book', label: 'Book a detail' } }) => `
<section class="sec cta" aria-labelledby="cta-h">
  <div class="wrap cta-inner">
    <div>
      <h2 id="cta-h">${accentTail(heading)}</h2>
      <p>${body}</p>
    </div>
    <div class="cta-act">
      <a class="btn btn-primary" href="${primary.href}">${primary.label} ${icon('right')}</a>
      <a class="hero-call" href="tel:${primaryPhone.tel}">${icon('phone')} Or call ${primaryPhone.phone}</a>
      <span class="hero-fine">${esc(TERMS.travelFee)}</span>
    </div>
  </div>
</section>`;
