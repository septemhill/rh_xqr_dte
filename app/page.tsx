"use client"

import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { translations, type Language } from "@/lib/translations";
import { useFinancialData, DataSource } from "@/hooks/useFinancialData";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { StockDataTable } from "@/components/stock-data-table";
import { FinancialChart } from "@/components/financial-chart";
import { StatsTable } from "@/components/stats-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FinancialDashboard() {
  const [language, setLanguage] = useState<Language>("en");
  // 新增狀態來管理選定的資料來源，預設為 roundhill
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource>("roundhill");

  const t = translations[language];
  // 將 selectedDataSource 傳遞給 useFinancialData Hook
  const { stocksData, chartData, dividendStats, loading } = useFinancialData(language, selectedDataSource);

  const handleDataSourceChange = (value: string) => {
    setSelectedDataSource(value as DataSource);
  };

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

        {/* 新增資料來源選擇的下拉選單 */}
        <div className="flex justify-center mb-6">
          <Select value={selectedDataSource} onValueChange={handleDataSourceChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Data Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="roundhill">Roundhill Data</SelectItem>
              <SelectItem value="yieldmax">YieldMax Data</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {stocksData.map((stock) => (
            <StockDataTable key={stock.symbol} stock={stock} t={t} />
          ))}
        </div>

        <FinancialChart chartData={chartData} t={t} />

        {dividendStats && <StatsTable stats={dividendStats} t={t} selectedDataSource={selectedDataSource} />}
      </div>
    </>
  );
}
