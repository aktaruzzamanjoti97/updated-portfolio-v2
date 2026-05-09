"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface SkillNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: "category" | "skill";
  proficiency: number;
  connections: string[];
}

const SKILLS: SkillNode[] = [
  { id: "frontend", label: "FRONTEND", x: 5, y: 30, type: "category", proficiency: 95, connections: ["react", "nextjs", "typescript"] },
  { id: "react", label: "React", x: 25, y: 15, type: "skill", proficiency: 92, connections: [] },
  { id: "nextjs", label: "Next.js", x: 48, y: 25, type: "skill", proficiency: 88, connections: [] },
  { id: "typescript", label: "TypeScript", x: 35, y: 55, type: "skill", proficiency: 90, connections: [] },
  { id: "styling", label: "STYLING", x: 65, y: 10, type: "category", proficiency: 90, connections: ["tailwind", "framer"] },
  { id: "tailwind", label: "Tailwind CSS", x: 70, y: 35, type: "skill", proficiency: 95, connections: [] },
  { id: "framer", label: "Framer Motion", x: 85, y: 20, type: "skill", proficiency: 85, connections: [] },
  { id: "tools", label: "TOOLS", x: 55, y: 65, type: "category", proficiency: 85, connections: ["git", "zustand"] },
  { id: "git", label: "Git", x: 78, y: 55, type: "skill", proficiency: 88, connections: [] },
  { id: "zustand", label: "Zustand", x: 40, y: 80, type: "skill", proficiency: 80, connections: [] },
];

export function Skills() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <section
      ref={ref}
      id="skills"
      className="relative min-h-screen py-32 px-6 md:px-16 max-w-6xl mx-auto"
    >
      <div
        className="font-mono text-xs tracking-[0.25em] mb-12"
        style={{ color: "var(--label-color)" }}
      >
        SECTION::SKILLS
      </div>

      <h2
        className="text-2xl font-bold mb-8"
        style={{ color: "var(--text-primary)" }}
      >
        Skills & Technologies
      </h2>

      <div className="relative w-full" style={{ height: "400px" }}>
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          {SKILLS.filter((s) => s.type === "category").map((cat) =>
            cat.connections.map((targetId) => {
              const target = SKILLS.find((s) => s.id === targetId);
              if (!target) return null;
              return (
                <motion.line
                  key={`${cat.id}-${targetId}`}
                  x1={`${cat.x}%`}
                  y1={`${cat.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  stroke="var(--border-paper)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              );
            })
          )}
        </svg>

        {SKILLS.map((node, i) => (
          <motion.div
            key={node.id}
            className="absolute"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: hoveredNode === node.id ? 10 : 1,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4, delay: 0.1 * i }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <div
              className={`paper-card px-3 py-2 rounded-sm cursor-default ${
                node.type === "category" ? "px-4 py-3" : ""
              }`}
              style={{
                borderColor: hoveredNode === node.id ? "var(--accent)" : "var(--border-paper)",
              }}
            >
              <div
                className={`font-mono ${node.type === "category" ? "text-xs font-bold" : "text-xs"}`}
                style={{
                  color: node.type === "category" ? "var(--accent)" : "var(--text-secondary)",
                }}
              >
                {node.label}
              </div>

              {hoveredNode === node.id && (
                <motion.div
                  className="mt-2 pt-2"
                  style={{ borderTop: "1px solid var(--border-paper)" }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                    proficiency: {"█".repeat(Math.round(node.proficiency / 10))}
                    {"░".repeat(10 - Math.round(node.proficiency / 10))}{" "}
                    {node.proficiency}%
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div
        className="font-mono text-xs mt-8 text-right"
        style={{ color: "var(--label-color)" }}
      >
        HOVER NODES FOR DETAILS | CONNECTIONS ANIMATE ON SCROLL
      </div>
    </section>
  );
}
