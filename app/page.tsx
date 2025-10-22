"use client"

import DataSourceSelector from "@/components/data-source-selector";
import { useState } from "react";
import { useFinancialData, DataSource } from "@/hooks/useFinancialData";
import { useLanguage } from '@/context/language-context';
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { StockDataTable } from "@/components/stock-data-table";
import { FinancialChart } from "@/components/financial-chart";
import { StatsChart } from "@/components/stats-chart";
import { SymbolPriceDividendChart } from "@/components/symbol-price-dividend-chart";

export default function FinancialDashboard() {
  const { language, t } = useLanguage();
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource>("roundhill");
  const { stocksData, chartData, dividendStats, loading } = useFinancialData(language, selectedDataSource);

  const handleDataSourceChange = (value: string) => {
    setSelectedDataSource(value as DataSource);
  };

  const priceAndCumulativeDividendChartData = (() => {
    const cumulativeDividends: { [key: string]: number } = {};
    return chartData.map(item => {
      const newItem = { ...item };
      Object.keys(newItem).forEach(key => {
        if (key.endsWith('_dividend')) {
          const symbol = key.replace('_dividend', '');
          if (!cumulativeDividends[symbol]) {
            cumulativeDividends[symbol] = 0;
          }
          cumulativeDividends[symbol] += Number(newItem[key] || 0);
          newItem[key] = Math.trunc(cumulativeDividends[symbol] * 1000000) / 1000000;
        }
      });
      Object.keys(newItem).forEach(key => {
        if (key.endsWith('_yield') || key.endsWith('volume')) {
          delete newItem[key];
        }
      });
      return newItem;
    });
  })();

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

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {stocksData.map((stock) => (
            <StockDataTable key={stock.symbol} stock={stock} t={t} />
          ))}
        </div>

        {stocksData.map(stock => {
          const symbol = stock.symbol;
          return (
            <SymbolPriceDividendChart
              key={symbol}
              symbol={symbol}
              chartData={priceAndCumulativeDividendChartData}
              t={{
                chartTitle: `${symbol} - ${t.chartTitle}`,
                chartDescription: t.chartDescription,
              }} />
          );
        })}

        <FinancialChart chartData={priceAndCumulativeDividendChartData} t={t} />

        <FinancialChart chartData={chartData.map(item => {
          const newItem = { ...item };
          Object.keys(newItem).forEach(key => {
            if (!key.endsWith('_yield') && !key.endsWith('date')) {
              delete newItem[key];
            }
          });
          return newItem;
        })} t={{
            chartTitle: t.yieldChartTitle,
            chartDescription: t.yieldChartDescription,
          }} unit="yield"/>

        <FinancialChart chartData={chartData.map(item => {
          const newItem = { ...item };
          Object.keys(newItem).forEach(key => {
            if (!key.endsWith('_volume') && !key.endsWith('date')) {
              delete newItem[key];
            }
          });
          return newItem;
        })} t={{
            chartTitle: t.volumeChartTitle,
            chartDescription: t.volumeChartDescription,
          }} unit="volume"/>

        {dividendStats && <StatsChart stats={dividendStats} t={t} selectedDataSource={selectedDataSource} />}
      </div>
    </>
  );
}
