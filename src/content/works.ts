/**
 * THE CATALOGUE
 * ------------------------------------------------------------------
 * One entry per work. To add a new piece:
 *
 *   1. Drop the photograph into  /public/works/originals/
 *   2. Run  `npm run images`  (optimises + measures it, prints an entry)
 *   3. Paste the printed entry below and fill in the details
 *
 * ⚠  TITLES, YEARS AND MEDIA BELOW ARE WORKING PLACEHOLDERS.
 *    They were inferred from the photographs, their signatures and
 *    their file dates — not supplied by the artist. Peterkin should
 *    correct every one of them. Nothing here is guesswork the viewer
 *    can see through, but it is still guesswork.
 */

export type Work = {
  /** Filename without extension. Must match the image in /public/works. */
  slug: string;
  title: string;
  year: number;
  medium: string;
  /** Physical size, e.g. "120 × 90 cm". Leave empty until confirmed. */
  dimensions?: string;
  /** Grouping — powers the catalogue filters. */
  series?: string;
  /** One or two sentences in the artist's own voice. */
  note?: string;
  /** Pixel dimensions of the photograph. Set by `npm run images`. */
  width: number;
  height: number;
  /** Average colour — the placeholder shown while loading. */
  tint: string;
  /** Show in the featured cinematic sequence. Aim for 3–5. */
  featured?: boolean;
  status?: "available" | "sold" | "private collection";
};

export const works: Work[] = [
  {
    slug: "the-cap",
    title: "Man in a Flat Cap",
    year: 2025,
    medium: "Graphite and charcoal on paper",
    series: "Portraits",
    note: "Almost all of the drawing is in the beard and the reflections in the lenses — everything else is held back so those two can do the work.",
    width: 1588,
    height: 1836,
    tint: "#c8c8c8",
    featured: true,
  },
  {
    slug: "hand-to-temple",
    title: "Hand to Temple",
    year: 2021,
    medium: "Graphite and charcoal on paper",
    series: "Portraits",
    note: "A study in restraint: the print of the blouse is the only place the drawing is allowed to be loud.",
    width: 1424,
    height: 1860,
    tint: "#b8a8a8",
    featured: true,
  },
  {
    slug: "green-ground",
    title: "Green Ground",
    year: 2025,
    medium: "Acrylic on canvas",
    series: "Colour work",
    note: "A face assembled out of planes and arcs — the same subject as the portraits, taken apart and rebuilt in colour.",
    width: 962,
    height: 1132,
    tint: "#a8a838",
    featured: true,
  },
  {
    slug: "the-child",
    title: "The Child",
    year: 2019,
    medium: "Graphite and charcoal on paper",
    series: "Portraits",
    width: 931,
    height: 1080,
    tint: "#3a3a3a",
  },
  {
    slug: "the-fila",
    title: "Elder in Fila",
    year: 2022,
    medium: "Pastel on paper",
    series: "Colour work",
    width: 712,
    height: 841,
    tint: "#685848",
  },
];

/* ---------------------------------------------------------------- */

export const featuredWorks = works.filter((w) => w.featured);

export const series = Array.from(
  new Set(works.map((w) => w.series).filter(Boolean)),
) as string[];

export const years = Array.from(new Set(works.map((w) => w.year))).sort(
  (a, b) => b - a,
);

export const workSrc = (slug: string) => `/works/${slug}.jpg`;

/**
 * Builds the "2025 · Graphite on paper · 90 × 60 cm" line, skipping any
 * field that hasn't been filled in yet — so an unconfirmed dimension
 * never shows up as a dangling separator.
 */
export const workMeta = (work: Work, withYear = false) =>
  [withYear ? String(work.year) : null, work.medium, work.dimensions]
    .filter(Boolean)
    .join(" · ");
