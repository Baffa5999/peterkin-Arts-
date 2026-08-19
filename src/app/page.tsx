import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
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
      <Introduction />
      <Works />
      <About />
      <Contact />
    </main>
  );
}
