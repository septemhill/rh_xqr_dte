// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from '@/context/language-context';
import ClientLayoutContent from "./client-layout-content"; // We'll create this file

// Define Metadata here (in a Server Component)
export const metadata: Metadata = {
  title: "0DTE Covered Call", // Default title, ClientLayoutContent will update it dynamically
  description: "Your go-to platform for in-depth analysis and comparison of high-yield ETFs.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  keywords: ["YieldMax", "Roundhill", "ETFs", "high yield", "dividends", "investment", "financial analysis", "0DTE", "Covered Call"],
  authors: [{ name: "Your Name/Organization" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"> {/* Initial lang can be default, client component will update it */}
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            {/* Render your client-side content wrapper */}
            <ClientLayoutContent>{children}</ClientLayoutContent>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}