"use client"

import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { translations, type Language } from "@/lib/translations";
import { useFinancialData } from "@/hooks/useFinancialData";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { StockDataTable } from "@/components/stock-data-table";
import { FinancialChart } from "@/components/financial-chart";
import { StatsTable } from "@/components/stats-table";

export default function FinancialDashboard() {
  const [language, setLanguage] = useState<Language>("en");
  const t = translations[language];
  const { stocksData, chartData, dividendStats, loading } = useFinancialData(language);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "zh" ? "en" : "zh"));
  };

  if (loading) {
    return <LoadingSkeleton t={t} />;
  }

  return (
    <>
      <ThemeToggle />
      <LanguageToggle language={language} onToggle={toggleLanguage} />
      <div className="container mx-auto p-4 pt-16 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">{t.pageTitle}</h1>
          <p className="text-muted-foreground">{t.pageDescription}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {stocksData.map((stock) => (
            <StockDataTable key={stock.symbol} stock={stock} t={t} />
          ))}
        </div>

        <FinancialChart chartData={chartData} t={t} />

        {dividendStats && <StatsTable stats={dividendStats} t={t} />}
      </div>
    </>
  );
}
