"use client"

import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";

interface DashboardHeaderProps {
  language: "zh" | "en";
  onToggle: () => void;
  t: {
    pageTitle: string;
  }
}

export function DashboardHeader({ t, language, onToggle }: DashboardHeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t.pageTitle}</h1>
          <div className="flex items-center gap-4">
            <LanguageToggle language={language} onToggle={onToggle} />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
