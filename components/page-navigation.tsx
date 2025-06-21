"use client";

import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { translations, Language } from "@/lib/translations"; // Import translations for localized page names

interface PageNavigationProps {
  language: Language; // To get the correct translations
  t: typeof translations[Language]; // Pass the 't' object for current language translations
}

export function PageNavigation({ language, t }: PageNavigationProps) {
  const router = useRouter();

  // Define your navigation links and their translations
  // Make sure these keys (e.g., 'home', 'about', 'issuerComparison') are defined in your translations.ts
  const navLinks = [
    { value: "/", labelKey: "dashboard" }, // 'home' should be defined in t.navigation
    { value: "/issuer-comparison", labelKey: "issuerComparison" }, // 'issuerComparison' should be defined in t.navigation
    // Add more pages as needed
    // { value: "/contact", labelKey: "contact" },
  ];

  const handleNavigationChange = (path: string) => {
    router.push(path);
  };

  return (
    <Select onValueChange={handleNavigationChange}>
      <SelectTrigger className="w-[160px]"> {/* Adjust width as needed */}
        <SelectValue placeholder={t.navigation.dashboard} /> {/* 'selectPage' should be defined in t.navigation */}
      </SelectTrigger>
      <SelectContent>
        {navLinks.map((link) => (
          <SelectItem key={link.value} value={link.value}>
            {t.navigation[link.labelKey as keyof typeof t.navigation]} {/* Access translation via labelKey */}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}