"use client";

import { useState, useEffect, useCallback } from "react";
import type { WordleConfig } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Trophy, Lightbulb, Delete, CornerDownLeft } from "lucide-react";

type LetterState = "correct" | "present" | "absent" | "empty";

const KEYBOARD = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function evaluateGuess(guess: string, answer: string): LetterState[] {
  const res: LetterState[] = Array(guess.length).fill("absent");
  const answerChars = answer.split("");
  // primera pasada: correctos
  guess.split("").forEach((ch, i) => {
    if (ch === answerChars[i]) {
      res[i] = "correct";
      answerChars[i] = "";
    }
  });
  // segunda pasada: presentes
  guess.split("").forEach((ch, i) => {
    if (res[i] === "correct") return;
    const idx = answerChars.indexOf(ch);
    if (idx !== -1) {
      res[i] = "present";
      answerChars[idx] = "";
    }
  });
  return res;
}

const tileColor: Record<LetterState, string> = {
  correct: "bg-accent-green border-accent-green text-white",
  present: "bg-accent-yellow border-accent-yellow text-white",
  absent: "bg-ide-panel2 border-ide-border text-ide-muted",
  empty: "border-ide-border text-ide-text",
};

export function TechWordle({
  config,
  onWin,
}: {
  config: WordleConfig;
  onWin?: () => void;
}) {
  const answer = config.word.toUpperCase();
  const len = answer.length;
  const MAX = 6;

  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");

  const reset = useCallback(() => {
    setGuesses([]);
    setCurrent("");
    setStatus("playing");
    setShowHint(false);
  }, []);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.word]);

  const submit = useCallback(() => {
    if (current.length !== len || status !== "playing") return;
    const next = [...guesses, current];
    setGuesses(next);
    if (current === answer) {
      setStatus("won");
      onWin?.();
    } else if (next.length >= MAX) {
      setStatus("lost");
    }
    setCurrent("");
  }, [current, len, status, guesses, answer, onWin]);

  const press = useCallback(
    (key: string) => {
      if (status !== "playing") return;
      if (key === "ENTER") return submit();
      if (key === "DEL") return setCurrent((c) => c.slice(0, -1));
      if (/^[A-Z]$/.test(key) && current.length < len) {
        setCurrent((c) => c + key);
      }
    },
    [status, submit, current, len]
  );

  // teclado físico
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") press("ENTER");
      else if (e.key === "Backspace") press("DEL");
      else if (/^[a-zA-Z]$/.test(e.key)) press(e.key.toUpperCase());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  // estado por letra para colorear teclado
  const keyStates: Record<string, LetterState> = {};
  guesses.forEach((g) => {
    evaluateGuess(g, answer).forEach((st, i) => {
      const ch = g[i];
      const prev = keyStates[ch];
      if (st === "correct" || (st === "present" && prev !== "correct") || !prev) {
        keyStates[ch] = st;
      }
    });
  });

  const rows = Array.from({ length: MAX }, (_, r) => {
    if (r < guesses.length) return { guess: guesses[r], submitted: true };
    if (r === guesses.length) return { guess: current, submitted: false };
    return { guess: "", submitted: false };
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ide-muted">
          Adivina la palabra técnica de {len} letras.
        </span>
        <button
          onClick={() => setShowHint((s) => !s)}
          className="flex items-center gap-1 text-xs text-accent-yellow hover:underline"
        >
          <Lightbulb size={13} /> Pista
        </button>
      </div>
      {showHint && (
        <p className="rounded-lg border border-accent-yellow/30 bg-accent-yellow/10 px-3 py-2 text-sm text-accent-yellow">
          {config.hint}
        </p>
      )}

      {/* Grid */}
      <div className="flex flex-col items-center gap-1.5">
        {rows.map((row, r) => {
          const states = row.submitted
            ? evaluateGuess(row.guess, answer)
            : null;
          return (
            <div key={r} className="flex gap-1.5">
              {Array.from({ length: len }, (_, c) => {
                const ch = row.guess[c] ?? "";
                const st: LetterState = states ? states[c] : "empty";
                return (
                  <div
                    key={c}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-md border-2 text-lg font-bold uppercase transition-colors",
                      tileColor[st],
                      !row.submitted && ch && "border-brand-500"
                    )}
                  >
                    {ch}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Status */}
      {status === "won" && (
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-accent-green">
          <Trophy size={16} /> ¡Correcto! Era {answer}.
        </div>
      )}
      {status === "lost" && (
        <div className="text-center text-sm font-medium text-accent-red">
          La palabra era <span className="font-mono">{answer}</span>.
        </div>
      )}

      {/* On-screen keyboard */}
      {status === "playing" ? (
        <div className="space-y-1.5">
          {KEYBOARD.map((row, i) => (
            <div key={i} className="flex justify-center gap-1.5">
              {i === 2 && (
                <button
                  onClick={() => press("ENTER")}
                  className="flex h-10 items-center rounded-md bg-ide-panel2 px-2 text-xs font-medium hover:bg-ide-border"
                >
                  <CornerDownLeft size={16} />
                </button>
              )}
              {row.split("").map((k) => (
                <button
                  key={k}
                  onClick={() => press(k)}
                  className={cn(
                    "h-10 w-7 rounded-md text-sm font-medium transition-colors sm:w-8",
                    keyStates[k]
                      ? tileColor[keyStates[k]]
                      : "bg-ide-panel2 hover:bg-ide-border text-ide-text"
                  )}
                >
                  {k}
                </button>
              ))}
              {i === 2 && (
                <button
                  onClick={() => press("DEL")}
                  className="flex h-10 items-center rounded-md bg-ide-panel2 px-2 hover:bg-ide-border"
                >
                  <Delete size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center">
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw size={14} /> Jugar de nuevo
          </Button>
        </div>
      )}
    </div>
  );
}
