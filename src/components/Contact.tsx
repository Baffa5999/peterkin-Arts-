"use client";

import { motion } from "framer-motion";
import { artist } from "@/content/artist";

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

        {artist.contact.phone && (
          <a
            href={`tel:${artist.contact.phone.replace(/\s/g, "")}`}
            className="label mt-6 inline-block transition-colors hover:text-paper"
          >
            {artist.contact.phone}
          </a>
        )}
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
