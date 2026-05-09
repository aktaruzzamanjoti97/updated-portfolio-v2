"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "engineering", label: "Engineering" },
  { id: "contact", label: "Contact" },
];

export function Navigation() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive(id);
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
      {SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className="group relative flex items-center justify-end"
          aria-label={`Go to ${label}`}
        >
          <span
            className="absolute right-6 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
            style={{ color: "var(--text-muted)" }}
          >
            {label}
          </span>
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{
              background:
                active === id ? "var(--accent)" : "var(--border-paper)",
              border: `1px solid ${
                active === id ? "var(--accent)" : "var(--border-paper)"
              }`,
            }}
            animate={{
              scale: active === id ? 1.4 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
        </button>
      ))}
    </nav>
  );
}
