import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Works from "@/components/Works";
import About from "@/components/About";
import Contact from "@/components/Contact";

/**
 * The running order: a cold open, then three sections.
 */
export default function Home() {
  return (
    <main id="top">
      <Nav />
      <Hero />
      <Works />
      <About />
      <Contact />
    </main>
  );
}
