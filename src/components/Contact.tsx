"use client";

import { motion } from "framer-motion";
import { artist, closing, whatsappUrl } from "@/content/artist";

/**
 * LET'S CREATE SOMETHING PERSONAL
 *
 * This used to be an email address set very large and not much else —
 * handsome, and passive. It now asks a question, invites the commission,
 * and lists the three ways to reach him as plain labelled rows rather
 * than as decoration.
 *
 * WhatsApp is the button because in Nigeria that is where the enquiries
 * will actually arrive. The email and the phone number are still real
 * links: mailto: and tel: respectively, so a tap does the obvious thing.
 */
export default function Contact() {
  const telHref = `tel:${artist.contact.phone.replace(/[^\d+]/g, "")}`;

  const details = [
    { label: "WhatsApp", value: artist.contact.phone, href: whatsappUrl, external: true },
    { label: "Email", value: artist.contact.email, href: `mailto:${artist.contact.email}` },
    { label: "Based in", value: artist.based },
  ];

  return (
    <footer
      id="contact"
      className="bg-void px-6 pt-28 pb-12 md:px-14 md:pt-40"
      aria-label="Contact"
    >
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12%" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-6xl"
      >
        <p className="label">Contact</p>

        <h2 className="display mt-5 max-w-3xl text-[clamp(2.4rem,6.5vw,5rem)]">
          {closing.heading}
        </h2>

        <p className="mt-8 font-display text-[clamp(1.5rem,3vw,2.25rem)] text-paper">
          {closing.lead}
        </p>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ash md:text-lg">
          {closing.body}
        </p>

        {/* The three ways to reach him ---------------------------- */}
        <p className="label mt-16">{closing.detailsTitle}</p>

        <dl className="mt-6 border-t border-rule">
          {details.map((d) => (
            <div
              key={d.label}
              className="flex flex-col gap-1 border-b border-rule py-5 md:flex-row md:items-baseline md:gap-10"
            >
              <dt className="label shrink-0 md:w-32">{d.label}</dt>
              <dd className="font-display text-lg break-words text-paper md:text-xl">
                {d.href ? (
                  <a
                    href={d.href}
                    {...(d.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-flex min-h-11 items-center transition-colors duration-300 hover:text-brass"
                  >
                    {d.value}
                  </a>
                ) : (
                  <span className="inline-flex min-h-11 items-center">
                    {d.value}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>

        {/* The one button that matters --------------------------- */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-flex min-h-14 items-center gap-3.5 bg-brass px-8 py-4 transition-colors duration-300 hover:bg-brass-lit"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-void">
            <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.79-1.67-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.6-.93-2.19-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46s1.06 2.86 1.21 3.06c.15.2 2.08 3.18 5.05 4.35.7.3 1.26.48 1.69.62.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.11.82.83-3.04-.19-.31a8.17 8.17 0 0 1-1.25-4.39c0-4.53 3.69-8.22 8.22-8.22 2.2 0 4.26.86 5.81 2.41a8.17 8.17 0 0 1 2.4 5.82c0 4.53-3.69 8.23-8.22 8.23Z" />
          </svg>
          <span className="label text-void">{closing.cta}</span>
        </a>

        {/* Kept, quietly: some people do still prefer to dial. */}
        <a
          href={telHref}
          className="label mt-6 flex min-h-11 w-fit items-center transition-colors hover:text-paper"
        >
          Or call {artist.contact.phone}
        </a>
      </motion.div>

      <div className="mx-auto mt-24 flex max-w-6xl flex-col-reverse gap-8 border-t border-rule pt-8 md:flex-row md:items-center md:justify-between">
        <p className="label normal-case tracking-normal">
          © {new Date().getFullYear()} {artist.copyrightName}. All works
          reproduced with the artist&rsquo;s permission. No image on this site
          may be reproduced without written consent.
        </p>

        <nav className="flex gap-7" aria-label="Elsewhere">
          {artist.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="label flex min-h-11 items-center transition-colors hover:text-paper"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
