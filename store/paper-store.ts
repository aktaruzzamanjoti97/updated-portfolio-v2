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
  content: string;
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
