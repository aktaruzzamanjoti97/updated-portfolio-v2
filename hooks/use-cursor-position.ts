"use client";

import { useEffect } from "react";
import { usePaperStore } from "@/store/paper-store";

export function useCursorPosition() {
  const setCursorPosition = usePaperStore((s) => s.setCursorPosition);
  const windEnabled = usePaperStore((s) => s.windEnabled);

  useEffect(() => {
    if (!windEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setCursorPosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseLeave = () => {
      setCursorPosition(-1000, -1000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [setCursorPosition, windEnabled]);
}
