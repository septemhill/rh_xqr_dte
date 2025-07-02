"use client"

import DataSourceSelector from "@/components/data-source-selector";
import { useState } from "react";
import { useFinancialData, DataSource } from "@/hooks/useFinancialData";
import { useLanguage } from '@/context/language-context';
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { StockDataTable } from "@/components/stock-data-table";
import { FinancialChart } from "@/components/financial-chart";
import { StatsChart } from "@/components/stats-chart";

export default function FinancialDashboard() {
  const { language, t } = useLanguage();
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource>("roundhill");
  const { stocksData, chartData, dividendStats, loading } = useFinancialData(language, selectedDataSource);

  const handleDataSourceChange = (value: string) => {
    setSelectedDataSource(value as DataSource);
  };

  if (loading) {
    return <LoadingSkeleton t={t} />;
  }

  return (
    <>
      <div className="container mx-auto p-4 pt-16 space-y-6">
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

        <FinancialChart chartData={chartData.map(item => {
          const newItem = { ...item };
          Object.keys(newItem).forEach(key => {
            if (key.endsWith('_yield') || key.endsWith('volume')) {
              delete newItem[key];
            }
          });
          return newItem;
        })} t={t} />

        <FinancialChart chartData={chartData.map(item => {
          const newItem = { ...item };
          Object.keys(newItem).forEach(key => {
            if (!key.endsWith('_yield') && !key.endsWith('date')) {
              delete newItem[key];
            }
          });
          return newItem;
        })} t={{
            chartTitle: "Yield Trends",
            chartDescription: "Comparison of yields",
          }} unit="percent"/>

        <FinancialChart chartData={chartData.map(item => {
          const newItem = { ...item };
          Object.keys(newItem).forEach(key => {
            if (!key.endsWith('_volume')) {
              delete newItem[key];
            }
          });
          return newItem;
        })} t={{
            chartTitle: "Volume Trends",
            chartDescription: "Comparison of volumes",
          }} unit="volume"/>

        {dividendStats && <StatsChart stats={dividendStats} t={t} selectedDataSource={selectedDataSource} />}
      </div>
    </>
  );
}
