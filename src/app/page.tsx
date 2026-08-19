import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Works from "@/components/Works";
import Commission from "@/components/Commission";
import About from "@/components/About";
import Contact from "@/components/Contact";

/**
 * The running order: a cold open, then the work, then the ask, then the
 * artist, then how to reach him. Commission sits before About on
 * purpose — the ask lands while the paintings are still fresh.
 */
export default function Home() {
  return (
    <main id="top">
      <Nav />
      <Hero />
      <Works />
      <Commission />
      <About />
      <Contact />
    </main>
  );
}
