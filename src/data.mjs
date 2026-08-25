/* ─────────────────────────────────────────────────────────────
   Royal Kings Auto Care — the single source of every fact.

   G33b/G33c: nothing in this site states a price, a phone number,
   an hour, a package inclusion or an add-on range from its own
   hardcoded literal. Every surface renders from this file.
   Change a number here and it changes everywhere at once.
   ───────────────────────────────────────────────────────────── */

export const SITE = {
  name:      'Royal Kings Auto Care',
  shortName: 'Royal Kings',
  origin:    'https://www.royalkingsdetailingwpg.ca',
  /* Two different jobs, deliberately two fields.

     serviceTitle is what the business calls ITSELF — it goes on brand
     surfaces: the hero crumb, the footer lockup, schema alternateName.
     (Confirmed by James 2026-08-12; it was also the pre-v3 H1.)

     category is the SEARCH term and stays "Auto Detailing", because that
     is what people in Winnipeg actually type and it is the July 2026
     positioning lock. It lives in <title> tags and schema serviceType.
     Never "mobile" as the category term — that lock still holds. */
  serviceTitle: 'Premium Detailing Service',
  category:     'Premium Auto Detailing',
  city:      'Winnipeg',
  region:    'MB',
  country:   'CA',
  tagline:   'Convenience meets quality — wherever you are, we deliver royal results.',
  logo:      '/Logo.jpg',
};

export const CONTACT = {
  hours:      'Mon–Sat · 8am–6pm',
  hoursShort: 'Mon–Sat, 8am–6pm',
  opens:      '08:00',
  closes:     '18:00',
  days:       ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  email:      'royalkingsautocare@gmail.com',
  people: [
    { name: 'Patrick', phone: '(431) 334-9577', tel: '+14313349577' },
    { name: 'Justin',  phone: '(431) 388-0859', tel: '+14313880859' },
  ],
  instagram: { handle: '@RoyalKingsDetailWinnipeg', url: 'https://www.instagram.com/RoyalKingsDetailWinnipeg/' },
  tiktok:    { handle: '@RoyalKingsDetailing',      url: 'https://www.tiktok.com/@RoyalKingsDetailing' },
};

/* Deposit + turnaround — quoted in five places, defined once. */
export const TERMS = {
  deposit:        '$50–$100',
  depositNote:    'Applied to your total. Refundable with 24 hours’ notice.',
  confirmWindow:  '24 hours',
  travelFee:      'No travel fee inside Winnipeg city limits.',
  travelFeeShort: 'No travel fee in the city',
  payment:        'e-Transfer, cash, and major cards.',
};

/* ── Packages ─────────────────────────────────────────────────
   `formValue` MUST match the <option value> the Apps Script backend
   already receives. Do not rename — it lands in the Bookings sheet
   and in the waiver prefill.                                    */
export const PACKAGES = [
  {
    id: 'minimal',
    name: 'Minimal',
    formValue: 'Minimal',
    price: 110,
    duration: '1 – 1.5 hours',
    line: 'The reset. Vacuum, wipe-down, and the car feels like yours again.',
    forWho: 'Regular upkeep on a car that is already in decent shape.',
    includes: [
      'Interior vacuuming — seats, carpets, mats, trunk',
      'General wipe-down and cleaning of interior surfaces',
    ],
  },
  {
    id: 'standard',
    name: 'The Standard',
    formValue: 'The Standard',
    price: 165,
    duration: '2 – 3 hours',
    line: 'Everything in Minimal, then we go into the fabric and the surfaces.',
    forWho: 'A car that has carried a winter, a summer, or a couple of kids.',
    includes: [
      'Everything in Minimal',
      'Deep cleaning of fabrics — seats and carpets',
      'Surface treatment for interior materials',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    formValue: 'Premium',
    price: 195,
    duration: 'Half day',
    featured: true,
    badge: 'Best Value',   // their own live wording. NOT 'Most booked' — that asserts a sales mix nobody has measured.
    line: 'The full interior. Fabric, odor, stains, and protection that holds.',
    forWho: 'A deep clean before you sell it, after you buy it, or when it is just time.',
    includes: [
      'Everything in The Standard',
      'Intensive fabric care',
      'Odor and stain management',
      'Additional protective treatments',
    ],
  },
];

/* ── Vehicle classes ──────────────────────────────────────────
   `formValue` MUST match the <option value> in the booking form. */
export const VEHICLE_CLASSES = [
  { id: 'sedan',  label: 'Coupes & Sedans',    formValue: 'Coupes & Sedans',    surcharge: 0  },
  { id: 'suv',    label: 'SUVs & Crossovers',  formValue: 'SUVs & Crossovers',  surcharge: 15 },
  { id: 'truck',  label: 'Trucks & 7-Seaters', formValue: 'Trucks & 7-Seaters', surcharge: 35 },
];

/* ── Add-ons ──────────────────────────────────────────────────
   `field` MUST match the checkbox name the backend and the waiver
   prefill map already expect (waiver.html maps addon_stain →
   stain-extraction, addon_odor → odor-removal, addon_ceramic_coat
   → true-ceramic). Renaming a field silently breaks the prefill. */
export const ADDONS = [
  { field: 'addon_clay_bar',       name: 'Clay Bar Treatment',        min: 50,  max: 100,  basis: 'Based on vehicle class',
    value: 'Clay Bar Treatment ($50-$100)',
    what: 'Pulls bonded tar, overspray and road grit off the paint that washing leaves behind.' },
  { field: 'addon_iron_remover',   name: 'Iron Remover',              min: 50,  max: 50,   basis: 'Flat rate',
    value: 'Iron Remover ($50)',
    what: 'Dissolves the brake dust and rail dust embedded in your clear coat.' },
  { field: 'addon_engine_bay',     name: 'Engine Bay Cleaning',       min: 50,  max: 150,  basis: 'Based on vehicle class',
    value: 'Engine Bay Cleaning ($50-$150)',
    what: 'Degreased and dressed. Worth it before a sale or a safety.' },
  { field: 'addon_headlight',      name: 'Headlight Restoration',     min: 60,  max: 120,  basis: 'Based on vehicle class',
    value: 'Headlight Restoration ($60-$120)',
    what: 'Cuts the yellow haze back off. You get the light output back too.' },
  { field: 'addon_pet_hair',       name: 'Pet Hair Removal',          min: 30,  max: 80,   basis: 'Based on vehicle class',
    value: 'Pet Hair Removal ($30-$80)',
    what: 'The hair a vacuum will not lift. Woven out of the carpet and upholstery.' },
  { field: 'addon_stain',          name: 'Stain Extraction',          min: 50,  max: 150,  basis: 'Based on vehicle class',
    value: 'Stain Extraction ($50-$150)',
    what: 'Hot-water extraction on coffee, salt, grease and whatever the kids did.' },
  { field: 'addon_odor',           name: 'Odor Removal',              min: 50,  max: 100,  basis: 'Based on vehicle class',
    value: 'Odor Removal ($50-$100)',
    what: 'Treats the source, not the smell. Smoke, pets, spilled milk.' },
  { field: 'addon_spray_ceramic',  name: 'Spray Ceramic Coating',     min: 100, max: 150,  basis: 'Based on vehicle class',
    value: 'Spray Ceramic Coating ($100-$150)',
    what: 'Months of gloss and water beading. The affordable protection layer.' },
  { field: 'addon_ceramic_coat',   name: 'True Ceramic Coating',      min: 400, max: 1000, basis: 'Based on protection tier & vehicle class',
    priceLabel: '$400 – $1,000+',
    value: 'True Ceramic Coating ($400-$1,000+)',
    what: 'Years, not months. Bonded to prepped paint and quoted per vehicle.' },
  { field: 'addon_buffing',        name: 'Paint Correction (Buffing)', min: 150, max: 600, basis: 'Based on correction steps & vehicle class',
    value: 'Paint Correction / Buffing ($150-$600)',
    note: 'Full-day service — exclusive booking required',
    what: 'Machine-polished to cut swirls, wash marks and light scratches out of the clear coat.' },
];

export const TIME_SLOTS = [
  'Morning (8am – 11am)',
  'Midday (11am – 1pm)',
  'Afternoon (1pm – 4pm)',
  'Late Afternoon (4pm – 6pm)',
];

/* ── Service pages ───────────────────────────────────────────── */
export const SERVICES = [
  {
    slug: 'interior-car-detailing-winnipeg',
    nav: 'Interior Detailing',
    title: 'Interior Car Detailing',
    short: 'Vacuum, fabric, surfaces, odor. The side of the car you actually sit in.',
    from: 110,
  },
  {
    slug: 'exterior-detailing-winnipeg',
    nav: 'Exterior Detailing',
    title: 'Exterior Detailing',
    short: 'Decontamination, clay, iron removal and protection — the paint side.',
    from: 50,
  },
  {
    slug: 'ceramic-coating-winnipeg',
    nav: 'Ceramic Coating',
    title: 'Ceramic Coating',
    short: 'Gloss and a shield your wash cannot strip off. Spray or true ceramic.',
    from: 100,
  },
  {
    slug: 'paint-correction-winnipeg',
    nav: 'Paint Correction',
    title: 'Paint Correction',
    short: 'Machine polishing that cuts swirls and scratches out of the clear coat.',
    from: 150,
  },
];

/* ── Process ─────────────────────────────────────────────────── */
export const PROCESS = [
  { n: '01', title: 'Pick your package',  body: 'Choose the tier and your vehicle class. The price moves in front of you — no quote request, no waiting on a callback.' },
  { n: '02', title: 'Book it online',     body: `Details, date, add-ons. Under two minutes. We confirm inside ${TERMS.confirmWindow}.` },
  { n: '03', title: 'We come to you',     body: 'We arrive at your place — home, work, wherever the car is parked — fully equipped. You do not drive anywhere or sit in a waiting room.' },
  { n: '04', title: 'We walk you through it', body: 'Before we pack up we go over the car with you. If something is not right, we deal with it there.' },
];

/* ── FAQ — answers are client-approved. Edit the wording only with Patrick or Justin. ── */
export const FAQS = [
  { q: 'Do I need to be home during the detail?',
    a: 'Not necessarily. As long as we have access to the vehicle and a water/power source nearby, you’re free to go about your day. Most clients leave the keys and let us handle it.' },
  { q: 'How long does a typical detail take?',
    a: 'The Minimal package takes about 1-1.5 hours. The Standard runs 2-3 hours. Premium and add-on services like paint correction can take a full day depending on vehicle size and condition.' },
  { q: 'What if it rains on my appointment day?',
    a: 'We’ll reach out to reschedule at no extra charge. Interior details can still happen under covered areas like garages or carports. We’ll work with you to find the best option.' },
  { q: 'Do you bring your own water and power?',
    a: 'We come fully equipped with our own tools and supplies. We just need access to a standard outdoor outlet and water spigot for exterior work. Interior-only jobs don’t need either.' },
  { q: 'What areas in Winnipeg do you serve?',
    a: 'We serve all of Winnipeg and surrounding areas. No extra travel fees within city limits. For locations outside Winnipeg, reach out and we’ll see what we can do.' },
  { q: 'How do I pay?',
    a: `A ${TERMS.deposit} deposit secures your booking (applied toward the total). The remaining balance is due after the service is complete. We accept ${TERMS.payment}` },
];

/* Winnipeg areas — we serve the whole city, so this is a wayfinding list,
   not a coverage claim. Do not extend past city limits without asking. */
export const AREAS = [
  'Downtown', 'St. Boniface', 'St. Vital', 'Windsor Park', 'Sage Creek',
  'Transcona', 'East Kildonan', 'North Kildonan', 'Garden City', 'The Maples',
  'Seven Oaks', 'St. James', 'Charleswood', 'Tuxedo', 'River Heights',
  'Fort Garry', 'Linden Woods', 'Whyte Ridge', 'Bridgwater', 'Waverley West',
];

/* ── Navigation ───────────────────────────────────────────────
   restraint #36: ≤6 top-level links. /gallery is deliberately
   absent — the page is built and wired but stays out of the nav
   and the sitemap until real photos exist (see PHOTOS.md).      */
export const NAV = [
  { href: '/services',  label: 'Services' },
  { href: '/pricing',   label: 'Pricing'  },
  { href: '/about',     label: 'About'    },
  { href: '/faq',       label: 'FAQ'      },
  { href: '/contact',   label: 'Contact'  },
];

/* ── Theme switcher ───────────────────────────────────────────
   A REVIEW TOOL, not a customer feature. It ships the nav toggle that
   flips between the v3 system and the classic (original) palette and
   type, so the two can be compared on the real pages.

   Set this to false and rebuild — the toggle disappears from all 13
   pages, the classic stylesheet stops loading, and nothing else in the
   markup changes. Do that before merging to main.                     */
export const THEME_SWITCHER = false;

/* Three points on one line, coolest to warmest. `sheet` is loaded on every
   page and stays inert until its attribute is set; `fonts` is requested only
   when that theme is actually active, so nobody pays for Cinzel to look at v3.
   `modern` is the default and needs neither. */
export const THEMES = [
  { id: 'modern',  label: 'V3',      note: 'Archivo · cool graphite · hard edges' },
  { id: 'warm',    label: 'Warm',    note: 'Derived from the logo — Playfair, gold gradient + chrome, pure black',
    sheet: '/assets/rk-warm.css',
    fonts: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400..900&display=swap' },
  { id: 'classic', label: 'Classic', note: 'Cinzel · warm palette · soft edges',
    sheet: '/assets/rk-classic.css',
    fonts: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap' },
];

/* ── Hero copy lifted from the LIVE site ─────────────────────────
   These H1s, eyebrows and subs are what royalkingsdetailingwpg.ca is
   serving today — client-approved and already indexed, pulled off their
   own sitemap rather than rewritten. Do not "improve" them without asking:
   the last time a hero line here was invented rather than taken from the
   business, it read as the company's motto and was not.

   The live homepage splits the slogan across two roles — the first half is
   its own line, the second half opens the sub. Both halves are DERIVED from
   SITE.tagline below so the motto has one source.                          */
export const LIVE_HERO = {
  home: {
    eyebrow: 'Premium Auto Detailing — Winnipeg',
    h1Lead: 'Royal Kings',
    h1Tail: 'Auto Care',
    subTail: 'Premium auto detailing across Winnipeg — showroom-clean, without leaving your driveway.',
  },
  services: {
    eyebrow: 'Auto Detailing — Winnipeg',
    h1: 'Car Detailing Services in <em>Winnipeg</em>',
    sub: "One team, the full range — from a deep interior clean to ceramic coating and paint correction. All of it done at your door, start to finish.",
  },
  'interior-car-detailing-winnipeg': {
    eyebrow: 'Interior Detailing — Winnipeg',
    h1: 'Interior Car Detailing in <em>Winnipeg</em>',
    sub: "The part of the car you actually live in — cleaned like it's new. Vacuumed, wiped, fabrics deep-cleaned, odors handled. We pull up to your driveway and hand it back showroom-fresh.",
  },
  'ceramic-coating-winnipeg': {
    eyebrow: 'Paint Protection — Winnipeg',
    h1: 'Ceramic Coating in <em>Winnipeg</em>',
    sub: "Lasting gloss and a shield your wash can't wear off. We coat your paint in your own driveway — spray ceramic for quick protection, true ceramic for the long haul. Both done at your door, both done right.",
  },
  'paint-correction-winnipeg': {
    eyebrow: 'Machine Polishing — Winnipeg',
    h1: 'Paint Correction in <em>Winnipeg</em>',
    sub: 'Swirls, scratches, and dull, tired paint — cut out with proper machine polishing. We bring the whole setup to your driveway and give the finish back its depth. A full day, one car, done right.',
  },
  /* No live equivalent — this page is new. Written to the same pattern
     rather than invented in a different voice. */
  'exterior-detailing-winnipeg': {
    eyebrow: 'Exterior Detailing — Winnipeg',
    h1: 'Exterior Car Detailing in <em>Winnipeg</em>',
    sub: 'Decontamination, correction and protection — in the order that actually works. Priced per service, because no two cars need the same steps. All of it done at your door.',
  },
};

/* The motto, split the way the live hero splits it. Derived, never retyped. */
export const taglineLead = SITE.tagline.split('—')[0].trim() + '.';
export const taglineTail = (t => t.charAt(0).toUpperCase() + t.slice(1))(SITE.tagline.split('—')[1].trim());

export const GAS_URL = 'https://script.google.com/macros/s/AKfycbzHEbSavkYrqL3sA9y5oqHXQbK24IQJahz_wYbQODO4rY-LSDJ_w9IyGslmgINtVLLf7g/exec';

/* ── Derived helpers ─────────────────────────────────────────── */
export const priceFrom = Math.min(...PACKAGES.map(p => p.price));
export const money = n => '$' + n.toLocaleString('en-CA');
export const addonRange = a => a.priceLabel || (a.min === a.max ? money(a.min) : `${money(a.min)} – ${money(a.max)}`);
export const primaryPhone = CONTACT.people[0];
