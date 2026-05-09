import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { PaperCanvas } from "@/components/paper/paper-canvas";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Engineering } from "@/components/sections/engineering";
import { Contact } from "@/components/sections/contact";
import { Navigation } from "@/components/layout/navigation";

export default function Home() {
  return (
    <SmoothScroll>
      <PaperCanvas />
      <ThemeToggle />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Engineering />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
