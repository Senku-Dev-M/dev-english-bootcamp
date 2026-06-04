"use client";

import type { VocabItem } from "@/lib/types";
import { Card, SectionTitle } from "@/components/ui/Card";
import { useSpeech } from "@/hooks/useSpeech";
import { BookOpen, Volume2 } from "lucide-react";

export function VocabularyTable({ items }: { items: VocabItem[] }) {
  const { speak, supported } = useSpeech();

  return (
    <Card>
      <SectionTitle icon={<BookOpen size={18} />} hint={`${items.length} términos`}>
        Vocabulary
      </SectionTitle>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-ide-border text-left text-xs uppercase tracking-wide text-ide-muted">
              <th className="py-2 pr-4 font-medium">English Term</th>
              <th className="py-2 pr-4 font-medium">Español</th>
              <th className="py-2 font-medium">Context Example</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr
                key={it.term}
                className="border-b border-ide-border/60 align-top last:border-0 hover:bg-ide-panel2/40"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-accent-blue">
                      {it.term}
                    </span>
                    {supported && (
                      <button
                        onClick={() => speak(it.term)}
                        className="text-ide-muted hover:text-brand-400"
                        aria-label={`Pronunciar ${it.term}`}
                        title="Escuchar pronunciación"
                      >
                        <Volume2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="py-3 pr-4 text-ide-muted">{it.translation}</td>
                <td className="py-3 italic text-ide-text/80">“{it.example}”</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
