# Photo shot list — Royal Kings Auto Care

The site is built photo-ready. Every slot below currently renders as a dark
material panel (`.plate`) rather than a broken image or a stock photo, so the
site is honest and complete as it stands — but photography is the single
biggest upgrade left, and it is the one thing we cannot make ourselves.

**Nothing on this site is stock.** No invented reviews, no other people's cars,
no AI images. That stays true — anything below gets shot by Patrick or Justin,
or pulled from the real Instagram feed.

---

## How to shoot it (send this part to the guys)

Phone camera is fine. What matters is consistency, not gear.

1. **Wipe the lens.** Every time. It is the single biggest quality difference.
2. **Shoot in the shade or on an overcast day.** Direct sun blows out paint and
   hides the finish you are trying to show.
3. **Landscape orientation** for anything wide. Portrait only for the two
   people shots.
4. **Hold still and step back.** Fill the frame with the car, not the driveway.
5. **Before/after pairs must match.** Same angle, same distance, same height,
   same lighting. Mark where you stood. A pair shot from two different spots is
   useless as a comparison — that is the whole point of the slider.
6. **Do not use filters.** No VSCO, no auto-enhance, no "vivid" mode. The work
   should sell it.
7. **Ask the customer before photographing their vehicle**, and avoid capturing
   licence plates or anything personal left in the car.

Send them at full resolution — do not compress or send through a chat app that
shrinks them. AirDrop, Google Drive, or email as "actual size".

**Minimum resolution: 2000px on the long edge.** Anything smaller looks soft
once it is stretched across a wide band.

---

## The slots

### 1. Before / after pairs — `/gallery` (highest value)

**Need: 3–6 pairs. This is the most persuasive thing a detailing site can have.**

| # | Subject | Framing |
|---|---|---|
| 1 | A genuinely filthy interior — driver's side footwell or rear bench | Door open, shot straight in from outside, same spot both times |
| 2 | Carpet with salt bloom | Straight down, close, one mat filling the frame |
| 3 | Cloth seat with a real stain | Straight on, whole seat in frame |
| 4 | Trunk or cargo area | From the bumper, tailgate up |
| 5 | Swirled paint under a hard light | Same panel, same light position, both shots |
| 6 | Yellowed headlight | One headlight filling the frame |

Filenames: `ba-01-before.jpg` / `ba-01-after.jpg`, and so on.

### 2. Finished work grid — `/gallery`

**Need: 6–10 shots** of completed cars. Mix of full-vehicle exteriors and
interior detail shots (a clean dash, a stitched seat, a vent, a beading hood).
Close-ups carry more than wide shots here.

Filenames: `work-01.jpg` … `work-10.jpg`

### 3. Patrick and Justin — `/about` and the homepage

**Need: 3 photos.**

- One of the two of them together, working or standing by the vehicle. Landscape.
- One portrait of Patrick. Portrait orientation.
- One portrait of Justin. Portrait orientation.

These do more for trust than anything else on the site. They do not need to be
posed — mid-work is better than a posed headshot.

Filenames: `team-both.jpg`, `team-patrick.jpg`, `team-justin.jpg`

### 4. Service page headers — `/services/*`

**Need: 4 shots, one per service.**

| Page | Shot |
|---|---|
| Interior detailing | An extractor mid-pull on a seat, or a spotless finished interior |
| Exterior detailing | Water beading on clean paint, or foam on a panel |
| Ceramic coating | Water beading tight and high on a coated panel |
| Paint correction | A polisher on a panel, or a half-corrected panel showing the cut line |

Filenames: `svc-interior.jpg`, `svc-exterior.jpg`, `svc-ceramic.jpg`, `svc-correction.jpg`

### 5. Hero / homepage band

**Need: 1 wide shot.** The best single photo you have — a finished car, shot
low and wide, ideally at dusk or in shade. Landscape, 2400px+ wide.

Filename: `hero.jpg`

---

## Dropping them in

1. Put the files in `assets/work/`.
2. **Open each one before writing its caption.** Alt text has to describe what
   is actually in the frame, not what the folder is called.
3. Fill the `PAIRS` and `SHOTS` arrays at the top of `src/pages/gallery.mjs`.
4. For the other slots, replace `<span class="plate …"></span>` with
   `<span class="plate …"><img src="/assets/work/<file>" alt="<real description>"
   width="…" height="…" loading="lazy"></span>` — the plate already crops and
   covers, so no other change is needed.
5. Publish the gallery: remove `noindex: true` from `gallery.mjs`, add
   `{ href: '/gallery', label: 'Our work' }` to `NAV` in `src/data.mjs`, and give
   the page a `sitemap` entry in `build.mjs`.
6. `node build.mjs`

---

## Also worth collecting (not photos)

- **Google reviews.** The Google Business Profile is still unclaimed. Once it is
  live, three real reviews unlock a testimonials section on the homepage that is
  built and waiting.
- **A count.** "X cars detailed since 2025" is worth putting in the hero spec
  strip — but only once someone can tell us the real number. Nothing invented
  goes on this site.
