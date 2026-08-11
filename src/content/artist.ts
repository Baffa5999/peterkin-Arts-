/**
 * ARTIST PROFILE
 * ------------------------------------------------------------------
 * Everything about the artist lives here. Edit this file — never the
 * components — to change names, biography, contact details or links.
 *
 * ⚠  The statement and process paragraphs below are PLACEHOLDER COPY
 *    written to the right length so the layout could be judged. They
 *    are not Peterkin's words. Replace them before the site goes live
 *    — a portfolio in someone else's voice is worse than no statement.
 *
 * ⚠  `based` and `contact.email` still need real values.
 */

export type Artist = {
  name: string;
  discipline: string;
  based: string;
  tagline: string;
  statement: string[];
  process: string[];
  contact: { email: string; phone: string; enquiries: string };
  links: { label: string; href: string }[];
  copyrightName: string;
};

export const artist: Artist = {
  name: "Peterkin Arts",
  discipline: "Portraits in graphite and colour",
  based: "Nigeria",

  /* The opening shot is now the cubist canvas, so this line has to
     carry both practices — a graphite-only tagline read as a caption
     for the wrong painting. */
  tagline: "A face held close in graphite, then taken apart in colour.",

  statement: [
    "The work is portraiture, mostly in graphite and charcoal, worked to the point where the paper disappears and only the person is left. A beard becomes thousands of separate marks. A lens becomes a small room reflected back at you.",
    "Alongside the drawings there is a second, louder body of work in colour — the same faces taken apart into planes, arcs and flat blocks of acrylic. The two practices are not opposites. They are the same interest in a face, approached from either end.",
  ],

  process: [
    "Each portrait is built up in layers over days rather than hours, starting from the darkest masses and working outward. Nothing is outlined; edges are found by putting tone next to tone until the shape arrives on its own.",
  ],

  contact: {
    email: "hello@peterkinarts.com",
    phone: "",
    enquiries: "",
  },

  links: [{ label: "Instagram", href: "https://instagram.com/peterkin101" }],

  copyrightName: "Peterkin Arts",
};
