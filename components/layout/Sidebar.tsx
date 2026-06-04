"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { modules, days } from "@/data/curriculum";
import { useStore } from "@/lib/store";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/lib/utils";
import {
  Lock,
  CheckCircle2,
  Circle,
  ChevronDown,
  Terminal,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const moduleAccent: Record<number, string> = {
  1: "text-accent-violet",
  2: "text-accent-cyan",
  3: "text-accent-orange",
  4: "text-accent-blue",
  5: "text-brand-400",
  6: "text-accent-yellow",
  7: "text-accent-green",
};

function DayRow({ dayId, onClick }: { dayId: number; onClick?: () => void }) {
  const day = days.find((d) => d.id === dayId)!;
  const statusOf = useStore((s) => s.statusOf);
  const status = statusOf(dayId);
  const pathname = usePathname();
  const active = pathname === `/day/${dayId}`;
  const locked = status === "locked";

  const inner = (
    <div
      className={cn(
        "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
        active && "bg-brand-600/15 ring-1 ring-brand-600/30",
        !active && !locked && "hover:bg-ide-panel2",
        locked && "opacity-50"
      )}
    >
      {status === "completed" ? (
        <CheckCircle2 size={16} className="shrink-0 text-accent-green" />
      ) : status === "active" ? (
        <Circle size={16} className="shrink-0 text-accent-blue" />
      ) : (
        <Lock size={14} className="shrink-0 text-ide-muted" />
      )}
      <span className="shrink-0 font-mono text-xs text-ide-muted">
        D{String(dayId).padStart(2, "0")}
      </span>
      <span
        className={cn(
          "truncate",
          active ? "font-medium text-ide-text" : "text-ide-muted group-hover:text-ide-text"
        )}
      >
        {day.title}
      </span>
    </div>
  );

  if (locked) return <div title="Completa el día anterior para desbloquear">{inner}</div>;
  return <Link href={`/day/${dayId}`} onClick={onClick}>{inner}</Link>;
}

function ModuleGroup({ moduleId, onItemClick }: { moduleId: number; onItemClick?: () => void }) {
  const mod = modules.find((m) => m.id === moduleId)!;
  const completedDays = useStore((s) => s.completedDays);
  const doneInModule = mod.dayIds.filter((id) => completedDays.includes(id)).length;
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-ide-panel2"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("font-mono text-xs", moduleAccent[moduleId])}>
              M{moduleId}
            </span>
            <span className="truncate text-sm font-semibold">{mod.title}</span>
          </div>
          <span className="ml-7 text-[11px] text-ide-muted">
            {doneInModule}/{mod.dayIds.length} · {mod.range}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-ide-muted transition-transform",
            !open && "-rotate-90"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-1 space-y-0.5 pl-1">
              {mod.dayIds.map((id) => (
                <DayRow key={id} dayId={id} onClick={onItemClick} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Sidebar({ onOpenSettings, onItemClick }: { onOpenSettings: () => void; onItemClick?: () => void }) {
  const globalProgress = useStore((s) => s.globalProgress());

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2.5 px-4 py-5" onClick={onItemClick}>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 shadow-lg shadow-brand-600/30">
          <Terminal size={18} className="text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold">DevEnglish</div>
          <div className="text-[11px] text-ide-muted">The 35-Day Bootcamp</div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <ProgressBar value={globalProgress} />
      </div>

      {/* Modules */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-3 pb-4">
        {modules.map((m) => (
          <ModuleGroup key={m.id} moduleId={m.id} onItemClick={onItemClick} />
        ))}
      </nav>

      {/* Settings */}
      <div className="border-t border-ide-border p-3">
        <button
          onClick={() => {
            onOpenSettings();
            onItemClick?.();
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ide-muted hover:bg-ide-panel2 hover:text-ide-text"
        >
          <Settings size={16} />
          Ajustes & API Key
        </button>
      </div>
    </div>
  );
}
