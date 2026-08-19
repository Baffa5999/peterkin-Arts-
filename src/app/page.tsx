import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Works from "@/components/Works";
import Commission from "@/components/Commission";
import About from "@/components/About";
import Contact from "@/components/Contact";

/**
 * The running order, front-loaded for a visitor who has never heard of
 * him: who he is and what to do next, what the work is for, the work
 * itself, the commission, the artist, then how to reach him.
 */
export default function Home() {
  return (
    <main id="top">
      <Nav />
      <Hero />
      <Intro />
      <Works />
      <Commission />
      <About />
      <Contact />
    </main>
  );
}
