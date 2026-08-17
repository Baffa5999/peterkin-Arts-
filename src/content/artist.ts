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
 *    Everything else here — name, location, contact, links — is real.
 *
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
  based: "FCT Abuja, Nigeria",

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
    email: "Peterkinpeter360@gmail.com",
    phone: "+234 810 011 2879",
    enquiries: "",
  },

  links: [{ label: "Instagram", href: "https://instagram.com/peterkin101" }],

  copyrightName: "Peterkin Arts",
};

/**
 * WhatsApp deep link, derived from the phone number above so there is
 * only ever one number to keep correct.
 *
 * wa.me wants the number in full international form with NO plus sign,
 * no spaces and no dashes — "+234 810 011 2879" has to become
 * "2348100112879" or the link opens WhatsApp on an empty chat.
 *
 * The prefilled message is a courtesy: it means the visitor does not
 * have to open with "hi" and explain where they found him.
 */
export const whatsappUrl = (() => {
  const digits = artist.contact.phone.replace(/\D/g, "");
  const text = encodeURIComponent(
    `Hello Peterkin, I found your portfolio online and would like to talk about your work.`,
  );
  return `https://wa.me/${digits}?text=${text}`;
})();
