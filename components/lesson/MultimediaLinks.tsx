import type { MediaLink, MediaType } from "@/lib/types";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Play, Tv, FileText, BookMarked, ExternalLink, Film } from "lucide-react";

const iconFor: Record<MediaType, React.ReactNode> = {
  video: <Play size={16} className="text-accent-red" />,
  series: <Tv size={16} className="text-brand-400" />,
  article: <FileText size={16} className="text-accent-blue" />,
  docs: <BookMarked size={16} className="text-accent-green" />,
};

export function MultimediaLinks({ links }: { links: MediaLink[] }) {
  return (
    <Card>
      <SectionTitle icon={<Film size={18} />}>Multimedia & Resources</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-3 rounded-lg border border-ide-border bg-ide-bg/40 p-3 transition-colors hover:border-brand-600/40 hover:bg-ide-panel2"
          >
            <span className="mt-0.5">{iconFor[link.type]}</span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-sm font-medium text-ide-text">
                <span className="truncate">{link.label}</span>
                <ExternalLink
                  size={12}
                  className="shrink-0 text-ide-muted opacity-0 transition-opacity group-hover:opacity-100"
                />
              </span>
              {link.note && (
                <span className="text-xs text-ide-muted">{link.note}</span>
              )}
            </span>
          </a>
        ))}
      </div>
    </Card>
  );
}
