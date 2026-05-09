"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  label: string;
  name: string;
  description: string;
  fullDescription: string;
  tags: string[];
  github?: string;
  demo?: string;
  rotation: number;
}

const PROJECTS: Project[] = [
  {
    id: "prj-1", label: "PRJ-001", name: "Physics Engine",
    description: "Custom 2D wind simulation with cursor interaction",
    fullDescription: "A lightweight 2D physics engine built from scratch for interactive paper simulations. Features cursor-driven wind forces, turbulence modeling, and spring-based damping — all running at 60fps with zero React re-renders per frame.",
    tags: ["React", "TypeScript", "Canvas"], github: "#", demo: "#", rotation: -1,
  },
  {
    id: "prj-2", label: "PRJ-002", name: "Design System",
    description: "Component library with 40+ primitives and theming engine",
    fullDescription: "A comprehensive design system featuring 40+ accessible components, a multi-theme engine with CSS custom properties, and Storybook documentation. Used across 5 product teams with 99% adoption rate.",
    tags: ["React", "Storybook", "Tailwind"], github: "#", demo: "#", rotation: 0.5,
  },
  {
    id: "prj-3", label: "PRJ-003", name: "Animation Library",
    description: "Spring-based motion primitives for React",
    fullDescription: "A lightweight animation library providing spring-based motion primitives, gesture-driven interactions, and layout animations. Bundle size under 5KB gzipped with tree-shaking support.",
    tags: ["Motion", "TypeScript"], github: "#", rotation: 1.5,
  },
  {
    id: "prj-4", label: "PRJ-004", name: "Portfolio v2",
    description: "This site — physics-driven paper portfolio",
    fullDescription: "The portfolio you're currently viewing. A single-page experience featuring a custom wind physics engine, blueprint-themed design, and smooth scroll orchestration. Built to showcase advanced frontend capabilities.",
    tags: ["Next.js", "Framer Motion"], github: "#", demo: "#", rotation: -0.5,
  },
];

export function Projects() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [unfoldedId, setUnfoldedId] = useState<string | null>(null);

  return (
    <section ref={ref} id="projects" className="relative py-32 px-6 md:px-16 max-w-6xl mx-auto">
      <div className="font-mono text-xs tracking-[0.25em] mb-12" style={{ color: "var(--label-color)" }}>
        SECTION::PROJECTS
      </div>
      <h2 className="text-2xl font-bold mb-12" style={{ color: "var(--text-primary)" }}>Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROJECTS.map((project, i) => {
          const isUnfolded = unfoldedId === project.id;
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.02, rotate: 0, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
              className="paper-card p-5 rounded-sm cursor-pointer relative"
              style={{ transform: `rotate(${project.rotation}deg)` }}
              onClick={() => setUnfoldedId(isUnfolded ? null : project.id)}
            >
              <div className="paper-label mb-3">
                {project.label} | {isUnfolded ? "UNFOLDED" : "FOLDED"}
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: "var(--text-primary)" }}>{project.name}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {project.tags.map((tag) => (
                  <span key={tag} className="font-mono text-xs px-2 py-0.5 rounded-sm"
                    style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <AnimatePresence>
                {isUnfolded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border-paper)" }}>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{project.fullDescription}</p>
                      <div className="flex gap-4 mt-3">
                        {project.github && <span className="text-xs font-mono" style={{ color: "var(--accent)" }}>→ GitHub</span>}
                        {project.demo && <span className="text-xs font-mono" style={{ color: "var(--accent)" }}>→ Live Demo</span>}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute bottom-0 right-0" style={{
                width: "16px", height: "16px",
                background: "linear-gradient(135deg, transparent 50%, var(--accent-dim) 50%)",
              }} />
              {!isUnfolded && (
                <div className="absolute bottom-3 right-5 font-mono text-xs" style={{ color: "var(--label-color)" }}>→ unfold</div>
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="font-mono text-xs mt-8 text-right" style={{ color: "var(--label-color)" }}>
        CLICK TO UNFOLD | HOVER TO ELEVATE
      </div>
    </section>
  );
}
