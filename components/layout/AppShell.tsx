"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { ApiKeyModal } from "@/components/settings/ApiKeyModal";
import { Menu, X, Terminal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "@/lib/uiStore";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const settingsOpen = useUIStore((s) => s.settingsOpen);
  const openSettings = useUIStore((s) => s.openSettings);
  const closeSettings = useUIStore((s) => s.closeSettings);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  // Evita parpadeo/hydration-mismatch del estado persistido (localStorage)
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ide-bg">
        <div className="flex items-center gap-3 text-ide-muted">
          <Terminal className="animate-pulse text-brand-400" />
          <span className="font-mono text-sm">Loading DevEnglish…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-ide-bg">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-ide-border bg-ide-panel md:block">
        <Sidebar onOpenSettings={openSettings} />
      </aside>

      {/* Mobile top bar */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ide-border bg-ide-panel/80 px-4 py-3 backdrop-blur md:hidden">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="rounded-md p-1.5 hover:bg-ide-panel2"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
          <span className="flex items-center gap-2 text-sm font-bold">
            <Terminal size={16} className="text-brand-400" /> DevEnglish
          </span>
          <span className="w-8" />
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.aside
              className="absolute left-0 top-0 h-full w-72 border-r border-ide-border bg-ide-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <button
                onClick={() => setMobileNavOpen(false)}
                className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-ide-muted hover:bg-ide-panel2"
                aria-label="Cerrar menú"
              >
                <X size={18} />
              </button>
              <div className="h-full">
                <Sidebar
                  onOpenSettings={openSettings}
                  onItemClick={() => setMobileNavOpen(false)}
                />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <ApiKeyModal open={settingsOpen} onClose={closeSettings} />
    </div>
  );
}
