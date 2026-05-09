"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Metric {
  label: string;
  value: string;
  percent: number;
  color: string;
}

const METRICS: Metric[] = [
  { label: "Lighthouse Score", value: "98/100", percent: 98, color: "var(--accent)" },
  { label: "Bundle Size (gzipped)", value: "45KB", percent: 35, color: "var(--accent)" },
  { label: "First Contentful Paint", value: "0.8s", percent: 85, color: "#4ade80" },
  { label: "Animation FPS Target", value: "60fps", percent: 100, color: "#4ade80" },
];

export function Engineering() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="engineering" className="relative py-32 px-6 md:px-16 max-w-6xl mx-auto">
      <div className="font-mono text-xs tracking-[0.25em] mb-12" style={{ color: "var(--label-color)" }}>
        SECTION::ENGINEERING
      </div>
      <h2 className="text-2xl font-bold mb-12" style={{ color: "var(--text-primary)" }}>Engineering Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8">
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="flex justify-between text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                <span>{metric.label}</span>
                <span style={{ color: metric.color }}>{metric.value}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--accent-dim)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: metric.color }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${metric.percent}%` } : { width: 0 }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="paper-card p-6 rounded-sm"
          style={{ transform: "rotate(1deg)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="paper-label mb-4">ENG-PHILOSOPHY</div>
          <h3 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>Engineering Principles</h3>
          <div className="text-sm leading-loose space-y-2" style={{ color: "var(--text-secondary)" }}>
            <div><span style={{ color: "var(--accent)" }}>01.</span> Performance is a feature, not an afterthought</div>
            <div><span style={{ color: "var(--accent)" }}>02.</span> Every pixel should serve a purpose</div>
            <div><span style={{ color: "var(--accent)" }}>03.</span> Accessibility is non-negotiable</div>
            <div><span style={{ color: "var(--accent)" }}>04.</span> Code should communicate intent clearly</div>
            <div><span style={{ color: "var(--accent)" }}>05.</span> Measure everything, assume nothing</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
