"use client";

import type { Day, DayStatus } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { modules } from "@/data/curriculum";
import { Target, CheckCircle2, Circle } from "lucide-react";

export function DayHeader({ day, status }: { day: Day; status: DayStatus }) {
  const mod = modules.find((m) => m.id === day.module)!;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand">
          Module {day.module} · {mod.title}
        </Badge>
        <Badge tone="neutral">Day {day.id} / 20</Badge>
        {status === "completed" ? (
          <Badge tone="green">
            <CheckCircle2 size={12} /> Completado
          </Badge>
        ) : (
          <Badge tone="blue">
            <Circle size={12} /> En curso
          </Badge>
        )}
      </div>

      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        <span className="font-mono text-brand-400">Day {day.id}:</span> {day.title}
      </h1>

      <div className="flex items-start gap-2 rounded-lg border border-ide-border bg-ide-panel2/50 p-3">
        <Target size={16} className="mt-0.5 shrink-0 text-accent-yellow" />
        <p className="text-sm text-ide-text/85">
          <span className="font-semibold text-ide-text">Objetivo:</span>{" "}
          {day.objective}
        </p>
      </div>
    </div>
  );
}
