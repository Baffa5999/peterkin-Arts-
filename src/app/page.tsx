import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import FeaturedSequence from "@/components/FeaturedSequence";
import GalleryWall from "@/components/GalleryWall";
import Catalogue from "@/components/Catalogue";
import Process from "@/components/Process";
import Contact from "@/components/Contact";

/**
 * The running order. Read top to bottom, this is the film:
 *
 *   cold open → voice-over → interview cuts → tracking shot
 *   → the catalogue → the studio → end card
 */
export default function Home() {
  return (
    <main id="top">
      <Nav />
      <Hero />
      <Statement />
      <FeaturedSequence />
      <GalleryWall />
      <Catalogue />
      <Process />
      <Contact />
    </main>
  );
}
