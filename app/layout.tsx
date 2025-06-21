"use client";

import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header";
import { LanguageProvider, useLanguage } from '@/context/language-context';

// Create a separate component inside RootLayout to consume the context
// This is necessary because RootLayout itself cannot directly use hooks (like useLanguage)
// *before* its children (LanguageProvider) have rendered.
function LayoutContent({ children }: { children: React.ReactNode }) {
  // Now, useLanguage can be called here because LayoutContent is wrapped by LanguageProvider
  const { language, t, toggleLanguage } = useLanguage();

  return (
    // Set the html lang attribute dynamically
    <html lang={language}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* DashboardHeader now receives language and toggle from the global context */}
          <DashboardHeader t={t} language={language} onToggle={toggleLanguage} />

          {/* Add padding to the main content to prevent it from being hidden behind the fixed header */}
          <main className="pt-[64px]"> {/* Adjust this value if your header's height changes */}
            {children} {/* This is where all your page content will be rendered */}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

// The main RootLayout component, responsible for providing the context
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LanguageProvider>
      <LayoutContent>{children}</LayoutContent>
    </LanguageProvider>
  );
}