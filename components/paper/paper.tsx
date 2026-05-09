"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { Paper as PaperType } from "@/store/paper-store";

interface PaperProps {
  paper: PaperType;
}

export function Paper({ paper }: PaperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(paper.x);
  const y = useMotionValue(paper.y);
  const rotation = useMotionValue(paper.rotation);

  useEffect(() => {
    x.set(paper.x);
    y.set(paper.y);
    rotation.set(paper.rotation);
  }, [paper.x, paper.y, paper.rotation, x, y, rotation]);

  return (
    <motion.div
      ref={ref}
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: paper.width,
        height: paper.height,
        rotate: rotation,
        willChange: "transform",
        zIndex: paper.zIndex,
        pointerEvents: "none",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: paper.opacity, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      <div className="paper-card h-full p-2 rounded-sm">
        <div className="paper-label">{paper.config.content}</div>
      </div>
    </motion.div>
  );
}
