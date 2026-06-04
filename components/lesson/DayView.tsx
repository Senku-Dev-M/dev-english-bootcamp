"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Day } from "@/lib/types";
import { DayHeader } from "./DayHeader";
import { VocabularyTable } from "./VocabularyTable";
import { GrammarBox } from "./GrammarBox";
import { MultimediaLinks } from "./MultimediaLinks";
import { GameTabs } from "@/components/games/GameTabs";
import { AITutorChat } from "@/components/ai/AITutorChat";
import { LessonChat } from "@/components/ai/LessonChat";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { useUIStore } from "@/lib/uiStore";
import { celebrate } from "@/lib/confetti";
import { TOTAL_DAYS } from "@/data/curriculum";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  PartyPopper,
} from "lucide-react";

export function DayView({ day }: { day: Day }) {
  const router = useRouter();
  const statusOf = useStore((s) => s.statusOf);
  const completeDay = useStore((s) => s.completeDay);
  const openSettings = useUIStore((s) => s.openSettings);

  const status = statusOf(day.id);
  const isCompleted = status === "completed";
  const nextUnlocked = day.id < TOTAL_DAYS && statusOf(day.id + 1) !== "locked";

  const handleComplete = () => {
    if (!isCompleted) {
      completeDay(day.id);
      celebrate();
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 sm:py-10">
      <DayHeader day={day} status={status} />

      <VocabularyTable items={day.vocabulary} />

      {day.grammar && <GrammarBox rule={day.grammar} />}

      <GameTabs day={day} />

      <AITutorChat day={day} onOpenSettings={openSettings} />

      <LessonChat day={day} />

      <MultimediaLinks links={day.media} />

      {/* Complete + nav */}
      <div className="rounded-xl border border-ide-border card-grad p-5">
        {isCompleted ? (
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-accent-green">
            <CheckCircle2 size={18} /> ¡Día completado! Sigue con el siguiente.
          </div>
        ) : (
          <Button size="lg" className="mb-4 w-full sm:w-auto" onClick={handleComplete}>
            <PartyPopper size={18} /> Marcar día como completado
          </Button>
        )}

        <div className="flex items-center justify-between border-t border-ide-border pt-4">
          {day.id > 1 ? (
            <Link href={`/day/${day.id - 1}`}>
              <Button variant="secondary" size="sm">
                <ChevronLeft size={16} /> Día {day.id - 1}
              </Button>
            </Link>
          ) : (
            <span />
          )}

          {day.id < TOTAL_DAYS &&
            (nextUnlocked ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push(`/day/${day.id + 1}`)}
              >
                Día {day.id + 1} <ChevronRight size={16} />
              </Button>
            ) : (
              <Button variant="ghost" size="sm" disabled title="Completa este día primero">
                <Lock size={14} /> Día {day.id + 1}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
}
