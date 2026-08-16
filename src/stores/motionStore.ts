'use client';

import { create } from 'zustand';

type Direction = 'up' | 'down' | 'idle';

type MotionState = {
  scrollProgress: number;
  scrollVelocity: number;
  normalizedVelocity: number;
  direction: Direction;
  activeSection: string;
  sectionProgress: number;
  pointerX: number;
  pointerY: number;
  quality: 'ultra' | 'high' | 'medium' | 'low';
  setScroll: (scrollProgress: number, scrollVelocity: number, direction: Direction) => void;
  setSection: (activeSection: string, sectionProgress: number) => void;
  setPointer: (pointerX: number, pointerY: number) => void;
  setQuality: (quality: MotionState['quality']) => void;
};

export const useMotionStore = create<MotionState>((set) => ({
  scrollProgress: 0,
  scrollVelocity: 0,
  normalizedVelocity: 0,
  direction: 'idle',
  activeSection: 'intro',
  sectionProgress: 0,
  pointerX: 0.5,
  pointerY: 0.5,
  quality: 'high',
  setScroll: (scrollProgress, scrollVelocity, direction) => set({
    scrollProgress,
    scrollVelocity,
    normalizedVelocity: Math.min(1, Math.abs(scrollVelocity) / 2.2),
    direction,
  }),
  setSection: (activeSection, sectionProgress) => set({ activeSection, sectionProgress }),
  setPointer: (pointerX, pointerY) => set({ pointerX, pointerY }),
  setQuality: (quality) => set({ quality }),
}));
