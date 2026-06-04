"use client";

import Link from "next/link";
import { modules, days, TOTAL_DAYS } from "@/data/curriculum";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
  Terminal,
  ArrowRight,
  CheckCircle2,
  Lock,
  Circle,
  Flame,
  Trophy,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const moduleColors: Record<number, string> = {
  1: "from-accent-violet/20 to-transparent border-accent-violet/30",
  2: "from-accent-cyan/20 to-transparent border-accent-cyan/30",
  3: "from-accent-orange/20 to-transparent border-accent-orange/30",
  4: "from-accent-blue/20 to-transparent border-accent-blue/30",
  5: "from-brand-600/20 to-transparent border-brand-600/30",
  6: "from-accent-yellow/20 to-transparent border-accent-yellow/30",
  7: "from-accent-green/20 to-transparent border-accent-green/30",
};

export function Dashboard() {
  const completedDays = useStore((s) => s.completedDays);
  const globalProgress = useStore((s) => s.globalProgress());
  const statusOf = useStore((s) => s.statusOf);

  const nextDay =
    days.find((d) => !completedDays.includes(d.id) && statusOf(d.id) !== "locked")
      ?.id ?? TOTAL_DAYS;
  const started = completedDays.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 shadow-xl shadow-brand-600/30">
          <Terminal size={26} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          DevEnglish: The 35-Day Bootcamp
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ide-muted">
          Inglés técnico para developers hispanohablantes. Vocabulario real,
          gramática aplicada al código, mini-juegos y un Tech Lead de IA que
          revisa tu escritura.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href={`/day/${nextDay}`}>
            <Button size="lg">
              {started ? "Continuar" : "Empezar"} · Día {nextDay}
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          <Stat icon={<Trophy size={18} />} label="Completados" value={`${completedDays.length}/${TOTAL_DAYS}`} />
          <Stat icon={<Flame size={18} />} label="Progreso" value={`${globalProgress}%`} />
          <Stat icon={<Sparkles size={18} />} label="Módulos" value={`${modules.length}`} />
        </div>
      </motion.div>

      {/* Modules */}
      <div className="space-y-6">
        {modules.map((mod, mi) => {
          const done = mod.dayIds.filter((id) => completedDays.includes(id)).length;
          return (
            <motion.section
              key={mod.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mi * 0.05 }}
              className={cn(
                "rounded-2xl border bg-gradient-to-br p-5",
                moduleColors[mod.id]
              )}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-ide-muted">
                      M{mod.id}
                    </span>
                    <h2 className="text-lg font-bold">{mod.title}</h2>
                  </div>
                  <p className="text-sm text-ide-muted">{mod.subtitle}</p>
                </div>
                <Badge tone={done === mod.dayIds.length ? "green" : "neutral"}>
                  {done}/{mod.dayIds.length}
                </Badge>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {mod.dayIds.map((id) => {
                  const day = days.find((d) => d.id === id)!;
                  const status = statusOf(id);
                  const locked = status === "locked";
                  const inner = (
                    <div
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg border border-ide-border bg-ide-bg/40 px-3 py-2.5 text-sm transition-colors",
                        !locked && "hover:border-brand-600/40 hover:bg-ide-panel2",
                        locked && "opacity-50"
                      )}
                    >
                      {status === "completed" ? (
                        <CheckCircle2 size={16} className="shrink-0 text-accent-green" />
                      ) : status === "active" ? (
                        <Circle size={16} className="shrink-0 text-accent-blue" />
                      ) : (
                        <Lock size={14} className="shrink-0 text-ide-muted" />
                      )}
                      <span className="font-mono text-xs text-ide-muted">
                        D{String(id).padStart(2, "0")}
                      </span>
                      <span className="truncate">{day.title}</span>
                    </div>
                  );
                  return locked ? (
                    <div key={id} title="Bloqueado">
                      {inner}
                    </div>
                  ) : (
                    <Link key={id} href={`/day/${id}`}>
                      {inner}
                    </Link>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </div>

      <p className="mt-10 text-center text-xs text-ide-muted">
        Tu progreso se guarda automáticamente en este navegador.
      </p>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-ide-border bg-ide-panel2/50 p-3">
      <div className="mb-1 flex items-center justify-center text-brand-400">
        {icon}
      </div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-[11px] text-ide-muted">{label}</div>
    </div>
  );
}
