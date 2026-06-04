"use client";

import { useState, useCallback, useRef } from "react";
import type { Day } from "@/lib/types";
import { useStore } from "@/lib/store";
import { chatWithContext, OpenRouterError, type ChatMessage } from "@/lib/openrouter";
import { buildLessonSystemPrompt } from "@/lib/lessonContext";

export interface ChatEntry extends ChatMessage {
  id: string;
}

interface UseLessonChatReturn {
  messages: ChatEntry[];
  loading: boolean;
  error: string | null;
  errorCode: string | null;
  send: (text: string) => Promise<void>;
  clear: () => void;
}

export function useLessonChat(day: Day): UseLessonChatReturn {
  const apiKey = useStore((s) => s.apiKey);
  const model = useStore((s) => s.model);

  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  // Keep a ref of the current messages so the send callback always has the latest
  const messagesRef = useRef<ChatEntry[]>([]);
  messagesRef.current = messages;

  const systemPrompt = buildLessonSystemPrompt(day);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      setError(null);
      setErrorCode(null);

      const userEntry: ChatEntry = {
        id: `u-${Date.now()}`,
        role: "user",
        content: text.trim(),
      };

      const updated = [...messagesRef.current, userEntry];
      setMessages(updated);
      setLoading(true);

      try {
        // Pass only role+content to the API (strip our local id)
        const history: ChatMessage[] = updated.map(({ role, content }) => ({
          role,
          content,
        }));

        const reply = await chatWithContext({ apiKey, model, systemPrompt, messages: history });

        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: "assistant", content: reply },
        ]);
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
    [apiKey, model, systemPrompt]
  );

  const clear = useCallback(() => {
    setMessages([]);
    setError(null);
    setErrorCode(null);
  }, []);

  return { messages, loading, error, errorCode, send, clear };
}
