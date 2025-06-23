// app/client-layout-content.tsx
"use client";

import type React from "react";
import { useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { useLanguage } from '@/context/language-context';

export default function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const { language, t, toggleLanguage } = useLanguage();

  // Dynamically set the page title based on the selected language
  useEffect(() => {
    // Ensure t.appTitle exists in your translation files (e.g., en.json, zh.json)
    // if (t && t.appTitle) {
    //   document.title = t.appTitle;
    // }
  }, [language, t]); // Re-run effect if language or translation object changes

  // Dynamically set the html lang attribute
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <>
      {/* DashboardHeader now receives language and toggle from the global context */}
      <DashboardHeader t={t} language={language} onToggle={toggleLanguage} />

      {/* Add padding to the main content to prevent it from being hidden behind the fixed header */}
      <main className="pt-[64px]"> {/* Adjust this value if your header's height changes */}
        {children} {/* This is where all your page content will be rendered */}
      </main>
    </>
  );
}