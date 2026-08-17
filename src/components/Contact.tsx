"use client";

import { motion } from "framer-motion";
import { artist, whatsappUrl } from "@/content/artist";

/**
 * THE END CARD
 *
 * Enquiries. Large, plain, and easy to act on — the one place on the
 * site where we stop being atmospheric and make the next step obvious.
 */
export default function Contact() {
  const enquiries = artist.contact.enquiries || artist.contact.email;

  return (
    <footer
      id="contact"
      className="bg-void px-6 pt-28 pb-12 md:px-14 md:pt-44"
      aria-label="Contact"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="label">Enquiries</p>

        <a
          href={`mailto:${enquiries}`}
          className="display mt-7 block break-words text-[clamp(2rem,7.5vw,6rem)] text-paper transition-colors duration-500 hover:text-brass"
        >
          {enquiries}
        </a>

        {/* WhatsApp, given its own button. In Nigeria it is how most
            enquiries will actually arrive, so it gets more weight than a
            line of small caps. */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-8 inline-flex items-center gap-3 border border-rule px-6 py-4 transition-colors duration-300 hover:border-brass"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="h-5 w-5 fill-paper transition-colors duration-300 group-hover:fill-brass"
          >
            <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.79-1.67-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.6-.93-2.19-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46s1.06 2.86 1.21 3.06c.15.2 2.08 3.18 5.05 4.35.7.3 1.26.48 1.69.62.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.11.82.83-3.04-.19-.31a8.17 8.17 0 0 1-1.25-4.39c0-4.53 3.69-8.22 8.22-8.22 2.2 0 4.26.86 5.81 2.41a8.17 8.17 0 0 1 2.4 5.82c0 4.53-3.69 8.23-8.22 8.23Z" />
          </svg>
          <span className="label text-paper transition-colors duration-300 group-hover:text-brass">
            Message on WhatsApp
          </span>
        </a>

        <div className="mt-7 flex flex-col gap-2.5">
          {artist.contact.phone && (
            <a
              /* Strip spaces but keep the leading + so the tel: link
                 dials correctly from outside Nigeria. */
              href={`tel:${artist.contact.phone.replace(/[^\d+]/g, "")}`}
              className="label w-fit transition-colors hover:text-paper"
            >
              {artist.contact.phone}
            </a>
          )}
          <p className="label">{artist.based}</p>
        </div>
      </motion.div>

      <div className="mt-24 flex flex-col-reverse gap-8 border-t border-rule pt-8 md:flex-row md:items-center md:justify-between">
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
              className="label transition-colors hover:text-paper"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
