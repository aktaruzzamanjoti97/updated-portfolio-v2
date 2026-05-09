"use client";

import { AnimatePresence } from "framer-motion";
import { usePaperStore } from "@/store/paper-store";
import { Paper } from "./paper";
import { PaperEngine } from "./paper-engine";

export function PaperCanvas() {
  const papers = usePaperStore((s) => s.papers);

  return (
    <>
      <PaperEngine />
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 5,
        }}
      >
        <AnimatePresence>
          {papers
            .filter((p) => p.visible)
            .map((paper) => (
              <Paper key={paper.id} paper={paper} />
            ))}
        </AnimatePresence>
      </div>
    </>
  );
}
