import type { GrammarRule } from "@/lib/types";
import { GraduationCap, ArrowRight } from "lucide-react";

export function GrammarBox({ rule }: { rule: GrammarRule }) {
  return (
    <div className="rounded-xl border border-brand-600/30 bg-brand-600/10 p-5">
      <div className="mb-2 flex items-center gap-2">
        <GraduationCap size={18} className="text-brand-400" />
        <h2 className="text-lg font-semibold text-ide-text">{rule.title}</h2>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-ide-text/85">
        {rule.explanation}
      </p>
      <ul className="space-y-2">
        {rule.examples.map((ex, i) => (
          <li
            key={i}
            className="flex items-start gap-2 rounded-lg bg-ide-bg/60 px-3 py-2 font-mono text-sm"
          >
            <ArrowRight size={14} className="mt-1 shrink-0 text-brand-400" />
            <span className="text-ide-text/90">{ex}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
