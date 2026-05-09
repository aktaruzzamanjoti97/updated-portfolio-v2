"use client";

import { useEffect, useRef } from "react";
import { usePaperStore } from "@/store/paper-store";
import { useCursorPosition } from "@/hooks/use-cursor-position";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function PaperEngine() {
  const updatePositions = usePaperStore((s) => s.updatePositions);
  const setWindEnabled = usePaperStore((s) => s.setWindEnabled);
  const reducedMotion = useReducedMotion();
  const frameRef = useRef<number>(0);

  useCursorPosition();

  useEffect(() => {
    if (reducedMotion) {
      setWindEnabled(false);
      return;
    }

    const checkViewport = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setWindEnabled(false);
      } else {
        setWindEnabled(true);
      }
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);

    const loop = () => {
      updatePositions();
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener("resize", checkViewport);
    };
  }, [reducedMotion, updatePositions, setWindEnabled]);

  return null;
}
