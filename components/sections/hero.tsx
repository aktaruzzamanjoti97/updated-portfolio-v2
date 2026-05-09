"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePaperStore, type PaperConfig } from "@/store/paper-store";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const HERO_PAPERS: { id: string; config: PaperConfig }[] = [
  {
    id: "hero-1",
    config: {
      driftSpeed: 0.5, windSensitivity: 0.8, turbulence: 0.3,
      damping: 0.95, maxRotation: 8, width: 180, height: 100,
      initialX: 80, initialY: 80, initialRotation: -6, content: "PAPER-001",
    },
  },
  {
    id: "hero-2",
    config: {
      driftSpeed: 0.4, windSensitivity: 0.6, turbulence: 0.2,
      damping: 0.96, maxRotation: 6, width: 160, height: 80,
      initialX: 0, initialY: 0, initialRotation: 4, content: "WIND-VEC-03",
    },
  },
  {
    id: "hero-3",
    config: {
      driftSpeed: 0.3, windSensitivity: 0.7, turbulence: 0.25,
      damping: 0.94, maxRotation: 5, width: 190, height: 110,
      initialX: 0, initialY: 0, initialRotation: -3, content: "PAPER-007",
    },
  },
  {
    id: "hero-4",
    config: {
      driftSpeed: 0.6, windSensitivity: 0.5, turbulence: 0.35,
      damping: 0.93, maxRotation: 10, width: 130, height: 70,
      initialX: 0, initialY: 0, initialRotation: 7, content: "NOTE-012",
    },
  },
  {
    id: "hero-5",
    config: {
      driftSpeed: 0.7, windSensitivity: 0.9, turbulence: 0.4,
      damping: 0.92, maxRotation: 12, width: 90, height: 50,
      initialX: 0, initialY: 0, initialRotation: -10, content: "NOTE-015",
    },
  },
];

export function Hero() {
  const registerPaper = usePaperStore((s) => s.registerPaper);
  const removePaper = usePaperStore((s) => s.removePaper);
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    HERO_PAPERS.forEach((p) => {
      let x = p.config.initialX;
      let y = p.config.initialY;

      if (p.id === "hero-2") { x = vw - 260; y = 60; }
      else if (p.id === "hero-3") { x = vw - 280; y = vh * 0.35; }
      else if (p.id === "hero-4") { x = 120; y = vh - 200; }
      else if (p.id === "hero-5") { x = vw * 0.3; y = vh * 0.55; }

      const config = { ...p.config, initialX: x, initialY: y };
      registerPaper(p.id, "hero", config);
    });

    return () => {
      HERO_PAPERS.forEach((p) => removePaper(p.id));
    };
  }, [registerPaper, removePaper, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <div
        className="paper-label absolute top-4 left-4"
        style={{ color: "var(--label-color)" }}
      >
        [0, 0]
      </div>

      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div
          className="font-mono text-xs tracking-[0.25em] mb-3"
          style={{ color: "var(--label-color)" }}
        >
          // FRONTEND ENGINEER
        </div>
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          M. AKTARUZZAMAN
        </h1>
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          style={{ color: "var(--accent)" }}
        >
          JOTI
        </h1>
        <p
          className="mt-4 text-sm tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          Frontend Engineer crafting scalable, high-performance web experiences
        </p>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div
          className="w-px h-8 mx-auto mb-2"
          style={{
            background: "linear-gradient(to bottom, var(--accent), transparent)",
          }}
        />
        <div
          className="font-mono text-xs tracking-widest"
          style={{ color: "var(--label-color)" }}
        >
          SCROLL TO EXPLORE
        </div>
      </motion.div>

      <div
        className="absolute bottom-0 left-0 right-0 h-7 flex items-center justify-between px-4 font-mono"
        style={{
          background: "rgba(10, 22, 40, 0.8)",
          borderTop: "1px solid var(--border-paper)",
          color: "var(--label-color)",
          fontSize: "0.55rem",
        }}
      >
        <span>PAPER PHYSICS ENGINE v1.0</span>
        <span>WIND::CURSOR_DRIVEN | DAMPING: 0.95 | MAX: 30</span>
        <span>MOVE CURSOR TO INTERACT</span>
      </div>
    </section>
  );
}
