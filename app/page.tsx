import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { PaperCanvas } from "@/components/paper/paper-canvas";

export default function Home() {
  return (
    <SmoothScroll>
      <PaperCanvas />
      <main>
        <section
          id="hero"
          className="relative min-h-screen flex items-center justify-center"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold">Portfolio Loading...</h1>
          </div>
        </section>
      </main>
    </SmoothScroll>
  );
}
