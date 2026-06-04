"use client";

import Link from "next/link";
import type { Day } from "@/lib/types";
import { DayView } from "./DayView";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";

export function DayGate({ day }: { day: Day }) {
  const statusOf = useStore((s) => s.statusOf);
  const locked = statusOf(day.id) === "locked";

  if (locked) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-ide-border bg-ide-panel2">
          <Lock size={28} className="text-ide-muted" />
        </div>
        <h1 className="text-xl font-bold">Day {day.id} está bloqueado</h1>
        <p className="text-sm text-ide-muted">
          Completa el <span className="font-medium text-ide-text">Día {day.id - 1}</span>{" "}
          para desbloquear esta lección.
        </p>
        <Link href={`/day/${day.id - 1}`}>
          <Button>Ir al Día {day.id - 1}</Button>
        </Link>
      </div>
    );
  }

  return <DayView day={day} />;
}
