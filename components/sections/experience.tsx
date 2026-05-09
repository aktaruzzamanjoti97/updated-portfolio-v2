"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

interface Experience {
  id: string;
  label: string;
  role: string;
  company: string;
  period: string;
  summary: string;
  details: string[];
  rotation: number;
  side: "left" | "right";
}

const EXPERIENCES: Experience[] = [
  {
    id: "exp-1", label: "EXP-001", role: "Senior Frontend Engineer",
    company: "Tech Company", period: "2022 — Present",
    summary: "Led frontend architecture for 3 product lines, improving performance by 40%.",
    details: [
      "Architected micro-frontend system serving 2M+ users",
      "Built design system with 50+ components",
      "Mentored team of 5 junior developers",
      "Reduced bundle size by 60% through code splitting",
    ],
    rotation: 1, side: "left",
  },
  {
    id: "exp-2", label: "EXP-002", role: "Frontend Developer",
    company: "Another Company", period: "2019 — 2022",
    summary: "Built component library serving 50+ developers across multiple teams.",
    details: [
      "Developed shared component library with TypeScript",
      "Implemented automated visual regression testing",
      "Led migration from class components to hooks",
      "Improved CI/CD pipeline reducing deploy time by 70%",
    ],
    rotation: -1.5, side: "right",
  },
  {
    id: "exp-3", label: "EXP-003", role: "Junior Developer",
    company: "Startup Inc", period: "2017 — 2019",
    summary: "Full-stack development on SaaS platform, focusing on frontend interactions.",
    details: [
      "Built interactive dashboards with real-time data",
      "Implemented responsive email templates",
      "Contributed to open-source UI library",
    ],
    rotation: 2, side: "left",
  },
];

export function Experience() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section ref={ref} id="experience" className="relative py-32 px-6 md:px-16 max-w-6xl mx-auto">
      <div className="font-mono text-xs tracking-[0.25em] mb-12" style={{ color: "var(--label-color)" }}>
        SECTION::EXPERIENCE
      </div>
      <h2 className="text-2xl font-bold mb-16 text-center" style={{ color: "var(--text-primary)" }}>
        Experience
      </h2>
      <div className="relative">
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
          style={{ background: "linear-gradient(to bottom, var(--accent), var(--border-paper))" }}
        />
        <div className="space-y-12">
          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={exp.id}
              className={`relative flex ${exp.side === "left" ? "md:justify-start" : "md:justify-end"}`}
              initial={{ opacity: 0, x: exp.side === "left" ? -40 : 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: exp.side === "left" ? -40 : 40 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div
                className="absolute left-1/2 top-6 -translate-x-1/2 w-2 h-2 rounded-full hidden md:block"
                style={{ background: "var(--accent)", opacity: i === 0 ? 1 : 0.6, border: "2px solid var(--accent)" }}
              />
              <div className={`w-full md:w-5/12 ${exp.side === "left" ? "md:pr-12" : "md:pl-12"}`}>
                <div
                  className="paper-card p-5 rounded-sm cursor-pointer"
                  style={{ transform: `rotate(${exp.rotation}deg)` }}
                  onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                >
                  <div className="paper-label mb-3">{exp.label}</div>
                  <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{exp.role}</h3>
                  <div className="text-sm mt-1" style={{ color: "var(--accent)" }}>@ {exp.company}</div>
                  <div className="font-mono text-xs mt-2" style={{ color: "var(--text-muted)" }}>{exp.period}</div>
                  <p className="text-sm mt-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{exp.summary}</p>
                  <AnimatePresence>
                    {expandedId === exp.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border-paper)" }}>
                          <ul className="space-y-1">
                            {exp.details.map((detail, j) => (
                              <li key={j} className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                <span style={{ color: "var(--accent)" }}>→</span> {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="font-mono text-xs mt-8 text-right" style={{ color: "var(--label-color)" }}>
        CLICK CARD TO EXPAND | PAPERS SWAY ON SCROLL
      </div>
    </section>
  );
}
