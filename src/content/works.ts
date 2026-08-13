/**
 * THE CATALOGUE
 * ------------------------------------------------------------------
 * One entry per work. To add a new piece:
 *
 *   1. Drop the photograph into  /public/works/originals/
 *   2. Run  `npm run images`  (optimises + measures it, prints an entry)
 *   3. Paste the printed entry below and fill in the details
 *
 * ⚠  TITLES, YEARS AND MEDIA ARE WORKING PLACEHOLDERS.
 *    Years are inferred from signatures on the work and from file
 *    dates; media from how the surface reads in the photograph.
 *    Peterkin should correct every one of them.
 */

export type Work = {
  /** Filename without extension. Must match the image in /public/works. */
  slug: string;
  title: string;
  year: number;
  medium: string;
  /** Physical size, e.g. "120 × 90 cm". Leave empty until confirmed. */
  dimensions?: string;
  /** One or two sentences in the artist's own voice. */
  note?: string;
  /** Pixel dimensions of the photograph. Set by `npm run images`. */
  width: number;
  height: number;
  /** Average colour — the placeholder shown while loading. */
  tint: string;
  /** The poster frame behind the hero film. Exactly one work. */
  hero?: boolean;
  status?: "available" | "sold" | "private collection";
};

export const works: Work[] = [
  {
    slug: "the-suit",
    title: "Man in a Dark Suit",
    year: 2023,
    medium: "Graphite and charcoal on paper",
    width: 1665,
    height: 2400,
    tint: "#282828",
    hero: true,
  },
  {
    slug: "the-lapel-pin",
    title: "The Lapel Pin",
    year: 2023,
    medium: "Graphite and charcoal on paper",
    width: 1878,
    height: 2400,
    tint: "#c8c8c8",
  },
  {
    slug: "braids",
    title: "Braids",
    year: 2022,
    medium: "Graphite and charcoal on paper",
    width: 1751,
    height: 2400,
    tint: "#281818",
  },
  {
    slug: "the-turban",
    title: "White Turban",
    year: 2020,
    medium: "Graphite and charcoal on paper",
    width: 610,
    height: 820,
    tint: "#686868",
  },
  {
    slug: "ankara",
    title: "Ankara",
    year: 2025,
    medium: "Acrylic on canvas",
    width: 2400,
    height: 2003,
    tint: "#081828",
  },
  {
    slug: "saxophone",
    title: "Saxophone",
    year: 2025,
    medium: "Acrylic on canvas",
    width: 1203,
    height: 2400,
    tint: "#081828",
  },
  {
    slug: "the-dance",
    title: "The Dance",
    year: 2025,
    medium: "Oil on canvas",
    width: 1653,
    height: 2400,
    tint: "#384858",
  },
  {
    slug: "the-cello",
    title: "Strings",
    year: 2025,
    medium: "Oil on canvas",
    width: 1560,
    height: 2330,
    tint: "#d8c898",
  },
  {
    slug: "two-faces",
    title: "Two Faces",
    year: 2024,
    medium: "Acrylic on canvas",
    width: 1532,
    height: 2400,
    tint: "#989898",
  },
  {
    slug: "the-hat",
    title: "The Wide Hat",
    year: 2025,
    medium: "Acrylic on canvas",
    width: 610,
    height: 1155,
    tint: "#b8a898",
  },
];

/* ---------------------------------------------------------------- */

/** The poster frame behind the hero film. */
export const heroWork = works.find((w) => w.hero) ?? works[0];

export const workSrc = (slug: string) => `/works/${slug}.jpg`;

/**
 * Builds the "2025 · Acrylic on canvas · 90 × 60 cm" line, skipping any
 * field that hasn't been filled in yet — so an unconfirmed dimension
 * never shows up as a dangling separator.
 */
export const workMeta = (work: Work, withYear = false) =>
  [withYear ? String(work.year) : null, work.medium, work.dimensions]
    .filter(Boolean)
    .join(" · ");
