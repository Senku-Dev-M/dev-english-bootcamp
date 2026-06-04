"use client";

import { useMemo, useState, useEffect } from "react";
import type { BugHunter as BugHunterData } from "@/lib/types";
import { shuffle, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, RotateCcw, Bug } from "lucide-react";

export function BugHunter({
  data,
  onWin,
}: {
  data: BugHunterData;
  onWin?: () => void;
}) {
  const segments = useMemo(() => data.template.split("___"), [data.template]);
  const blanksCount = segments.length - 1;

  const [filled, setFilled] = useState<(string | null)[]>([]);
  const [bank, setBank] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const reset = () => {
    setFilled(Array(blanksCount).fill(null));
    setBank(shuffle(data.wordBank));
    setChecked(false);
  };

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const placeWord = (word: string) => {
    if (checked) return;
    const idx = filled.findIndex((f) => f === null);
    if (idx === -1) return;
    const next = [...filled];
    next[idx] = word;
    setFilled(next);
    setBank((b) => {
      const i = b.indexOf(word);
      if (i === -1) return b;
      const copy = [...b];
      copy.splice(i, 1);
      return copy;
    });
  };

  const removeWord = (idx: number) => {
    if (checked) return;
    const word = filled[idx];
    if (!word) return;
    const next = [...filled];
    next[idx] = null;
    setFilled(next);
    setBank((b) => [...b, word]);
  };

  const allFilled = filled.every((f) => f !== null);
  const correct = filled.map((f, i) => f === data.answers[i]);
  const allCorrect = correct.every(Boolean) && allFilled;

  useEffect(() => {
    if (checked && allCorrect) onWin?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, allCorrect]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-ide-muted">{data.intro}</p>

      {/* Sentence with blanks */}
      <div className="rounded-xl border border-ide-border bg-ide-bg p-4 font-mono text-sm leading-loose">
        {segments.map((seg, i) => (
          <span key={i}>
            <span className="text-ide-text/90">{seg}</span>
            {i < blanksCount && (
              <button
                onClick={() => removeWord(i)}
                className={cn(
                  "mx-1 inline-flex min-w-[80px] items-center justify-center rounded-md border px-2 py-0.5 align-middle",
                  filled[i] === null && "border-dashed border-ide-muted text-ide-muted",
                  filled[i] !== null && !checked && "border-brand-500 bg-brand-600/20 text-ide-text",
                  checked && correct[i] && "border-accent-green/50 bg-accent-green/15 text-accent-green",
                  checked && !correct[i] && "border-accent-red/50 bg-accent-red/15 text-accent-red"
                )}
              >
                {filled[i] ?? "____"}
              </button>
            )}
          </span>
        ))}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2">
        {bank.map((word, i) => (
          <button
            key={`${word}-${i}`}
            onClick={() => placeWord(word)}
            disabled={checked}
            className="rounded-lg border border-ide-border bg-ide-panel2 px-3 py-1.5 font-mono text-sm transition-colors hover:border-brand-600/40 hover:bg-ide-border disabled:opacity-50"
          >
            {word}
          </button>
        ))}
        {bank.length === 0 && !checked && (
          <span className="text-xs text-ide-muted">
            Todas las palabras colocadas — pulsa Comprobar.
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!checked ? (
          <Button size="sm" disabled={!allFilled} onClick={() => setChecked(true)}>
            <Bug size={14} /> Comprobar
          </Button>
        ) : allCorrect ? (
          <span className="flex items-center gap-2 text-sm font-medium text-accent-green">
            <CheckCircle2 size={16} /> ¡Perfecto! Sin bugs.
          </span>
        ) : (
          <span className="text-sm font-medium text-accent-red">
            Aún hay bugs. Revisa los campos en rojo.
          </span>
        )}
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw size={14} /> Reiniciar
        </Button>
      </div>
    </div>
  );
}
