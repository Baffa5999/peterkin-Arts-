/**
 * ARTIST PROFILE
 * ------------------------------------------------------------------
 * Everything about the artist lives here. Edit this file — never the
 * components — to change the biography, the commission copy, contact
 * details or links.
 *
 * Every word below is the artist's own, supplied 19 Aug 2026. Nothing
 * here is placeholder any more.
 */

export type Artist = {
  name: string;
  discipline: string;
  based: string;
  tagline: string;
  /** "Meet the Artist" — the About section, in order. */
  about: string[];
  contact: { email: string; phone: string; enquiries: string };
  links: { label: string; href: string }[];
  copyrightName: string;
};

export const artist: Artist = {
  name: "Peterkin Arts",
  discipline: "Portraits in graphite and colour",
  based: "FCT Abuja, Nigeria",

  /* The opening shot is the cubist canvas, so this line has to carry
     both practices — a graphite-only tagline read as a caption for the
     wrong painting. */
  tagline: "A face held close in graphite, then taken apart in colour.",

  about: [
    "Peterkin is a Nigerian artist based in Abuja, working mostly in portraiture — graphite, charcoal, acrylic, and oil.",
    "The graphite and charcoal drawings are where he spends most of his patience: dense, detailed, built up slowly until the paper disappears under the marks. The colour work moves faster and looser — the same faces, but pulled apart into shape and colour instead of held together in fine detail.",
    "Whichever medium he's working in, the aim stays the same: not just getting the face right, but getting the person right.",
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
 * COMMISSIONS
 * ------------------------------------------------------------------
 * The artist's own words, verbatim. The media and the steps are data
 * rather than markup so the section can gain or lose one without
 * anybody touching a component.
 */
export const commission = {
  heading: "Commission a Portrait",
  intro: [
    "Turn a meaningful photograph into a work of art.",
    "Whether it is a portrait of yourself, a loved one, a family member or someone whose memory deserves to be preserved, Peterkin Arts creates custom portraits designed to become lasting pieces of art.",
  ],

  mediaTitle: "Available in",
  media: [
    {
      name: "Graphite & Charcoal",
      note: "Detailed monochromatic portraits with exceptional attention to texture and expression.",
    },
    {
      name: "Acrylic",
      note: "Contemporary portraits with expressive colour and bold visual character.",
    },
    {
      name: "Oil",
      note: "Rich, layered paintings created for a timeless and sophisticated finish.",
    },
  ],

  stepsTitle: "How It Works",
  steps: [
    {
      title: "Send Your Reference",
      note: "Send your preferred photograph through WhatsApp.",
    },
    {
      title: "Choose Your Medium",
      note: "Select graphite, charcoal, acrylic or oil.",
    },
    {
      title: "Confirm Your Artwork",
      note: "We'll discuss size, composition, pricing and timeline.",
    },
    {
      title: "Your Portrait Is Created",
      note: "Your artwork is carefully developed layer by layer.",
    },
    {
      title: "Delivery",
      note: "Your completed artwork is prepared and delivered.",
    },
  ],

  cta: "Start Your Commission",
} as const;

/**
 * WhatsApp deep links, derived from the phone number above so there is
 * only ever one number to keep correct.
 *
 * wa.me wants the number in full international form with NO plus sign,
 * no spaces and no dashes — "+234 810 011 2879" has to become
 * "2348100112879", or the link opens WhatsApp on an empty chat: a
 * failure that looks exactly like success.
 *
 * Two links, one number. The prefilled text differs so a commission
 * lead is distinguishable from a general enquiry the moment it lands,
 * and so the visitor never has to open with "hi" and explain where they
 * found him.
 */
const waLink = (message: string) => {
  const digits = artist.contact.phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
};

export const whatsappUrl = waLink(
  "Hello Peterkin, I found your portfolio online and would like to talk about your work.",
);

export const commissionWhatsappUrl = waLink(
  "Hello Peterkin, I would like to commission a portrait.",
);
