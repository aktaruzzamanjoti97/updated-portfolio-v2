"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const LINKS = [
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "Email", href: "mailto:hello@example.com" },
];

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="contact" className="relative py-32 px-6 md:px-16 max-w-4xl mx-auto">
      <div className="font-mono text-xs tracking-[0.25em] mb-12" style={{ color: "var(--label-color)" }}>
        SECTION::CONTACT
      </div>
      <motion.div
        className="paper-card p-8 md:p-10 rounded-sm max-w-lg mx-auto relative"
        style={{ transform: "rotate(-1deg)" }}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
      >
        <div className="paper-label mb-4">LETTER-001 | ENVELOPE</div>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Get In Touch</h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
          Have a project in mind or want to collaborate? Let&apos;s build something remarkable together.
        </p>
        <div className="flex flex-wrap gap-3">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="paper-card px-4 py-2 rounded-sm text-xs font-mono"
              style={{ color: "var(--accent)", borderColor: "var(--border-paper)", textDecoration: "none" }}
            >
              {link.label} →
            </a>
          ))}
        </div>
        <div className="absolute bottom-0 right-0" style={{
          width: "20px", height: "20px",
          background: "linear-gradient(135deg, transparent 50%, var(--accent-dim) 50%)",
        }} />
      </motion.div>
      <div className="text-center mt-16 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
        Designed &amp; built by M. Aktaruzzaman Joti
      </div>
    </section>
  );
}
