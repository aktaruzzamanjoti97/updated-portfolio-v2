import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { PaperCanvas } from "@/components/paper/paper-canvas";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <SmoothScroll>
      <PaperCanvas />
      <ThemeToggle />
      <main>
        <Hero />
      </main>
    </SmoothScroll>
  );
}
