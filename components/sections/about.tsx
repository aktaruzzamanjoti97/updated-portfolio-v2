"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function About() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="about"
      className="relative min-h-screen py-32 px-6 md:px-16 max-w-6xl mx-auto"
    >
      <div
        className="font-mono text-xs tracking-[0.25em] mb-12"
        style={{ color: "var(--label-color)" }}
      >
        SECTION::ABOUT
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <motion.div
          className="paper-card p-6 md:p-8 rounded-sm"
          style={{ transform: "rotate(-1deg)" }}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="paper-label mb-4">BIO-001 | PAPER</div>
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            About Me
          </h2>
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            Frontend engineer with 5+ years of experience building
            high-performance web applications. Specialized in interactive
            experiences, animation systems, and scalable React architectures.
          </p>
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            Passionate about pushing the boundaries of what&apos;s possible in
            the browser — from physics simulations to complex animation
            orchestration.
          </p>
          <div
            className="font-mono text-xs mt-4"
            style={{ color: "var(--accent)" }}
          >
            // Philosophy: Code as craft
          </div>
        </motion.div>

        <div className="flex flex-col gap-6">
          <motion.div
            className="paper-card p-5 rounded-sm"
            style={{ transform: "rotate(1.5deg)" }}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <div className="paper-label mb-3">FOCUS-AREA</div>
            <div
              className="text-sm leading-loose"
              style={{ color: "var(--text-secondary)" }}
            >
              <div><span style={{ color: "var(--accent)" }}>→</span> Interactive UI / Animation</div>
              <div><span style={{ color: "var(--accent)" }}>→</span> Performance Optimization</div>
              <div><span style={{ color: "var(--accent)" }}>→</span> Design Systems & Architecture</div>
              <div><span style={{ color: "var(--accent)" }}>→</span> Developer Experience Tooling</div>
            </div>
          </motion.div>

          <motion.div
            className="paper-card p-5 rounded-sm"
            style={{ transform: "rotate(-2deg)" }}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="paper-label mb-3">METRICS</div>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>5+</div>
                <div className="font-mono text-xs mt-1" style={{ color: "var(--text-muted)" }}>YEARS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>20+</div>
                <div className="font-mono text-xs mt-1" style={{ color: "var(--text-muted)" }}>PROJECTS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>50+</div>
                <div className="font-mono text-xs mt-1" style={{ color: "var(--text-muted)" }}>COMPONENTS</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
