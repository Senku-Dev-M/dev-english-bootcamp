"use client";

import { useCallback } from "react";

/** Text-to-speech para pronunciar términos en inglés (Web Speech API nativa). */
export function useSpeech() {
  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    // Prefiere una voz en inglés si está disponible
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find((v) => v.lang.startsWith("en"));
    if (enVoice) utterance.voice = enVoice;
    window.speechSynthesis.speak(utterance);
  }, []);

  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  return { speak, supported };
}
