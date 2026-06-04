"use client";

import { useState, useCallback } from "react";
import { useStore } from "@/lib/store";
import { evaluateWriting, OpenRouterError } from "@/lib/openrouter";
import type { AIResult } from "@/lib/types";

interface UseAITutorReturn {
  evaluate: (objective: string, userText: string, dayId: number) => Promise<void>;
  loading: boolean;
  error: string | null;
  errorCode: string | null;
  result: AIResult | null;
  reset: () => void;
}

export function useAITutor(): UseAITutorReturn {
  const apiKey = useStore((s) => s.apiKey);
  const model = useStore((s) => s.model);
  const saveAiResult = useStore((s) => s.saveAiResult);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [result, setResult] = useState<AIResult | null>(null);

  const evaluate = useCallback(
    async (objective: string, userText: string, dayId: number) => {
      setLoading(true);
      setError(null);
      setErrorCode(null);
      setResult(null);
      try {
        const res = await evaluateWriting({ apiKey, model, objective, userText });
        setResult(res);
        saveAiResult(dayId, { ...res, text: userText });
      } catch (e) {
        if (e instanceof OpenRouterError) {
          setError(e.message);
          setErrorCode(e.code ?? null);
        } else {
          setError("Algo salió mal. Intenta de nuevo.");
        }
      } finally {
        setLoading(false);
      }
    },
    [apiKey, model, saveAiResult]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setErrorCode(null);
  }, []);

  return { evaluate, loading, error, errorCode, result, reset };
}
