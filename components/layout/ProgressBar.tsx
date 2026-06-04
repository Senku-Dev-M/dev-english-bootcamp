"use client";

import { motion } from "framer-motion";

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-ide-muted">Progreso global</span>
        <span className="font-semibold text-brand-400">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ide-panel2">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-blue"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
