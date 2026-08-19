"use client";

import { motion } from "framer-motion";
import { commission, commissionWhatsappUrl } from "@/content/artist";

/**
 * COMMISSION
 *
 * The only section on the site that asks the visitor for something, so
 * it is the only one allowed to look like a sales page: a clear offer,
 * three media, five numbered steps, one unmissable button.
 *
 * It sits between Works and About deliberately — the ask lands while
 * the visitor is still holding the impression the paintings made, not
 * after a biography has cooled it off.
 *
 * The brass from the artist's own logo is used at full strength here for
 * the first time. Everywhere else it is a hover state or a single
 * italic word; a filled brass button is the one moment on a near-black
 * site that should read unambiguously as "press this".
 */
export default function Commission() {
  return (
    <section
      id="commission"
      className="bg-wall px-6 py-28 md:px-14 md:py-40"
      aria-label="Commission a portrait"
    >
      <div className="mx-auto max-w-6xl">
        {/* The offer -------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="label">Commission</p>

          <h2 className="display mt-5 max-w-3xl text-[clamp(2.4rem,6vw,4.75rem)]">
            {commission.heading}
          </h2>

          <p className="mt-8 max-w-2xl font-display text-[clamp(1.35rem,2.4vw,2rem)] leading-[1.35] text-paper">
            {commission.intro[0]}
          </p>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ash md:text-lg">
            {commission.intro[1]}
          </p>
        </motion.div>

        {/* Available in --------------------------------------------- */}
        <div className="mt-20 md:mt-24">
          <p className="label">{commission.mediaTitle}</p>

          <div className="mt-8 grid gap-px border-t border-rule md:grid-cols-3">
            {commission.media.map((medium, i) => (
              <motion.div
                key={medium.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                /* A hairline between the columns on desktop and between
                   the rows on phones — the rule follows the axis the
                   cards actually stack on. */
                className="border-b border-rule py-7 md:border-b-0 md:border-r md:pr-8 md:last:border-r-0"
              >
                <h3 className="font-display text-2xl text-paper md:text-[1.75rem]">
                  {medium.name}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-ash md:text-base">
                  {medium.note}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How it works -------------------------------------------- */}
        <div className="mt-20 md:mt-24">
          <p className="label">{commission.stepsTitle}</p>

          {/* A real ordered list: the numbering is content, not
              decoration, so it should survive with styles off. */}
          <ol className="mt-8 border-t border-rule">
            {commission.steps.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-6%" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col gap-1.5 border-b border-rule py-6 md:flex-row md:items-baseline md:gap-10"
              >
                <span className="label shrink-0 text-brass md:w-24">
                  {String(i + 1).padStart(2, "0")} —
                </span>
                <span className="flex-1">
                  <span className="block font-display text-xl text-paper md:text-2xl">
                    {step.title}
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-ash md:text-base">
                    {step.note}
                  </span>
                </span>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* The ask ------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14"
        >
          <a
            href={commissionWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-14 items-center gap-3.5 bg-brass px-8 py-4 text-void transition-colors duration-300 hover:bg-brass-lit"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-void">
              <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.79-1.67-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.6-.93-2.19-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46s1.06 2.86 1.21 3.06c.15.2 2.08 3.18 5.05 4.35.7.3 1.26.48 1.69.62.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.11.82.83-3.04-.19-.31a8.17 8.17 0 0 1-1.25-4.39c0-4.53 3.69-8.22 8.22-8.22 2.2 0 4.26.86 5.81 2.41a8.17 8.17 0 0 1 2.4 5.82c0 4.53-3.69 8.23-8.22 8.23Z" />
            </svg>
            <span className="label text-void">{commission.cta}</span>
          </a>

          <p className="label mt-4 normal-case tracking-normal">
            Opens a WhatsApp message to the artist.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
