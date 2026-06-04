"use client";

import { useMemo, useState, useEffect } from "react";
import type { MatchPair } from "@/lib/types";
import { shuffle, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { RotateCcw, Trophy } from "lucide-react";

interface CardItem {
  id: string;
  pairId: number;
  label: string;
  side: "en" | "es";
}

export function MatchCardsGame({
  pairs,
  onWin,
}: {
  pairs: MatchPair[];
  onWin?: () => void;
}) {
  const build = () => {
    const cards: CardItem[] = [];
    pairs.forEach((p, i) => {
      cards.push({ id: `en-${i}`, pairId: i, label: p.en, side: "en" });
      cards.push({ id: `es-${i}`, pairId: i, label: p.es, side: "es" });
    });
    return shuffle(cards);
  };

  const [deck, setDeck] = useState<CardItem[]>([]);
  const [selected, setSelected] = useState<CardItem | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [tries, setTries] = useState(0);

  useEffect(() => {
    setDeck(build());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairs]);

  const won = matched.size === pairs.length && pairs.length > 0;

  useEffect(() => {
    if (won) onWin?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won]);

  const reset = () => {
    setDeck(build());
    setSelected(null);
    setMatched(new Set());
    setWrong(null);
    setTries(0);
  };

  const handleClick = (card: CardItem) => {
    if (matched.has(card.pairId) || wrong) return;
    if (!selected) {
      setSelected(card);
      return;
    }
    if (selected.id === card.id) {
      setSelected(null);
      return;
    }
    setTries((t) => t + 1);
    if (selected.pairId === card.pairId) {
      setMatched((m) => new Set(m).add(card.pairId));
      setSelected(null);
    } else {
      setWrong(card.id);
      setTimeout(() => {
        setWrong(null);
        setSelected(null);
      }, 700);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-ide-muted">
        <span>
          Empareja el término en <span className="text-accent-blue">inglés</span> con
          su traducción.
        </span>
        <span className="font-mono">
          {matched.size}/{pairs.length} · {tries} intentos
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {deck.map((card) => {
          const isMatched = matched.has(card.pairId);
          const isSelected = selected?.id === card.id;
          const isWrong = wrong === card.id || (wrong && isSelected);
          return (
            <motion.button
              key={card.id}
              layout
              disabled={isMatched}
              onClick={() => handleClick(card)}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "min-h-[64px] rounded-xl border p-3 text-center text-sm transition-colors",
                isMatched &&
                  "border-accent-green/40 bg-accent-green/15 text-accent-green",
                isWrong && "border-accent-red/50 bg-accent-red/15 text-accent-red",
                isSelected &&
                  !isWrong &&
                  "border-brand-500 bg-brand-600/20 text-ide-text",
                !isMatched &&
                  !isSelected &&
                  !isWrong &&
                  "border-ide-border bg-ide-panel2 hover:border-brand-600/40 text-ide-text"
              )}
            >
              <span className={cn(card.side === "en" && "font-mono")}>
                {card.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {won ? (
        <div className="flex items-center justify-between rounded-lg border border-accent-green/30 bg-accent-green/10 p-3">
          <span className="flex items-center gap-2 text-sm font-medium text-accent-green">
            <Trophy size={16} /> ¡Completado en {tries} intentos!
          </span>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw size={14} /> Otra vez
          </Button>
        </div>
      ) : (
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw size={14} /> Reiniciar
        </Button>
      )}
    </div>
  );
}
