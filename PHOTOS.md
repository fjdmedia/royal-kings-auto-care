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

Filenames: any two files sharing a name, one ending `-before` and one
ending `-after` — `civic-interior-before.jpg` / `civic-interior-after.jpg`.
Case and extension do not matter. Drop them in `assets/Gallery/`.

### 2. Finished work grid — `/gallery`

**Need: 6–10 shots** of completed cars. Mix of full-vehicle exteriors and
interior detail shots (a clean dash, a stitched seat, a vent, a beading hood).
Close-ups carry more than wide shots here.

Filenames: anything, as long as it does not end `-before` or `-after`.
Drop them in `assets/Gallery/` and they become work-grid shots.

### 3. Patrick and Justin — `/about` and the homepage

**Need: 3 photos.**

- One of the two of them together, working or standing by the vehicle. Landscape.
- One portrait of Patrick. Portrait orientation.
- One portrait of Justin. Portrait orientation.

These do more for trust than anything else on the site. They do not need to be
posed — mid-work is better than a posed headshot.

Filenames: `team-both.jpg`, `team-patrick.jpg`, `team-justin.jpg` (see note below — these are not auto-wired yet)

### 4. Service page headers — `/services/*`

**Need: 4 shots, one per service.**

| Page | Shot |
|---|---|
| Interior detailing | An extractor mid-pull on a seat, or a spotless finished interior |
| Exterior detailing | Water beading on clean paint, or foam on a panel |
| Ceramic coating | Water beading tight and high on a coated panel |
| Paint correction | A polisher on a panel, or a half-corrected panel showing the cut line |

Drop these in `assets/Gallery/Services/`. The filename just has to contain
the service word: `interior`, `exterior`, `ceramic` or `paint`.

### 5. Hero / homepage band

**Need: 1 wide shot.** The best single photo you have — a finished car, shot
low and wide, ideally at dusk or in shade. Landscape, 2400px+ wide.

Filename: `hero.jpg`

---

## Dropping them in

**This is the whole workflow:**

1. Put the files in `assets/Gallery/` (or `assets/Gallery/Services/` for the
   service headers).
2. Run `node build.mjs`.
3. It will stop and tell you which photos need a caption. Open each image,
   write what is actually in the frame into `assets/Gallery/captions.json`.
4. Run `node build.mjs` again.

That is it. There is no page to edit and no flag to flip. Once a single
before/after pair or work shot is in the folder:

- the before/after section appears on the homepage
- `/gallery` fills itself, drops `noindex`, joins the navigation and enters
  the sitemap
- the service pages pick up their headers

Empty the folder again and all of that disappears just as cleanly.

**Why it makes you write captions.** Alt text has to describe what is really
in the frame — that is what a screen reader announces and what Google reads.
Generating it from a filename is how a customer's truck ends up captioned as
"a car". The build refuses rather than guessing, and it names exactly which
files it is waiting on.

**What the build also tells you**, without being asked:

- a pair missing its other half
- a before/after pair whose two halves are different shapes (the slider
  would crop one of them)
- anything too low-resolution to sit full-width
- a Services image whose name does not say which service it belongs to

**Not auto-wired yet:** the team photos and the wide hero shot. Those slot
into specific places on `/about` and the homepage rather than a grid, so
send them over and I will place them.

## Also worth collecting (not photos)

- **Google reviews.** The Google Business Profile is still unclaimed. Once it is
  live, three real reviews unlock a testimonials section on the homepage that is
  built and waiting.
- **A count.** "X cars detailed since 2025" is worth putting in the hero spec
  strip — but only once someone can tell us the real number. Nothing invented
  goes on this site.
