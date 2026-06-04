"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ScoreRing({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(10, score)) / 10;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const color =
    score >= 7 ? "#3fb950" : score >= 5 ? "#d29922" : "#f85149";

  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#272e3b"
          strokeWidth="7"
        />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - pct) }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-2xl font-bold")} style={{ color }}>
          {score}
        </span>
        <span className="text-[10px] text-ide-muted">/ 10</span>
      </div>
    </div>
  );
}
