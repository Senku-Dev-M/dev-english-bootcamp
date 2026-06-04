"use client";

import { useState } from "react";
import type { Day, GameKey } from "@/lib/types";
import { Card, SectionTitle } from "@/components/ui/Card";
import { MatchCardsGame } from "./MatchCardsGame";
import { BugHunter } from "./BugHunter";
import { TechWordle } from "./TechWordle";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Gamepad2, Check, Layers, Bug, Type } from "lucide-react";

const meta: Record<GameKey, { label: string; icon: React.ReactNode }> = {
  match: { label: "Match Cards", icon: <Layers size={14} /> },
  bugHunter: { label: "Bug Hunter", icon: <Bug size={14} /> },
  wordle: { label: "Tech Wordle", icon: <Type size={14} /> },
};

export function GameTabs({ day }: { day: Day }) {
  const available = (Object.keys(meta) as GameKey[]).filter(
    (k) => day.games[k] !== undefined
  );
  const [tab, setTab] = useState<GameKey>(available[0]);

  const markGameDone = useStore((s) => s.markGameDone);
  const isGameDone = useStore((s) => s.isGameDone);

  if (available.length === 0) return null;

  return (
    <Card>
      <SectionTitle icon={<Gamepad2 size={18} />} hint="Practica jugando">
        Interactive Games
      </SectionTitle>

      <div className="mb-4 flex flex-wrap gap-2">
        {available.map((k) => {
          const done = isGameDone(day.id, k);
          return (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors",
                tab === k
                  ? "border-brand-500 bg-brand-600/15 text-ide-text"
                  : "border-ide-border bg-ide-panel2 text-ide-muted hover:text-ide-text"
              )}
            >
              {meta[k].icon}
              {meta[k].label}
              {done && <Check size={13} className="text-accent-green" />}
            </button>
          );
        })}
      </div>

      <div key={tab} className="animate-fade-in">
        {tab === "match" && day.games.match && (
          <MatchCardsGame
            pairs={day.games.match}
            onWin={() => markGameDone(day.id, "match")}
          />
        )}
        {tab === "bugHunter" && day.games.bugHunter && (
          <BugHunter
            data={day.games.bugHunter}
            onWin={() => markGameDone(day.id, "bugHunter")}
          />
        )}
        {tab === "wordle" && day.games.wordle && (
          <TechWordle
            config={day.games.wordle}
            onWin={() => markGameDone(day.id, "wordle")}
          />
        )}
      </div>
    </Card>
  );
}
