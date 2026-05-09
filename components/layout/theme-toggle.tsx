"use client";

import { useThemeStore } from "@/store/theme-store";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 paper-card w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span className="text-base" style={{ color: "var(--accent)" }}>
        {theme === "dark" ? "☀" : "☾"}
      </span>
    </motion.button>
  );
}
