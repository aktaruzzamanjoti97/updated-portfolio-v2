# Physics-Inspired Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page portfolio with a custom wind physics engine, blueprint-themed design, and 7 interactive content sections.

**Architecture:** Single-page scroll using Lenis. A global paper physics engine (custom TypeScript + Framer Motion `useMotionValue`) runs as a fixed overlay. Sections register papers via a Zustand store. Each section is self-contained with scroll-triggered animations.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Framer Motion, Zustand, Lenis

**Spec:** `docs/superpowers/specs/2026-05-09-physics-portfolio-design.md`

---

## File Map

### Created Files

| File | Responsibility |
|------|---------------|
| `app/globals.css` | Tailwind imports, CSS custom properties (dark/light themes), blueprint grid styles |
| `app/layout.tsx` | Root layout with fonts, metadata, Lenis provider, theme class, PaperCanvas |
| `app/page.tsx` | Single-page composition rendering all sections in order |
| `store/theme-store.ts` | Zustand store: theme mode, toggle function, localStorage persistence |
| `store/paper-store.ts` | Zustand store: papers array, cursor position, register/remove/update functions |
| `hooks/use-cursor-position.ts` | Tracks mouse/touch position, updates paper store on move |
| `hooks/use-reduced-motion.ts` | Returns boolean from `prefers-reduced-motion` media query |
| `components/paper/paper.tsx` | Single paper element — motion.div driven by MotionValues |
| `components/paper/paper-canvas.tsx` | Fixed overlay container rendering all active Paper components |
| `components/paper/paper-engine.tsx` | rAF loop computing physics updates on all papers |
| `components/sections/hero.tsx` | Full-viewport hero with centered name and floating papers |
| `components/sections/about.tsx` | Two-column bio section with paper cards |
| `components/sections/skills.tsx` | Node graph with category/skill nodes and SVG connections |
| `components/sections/experience.tsx` | Vertical timeline with alternating paper cards |
| `components/sections/projects.tsx` | 2x2 grid of unfold-on-click project cards |
| `components/sections/engineering.tsx` | Animated progress bars for performance metrics |
| `components/sections/contact.tsx` | Centered paper letter with social links |
| `components/layout/navigation.tsx` | Fixed dot indicators for section navigation |
| `components/layout/theme-toggle.tsx` | Floating sun/moon button to switch themes |

### Modified Files

| File | Change |
|------|--------|
| `package.json` | Add framer-motion, zustand, lenis, clsx, tailwind-merge, class-variance-authority, @radix-ui/react-slot |

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install all required packages**

```bash
npm install framer-motion zustand lenis clsx tailwind-merge class-variance-authority @radix-ui/react-slot
```

- [ ] **Step 2: Verify installation**

```bash
npm ls framer-motion zustand lenis clsx tailwind-merge class-variance-authority @radix-ui/react-slot --depth=0
```

Expected: All packages listed with their versions, no errors.

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts on localhost:3000 with no errors. Kill after confirming.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install framer-motion, zustand, lenis, clsx, tailwind-merge, cva, radix-slot"
```

---

## Task 2: Theme System + Global Styles

**Files:**
- Create: `store/theme-store.ts`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create theme store**

Create `store/theme-store.ts`:

```typescript
import { create } from "zustand";

type Theme = "dark" | "light";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: "dark",
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        localStorage.setItem("portfolio-theme", next);
        document.documentElement.classList.toggle("light", next === "light");
      }
      return { theme: next };
    }),
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio-theme", theme);
      document.documentElement.classList.toggle("light", theme === "light");
    }
    set({ theme });
  },
}));
```

- [ ] **Step 2: Rewrite globals.css with theme variables and blueprint grid**

Replace `app/globals.css` entirely:

```css
@import "tailwindcss";

:root {
  --bg-primary: #0a1628;
  --bg-paper: rgba(30, 58, 95, 0.7);
  --border-grid: rgba(59, 130, 246, 0.06);
  --border-grid-major: rgba(59, 130, 246, 0.12);
  --border-paper: rgba(59, 130, 246, 0.3);
  --text-primary: #bfdbfe;
  --text-secondary: rgba(148, 163, 184, 0.8);
  --text-muted: rgba(100, 116, 139, 0.6);
  --accent: #3b82f6;
  --accent-dim: rgba(59, 130, 246, 0.15);
  --label-color: rgba(59, 130, 246, 0.4);
  --shadow-paper: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.light {
  --bg-primary: #f0f4f8;
  --bg-paper: rgba(255, 255, 255, 0.9);
  --border-grid: rgba(59, 130, 246, 0.06);
  --border-grid-major: rgba(59, 130, 246, 0.12);
  --border-paper: rgba(59, 130, 246, 0.25);
  --text-primary: #0f172a;
  --text-secondary: rgba(51, 65, 85, 0.9);
  --text-muted: rgba(100, 116, 139, 0.7);
  --accent: #3b82f6;
  --accent-dim: rgba(59, 130, 246, 0.1);
  --label-color: rgba(59, 130, 246, 0.35);
  --shadow-paper: 0 4px 20px rgba(0, 0, 0, 0.08);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: auto;
}

body {
  margin: 0;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Blueprint grid background */
.blueprint-grid {
  background-image:
    linear-gradient(var(--border-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-grid) 1px, transparent 1px),
    linear-gradient(var(--border-grid-major) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-grid-major) 1px, transparent 1px);
  background-size:
    20px 20px,
    20px 20px,
    100px 100px,
    100px 100px;
}

/* Paper card base styles */
.paper-card {
  background: var(--bg-paper);
  border: 1px solid var(--border-paper);
  box-shadow: var(--shadow-paper);
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.paper-label {
  font-family: var(--font-geist-mono), monospace;
  font-size: 0.5rem;
  color: var(--label-color);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Smooth transitions for theme switch */
.paper-card,
.blueprint-grid {
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
```

- [ ] **Step 3: Rewrite layout.tsx with fonts, theme init, and Lenis**

Replace `app/layout.tsx` entirely:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M. Aktaruzzaman Joti — Frontend Engineer",
  description:
    "Portfolio of M. Aktaruzzaman Joti — Frontend Engineer specializing in interactive experiences, animation systems, and scalable React architectures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('portfolio-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="blueprint-grid min-h-screen">{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Verify theme system works**

```bash
npm run dev
```

Expected: Page loads with dark blue background (`#0a1628`) and blueprint grid. No console errors. The inline script prevents theme flash.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx store/theme-store.ts
git commit -m "feat: add theme system with CSS custom properties, blueprint grid, and dark/light modes"
```

---

## Task 3: Paper Physics Store + Hooks

**Files:**
- Create: `store/paper-store.ts`
- Create: `hooks/use-cursor-position.ts`
- Create: `hooks/use-reduced-motion.ts`

- [ ] **Step 1: Create paper store**

Create `store/paper-store.ts`:

```typescript
import { create } from "zustand";

export interface PaperConfig {
  driftSpeed: number;
  windSensitivity: number;
  turbulence: number;
  damping: number;
  maxRotation: number;
  width: number;
  height: number;
  initialX: number;
  initialY: number;
  initialRotation: number;
  content: string; // section-specific label like "PAPER-001", "EXP-002"
}

export interface Paper {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  rotationVelocity: number;
  velocityX: number;
  velocityY: number;
  opacity: number;
  zIndex: number;
  section: string;
  config: PaperConfig;
  visible: boolean;
}

interface PaperStore {
  papers: Paper[];
  cursorPosition: { x: number; y: number };
  windEnabled: boolean;
  time: number;

  registerPaper: (id: string, section: string, config: PaperConfig) => void;
  removePaper: (id: string) => void;
  setCursorPosition: (x: number, y: number) => void;
  setWindEnabled: (enabled: boolean) => void;
  updatePositions: () => void;
  setVisible: (id: string, visible: boolean) => void;
}

let paperCounter = 0;

export const usePaperStore = create<PaperStore>((set, get) => ({
  papers: [],
  cursorPosition: { x: -1000, y: -1000 },
  windEnabled: true,
  time: 0,

  registerPaper: (id, section, config) => {
    set((state) => {
      if (state.papers.length >= 30) return state;
      if (state.papers.find((p) => p.id === id)) return state;
      return {
        papers: [
          ...state.papers,
          {
            id,
            x: config.initialX,
            y: config.initialY,
            width: config.width,
            height: config.height,
            rotation: config.initialRotation,
            rotationVelocity: 0,
            velocityX: 0,
            velocityY: 0,
            opacity: 1,
            zIndex: paperCounter++,
            section,
            config,
            visible: true,
          },
        ],
      };
    });
  },

  removePaper: (id) => {
    set((state) => ({
      papers: state.papers.filter((p) => p.id !== id),
    }));
  },

  setCursorPosition: (x, y) => {
    set({ cursorPosition: { x, y } });
  },

  setWindEnabled: (enabled) => {
    set({ windEnabled: enabled });
  },

  setVisible: (id, visible) => {
    set((state) => ({
      papers: state.papers.map((p) =>
        p.id === id ? { ...p, visible } : p
      ),
    }));
  },

  updatePositions: () => {
    const { papers, cursorPosition, windEnabled, time } = get();
    if (!windEnabled) return;

    const cursorRadius = 300;
    const newTime = time + 1;

    const updated = papers.map((paper) => {
      if (!paper.visible) return paper;

      const config = paper.config;

      // Cursor repulsion force
      const dx = paper.x + paper.width / 2 - cursorPosition.x;
      const dy = paper.y + paper.height / 2 - cursorPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      let cursorForceX = 0;
      let cursorForceY = 0;

      if (distance < cursorRadius && distance > 0) {
        const force =
          ((cursorRadius - distance) / cursorRadius) * config.windSensitivity;
        cursorForceX = (dx / distance) * force * 2;
        cursorForceY = (dy / distance) * force * 2;
      }

      // Base drift force
      const driftX =
        Math.sin(newTime * 0.01 + paper.zIndex) * config.driftSpeed * 0.3;
      const driftY =
        Math.cos(newTime * 0.008 + paper.zIndex * 1.5) *
        config.driftSpeed *
        0.2;

      // Turbulence
      const turbX = (Math.random() - 0.5) * config.turbulence * 0.5;
      const turbY = (Math.random() - 0.5) * config.turbulence * 0.5;

      // Update velocity
      let newVX =
        (paper.velocityX + cursorForceX + driftX + turbX) * config.damping;
      let newVY =
        (paper.velocityY + cursorForceY + driftY + turbY) * config.damping;

      // Clamp velocity
      const maxVel = 5;
      newVX = Math.max(-maxVel, Math.min(maxVel, newVX));
      newVY = Math.max(-maxVel, Math.min(maxVel, newVY));

      // Update position
      let newX = paper.x + newVX;
      let newY = paper.y + newVY;

      // Update rotation
      let newRotVel =
        (paper.rotationVelocity +
          (Math.random() - 0.5) * config.turbulence * 0.2) *
        0.95;
      let newRotation = paper.rotation + newRotVel;

      // Clamp rotation
      if (Math.abs(newRotation) > config.maxRotation) {
        newRotVel = newRotVel * -0.5;
        newRotation = Math.sign(newRotation) * config.maxRotation;
      }

      return {
        ...paper,
        x: newX,
        y: newY,
        velocityX: newVX,
        velocityY: newVY,
        rotation: newRotation,
        rotationVelocity: newRotVel,
      };
    });

    set({ papers: updated, time: newTime });
  },
}));
```

- [ ] **Step 2: Create cursor position hook**

Create `hooks/use-cursor-position.ts`:

```typescript
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
```

- [ ] **Step 3: Create reduced motion hook**

Create `hooks/use-reduced-motion.ts`:

```typescript
"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return reduced;
}
```

- [ ] **Step 4: Verify files compile**

```bash
npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add store/paper-store.ts hooks/use-cursor-position.ts hooks/use-reduced-motion.ts
git commit -m "feat: add paper physics store, cursor tracking hook, and reduced motion hook"
```

---

## Task 4: Paper Components (Canvas, Engine, Paper Element)

**Files:**
- Create: `components/paper/paper.tsx`
- Create: `components/paper/paper-canvas.tsx`
- Create: `components/paper/paper-engine.tsx`

- [ ] **Step 1: Create single Paper component**

Create `components/paper/paper.tsx`:

```tsx
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
```

- [ ] **Step 2: Create paper engine (rAF loop)**

Create `components/paper/paper-engine.tsx`:

```tsx
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
    setWindEnabled(true);

    const loop = () => {
      updatePositions();
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [reducedMotion, updatePositions, setWindEnabled]);

  return null;
}
```

- [ ] **Step 3: Create paper canvas overlay**

Create `components/paper/paper-canvas.tsx`:

```tsx
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
```

- [ ] **Step 4: Verify compilation**

```bash
npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add components/paper/paper.tsx components/paper/paper-engine.tsx components/paper/paper-canvas.tsx
git commit -m "feat: add Paper component, physics engine rAF loop, and canvas overlay"
```

---

## Task 5: Page Shell + Lenis Smooth Scroll

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Create a Lenis smooth scroll provider component**

Create `components/layout/smooth-scroll.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 2: Rewrite page.tsx with Lenis, PaperCanvas, and section placeholders**

Replace `app/page.tsx` entirely:

```tsx
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { PaperCanvas } from "@/components/paper/paper-canvas";

export default function Home() {
  return (
    <SmoothScroll>
      <PaperCanvas />
      <main>
        <section
          id="hero"
          className="relative min-h-screen flex items-center justify-center"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold">Portfolio Loading...</h1>
          </div>
        </section>
      </main>
    </SmoothScroll>
  );
}
```

- [ ] **Step 3: Verify the page loads with smooth scroll**

```bash
npm run dev
```

Expected: Page loads with dark blueprint grid background, "Portfolio Loading..." text centered, smooth scrolling works when scrolling with mouse wheel.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx components/layout/smooth-scroll.tsx
git commit -m "feat: add Lenis smooth scroll provider and page shell with PaperCanvas"
```

---

## Task 6: Theme Toggle Component

**Files:**
- Create: `components/layout/theme-toggle.tsx`

- [ ] **Step 1: Create theme toggle button**

Create `components/layout/theme-toggle.tsx`:

```tsx
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
```

- [ ] **Step 2: Add ThemeToggle to page.tsx**

Add import and render `<ThemeToggle />` inside `<SmoothScroll>` in `app/page.tsx`:

```tsx
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { PaperCanvas } from "@/components/paper/paper-canvas";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function Home() {
  return (
    <SmoothScroll>
      <PaperCanvas />
      <ThemeToggle />
      <main>
        <section
          id="hero"
          className="relative min-h-screen flex items-center justify-center"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold">Portfolio Loading...</h1>
          </div>
        </section>
      </main>
    </SmoothScroll>
  );
}
```

- [ ] **Step 3: Verify theme toggle works**

```bash
npm run dev
```

Expected: A circular button in top-right corner. Clicking it toggles between dark (#0a1628) and light (#f0f4f8) backgrounds with smooth 300ms transition.

- [ ] **Step 4: Commit**

```bash
git add components/layout/theme-toggle.tsx app/page.tsx
git commit -m "feat: add theme toggle button with dark/light switching"
```

---

## Task 7: Hero Section

**Files:**
- Create: `components/sections/hero.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create hero section with floating papers and centered name**

Create `components/sections/hero.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePaperStore, type PaperConfig } from "@/store/paper-store";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const HERO_PAPERS: { id: string; config: PaperConfig; content: string }[] = [
  {
    id: "hero-1",
    config: {
      driftSpeed: 0.5,
      windSensitivity: 0.8,
      turbulence: 0.3,
      damping: 0.95,
      maxRotation: 8,
      width: 180,
      height: 100,
      initialX: 80,
      initialY: 80,
      initialRotation: -6,
      content: "PAPER-001",
    },
    content: `const skills = [\n  "React", "Next.js",\n  "TypeScript", "Motion"\n];`,
  },
  {
    id: "hero-2",
    config: {
      driftSpeed: 0.4,
      windSensitivity: 0.6,
      turbulence: 0.2,
      damping: 0.96,
      maxRotation: 6,
      width: 160,
      height: 80,
      initialX: 0,
      initialY: 0,
      initialRotation: 4,
      content: "WIND-VEC-03",
    },
    content: `→ dir: 34.2°\n→ force: 1.8N\n→ turb: 0.4`,
  },
  {
    id: "hero-3",
    config: {
      driftSpeed: 0.3,
      windSensitivity: 0.7,
      turbulence: 0.25,
      damping: 0.94,
      maxRotation: 5,
      width: 190,
      height: 110,
      initialX: 0,
      initialY: 0,
      initialRotation: -3,
      content: "PAPER-007",
    },
    content: `Sr. Frontend Eng\n@ Tech Company\n2022 — Present`,
  },
  {
    id: "hero-4",
    config: {
      driftSpeed: 0.6,
      windSensitivity: 0.5,
      turbulence: 0.35,
      damping: 0.93,
      maxRotation: 10,
      width: 130,
      height: 70,
      initialX: 0,
      initialY: 0,
      initialRotation: 7,
      content: "NOTE-012",
    },
    content: `Performance\nMetrics: 98/100\n● Lighthouse`,
  },
  {
    id: "hero-5",
    config: {
      driftSpeed: 0.7,
      windSensitivity: 0.9,
      turbulence: 0.4,
      damping: 0.92,
      maxRotation: 12,
      width: 90,
      height: 50,
      initialX: 0,
      initialY: 0,
      initialRotation: -10,
      content: "NOTE-015",
    },
    content: `→ scroll`,
  },
];

export function Hero() {
  const registerPaper = usePaperStore((s) => s.registerPaper);
  const removePaper = usePaperStore((s) => s.removePaper);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "-100px" });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    // Position papers relative to viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    HERO_PAPERS.forEach((p) => {
      let x = p.config.initialX;
      let y = p.config.initialY;

      // Distribute papers around the edges
      if (p.id === "hero-2") {
        x = vw - 260;
        y = 60;
      } else if (p.id === "hero-3") {
        x = vw - 280;
        y = vh * 0.35;
      } else if (p.id === "hero-4") {
        x = 120;
        y = vh - 200;
      } else if (p.id === "hero-5") {
        x = vw * 0.3;
        y = vh * 0.55;
      }

      const config = { ...p.config, initialX: x, initialY: y };
      registerPaper(p.id, "hero", config);
    });

    return () => {
      HERO_PAPERS.forEach((p) => removePaper(p.id));
    };
  }, [registerPaper, removePaper, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Coordinate markers */}
      <div
        className="paper-label absolute top-4 left-4"
        style={{ color: "var(--label-color)" }}
      >
        [0, 0]
      </div>

      {/* Center name block */}
      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div
          className="font-mono text-xs tracking-[0.25em] mb-3"
          style={{ color: "var(--label-color)" }}
        >
          // FRONTEND ENGINEER
        </div>
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          M. AKTARUZZAMAN
        </h1>
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          style={{ color: "var(--accent)" }}
        >
          JOTI
        </h1>
        <p
          className="mt-4 text-sm tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          Building interactive experiences with physics & precision
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div
          className="w-px h-8 mx-auto mb-2"
          style={{
            background:
              "linear-gradient(to bottom, var(--accent), transparent)",
          }}
        />
        <div
          className="font-mono text-xs tracking-widest"
          style={{ color: "var(--label-color)" }}
        >
          SCROLL TO EXPLORE
        </div>
      </motion.div>

      {/* Debug bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-7 flex items-center justify-between px-4 font-mono"
        style={{
          background: "rgba(10, 22, 40, 0.8)",
          borderTop: "1px solid var(--border-paper)",
          color: "var(--label-color)",
          fontSize: "0.55rem",
        }}
      >
        <span>PAPER PHYSICS ENGINE v1.0</span>
        <span>WIND::CURSOR_DRIVEN | DAMPING: 0.95 | MAX: 30</span>
        <span>MOVE CURSOR TO INTERACT</span>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update page.tsx with Hero section**

Replace `app/page.tsx`:

```tsx
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { PaperCanvas } from "@/components/paper/paper-canvas";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <SmoothScroll>
      <PaperCanvas />
      <ThemeToggle />
      <main>
        <Hero />
      </main>
    </SmoothScroll>
  );
}
```

- [ ] **Step 3: Verify hero section renders with floating papers**

```bash
npm run dev
```

Expected: Full-viewport hero with centered name, floating paper elements that react to cursor movement, blueprint grid visible behind, scroll indicator at bottom, debug bar at very bottom.

- [ ] **Step 4: Commit**

```bash
git add components/sections/hero.tsx app/page.tsx
git commit -m "feat: add hero section with floating papers, centered name, and debug bar"
```

---

## Task 8: About Section

**Files:**
- Create: `components/sections/about.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create about section**

Create `components/sections/about.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function About() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="about"
      className="relative min-h-screen py-32 px-6 md:px-16 max-w-6xl mx-auto"
    >
      <div
        className="font-mono text-xs tracking-[0.25em] mb-12"
        style={{ color: "var(--label-color)" }}
      >
        SECTION::ABOUT
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Bio paper */}
        <motion.div
          className="paper-card p-6 md:p-8 rounded-sm"
          style={{ transform: "rotate(-1deg)" }}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="paper-label mb-4">BIO-001 | PAPER</div>
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            About Me
          </h2>
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            Frontend engineer with 5+ years of experience building
            high-performance web applications. Specialized in interactive
            experiences, animation systems, and scalable React architectures.
          </p>
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            Passionate about pushing the boundaries of what&apos;s possible in
            the browser — from physics simulations to complex animation
            orchestration.
          </p>
          <div
            className="font-mono text-xs mt-4"
            style={{ color: "var(--accent)" }}
          >
            // Philosophy: Code as craft
          </div>
        </motion.div>

        {/* Right column: focus areas + metrics */}
        <div className="flex flex-col gap-6">
          <motion.div
            className="paper-card p-5 rounded-sm"
            style={{ transform: "rotate(1.5deg)" }}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <div className="paper-label mb-3">FOCUS-AREA</div>
            <div
              className="text-sm leading-loose"
              style={{ color: "var(--text-secondary)" }}
            >
              <div>
                <span style={{ color: "var(--accent)" }}>→</span> Interactive
                UI / Animation
              </div>
              <div>
                <span style={{ color: "var(--accent)" }}>→</span> Performance
                Optimization
              </div>
              <div>
                <span style={{ color: "var(--accent)" }}>→</span> Design
                Systems & Architecture
              </div>
              <div>
                <span style={{ color: "var(--accent)" }}>→</span> Developer
                Experience Tooling
              </div>
            </div>
          </motion.div>

          <motion.div
            className="paper-card p-5 rounded-sm"
            style={{ transform: "rotate(-2deg)" }}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="paper-label mb-3">METRICS</div>
            <div className="flex gap-8">
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--accent)" }}
                >
                  5+
                </div>
                <div
                  className="font-mono text-xs mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  YEARS
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--accent)" }}
                >
                  20+
                </div>
                <div
                  className="font-mono text-xs mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  PROJECTS
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--accent)" }}
                >
                  50+
                </div>
                <div
                  className="font-mono text-xs mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  COMPONENTS
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add About to page.tsx**

Add import and render `<About />` after `<Hero />` in `app/page.tsx`:

```tsx
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { PaperCanvas } from "@/components/paper/paper-canvas";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";

export default function Home() {
  return (
    <SmoothScroll>
      <PaperCanvas />
      <ThemeToggle />
      <main>
        <Hero />
        <About />
      </main>
    </SmoothScroll>
  );
}
```

- [ ] **Step 3: Verify about section renders**

```bash
npm run dev
```

Expected: About section appears below hero. Bio card with rotation on left, focus areas and metrics cards on right. All fade in when scrolled into view.

- [ ] **Step 4: Commit**

```bash
git add components/sections/about.tsx app/page.tsx
git commit -m "feat: add about section with bio paper, focus areas, and metrics"
```

---

## Task 9: Skills Section (Node Graph)

**Files:**
- Create: `components/sections/skills.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create skills section with node graph**

Create `components/sections/skills.tsx`:

```tsx
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
        {/* SVG Connection Lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 0 }}
        >
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
                  animate={
                    isInView
                      ? { pathLength: 1, opacity: 1 }
                      : { pathLength: 0, opacity: 0 }
                  }
                  transition={{ duration: 1, delay: 0.3 }}
                />
              );
            })
          )}
        </svg>

        {/* Nodes */}
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
            animate={
              isInView
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.5 }
            }
            transition={{ duration: 0.4, delay: 0.1 * i }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <div
              className={`paper-card px-3 py-2 rounded-sm cursor-default ${
                node.type === "category"
                  ? "px-4 py-3"
                  : ""
              }`}
              style={{
                borderColor:
                  hoveredNode === node.id
                    ? "var(--accent)"
                    : "var(--border-paper)",
              }}
            >
              <div
                className={`font-mono ${
                  node.type === "category"
                    ? "text-xs font-bold"
                    : "text-xs"
                }`}
                style={{
                  color:
                    node.type === "category"
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                }}
              >
                {node.label}
              </div>

              {/* Tooltip on hover */}
              {hoveredNode === node.id && (
                <motion.div
                  className="mt-2 pt-2"
                  style={{
                    borderTop: "1px solid var(--border-paper)",
                  }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <div
                    className="text-xs mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
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
```

- [ ] **Step 2: Add Skills to page.tsx**

Add import and render `<Skills />` after `<About />` in `app/page.tsx`.

- [ ] **Step 3: Verify skills section renders**

```bash
npm run dev
```

Expected: Node graph with category nodes (FRONTEND, STYLING, TOOLS) connected to skill nodes via dashed SVG lines. Hover shows proficiency bar. Lines animate in on scroll.

- [ ] **Step 4: Commit**

```bash
git add components/sections/skills.tsx app/page.tsx
git commit -m "feat: add skills section with node graph, SVG connections, and hover tooltips"
```

---

## Task 10: Experience Timeline

**Files:**
- Create: `components/sections/experience.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create experience timeline section**

Create `components/sections/experience.tsx`:

```tsx
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
    id: "exp-1",
    label: "EXP-001",
    role: "Senior Frontend Engineer",
    company: "Tech Company",
    period: "2022 — Present",
    summary:
      "Led frontend architecture for 3 product lines, improving performance by 40%.",
    details: [
      "Architected micro-frontend system serving 2M+ users",
      "Built design system with 50+ components",
      "Mentored team of 5 junior developers",
      "Reduced bundle size by 60% through code splitting",
    ],
    rotation: 1,
    side: "left",
  },
  {
    id: "exp-2",
    label: "EXP-002",
    role: "Frontend Developer",
    company: "Another Company",
    period: "2019 — 2022",
    summary:
      "Built component library serving 50+ developers across multiple teams.",
    details: [
      "Developed shared component library with TypeScript",
      "Implemented automated visual regression testing",
      "Led migration from class components to hooks",
      "Improved CI/CD pipeline reducing deploy time by 70%",
    ],
    rotation: -1.5,
    side: "right",
  },
  {
    id: "exp-3",
    label: "EXP-003",
    role: "Junior Developer",
    company: "Startup Inc",
    period: "2017 — 2019",
    summary:
      "Full-stack development on SaaS platform, focusing on frontend interactions.",
    details: [
      "Built interactive dashboards with real-time data",
      "Implemented responsive email templates",
      "Contributed to open-source UI library",
    ],
    rotation: 2,
    side: "left",
  },
];

export function Experience() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section
      ref={ref}
      id="experience"
      className="relative py-32 px-6 md:px-16 max-w-6xl mx-auto"
    >
      <div
        className="font-mono text-xs tracking-[0.25em] mb-12"
        style={{ color: "var(--label-color)" }}
      >
        SECTION::EXPERIENCE
      </div>

      <h2
        className="text-2xl font-bold mb-16 text-center"
        style={{ color: "var(--text-primary)" }}
      >
        Experience
      </h2>

      <div className="relative">
        {/* Timeline center line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
          style={{
            background:
              "linear-gradient(to bottom, var(--accent), var(--border-paper))",
          }}
        />

        <div className="space-y-12">
          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={exp.id}
              className={`relative flex ${
                exp.side === "left"
                  ? "md:justify-start"
                  : "md:justify-end"
              }`}
              initial={{ opacity: 0, x: exp.side === "left" ? -40 : 40 }}
              animate={
                isInView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: exp.side === "left" ? -40 : 40 }
              }
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              {/* Timeline dot */}
              <div
                className="absolute left-1/2 top-6 -translate-x-1/2 w-2 h-2 rounded-full hidden md:block"
                style={{
                  background: "var(--accent)",
                  opacity: i === 0 ? 1 : 0.6,
                  border: `2px solid var(--accent)`,
                }}
              />

              {/* Card */}
              <div
                className={`w-full md:w-5/12 ${
                  exp.side === "left" ? "md:pr-12" : "md:pl-12"
                }`}
              >
                <div
                  className="paper-card p-5 rounded-sm cursor-pointer"
                  style={{ transform: `rotate(${exp.rotation}deg)` }}
                  onClick={() =>
                    setExpandedId(expandedId === exp.id ? null : exp.id)
                  }
                >
                  <div className="paper-label mb-3">{exp.label}</div>
                  <h3
                    className="text-base font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {exp.role}
                  </h3>
                  <div
                    className="text-sm mt-1"
                    style={{ color: "var(--accent)" }}
                  >
                    @ {exp.company}
                  </div>
                  <div
                    className="font-mono text-xs mt-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {exp.period}
                  </div>
                  <p
                    className="text-sm mt-3 leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {exp.summary}
                  </p>

                  <AnimatePresence>
                    {expandedId === exp.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="mt-3 pt-3"
                          style={{
                            borderTop: "1px solid var(--border-paper)",
                          }}
                        >
                          <ul className="space-y-1">
                            {exp.details.map((detail, j) => (
                              <li
                                key={j}
                                className="text-xs leading-relaxed"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                <span
                                  style={{ color: "var(--accent)" }}
                                >
                                  →
                                </span>{" "}
                                {detail}
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

      <div
        className="font-mono text-xs mt-8 text-right"
        style={{ color: "var(--label-color)" }}
      >
        CLICK CARD TO EXPAND | PAPERS SWAY ON SCROLL
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add Experience to page.tsx**

Add import and render `<Experience />` after `<Skills />` in `app/page.tsx`.

- [ ] **Step 3: Verify timeline renders**

```bash
npm run dev
```

Expected: Vertical timeline with alternating left/right cards. Cards have slight rotation. Clicking expands to show bullet points. Fade-in animation on scroll.

- [ ] **Step 4: Commit**

```bash
git add components/sections/experience.tsx app/page.tsx
git commit -m "feat: add experience timeline with alternating cards and expand-on-click"
```

---

## Task 11: Projects Section (Unfold Cards)

**Files:**
- Create: `components/sections/projects.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create projects section with unfold cards**

Create `components/sections/projects.tsx`:

```tsx
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
    id: "prj-1",
    label: "PRJ-001",
    name: "Physics Engine",
    description: "Custom 2D wind simulation with cursor interaction",
    fullDescription:
      "A lightweight 2D physics engine built from scratch for interactive paper simulations. Features cursor-driven wind forces, turbulence modeling, and spring-based damping — all running at 60fps with zero React re-renders per frame.",
    tags: ["React", "TypeScript", "Canvas"],
    github: "#",
    demo: "#",
    rotation: -1,
  },
  {
    id: "prj-2",
    label: "PRJ-002",
    name: "Design System",
    description: "Component library with 40+ primitives and theming engine",
    fullDescription:
      "A comprehensive design system featuring 40+ accessible components, a multi-theme engine with CSS custom properties, and Storybook documentation. Used across 5 product teams with 99% adoption rate.",
    tags: ["React", "Storybook", "Tailwind"],
    github: "#",
    demo: "#",
    rotation: 0.5,
  },
  {
    id: "prj-3",
    label: "PRJ-003",
    name: "Animation Library",
    description: "Spring-based motion primitives for React",
    fullDescription:
      "A lightweight animation library providing spring-based motion primitives, gesture-driven interactions, and layout animations. Bundle size under 5KB gzipped with tree-shaking support.",
    tags: ["Motion", "TypeScript"],
    github: "#",
    rotation: 1.5,
  },
  {
    id: "prj-4",
    label: "PRJ-004",
    name: "Portfolio v2",
    description: "This site — physics-driven paper portfolio",
    fullDescription:
      "The portfolio you're currently viewing. A single-page experience featuring a custom wind physics engine, blueprint-themed design, and smooth scroll orchestration. Built to showcase advanced frontend capabilities.",
    tags: ["Next.js", "Framer Motion"],
    github: "#",
    demo: "#",
    rotation: -0.5,
  },
];

export function Projects() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [unfoldedId, setUnfoldedId] = useState<string | null>(null);

  return (
    <section
      ref={ref}
      id="projects"
      className="relative py-32 px-6 md:px-16 max-w-6xl mx-auto"
    >
      <div
        className="font-mono text-xs tracking-[0.25em] mb-12"
        style={{ color: "var(--label-color)" }}
      >
        SECTION::PROJECTS
      </div>

      <h2
        className="text-2xl font-bold mb-12"
        style={{ color: "var(--text-primary)" }}
      >
        Projects
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROJECTS.map((project, i) => {
          const isUnfolded = unfoldedId === project.id;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{
                scale: 1.02,
                rotate: 0,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
              className="paper-card p-5 rounded-sm cursor-pointer relative"
              style={{ transform: `rotate(${project.rotation}deg)` }}
              onClick={() =>
                setUnfoldedId(isUnfolded ? null : project.id)
              }
            >
              <div className="paper-label mb-3">
                {project.label} | {isUnfolded ? "UNFOLDED" : "FOLDED"}
              </div>
              <h3
                className="text-base font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {project.name}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs px-2 py-0.5 rounded-sm"
                    style={{
                      background: "var(--accent-dim)",
                      color: "var(--accent)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Unfolded content */}
              <AnimatePresence>
                {isUnfolded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="mt-4 pt-4"
                      style={{ borderTop: "1px solid var(--border-paper)" }}
                    >
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {project.fullDescription}
                      </p>
                      <div className="flex gap-4 mt-3">
                        {project.github && (
                          <span
                            className="text-xs font-mono"
                            style={{ color: "var(--accent)" }}
                          >
                            → GitHub
                          </span>
                        )}
                        {project.demo && (
                          <span
                            className="text-xs font-mono"
                            style={{ color: "var(--accent)" }}
                          >
                            → Live Demo
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Fold corner effect */}
              <div
                className="absolute bottom-0 right-0"
                style={{
                  width: "16px",
                  height: "16px",
                  background:
                    "linear-gradient(135deg, transparent 50%, var(--accent-dim) 50%)",
                }}
              />

              {/* Unfold hint */}
              {!isUnfolded && (
                <div
                  className="absolute bottom-3 right-5 font-mono text-xs"
                  style={{ color: "var(--label-color)" }}
                >
                  → unfold
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div
        className="font-mono text-xs mt-8 text-right"
        style={{ color: "var(--label-color)" }}
      >
        CLICK TO UNFOLD | HOVER TO ELEVATE
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add Projects to page.tsx**

Add import and render `<Projects />` after `<Experience />` in `app/page.tsx`.

- [ ] **Step 3: Verify projects section renders**

```bash
npm run dev
```

Expected: 2x2 grid of project cards with slight rotations. Hover elevates cards. Click unfolds to show full description and links.

- [ ] **Step 4: Commit**

```bash
git add components/sections/projects.tsx app/page.tsx
git commit -m "feat: add projects section with unfold-on-click cards and hover elevation"
```

---

## Task 12: Engineering Section (Metrics Bars)

**Files:**
- Create: `components/sections/engineering.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create engineering section with animated metrics**

Create `components/sections/engineering.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Metric {
  label: string;
  value: string;
  percent: number;
  color: string;
}

const METRICS: Metric[] = [
  {
    label: "Lighthouse Score",
    value: "98/100",
    percent: 98,
    color: "var(--accent)",
  },
  {
    label: "Bundle Size (gzipped)",
    value: "45KB",
    percent: 35,
    color: "var(--accent)",
  },
  {
    label: "First Contentful Paint",
    value: "0.8s",
    percent: 85,
    color: "#4ade80",
  },
  {
    label: "Animation FPS Target",
    value: "60fps",
    percent: 100,
    color: "#4ade80",
  },
];

export function Engineering() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="engineering"
      className="relative py-32 px-6 md:px-16 max-w-6xl mx-auto"
    >
      <div
        className="font-mono text-xs tracking-[0.25em] mb-12"
        style={{ color: "var(--label-color)" }}
      >
        SECTION::ENGINEERING
      </div>

      <h2
        className="text-2xl font-bold mb-12"
        style={{ color: "var(--text-primary)" }}
      >
        Engineering Metrics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Metrics bars */}
        <div className="space-y-8">
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -20 }}
              animate={
                isInView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: -20 }
              }
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div
                className="flex justify-between text-sm mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                <span>{metric.label}</span>
                <span style={{ color: metric.color }}>{metric.value}</span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "var(--accent-dim)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: metric.color }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${metric.percent}%` } : { width: 0 }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Engineering philosophy paper */}
        <motion.div
          className="paper-card p-6 rounded-sm"
          style={{ transform: "rotate(1deg)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="paper-label mb-4">ENG-PHILOSOPHY</div>
          <h3
            className="text-lg font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Engineering Principles
          </h3>
          <div
            className="text-sm leading-loose space-y-2"
            style={{ color: "var(--text-secondary)" }}
          >
            <div>
              <span style={{ color: "var(--accent)" }}>01.</span> Performance
              is a feature, not an afterthought
            </div>
            <div>
              <span style={{ color: "var(--accent)" }}>02.</span> Every pixel
              should serve a purpose
            </div>
            <div>
              <span style={{ color: "var(--accent)" }}>03.</span> Accessibility
              is non-negotiable
            </div>
            <div>
              <span style={{ color: "var(--accent)" }}>04.</span> Code should
              communicate intent clearly
            </div>
            <div>
              <span style={{ color: "var(--accent)" }}>05.</span> Measure
              everything, assume nothing
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add Engineering to page.tsx**

Add import and render `<Engineering />` after `<Projects />` in `app/page.tsx`.

- [ ] **Step 3: Verify engineering section renders**

```bash
npm run dev
```

Expected: Progress bars fill when scrolled into view. Engineering philosophy paper card on the right.

- [ ] **Step 4: Commit**

```bash
git add components/sections/engineering.tsx app/page.tsx
git commit -m "feat: add engineering section with animated metric bars and philosophy card"
```

---

## Task 13: Contact Section

**Files:**
- Create: `components/sections/contact.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create contact section with paper letter**

Create `components/sections/contact.tsx`:

```tsx
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
    <section
      ref={ref}
      id="contact"
      className="relative py-32 px-6 md:px-16 max-w-4xl mx-auto"
    >
      <div
        className="font-mono text-xs tracking-[0.25em] mb-12"
        style={{ color: "var(--label-color)" }}
      >
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
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Get In Touch
        </h2>
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          Have a project in mind or want to collaborate? Let&apos;s build
          something remarkable together.
        </p>

        {/* Social links */}
        <div className="flex flex-wrap gap-3">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="paper-card px-4 py-2 rounded-sm text-xs font-mono"
              style={{
                color: "var(--accent)",
                borderColor: "var(--border-paper)",
                textDecoration: "none",
              }}
            >
              {link.label} →
            </a>
          ))}
        </div>

        {/* Fold corner */}
        <div
          className="absolute bottom-0 right-0"
          style={{
            width: "20px",
            height: "20px",
            background:
              "linear-gradient(135deg, transparent 50%, var(--accent-dim) 50%)",
          }}
        />
      </motion.div>

      {/* Footer */}
      <div
        className="text-center mt-16 font-mono text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        Designed & built by M. Aktaruzzaman Joti
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add Contact to page.tsx**

Add import and render `<Contact />` after `<Engineering />` in `app/page.tsx`.

- [ ] **Step 3: Verify contact section renders**

```bash
npm run dev
```

Expected: Centered paper letter with social link tags. Fold corner effect. Footer text below.

- [ ] **Step 4: Commit**

```bash
git add components/sections/contact.tsx app/page.tsx
git commit -m "feat: add contact section with paper letter and social links"
```

---

## Task 14: Navigation (Dot Indicators)

**Files:**
- Create: `components/layout/navigation.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create dot navigation**

Create `components/layout/navigation.tsx`:

```tsx
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
          {/* Label tooltip */}
          <span
            className="absolute right-6 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
            style={{ color: "var(--text-muted)" }}
          >
            {label}
          </span>

          {/* Dot */}
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{
              background:
                active === id ? "var(--accent)" : "var(--border-paper)",
              border: `1px solid ${active === id ? "var(--accent)" : "var(--border-paper)"}`,
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
```

- [ ] **Step 2: Add Navigation to page.tsx**

Add import and render `<Navigation />` inside `<SmoothScroll>` in `app/page.tsx`.

- [ ] **Step 3: Verify dot navigation works**

```bash
npm run dev
```

Expected: Small dots on right side of viewport. Active section dot is larger and brighter. Hovering shows section name. Clicking scrolls to section.

- [ ] **Step 4: Commit**

```bash
git add components/layout/navigation.tsx app/page.tsx
git commit -m "feat: add dot navigation with active section tracking and smooth scroll"
```

---

## Task 15: Responsive Design + Reduced Motion

**Files:**
- Modify: `components/paper/paper-engine.tsx`
- Modify: `components/sections/skills.tsx`
- Modify: `components/sections/experience.tsx`
- Modify: `components/sections/projects.tsx`

- [ ] **Step 1: Add viewport-based paper limits to paper-engine.tsx**

Update the `PaperEngine` component in `components/paper/paper-engine.tsx` to reduce paper count on smaller screens. Add this logic inside the `useEffect`:

```tsx
// Add inside the useEffect, before the loop:
const checkViewport = () => {
  const width = window.innerWidth;
  if (width < 768) {
    setWindEnabled(false);
  }
};
checkViewport();
window.addEventListener("resize", checkViewport);
return () => window.removeEventListener("resize", checkViewport);
```

Also add to the cleanup:

```tsx
return () => {
  if (frameRef.current) {
    cancelAnimationFrame(frameRef.current);
  }
  window.removeEventListener("resize", checkViewport);
};
```

- [ ] **Step 2: Ensure sections are responsive**

Verify that all sections use responsive classes:
- `grid-cols-1 md:grid-cols-2` for grids
- `px-6 md:px-16` for padding
- `text-4xl md:text-5xl lg:text-6xl` for hero heading
- The timeline, project grid, and skills already have these classes from the code above.

- [ ] **Step 3: Verify responsive behavior**

```bash
npm run dev
```

Open browser DevTools, toggle device toolbar. Test at:
- 375px (mobile): Single column layouts, no paper physics
- 768px (tablet): Two-column where applicable
- 1440px (desktop): Full layout with physics

- [ ] **Step 4: Commit**

```bash
git add components/paper/paper-engine.tsx
git commit -m "feat: add responsive breakpoints and mobile physics disable"
```

---

## Task 16: SEO Metadata + Final Polish

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update metadata in layout.tsx**

Update the metadata export in `app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: "M. Aktaruzzaman Joti — Frontend Engineer",
  description:
    "Portfolio of M. Aktaruzzaman Joti — Frontend Engineer specializing in interactive experiences, physics-based animations, and scalable React architectures.",
  keywords: [
    "Frontend Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "Animation",
    "Portfolio",
  ],
  authors: [{ name: "M. Aktaruzzaman Joti" }],
  openGraph: {
    title: "M. Aktaruzzaman Joti — Frontend Engineer",
    description:
      "Interactive portfolio showcasing frontend engineering with physics-based paper animations.",
    type: "website",
  },
};
```

- [ ] **Step 2: Run production build to verify everything compiles**

```bash
npm run build
```

Expected: Build completes with no errors. All pages compile successfully.

- [ ] **Step 3: Run Lighthouse audit (manual)**

Open the production build in browser (`npm run start`), run Lighthouse from DevTools. Verify:
- Performance > 90
- Accessibility > 90
- Best Practices > 90
- SEO > 90

- [ ] **Step 4: Final commit**

```bash
git add app/layout.tsx
git commit -m "feat: add SEO metadata and OpenGraph tags"
```

---

## Self-Review

### Spec Coverage

| Spec Requirement | Task |
|-----------------|------|
| Dark Blueprint theme | Task 2 |
| Light Blueprint theme | Task 2 + Task 6 |
| CSS custom properties | Task 2 |
| Blueprint grid | Task 2 |
| Paper card style | Task 2 (CSS) |
| Paper data model | Task 3 |
| PaperConfig | Task 3 |
| Cursor repulsion force | Task 3 (updatePositions) |
| Base drift force | Task 3 (updatePositions) |
| Turbulence force | Task 3 (updatePositions) |
| Velocity damping | Task 3 (updatePositions) |
| Rotation physics | Task 3 (updatePositions) |
| 30 paper limit | Task 3 (registerPaper) |
| useMotionValue rendering | Task 4 (Paper component) |
| IntersectionObserver for visibility | Task 7 (Hero uses useInView) |
| Paper recycling | Task 3 (removePaper on unmount) |
| Zustand paper store | Task 3 |
| Cursor position hook | Task 3 |
| Reduced motion hook | Task 3 |
| PaperCanvas overlay | Task 4 |
| PaperEngine rAF loop | Task 4 |
| Hero section | Task 7 |
| About section | Task 8 |
| Skills node graph | Task 9 |
| Experience timeline | Task 10 |
| Projects unfold cards | Task 11 |
| Engineering metrics | Task 12 |
| Contact section | Task 13 |
| Dot navigation | Task 14 |
| Theme toggle | Task 6 |
| Lenis smooth scroll | Task 5 |
| Responsive breakpoints | Task 15 |
| Reduced motion support | Task 3 + Task 15 |
| SEO metadata | Task 16 |
| Geist fonts | Task 2 |
| Performance targets | Task 16 (Lighthouse) |

### Placeholder Scan
No TBDs, TODOs, or vague instructions found. All steps contain complete code.

### Type Consistency
- `Paper` and `PaperConfig` interfaces defined in Task 3, used consistently in Tasks 4, 7
- `usePaperStore` created in Task 3, imported identically in Tasks 4, 7
- `useThemeStore` created in Task 2, imported in Task 6
- Section component names match imports in page.tsx across all tasks
