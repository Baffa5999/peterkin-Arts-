/**
 * THE CATALOGUE
 * ------------------------------------------------------------------
 * One entry per work. To add a new piece:
 *
 *   1. Drop the photograph into  /public/works/originals/
 *   2. Run  `npm run images`  (optimises + measures it, prints an entry)
 *   3. Paste the printed entry below and fill in the details
 *
 * Titles, years, media, captions and the "Word of the Artist" lines
 * were all supplied by the artist on 14 Aug 2026. They are no longer
 * inferred — do not overwrite them with guesses.
 *
 * The `slug` is the image filename and is NOT the title: "ankara" and
 * "the-turban" were renamed to "Mosaic of Soul" and "Emir" on 17 Aug.
 * Leaving the slugs alone keeps the photographs, the film build and the
 * catalogue in step; only the displayed title changed.
 */

export type Work = {
  /** Filename without extension. Must match the image in /public/works. */
  slug: string;
  title: string;
  year: number;
  medium: string;
  /** Physical size, e.g. "120 × 90 cm". Leave empty until confirmed. */
  dimensions?: string;
  /** Shown directly under the image in the Works grid. */
  caption?: string;
  /** "Word of the Artist" — shown after the caption and in the lightbox. */
  artistWord?: string;
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
    caption: "Quiet confidence held in a single look.",
    artistWord:
      "I start with the darkest places and work outward until the face arrives on its own.",
  },
  {
    slug: "the-lapel-pin",
    title: "The Lapel Pin",
    year: 2023,
    medium: "Graphite and charcoal on paper",
    width: 1882,
    height: 2400,
    tint: "#c8c8c8",
    caption: "A small detail that carries the whole presence.",
    artistWord:
      "Nothing is outlined. Edges are found by putting tone next to tone.",
  },
  {
    slug: "braids",
    title: "Braids",
    year: 2022,
    medium: "Graphite and charcoal on paper",
    width: 1758,
    height: 2400,
    tint: "#281818",
    caption: "Hair as architecture. Light caught in every strand.",
    artistWord:
      "The braids took longer than the face. Every strand has to travel the right way.",
  },
  {
    slug: "the-turban",
    title: "Emir",
    year: 2020,
    medium: "Graphite and charcoal on paper",
    width: 862,
    height: 1080,
    tint: "#080808",
    caption: "Soft fabric, hard attention.",
    artistWord:
      "I want the paper to disappear. Only the person should remain.",
  },
  {
    slug: "ankara",
    title: "Mosaic of Soul",
    year: 2025,
    medium: "Acrylic on canvas",
    width: 2400,
    height: 2038,
    tint: "#d8d8d8",
    caption: "Pattern and face speaking at the same volume.",
    artistWord:
      "The colour work is not the opposite of the drawings. It is the same face approached from the other end.",
  },
  {
    slug: "saxophone",
    title: "Saxophone",
    year: 2025,
    medium: "Acrylic on canvas",
    width: 1249,
    height: 2400,
    tint: "#081828",
    caption: "Sound made visible.",
    artistWord:
      "Every portrait is built in layers over days. Rushing it only makes it thinner.",
  },
  {
    slug: "the-dance",
    title: "The Dance",
    year: 2025,
    medium: "Oil on canvas",
    width: 1693,
    height: 2400,
    tint: "#384858",
    caption: "Movement frozen just long enough to see it.",
    artistWord:
      "I start with the darkest places and work outward until the face arrives on its own.",
  },
  {
    slug: "the-cello",
    title: "Anatomy of Music",
    year: 2025,
    medium: "Oil on canvas",
    width: 1698,
    height: 2400,
    tint: "#e8e8e8",
    caption: "Tension held in colour.",
    artistWord:
      "Here the outline does the work: black lines first, then colour poured into the shapes.",
  },
  {
    slug: "two-faces",
    title: "Two Faces",
    year: 2024,
    medium: "Acrylic on canvas",
    width: 1532,
    height: 2400,
    tint: "#989898",
    caption: "One person, two ways of being seen.",
    artistWord:
      "The colour work is not the opposite of the drawings. It is the same face approached from the other end.",
  },
  {
    slug: "the-hat",
    title: "The Wide Hat",
    year: 2025,
    medium: "Acrylic on canvas",
    width: 708,
    height: 1244,
    tint: "#e8e8d8",
    caption: "Shadow as another kind of portrait.",
    artistWord:
      "The hat holds the whole figure together. Everything below it is movement.",
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
