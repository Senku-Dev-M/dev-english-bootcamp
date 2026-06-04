import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "green" | "red" | "yellow" | "blue";

const tones: Record<Tone, string> = {
  neutral: "bg-ide-panel2 text-ide-muted border-ide-border",
  brand: "bg-brand-600/15 text-brand-400 border-brand-600/30",
  green: "bg-accent-green/15 text-accent-green border-accent-green/30",
  red: "bg-accent-red/15 text-accent-red border-accent-red/30",
  yellow: "bg-accent-yellow/15 text-accent-yellow border-accent-yellow/30",
  blue: "bg-accent-blue/15 text-accent-blue border-accent-blue/30",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
