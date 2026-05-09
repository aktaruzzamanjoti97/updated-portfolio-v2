# Physics-Inspired Portfolio — Design Spec

**Date:** 2026-05-09
**Project:** M. Aktaruzzaman Joti — Personal Portfolio
**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Framer Motion, Zustand, Lenis

---

## 1. Overview

A single-page portfolio website simulating a dynamic paper environment on a blueprint-style grid. Papers float, drift, and react to cursor movement via a custom wind physics engine. The design showcases advanced frontend engineering capabilities through interactive animations, real-time physics, and polished visual design.

**Visual tone:** Technical & precise — dark blueprint aesthetic with monospace annotations, grid backgrounds, and semi-transparent paper cards.

**Architecture:** Single-page scroll experience (Approach A). All sections render sequentially in one page. Lenis provides smooth scrolling. A global paper engine runs as a fixed overlay managed by Zustand.

---

## 2. Visual Design

### 2.1 Color System (CSS Custom Properties)

**Dark Blueprint (default):**

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a1628` | Page background |
| `--bg-paper` | `rgba(30, 58, 95, 0.7)` | Paper card backgrounds |
| `--border-grid` | `rgba(59, 130, 246, 0.06)` | Minor grid lines (20px) |
| `--border-grid-major` | `rgba(59, 130, 246, 0.12)` | Major grid lines (100px) |
| `--border-paper` | `rgba(59, 130, 246, 0.3)` | Paper card borders |
| `--text-primary` | `#bfdbfe` | Headings, name |
| `--text-secondary` | `rgba(148, 163, 184, 0.8)` | Body text |
| `--text-muted` | `rgba(100, 116, 139, 0.6)` | Annotations, dates |
| `--accent` | `#3b82f6` | Interactive elements, highlights |
| `--accent-dim` | `rgba(59, 130, 246, 0.15)` | Tag backgrounds |
| `--label` | `rgba(59, 130, 246, 0.4)` | Technical labels (PAPER-001, etc.) |

**Light Blueprint:**

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#f0f4f8` | Page background |
| `--bg-paper` | `rgba(255, 255, 255, 0.9)` | Paper card backgrounds |
| `--border-grid` | `rgba(59, 130, 246, 0.06)` | Minor grid lines |
| `--border-grid-major` | `rgba(59, 130, 246, 0.12)` | Major grid lines |
| `--border-paper` | `rgba(59, 130, 246, 0.25)` | Paper card borders |
| `--text-primary` | `#0f172a` | Headings |
| `--text-secondary` | `rgba(51, 65, 85, 0.9)` | Body text |
| `--text-muted` | `rgba(100, 116, 139, 0.7)` | Annotations |
| `--accent` | `#3b82f6` | Same as dark |
| `--accent-dim` | `rgba(59, 130, 246, 0.1)` | Tag backgrounds |
| `--label` | `rgba(59, 130, 246, 0.35)` | Technical labels |

### 2.2 Typography

- **Primary:** Geist Sans (via `next/font`) — headings, body
- **Monospace:** Geist Mono (via `next/font`) — technical annotations, labels, code snippets
- **Label convention:** Uppercase, letter-spaced, small — e.g., `SECTION::ABOUT`, `PAPER-001`, `EXP-002`

### 2.3 Blueprint Grid

Implemented as CSS `background-image` with repeating linear gradients on the `<body>` or section containers:

- Minor grid: 20px spacing, `--border-grid` opacity
- Major grid: 100px spacing, `--border-grid-major` opacity
- Coordinate markers at corners: `[0, 0]`, `[1920, 1080]` etc.

### 2.4 Paper Card Style

Every content element styled as a "paper":

- Background: `--bg-paper` (semi-transparent)
- Border: 1px solid `--border-paper`
- Box shadow: layered shadows for depth (0 4px 20px rgba(0,0,0,0.3))
- Slight rotation (transform: rotate(-2deg to 3deg)) for organic feel
- Technical label in top-left corner
- Optional fold corner effect (bottom-right CSS triangle)

---

## 3. Wind Physics Engine

### 3.1 Data Model

```typescript
interface Paper {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;          // degrees
  rotationVelocity: number;  // deg/frame
  velocityX: number;         // px/frame
  velocityY: number;         // px/frame
  opacity: number;
  zIndex: number;
  section: string;           // spawning section identifier
  config: PaperConfig;       // behavior modifiers
}

interface PaperConfig {
  driftSpeed: number;        // ambient drift intensity (0-1)
  windSensitivity: number;   // how much cursor affects this paper (0-1)
  turbulence: number;        // random jitter amount (0-1)
  damping: number;           // velocity decay per frame (0.90-0.99)
  maxRotation: number;       // degrees, how much it can rotate
}
```

### 3.2 Wind Forces

Three force layers computed per frame for each active paper:

**1. Cursor repulsion (primary interaction):**
- Calculate direction vector from cursor to paper center
- If distance < 300px, apply repulsive force inversely proportional to distance squared
- Force direction: away from cursor
- Magnitude: `(cursorRadius - distance) / cursorRadius * config.windSensitivity`

**2. Base drift (ambient movement):**
- Gentle velocity that keeps papers floating when cursor is idle
- Direction oscillates using `sin(time * driftFrequency)` for X, `cos(time * driftFrequency)` for Y
- Magnitude: `config.driftSpeed * 0.3` px/frame

**3. Turbulence (organic feel):**
- Small random force applied each frame: `(Math.random() - 0.5) * config.turbulence * 0.5`
- Prevents perfectly smooth/robotic movement

**Velocity update per frame:**
```
velocity += cursorForce + driftForce + turbulenceForce
velocity *= damping
position += velocity
rotation += rotationVelocity
rotationVelocity += (Math.random() - 0.5) * turbulence * 0.2
rotationVelocity *= 0.95  // rotation damping
```

### 3.3 Performance Constraints

- Maximum 30 active papers at any time
- Papers only simulated when within viewport + 200px margin (IntersectionObserver)
- Papers that drift >500px offscreen get recycled (respawned near their section)
- Positions driven by `useMotionValue` (Framer Motion) — zero React re-renders per frame
- `will-change: transform` on paper elements for GPU compositing
- `requestAnimationFrame` loop with delta-time normalization

### 3.4 Zustand Store

```typescript
interface PaperStore {
  papers: Paper[];
  cursorPosition: { x: number; y: number };
  scrollVelocity: number;
  windEnabled: boolean;

  registerPaper: (section: string, config: PaperConfig) => string;
  removePaper: (id: string) => void;
  updatePositions: () => void;  // called from rAF loop
}
```

---

## 4. Section Designs

### 4.1 Hero Section

- Full viewport height
- Name centered: "M. AKTARUZZAMAN JOTI" in large bold text
- Role label: "// FRONTEND ENGINEER" above name, small uppercase
- Tagline below: "Building interactive experiences with physics & precision"
- 6-8 floating paper elements around the name with code snippets, skill lists, metrics
- Scroll indicator: thin animated line + "SCROLL TO EXPLORE" text
- Bottom debug bar: live physics stats (FPS, paper count, wind vector)
- **Entrance animation:** Papers fly in from edges over 1.5s with staggered delays, settle into floating positions

### 4.2 About Section

- Two-column layout
- **Left column:** Bio as a paper card with slight rotation. Contains professional summary, engineering philosophy.
- **Right column:** Two smaller floating papers stacked — focus areas (listed with arrow prefixes) and quick metrics (years, projects, components) with animated counters.
- Papers sway gently, respond to cursor.

### 4.3 Skills Section

- Node graph visualization on the blueprint grid
- **Category nodes:** Larger rectangles (e.g., "FRONTEND", "TOOLS", "ANIMATION")
- **Skill nodes:** Smaller rounded rectangles connected to categories via dashed lines
- **Connection lines:** SVG `<line>` elements with `stroke-dasharray`, animated to draw in on scroll
- **Hover interaction:** Tooltip shows proficiency bar + project count
- **Layout:** Skills positioned at specific coordinates within the section, not a grid layout

### 4.4 Experience Timeline

- Vertical timeline with centered line
- Experience cards alternate left/right along the timeline
- Each card is a paper with slight rotation ("hanging paper" effect)
- **Card content:** Role (bold), company name (accent), date range (muted), summary text
- **Timeline nodes:** Small dots on the center line, brighter for more recent roles
- **Click interaction:** Card expands to show more detail (bullet points of achievements)
- **Scroll animation:** Cards fade in with rotation as they enter viewport

### 4.5 Projects Section

- 2x2 grid of paper cards (switches to single column on mobile)
- **Default state (folded):** Compact card showing project name, one-line description, tech tags
- **Unfolded state (on click):** Card expands to reveal full description, GitHub link, live demo link. Paper fold corner effect on bottom-right.
- **Hover effect:** Elevation (increased shadow + slight scale) + reduced rotation (aligns more toward flat)
- **Tech tags:** Small pill-shaped badges with accent background

### 4.6 Engineering Section

- Animated progress bars for performance metrics
- **Metrics displayed:** Lighthouse Score, Bundle Size (gzipped), First Contentful Paint, Animation FPS Target
- Each bar has label, value, and a colored fill bar
- **Animation:** Bars fill from 0 to target width when scrolled into view (IntersectionObserver trigger)
- Color coding: green for excellent metrics, blue for good

### 4.7 Contact Section

- Single centered paper letter with fold corner effect
- Heading: "Get In Touch"
- Brief invitation text
- Social links as clipped paper tags: GitHub, LinkedIn, Twitter, Email
- Paper sways gently with slight rotation
- Links open in new tabs

---

## 5. Navigation

- **Fixed right-side dot indicators**, vertically centered
- One dot per section (Hero, About, Skills, Experience, Projects, Engineering, Contact)
- Active section dot is brighter + shows tiny label on hover
- Clicking dot triggers Lenis smooth scroll to section
- **Mobile:** Dots move to bottom as horizontal indicator strip
- No top navbar — hero section serves as the header

---

## 6. Theme System

- Two modes: Dark Blueprint (default), Light Blueprint
- Toggled via a floating button in the top-right corner (sun/moon icon)
- Implementation: CSS custom properties switch on `<html>` class change
- Zustand `theme-store` persists preference to `localStorage`
- Framer Motion animates the transition (300ms crossfade on background and paper colors)

---

## 7. Responsive Strategy

| Breakpoint | Papers | Physics | Layout |
|-----------|--------|---------|--------|
| Desktop (>1024px) | Up to 30, full wind | Full cursor interaction | Full layouts as designed |
| Tablet (768–1024px) | Max 15, reduced wind | Cursor interaction, lower sensitivity | Skills become list, timeline narrower |
| Mobile (<768px) | 5–8, minimal drift | No cursor physics | Single column, timeline stacks, project grid 1-col |

**Reduced motion:** When `prefers-reduced-motion: reduce` is detected, disable all paper physics. Show sections as static cards without floating animation. Keep scroll-triggered reveals as simple fade-ins.

---

## 8. Dependencies

| Package | Version | Purpose | Est. Size (gzip) |
|---------|---------|---------|-------------------|
| `framer-motion` | latest | Paper animation, section reveals, theme transition | ~32KB |
| `zustand` | latest | Paper engine state, theme state | ~1KB |
| `lenis` | latest | Smooth scrolling | ~6KB |
| `@radix-ui/react-slot` | latest | shadcn primitive dependency | ~1KB |
| `class-variance-authority` | latest | shadcn utility | ~1KB |
| `clsx` | latest | className utility | ~0.5KB |
| `tailwind-merge` | latest | Tailwind class merging | ~0.5KB |

**Not included:** Matter.js, GSAP, React Three Fiber, Drei — kept out to minimize bundle size.

---

## 9. Performance Targets

- **Lighthouse:** 90+ across all categories
- **Initial load:** Under 3 seconds on 4G
- **Animation:** Stable 60 FPS with 30 active papers
- **Bundle:** Under 150KB gzipped total JS
- **CLS:** Under 0.1 (fonts preloaded via `next/font`)
- **No layout shifts** from paper engine (papers are positioned absolutely in overlay)

---

## 10. Project Structure

```
app/
├── layout.tsx              # Root layout: fonts, metadata, global providers
├── page.tsx                # Single-page entry, renders all sections
├── globals.css             # Tailwind + blueprint grid CSS variables
│
components/
├── paper/
│   ├── paper-engine.tsx    # Global rAF loop + physics simulation
│   ├── paper.tsx           # Single paper element (motion.div)
│   └── paper-canvas.tsx    # Overlay container rendering all papers
│
├── sections/
│   ├── hero.tsx            # Hero with floating name/title papers
│   ├── about.tsx           # Professional summary
│   ├── skills.tsx          # Skill nodes with connection lines
│   ├── experience.tsx      # Timeline with hanging paper cards
│   ├── projects.tsx        # Project cards with unfold animations
│   ├── engineering.tsx     # Metrics and achievements
│   └── contact.tsx         # Contact info + paper letter
│
├── layout/
│   ├── navigation.tsx      # Dot indicators (fixed right/bottom)
│   └── theme-toggle.tsx    # Dark/Light blueprint switch
│
store/
├── paper-store.ts          # Zustand store for paper physics state
└── theme-store.ts          # Zustand store for theme state

hooks/
├── use-wind-physics.ts     # Hook wrapping physics calculations
├── use-cursor-position.ts  # Tracks cursor, updates store
└── use-reduced-motion.ts   # Respects prefers-reduced-motion
```

---

## 11. Build Order

1. Theme system + globals (CSS variables, fonts, blueprint grid)
2. Paper physics engine (Zustand store, rAF loop, cursor tracking)
3. Paper canvas overlay + single paper component
4. Hero section (floating papers + name)
5. About section
6. Skills section (node graph)
7. Experience section (timeline)
8. Projects section (unfold cards)
9. Engineering section (metrics bars)
10. Contact section (paper letter)
11. Navigation (dot indicators)
12. Responsive + reduced motion
13. SEO metadata + final polish
