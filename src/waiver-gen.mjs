/* ══════════════════════════════════════════════════════════════════
   BOOKING ↔ WAIVER: one source for the DATA, none of the wording

   The booking form is generated from data.mjs. The waiver is a hand-written
   legal document that carried its own copy of the same services, add-ons and
   prices. Two descriptions of one business, maintained separately — which is
   exactly how Paint Correction ended up on the booking form with no waiver
   tile, so the most expensive add-on we sell never reached the document the
   customer signs. Nothing on either page showed it; the defect lived only in
   the gap between them.

   WHY THIS GENERATES SO LITTLE
   ---------------------------
   The first version of this file generated the add-on tiles and the service
   dropdown too. Diffing its output against the real file showed it would have:
     · deleted Patrick's <optgroup> headings ("Full Service Packages" /
       "Paint Correction") and flattened the dropdown,
     · renamed his "2-Step Correction" option to "2-Step Paint Correction",
     · renamed his "Paint Correction / Buffing" tile to "Paint Correction
       (Buffing)".
   All three are HIS wording, not our facts — data.mjs happens to spell the
   same things differently because it was written for the marketing site. A
   generator that rewrites a signed contract's labels to match our internal
   naming is worse than the drift it was meant to fix.

   So the rule is: GENERATE the glue, ASSERT the facts, TOUCH NO WORDING.

     GENERATED  the booking→waiver key map (pure identifiers, no prose)
     ASSERTED   every add-on has a tile · every tile is reachable · every
                price on the waiver matches what the site sells
     UNTOUCHED  every label, description, heading and term in the document
   ══════════════════════════════════════════════════════════════════ */

/* The waiver renders ranges with an en-dash and thousands separators; data.mjs
   stores plain numbers. Compare on the numbers, never on the formatting, or the
   check fails on punctuation and gets muted. */
const priceNumbers = s => (s.match(/\d[\d,]*/g) || []).map(n => Number(n.replace(/,/g, '')));

function injectAddonMap(html, ADDONS, problems) {
  const OPEN = '/* GEN:addon-map';
  const CLOSE = '/* /GEN:addon-map */';
  const oi = html.indexOf(OPEN);
  const ci = html.indexOf(CLOSE, oi);
  if (oi < 0 || ci < 0) {
    problems.push('waiver: GEN:addon-map markers missing — the booking→waiver map is no longer generated');
    return html;
  }
  const oEnd = html.indexOf('*/', oi) + 2;
  const body = [
    '      const ADDON_MAP = {',
    ...ADDONS.map(a => '        ' + a.field + ": '" + a.waiverKey + "',"),
    '      };',
  ].join('\n');
  return html.slice(0, oEnd) + '\n' + body + '\n      ' + html.slice(ci);
}

export function reconcileWaiver(html, { ADDONS, PACKAGES }, problems) {
  const out = injectAddonMap(html, ADDONS, problems);

  const tiles = [...out.matchAll(/data-key="([a-z0-9-]+)"/g)].map(m => m[1]);

  /* Every add-on the booking form offers must have somewhere to land. This is
     the check that would have caught Paint Correction. */
  for (const a of ADDONS) {
    if (!tiles.includes(a.waiverKey)) {
      problems.push('waiver: add-on "' + a.name + '" (' + a.field + ') has no tile "' + a.waiverKey
        + '" — booking it would be silently lost from the signed agreement');
      continue;
    }
    /* And it must be offered at the same price it was sold at. */
    const tile = out.slice(out.indexOf('data-key="' + a.waiverKey + '"'));
    const shown = (tile.match(/addon-price">([^<]+)</) || [])[1] || '';
    const want = a.max && a.max !== a.min ? [a.min, a.max] : [a.min];
    const got = priceNumbers(shown);
    if (JSON.stringify(got) !== JSON.stringify(want)) {
      problems.push('waiver: "' + a.name + '" shows ' + shown.trim() + ' but the site sells it at '
        + want.map(n => '$' + n).join('–') + ' — the customer would sign a different price');
    }
  }

  /* And nothing may be offered on the waiver that cannot be booked. */
  const reachable = ADDONS.map(a => a.waiverKey);
  for (const t of tiles) {
    if (!reachable.includes(t)) {
      problems.push('waiver: tile "' + t + '" is unreachable from the booking form — no add-on maps to it');
    }
  }

  /* Package prices appear three times in the document: the price card the
     customer reads, the dropdown they choose from, and the JS object that
     prints the signed PDF. All three must agree with what the site charges. */
  for (const p of PACKAGES) {
    if (!out.includes('<div class="service-item-price">$' + p.price + '</div>')) {
      problems.push('waiver: the "' + p.name + '" price card does not read $' + p.price);
    }
    if (!new RegExp("name: '" + p.name + "', price: '\\$" + p.price + "'").test(out)) {
      problems.push('waiver: the signed PDF would print "' + p.name + '" at a price other than $' + p.price);
    }
    if (!new RegExp('<option value="' + p.id + '">[^<]*\\$' + p.price + '<').test(out)) {
      problems.push('waiver: the "' + p.name + '" dropdown option does not read $' + p.price);
    }
  }

  return out;
}
