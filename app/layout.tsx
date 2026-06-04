import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "DevEnglish · The 35-Day Bootcamp",
  description:
    "Aprende inglés técnico para developers en 20 días: vocabulario, gramática aplicada, mini-juegos y un tutor de IA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-ide-bg text-ide-text antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
