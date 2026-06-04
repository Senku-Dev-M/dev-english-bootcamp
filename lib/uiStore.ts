"use client";

import { create } from "zustand";

interface UIState {
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

/** Estado de UI efímero (no se persiste). */
export const useUIStore = create<UIState>((set) => ({
  settingsOpen: false,
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
}));
