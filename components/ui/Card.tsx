import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-ide-border card-grad p-5 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  icon,
  children,
  hint,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      {icon && <span className="text-brand-400">{icon}</span>}
      <h2 className="text-lg font-semibold text-ide-text">{children}</h2>
      {hint && <span className="text-xs text-ide-muted">{hint}</span>}
    </div>
  );
}
