# Peterkin Arts

A cinematic portfolio site for the painter and graphite portraitist **Peterkin Arts**.

The site is built to behave like a short film: the page opens on a single drawing
in a dark room, scroll acts as the camera, and the work is the only colour on
screen. Everything else — type, chrome, background — stays out of the way.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run images` | Optimise new artwork and print catalogue entries |
| `npm run lint` | ESLint |

---

## The hero film

The site opens on one looping clip cut from five paintings — a push-in on
the graphite suit portrait, a drift across the ankara patchwork, a macro
pass over mark-making, a tilt up the saxophone figure, and a pull-back off
the dancer. About 21 seconds, silent, looping.

Four of the five shots are **real camera moves over the actual scans** —
a virtual camera pushing in and drifting across a still image, so every
pixel on screen is the artist's own paint. Only the closing shot is
AI-generated, and only because it is an abstract: generative video
re-draws every frame, which reads as motion on a gestural painting and as
a smeared face on hyperrealist graphite.

To rebuild it after changing the paintings:

```bash
node scripts/build-film.mjs     # needs ffmpeg on PATH
```

That writes `public/film/hero-1080.mp4` (3.2MB), `hero-720.mp4` (1.4MB)
and `poster.jpg`. The player picks the encode by viewport width, shows the
poster until playback starts, pauses off-screen and on hidden tabs, and
serves the poster alone to `prefers-reduced-motion`.

The generated shot is not reproducible from the script — it came from a
video model. `/tmp/film/ai-dance.mp4` is its source; keep a copy if you
want to re-cut without regenerating.

---

## ⚠ First: add the artwork files

**This repository contains the source code but not the images.** They were
pushed through an API that only accepts text, which re-encodes binary files
and corrupts them — a 57KB JPEG arrived as an unopenable 86KB file, so the
transfer was abandoned rather than shipped broken.

Get `peterkin-arts-assets.tar.gz` (supplied alongside this repo), then from
the project root:

```bash
tar -xzf peterkin-arts-assets.tar.gz     # restores public/ and src/app/icon.png
npm install
npm run dev
```

That archive contains:

| Path | What |
| --- | --- |
| `public/works/originals/*.jpg` | The master photographs — the real source of truth |
| `public/film/*` | The hero film and its poster frame |
| `public/works/*.jpg` | The optimised versions the site serves |
| `public/peterkin-*.png` | Logo lockup and JP monogram |
| `src/app/icon.png` | Favicon |

If you only have the originals, you don't need the rest — drop them into
`public/works/originals/` and run `npm run images` to regenerate everything.

Once the images are in place, commit them normally with `git add` and `git
push` from your own machine. Git itself handles binary files perfectly well;
it was only the API bridge that couldn't.

---

## Adding a new painting

You should never need to touch a component to add work.

1. **Drop the photograph** into `public/works/originals/`.
   Name it after the piece — `harmattan-study.jpg` becomes the slug
   `harmattan-study`.

2. **Run the pipeline:**

   ```bash
   npm run images
   ```

   This resizes the long edge down to 2400px, compresses it with 4:4:4 chroma
   (no colour smearing on brushwork), preserves the colour profile, measures the
   pixel dimensions, samples the average colour, and warns you if a photograph
   is too small to display well. It then prints a ready-made catalogue entry.

3. **Paste that entry** into `src/content/works.ts` and fill in the title, year,
   medium and dimensions.

Every work appears in the Works grid. Set `hero: true` on exactly one piece
to choose which still backs the hero when video can't play.

### Where the content lives

| File | Contains |
| --- | --- |
| `src/content/artist.ts` | Name, statement, studio note, contact, links |
| `src/content/works.ts` | Every artwork and its details |

---

## ⚠ Before this goes live

The site is structurally finished, but some of the *words* are still
placeholders written to the correct length so the layout could be judged.
They are marked with `⚠` in the source. Replace them:

- [ ] **The statement and studio paragraphs** in `artist.ts` — these are not
      Peterkin's words. A portfolio in someone else's voice is worse than no
      statement at all.
- [ ] **Every title, year and medium** in `works.ts` — inferred from the
      photographs, their signatures and their file dates, not supplied by the
      artist.
- [ ] **Dimensions** — not supplied for any work. They are omitted cleanly
      wherever they're missing, so the site is correct as-is, but a collector
      will want them.
- [ ] **The contact email** — currently `hello@peterkinarts.com`, a guess.
- [ ] **`based`** — currently "Nigeria", inferred from the subjects' dress.

### Photography notes

- Two works are **too small to feature**: `the-hat` (610×1155, cropped out of
  a wide room photograph) and `the-turban` (610×820). They hold up in the grid
  but soften badly in the lightbox, and neither can carry a camera move in the
  film. Re-shoot them if they matter.
- `two-faces` arrived **photographed sideways on an easel** in a cluttered
  studio; it is rotated upright and cropped in `prepare-source.mjs`.
- Most of the rest are framed presentation mockups sat on white walls, cropped
  down to the artwork so a white surround doesn't read as a bug on a dark page.

**How to photograph work for this site:** flat to the wall, camera square on,
indirect daylight, no flash, fill the frame with the piece, and send the
original file rather than a WhatsApp copy — WhatsApp re-compresses hard.

---

## How the site is put together

```
src/
  app/
    layout.tsx           Fonts, metadata, smooth-scroll + lightbox providers
    page.tsx             The running order of the film
    globals.css          Design tokens — the whole palette lives here
  components/
    SmoothScroll.tsx     Lenis — the dolly track everything else rides on
    Hero.tsx             The film, and the title card over it
    Works.tsx            Every piece, one grid, click to open
    About.tsx            Statement and studio note
    Contact.tsx          End card, enquiries, rights
    Lightbox.tsx         Full screen + zoom into the surface
    Nav.tsx              Chrome, which arrives late and quietly
  content/               ← the only files you normally edit
  lib/
    hooks.ts             Media queries and the hydration gate
    lenis.ts             Shared scroll handle so overlays can freeze the page
scripts/
  images.mjs             The artwork pipeline
  prepare-source.mjs     Crops each photograph down to the artwork
  build-film.mjs         Cuts the hero film
  shots.mjs / reel.mjs   Headless screenshots for visual checking
```

### On the motion

The hero film is gated: it pauses off-screen and on hidden tabs, and anyone
with `prefers-reduced-motion`
set. Those visitors get the same content as ordinary stacked sections and
native swipe strips — not a broken desktop layout. This is a supported way to
view the site, not a fallback nobody tested.

### Keyboard, in the lightbox

| Key | Action |
| --- | --- |
| `←` `→` | Previous / next work |
| `Space` | Toggle zoom into the surface |
| `Esc` | Zoom out, then close |

---

## Deploying

The easiest route is **Vercel**, which builds Next.js with no configuration:

1. Push this repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Accept the defaults and deploy.

Point a custom domain at it from the Vercel dashboard when ready.

---

© Peterkin Arts. All works reproduced with the artist's permission.
