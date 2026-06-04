"use client";

import { useState } from "react";
import type { Day } from "@/lib/types";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { useAITutor } from "@/hooks/useAITutor";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Send,
  Loader2,
  RotateCcw,
  AlertTriangle,
  KeyRound,
  ClipboardCheck,
} from "lucide-react";

export function AITutorChat({
  day,
  onOpenSettings,
}: {
  day: Day;
  onOpenSettings: () => void;
}) {
  const apiKey = useStore((s) => s.apiKey);
  const saved = useStore((s) => s.aiResults[day.id]);
  const { evaluate, loading, error, errorCode, result, reset } = useAITutor();

  const [text, setText] = useState(saved?.text ?? "");

  const shown = result ?? (saved ? { ...saved } : null);
  const good = (shown?.score ?? 0) >= 7;

  const handleSubmit = () => {
    if (!text.trim()) return;
    evaluate(day.aiTask.objective, text.trim(), day.id);
  };

  return (
    <Card className="border-brand-600/30">
      <SectionTitle icon={<Sparkles size={18} />} hint="OpenRouter">
        Daily Code Review · AI Tutor
      </SectionTitle>

      <div className="mb-3 rounded-lg border border-ide-border bg-ide-panel2/50 p-3 text-sm">
        <span className="font-semibold text-brand-400">Tu reto de hoy: </span>
        <span className="text-ide-text/90">
          {day.aiTask.promptHint}
        </span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={day.aiTask.placeholder}
        rows={5}
        className="w-full resize-y rounded-lg border border-ide-border bg-ide-bg p-3 font-mono text-sm leading-relaxed outline-none focus:border-brand-500"
      />

      <div className="mt-3 flex items-center gap-2">
        <Button onClick={handleSubmit} disabled={loading || !text.trim()}>
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Evaluando…
            </>
          ) : (
            <>
              <Send size={16} /> Enviar al Tech Lead
            </>
          )}
        </Button>
        {shown && !loading && (
          <Button
            variant="ghost"
            onClick={() => {
              reset();
            }}
          >
            <RotateCcw size={14} /> Reintentar
          </Button>
        )}
        <span className="ml-auto text-xs text-ide-muted">
          {text.trim().split(/\s+/).filter(Boolean).length} palabras
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-accent-red/30 bg-accent-red/10 p-3 text-sm text-accent-red">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <div className="space-y-2">
            <p>{error}</p>
            {(errorCode === "NO_KEY" || errorCode === "UNAUTHORIZED") && (
              <Button variant="danger" size="sm" onClick={onOpenSettings}>
                <KeyRound size={14} /> Configurar API Key
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Result */}
      {shown && !error && (
        <div
          className={cn(
            "mt-4 rounded-xl border p-4",
            good
              ? "border-accent-green/30 bg-accent-green/10"
              : "border-accent-red/30 bg-accent-red/10"
          )}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <ScoreRing score={shown.score} />
            <div className="min-w-0 flex-1">
              <h4
                className={cn(
                  "mb-1 font-semibold",
                  good ? "text-accent-green" : "text-accent-red"
                )}
              >
                {good ? "¡Buen trabajo! 🚀" : "A seguir practicando 💪"}
              </h4>
              <p className="text-sm text-ide-text/90">{shown.feedback}</p>
            </div>
          </div>

          {shown.corrected_text && (
            <div className="mt-4">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ide-muted">
                <ClipboardCheck size={13} /> Versión corregida
              </div>
              <p className="rounded-lg border border-ide-border bg-ide-bg p-3 font-mono text-sm leading-relaxed text-ide-text/90">
                {shown.corrected_text}
              </p>
            </div>
          )}
        </div>
      )}

      {!apiKey && !error && (
        <p className="mt-3 text-xs text-ide-muted">
          💡 Necesitas una API Key de OpenRouter.{" "}
          <button onClick={onOpenSettings} className="text-accent-blue hover:underline">
            Configúrala aquí
          </button>
          .
        </p>
      )}
    </Card>
  );
}
