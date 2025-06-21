"use client"

import DataSourceSelector from "@/components/data-source-selector";
import { useState } from "react";
import { translations, type Language } from "@/lib/translations";
import { useFinancialData, DataSource } from "@/hooks/useFinancialData";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { StockDataTable } from "@/components/stock-data-table";
import { FinancialChart } from "@/components/financial-chart";
import { StatsTable } from "@/components/stats-table";
import { DashboardHeader } from "@/components/dashboard-header";

export default function FinancialDashboard() {
  const [language, setLanguage] = useState<Language>("en");
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource>("roundhill");

  const t = translations[language];
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
      <DashboardHeader language={language} t={t} onToggle={toggleLanguage} />
      <div className="container mx-auto p-4 pt-16 space-y-6">
        {/* <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">{t.pageTitle}</h1>
          <p className="text-muted-foreground">{t.pageDescription}</p>
        </div> */}

        <div className="flex justify-center mb-6">
          <DataSourceSelector
            selectedDataSource={selectedDataSource}
            onDataSourceChange={handleDataSourceChange}
            dataSources={["roundhill", "yieldmax"]}
            t={t}
          />
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
