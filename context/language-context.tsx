// src/context/language-context.tsx
"use client"; // IMPORTANT: This file must be a client component

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Language } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  t: typeof translations[Language]; // Dynamically type 't'
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en"); // Global language state
  const t = translations[language]; // Global translations object

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "zh" ? "en" : "zh")); // Function to toggle language
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to easily consume the context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}