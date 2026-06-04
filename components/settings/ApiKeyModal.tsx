"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { KeyRound, ExternalLink, Check } from "lucide-react";

const SUGGESTED_MODELS = [
  "google/gemini-flash-1.5",
  "meta-llama/llama-3-8b-instruct",
  "openai/gpt-4o-mini",
  "anthropic/claude-3-haiku",
];

export function ApiKeyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const apiKey = useStore((s) => s.apiKey);
  const model = useStore((s) => s.model);
  const setApiKey = useStore((s) => s.setApiKey);
  const setModel = useStore((s) => s.setModel);

  const [localKey, setLocalKey] = useState(apiKey);
  const [localModel, setLocalModel] = useState(model);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalKey(apiKey);
    setLocalModel(model);
  }, [apiKey, model, open]);

  const save = () => {
    setApiKey(localKey);
    setModel(localModel);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 700);
  };

  return (
    <Modal open={open} onClose={onClose} title="Ajustes del AI Tutor">
      <div className="space-y-4">
        <p className="text-sm text-ide-muted">
          DevEnglish usa tu propia API Key de OpenRouter (modelo BYOK). Se guarda
          solo en este navegador (localStorage) y nunca se envía a otro sitio.
        </p>

        <label className="block space-y-1.5">
          <span className="flex items-center gap-1.5 text-sm font-medium">
            <KeyRound size={14} className="text-brand-400" /> OpenRouter API Key
          </span>
          <input
            type="password"
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            placeholder="sk-or-v1-..."
            className="w-full rounded-lg border border-ide-border bg-ide-bg px-3 py-2 font-mono text-sm outline-none focus:border-brand-500"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Modelo</span>
          <input
            list="models"
            value={localModel}
            onChange={(e) => setLocalModel(e.target.value)}
            className="w-full rounded-lg border border-ide-border bg-ide-bg px-3 py-2 font-mono text-sm outline-none focus:border-brand-500"
          />
          <datalist id="models">
            {SUGGESTED_MODELS.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </label>

        <a
          href="https://openrouter.ai/keys"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-accent-blue hover:underline"
        >
          Consigue una API Key gratis <ExternalLink size={12} />
        </a>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant={saved ? "success" : "primary"} onClick={save}>
            {saved ? (
              <>
                <Check size={16} /> Guardado
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
