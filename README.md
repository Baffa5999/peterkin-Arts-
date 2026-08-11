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

Set `featured: true` on three to five works to include them in the pinned
cinematic sequence. Everything else appears in the catalogue grid.

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

- `hand-to-temple.jpg` carries a visible **"I.G Peterkin101" watermark** burnt
  into the scan. An unwatermarked copy would look considerably better at the
  size this site displays it.
- Three works are **under 1200px on the long edge** (`green-ground`,
  `the-child`, `the-fila`). They hold up in the catalogue grid but will soften
  in the full-screen lightbox. Re-shoot them if they matter.
- One supplied piece — a framed portrait photographed in the workshop — was
  **left out**. The artwork occupied only ~344×478px of a cluttered, angled
  snapshot with glass glare. It's worth re-photographing flat and adding.

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
    Hero.tsx             Cold open: one work, lights coming up
    Statement.tsx        Voice-over
    FeaturedSequence.tsx Pinned works with captions travelling past
    GalleryWall.tsx      Lateral tracking shot driven by vertical scroll
    Catalogue.tsx        Filterable grid of everything
    Process.tsx          Studio note over a parallaxing detail
    Contact.tsx          End card, enquiries, rights
    Lightbox.tsx         Full screen + zoom into the surface
    Nav.tsx              Chrome, which arrives late and quietly
  content/               ← the only files you normally edit
  lib/
    hooks.ts             useCinematic() — the motion budget gate
    lenis.ts             Shared scroll handle so overlays can freeze the page
scripts/
  images.mjs             The artwork pipeline
  prepare-source.mjs     One-off crops of the framed mockups (kept for reference)
  shots.mjs              Headless screenshots of every section
```

### On the motion

Every pinned or scroll-driven effect is gated behind `useCinematic()`, which
returns `false` below 768px **and** for anyone with `prefers-reduced-motion`
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
