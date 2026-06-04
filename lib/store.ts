"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AIResult, DayStatus, GameKey } from "./types";
import { TOTAL_DAYS } from "@/data/curriculum";

const DEFAULT_MODEL =
  process.env.NEXT_PUBLIC_DEFAULT_MODEL || "openrouter/free";

interface StoredAIResult extends AIResult {
  text: string;
}

interface BootcampState {
  // settings
  apiKey: string;
  model: string;
  // progress
  completedDays: number[];
  gameProgress: Record<number, Partial<Record<GameKey, boolean>>>;
  aiResults: Record<number, StoredAIResult>;

  // actions
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  completeDay: (id: number) => void;
  uncompleteDay: (id: number) => void;
  markGameDone: (dayId: number, game: GameKey) => void;
  saveAiResult: (dayId: number, result: StoredAIResult) => void;
  resetProgress: () => void;

  // selectors
  isUnlocked: (id: number) => boolean;
  statusOf: (id: number) => DayStatus;
  isGameDone: (dayId: number, game: GameKey) => boolean;
  globalProgress: () => number;
}

export const useStore = create<BootcampState>()(
  persist(
    (set, get) => ({
      apiKey: "",
      model: DEFAULT_MODEL,
      completedDays: [],
      gameProgress: {},
      aiResults: {},

      setApiKey: (key) => set({ apiKey: key.trim() }),
      setModel: (model) => set({ model }),

      completeDay: (id) =>
        set((s) =>
          s.completedDays.includes(id)
            ? s
            : { completedDays: [...s.completedDays, id].sort((a, b) => a - b) }
        ),

      uncompleteDay: (id) =>
        set((s) => ({
          completedDays: s.completedDays.filter((d) => d !== id),
        })),

      markGameDone: (dayId, game) =>
        set((s) => ({
          gameProgress: {
            ...s.gameProgress,
            [dayId]: { ...s.gameProgress[dayId], [game]: true },
          },
        })),

      saveAiResult: (dayId, result) =>
        set((s) => ({
          aiResults: { ...s.aiResults, [dayId]: result },
        })),

      resetProgress: () =>
        set({ completedDays: [], gameProgress: {}, aiResults: {} }),

      isUnlocked: (id) => {
        if (id <= 1) return true;
        return get().completedDays.includes(id - 1);
      },

      statusOf: (id) => {
        const s = get();
        if (s.completedDays.includes(id)) return "completed";
        if (s.isUnlocked(id)) return "active";
        return "locked";
      },

      isGameDone: (dayId, game) => Boolean(get().gameProgress[dayId]?.[game]),

      globalProgress: () =>
        Math.round((get().completedDays.length / TOTAL_DAYS) * 100),
    }),
    {
      name: "devenglish-store",
      version: 1,
    }
  )
);
