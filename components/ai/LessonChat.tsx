"use client";

import { useState, useRef, useEffect } from "react";
import type { Day } from "@/lib/types";
import { useLessonChat } from "@/hooks/useLessonChat";
import { useStore } from "@/lib/store";
import { useUIStore } from "@/lib/uiStore";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  Send,
  Loader2,
  Trash2,
  AlertTriangle,
  KeyRound,
  Bot,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-current"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  );
}

export function LessonChat({ day }: { day: Day }) {
  const apiKey = useStore((s) => s.apiKey);
  const openSettings = useUIStore((s) => s.openSettings);

  const { messages, loading, error, errorCode, send, clear } = useLessonChat(day);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    await send(text);
    inputRef.current?.focus();
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <Card className="border-accent-cyan/30">
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle icon={<MessageCircle size={18} className="text-accent-cyan" />}>
          Lesson Chat
          <span className="ml-2 text-xs font-normal text-ide-muted">
            — pregunta lo que quieras sobre este tema
          </span>
        </SectionTitle>
        {!isEmpty && (
          <Button variant="ghost" size="sm" onClick={clear} title="Limpiar chat">
            <Trash2 size={14} />
          </Button>
        )}
      </div>

      {/* Context badge */}
      <div className="mb-3 flex items-center gap-2 rounded-lg border border-accent-cyan/20 bg-accent-cyan/5 px-3 py-2 text-xs text-ide-muted">
        <Bot size={13} className="shrink-0 text-accent-cyan" />
        <span>
          Contexto cargado:{" "}
          <span className="font-medium text-ide-text">
            Day {day.id} · {day.title}
          </span>{" "}
          ({day.vocabulary.length} términos, {day.grammar ? "gramática incluida" : "sin gramática"})
        </span>
      </div>

      {/* Message list */}
      <div className="mb-3 h-64 overflow-y-auto rounded-lg border border-ide-border bg-ide-bg/60 p-3 sm:h-72">
        {isEmpty && !loading && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-ide-muted">
            <MessageCircle size={28} className="text-accent-cyan/40" />
            <p>
              ¿Tienes dudas sobre{" "}
              <span className="font-medium text-ide-text">{day.title}</span>?
            </p>
            <p className="text-xs">
              Pregúntame sobre el vocabulario, gramática o cualquier ejemplo de la lección.
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "mb-3 flex gap-2",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs",
                  msg.role === "user"
                    ? "bg-brand-600 text-white"
                    : "bg-accent-cyan/20 text-accent-cyan"
                )}
              >
                {msg.role === "user" ? <User size={13} /> : <Bot size={13} />}
              </div>

              {/* Bubble */}
              <div
                className={cn(
                  "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "rounded-tr-sm bg-brand-600/20 text-ide-text"
                    : "rounded-tl-sm bg-ide-panel2 text-ide-text"
                )}
              >
                {/* Preserve newlines from the AI response */}
                {msg.content.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < msg.content.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading bubble */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 flex gap-2"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-cyan/20 text-accent-cyan">
              <Bot size={13} />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-ide-panel2 px-4 py-3 text-sm text-ide-muted">
              <TypingDots />
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-3 flex items-start gap-2 rounded-lg border border-accent-red/30 bg-accent-red/10 px-3 py-2 text-sm text-accent-red">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <p>{error}</p>
            {(errorCode === "NO_KEY" || errorCode === "UNAUTHORIZED") && (
              <Button variant="danger" size="sm" onClick={openSettings}>
                <KeyRound size={13} /> Configurar API Key
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={`Pregunta algo sobre "${day.title}"… (Enter para enviar)`}
          rows={2}
          className="flex-1 resize-none rounded-xl border border-ide-border bg-ide-bg px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-accent-cyan/60"
        />
        <Button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="shrink-0 !bg-accent-cyan/20 !text-accent-cyan hover:!bg-accent-cyan/30 border border-accent-cyan/30"
          size="md"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </Button>
      </div>

      {!apiKey && (
        <p className="mt-2 text-xs text-ide-muted">
          💡 Necesitas una API Key.{" "}
          <button onClick={openSettings} className="text-accent-cyan hover:underline">
            Configúrala aquí
          </button>
          .
        </p>
      )}
    </Card>
  );
}
