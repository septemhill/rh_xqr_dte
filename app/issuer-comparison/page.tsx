"use client"

import { FinancialChart } from "@/components/financial-chart";
import { useFinancialData } from "@/hooks/useFinancialData";
import { useLanguage } from '@/context/language-context';
import { CombinedData } from "@/lib/types";
import { ComparisonStatsChart } from "@/components/comparison-stats-chart";

export default function IssuerComparisonPage() {
  const { language, t } = useLanguage();
  const { chartData: roundhillData, dividendStats: roundhillStats } = useFinancialData(language, "roundhill");
  const { chartData: yieldmaxData, dividendStats: yieldmaxStats } = useFinancialData(language, "yieldmax");

  // Create a Map to store combined data, using the date as the key for efficient lookups.
  const combinedChartDataMap = new Map<string, CombinedData>();

  // --- Step 1: Add all data from roundhillData to the map ---
  roundhillData?.forEach((item) => {
    if (item.date) { // Ensure date exists
      // Initialize an object for this date, including all expected fields from both sources.
      // Set YieldMax fields to null initially, as they will be merged later.
      combinedChartDataMap.set(item.date, {
        date: item.date,
        // Roundhill fields (example, adjust to your actual data keys)
        XDTE_price: item.XDTE_price,
        XDTE_dividend: item.XDTE_dividend,
        XDTE_yield: item.XDTE_yield,
        QDTE_price: item.QDTE_price, // Assuming QDTE/RDTE are also in Roundhill for consistency based on your earlier code
        QDTE_dividend: item.QDTE_dividend,
        QDTE_yield: item.QDTE_yield,
        RDTE_price: item.RDTE_price,
        RDTE_dividend: item.RDTE_dividend,
        RDTE_yield: item.RDTE_yield,
        WPAY_price: item.WPAY_price,
        WPAY_dividend: item.WPAY_dividend,
        WPAY_yield: item.WPAY_yield,

        // YieldMax fields (initialized to null, will be populated if found)
        SDTY_price: null, 
        SDTY_dividend: null, 
        SDTY_yield: null,
        QDTY_price: null,
        QDTY_dividend: null,
        QDTY_yield: null,
        RDTY_price: null,
        RDTY_dividend: null,
        RDTY_yield: null,
        YMAX_price: null,
        YMAX_dividend: null,
        YMAX_yield: null,
        // If there are other YieldMax specific symbols, initialize them here too
      });
    }
  });

  // --- Step 2: Merge data from yieldmaxData into the map ---
  yieldmaxData?.forEach((item) => {
    if (item.date) { // Ensure date exists
      const existingEntry = combinedChartDataMap.get(item.date);

      if (existingEntry) {
        // If an entry for this date already exists (from roundhillData), merge YieldMax data into it
        existingEntry.QDTY_price = item.QDTY_price;
        existingEntry.QDTY_dividend = item.QDTY_dividend;
        existingEntry.QDTY_yield = item.QDTY_yield;
        existingEntry.RDTY_price = item.RDTY_price;
        existingEntry.RDTY_dividend = item.RDTY_dividend;
        existingEntry.RDTY_yield = item.RDTY_yield;
        existingEntry.SDTY_price = item.SDTY_price;
        existingEntry.SDTY_dividend = item.SDTY_dividend;
        existingEntry.SDTY_yield = item.SDTY_yield;
        existingEntry.YMAX_price = item.YMAX_price;
        existingEntry.YMAX_dividend = item.YMAX_dividend;
        existingEntry.YMAX_yield = item.YMAX_yield;
        // Also update QDTE/RDTE if they exist in YieldMax and Roundhill has null for them,
        // or if YieldMax data should take precedence for these
        existingEntry.QDTE_price = item.QDTE_price || existingEntry.QDTE_price;
        existingEntry.QDTE_dividend = item.QDTE_dividend || existingEntry.QDTE_dividend;
        existingEntry.QDTE_yield = item.QDTE_yield || existingEntry.QDTE_yield;
        existingEntry.RDTE_price = item.RDTE_price || existingEntry.RDTE_price;
        existingEntry.RDTE_dividend = item.RDTE_dividend || existingEntry.RDTE_dividend;
        existingEntry.RDTE_yield = item.RDTE_yield || existingEntry.RDTE_yield;
        existingEntry.XDTE_price = item.XDTE_price || existingEntry.XDTE_price;
        existingEntry.XDTE_dividend = item.XDTE_dividend || existingEntry.XDTE_dividend;
        existingEntry.XDTE_yield = item.XDTE_yield || existingEntry.XDTE_yield;
        existingEntry.WPAY_price = item.WPAY_price || existingEntry.WPAY_price;
        existingEntry.WPAY_dividend = item.WPAY_dividend || existingEntry.WPAY_dividend;
        existingEntry.WPAY_yield = item.WPAY_yield || existingEntry.WPAY_yield;

        // If there are other YieldMax specific symbols, merge them here
      } else {
        // If no entry exists for this date (meaning it's a date only present in yieldmaxData), add a new one
        combinedChartDataMap.set(item.date, {
          date: item.date,
          // Roundhill fields (initialized to null as they're not in this YieldMax item)
          XDTE_price: null,
          XDTE_dividend: null,
          XDTE_yield: null,
          QDTE_price: null,
          QDTE_dividend: null,
          QDTE_yield: null,
          RDTE_price: null,
          RDTE_dividend: null,
          RDTE_yield: null,
          WPAY_price: null,
          WPAY_dividend: null,
          WPAY_yield: null,
          // YieldMax fields (from the current item)
          SDTY_price: item.SDTY_price,
          SDTY_dividend: item.SDTY_dividend,
          SDTY_yield: item.SDTY_yield,
          QDTY_price: item.QDTY_price,
          QDTY_dividend: item.QDTY_dividend,
          QDTY_yield: item.QDTY_yield,
          RDTY_price: item.RDTY_price,
          RDTY_dividend: item.RDTY_dividend,
          RDTY_yield: item.RDTY_yield,
          YMAX_price: item.YMAX_price,
          YMAX_dividend: item.YMAX_dividend,
          YMAX_yield: item.YMAX_yield,
          // If there are other YieldMax specific symbols, add them here
        });
      }
    }
  });

  // --- Step 3: Convert the Map to an array and sort by date ---
  // Assuming 'date' is in a sortable string format (e.g., "YYYY-MM-DD")
  const combinedChartData = Array.from(combinedChartDataMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  const SDTYXDTEData = combinedChartData.map((item) => ({
    date: item.date,
    SDTY_price: item.SDTY_price,
    SDTY_dividend: item.SDTY_dividend,
    XDTE_price: item.XDTE_price,
    XDTE_dividend: item.XDTE_dividend,
  }));

  const WPAYYMAXData = combinedChartData.map((item) => ({
    date: item.date,
    WPAY_price: item.WPAY_price,
    WPAY_dividend: item.WPAY_dividend,
    YMAX_price: item.YMAX_price,
    YMAX_dividend: item.YMAX_dividend,
  }));

  const QDTYQDTEData = combinedChartData.map(({ date, QDTY_price, QDTY_dividend, QDTE_price, QDTE_dividend }) => ({
    date,
    QDTY_price,
    QDTY_dividend,
    QDTE_price,
    QDTE_dividend,
  }));

  // Filter and map RDTYRDTEData
  const RDTYRDTEData = combinedChartData
    .filter(({ RDTY_price, RDTY_dividend, RDTE_price, RDTE_dividend }) => (RDTY_price !== null && RDTY_dividend !== null) || (RDTE_price !== null && RDTE_dividend !== null))
    .map(({ date, RDTY_price, RDTY_dividend, RDTE_price, RDTE_dividend }) => ({
      date,
      RDTY_price,
      RDTY_dividend,
      RDTE_price,
      RDTE_dividend,
    }));

  const SDTYXDTEYieldData = combinedChartData.map(({ date, SDTY_yield, XDTE_yield }) => ({
    date,
    SDTY_yield,
    XDTE_yield,
  }));

  const WPAYYMAXYieldData = combinedChartData.map(({ date, WPAY_yield, YMAX_yield }) => ({
    date,
    WPAY_yield,
    YMAX_yield,
  }));

  const QDTYQDTEYieldData = combinedChartData.map(({ date, QDTY_yield, QDTE_yield }) => ({
    date,
    QDTY_yield,
    QDTE_yield,
  }));

  // Filter and map RDTYRDTEYieldData
  const RDTYRDTEYieldData = combinedChartData
    .filter(({ RDTY_yield, RDTE_yield }) => RDTY_yield !== null || RDTE_yield !== null)
    .map(({ date, RDTY_yield, RDTE_yield }) => ({
      date,
      RDTY_yield,
      RDTE_yield,
    }));

  return (
    <div className="container mx-auto p-4 pt-16 space-y-6">
      {WPAYYMAXData.length > 0 && (
        <FinancialChart
          chartData={WPAYYMAXData}
          t={{
            chartTitle: "WPAY vs YMAX",
            chartDescription: t.comparison.priceDivComparison,
            tooltipText: t.comparison.lineDiscontinous,
          }}
        />
      )}
      {WPAYYMAXYieldData.length > 0 && (
        <FinancialChart
          chartData={WPAYYMAXYieldData}
          t={{
            chartTitle: "WPAY vs YMAX Yield",
            chartDescription: "Comparison of WPAY and YMAX yields",
            tooltipText: t.comparison.lineDiscontinous,
          }}
          dataKeys={["WPAY_yield", "YMAX_yield"]}
          unit="percent"
        />
      )}
      {roundhillStats && yieldmaxStats && roundhillStats.WPAY && yieldmaxStats.YMAX && (
          <ComparisonStatsChart
            stats1={yieldmaxStats.YMAX}
            stats2={roundhillStats.WPAY}
            symbol1="YMAX"
            symbol2="WPAY"
            chartTitle="YMAX vs WPAY Stats"
            chartDescription={t.comparison.statsComparison}
            tooltipText={t.comparison.avgStats}
          />
      )}
      {SDTYXDTEData.length > 0 && (
        <FinancialChart
          chartData={SDTYXDTEData}
          t={{
            chartTitle: "SDTY vs XDTE",
            chartDescription: t.comparison.priceDivComparison,
            tooltipText: t.comparison.lineDiscontinous,
          }}
        />
      )}
      {SDTYXDTEYieldData.length > 0 && (
        <FinancialChart
          chartData={SDTYXDTEYieldData}
          t={{
            chartTitle: "SDTY vs XDTE Yield",
            chartDescription: "Comparison of SDTY and XDTE yields",
            tooltipText: t.comparison.lineDiscontinous,
          }}
          dataKeys={["SDTY_yield", "XDTE_yield"]}
          unit="percent"
        />
      )}
      {roundhillStats && yieldmaxStats && (
          <ComparisonStatsChart
            stats1={yieldmaxStats.SDTY}
            stats2={roundhillStats.XDTE}
            symbol1="SDTY"
            symbol2="XDTE"
            chartTitle="SDTY vs XDTE Stats"
            chartDescription={t.comparison.statsComparison}
            tooltipText={t.comparison.avgStats}
          />
      )}
      {QDTYQDTEData.length > 0 && (
        <FinancialChart
          chartData={QDTYQDTEData}
          t={{
            chartTitle: "QDTY vs QDTE",
            chartDescription: t.comparison.priceDivComparison,
            tooltipText: t.comparison.lineDiscontinous,
          }}
        />
      )}
      {QDTYQDTEYieldData.length > 0 && (
        <FinancialChart
          chartData={QDTYQDTEYieldData}
          t={{
            chartTitle: "QDTY vs QDTE Yield",
            chartDescription: "Comparison of QDTY and QDTE yields",
            tooltipText: t.comparison.lineDiscontinous,
          }}
          dataKeys={["QDTY_yield", "QDTE_yield"]}
          unit="percent"
        />
      )}
      {roundhillStats && yieldmaxStats && (
          <ComparisonStatsChart
            stats1={yieldmaxStats.QDTY}
            stats2={roundhillStats.QDTE}
            symbol1="QDTY"
            symbol2="QDTE"
            chartTitle="QDTY vs QDTE Stats"
            chartDescription={t.comparison.statsComparison}
            tooltipText={t.comparison.avgStats}
          />
      )}
      {RDTYRDTEData.length > 0 && (
        <FinancialChart
          chartData={RDTYRDTEData}
          t={{
            chartTitle: "RDTY vs RDTE",
            chartDescription: t.comparison.priceDivComparison,
            tooltipText: t.comparison.lineDiscontinous,
          }}
        />
      )}
      {RDTYRDTEYieldData.length > 0 && (
        <FinancialChart
          chartData={RDTYRDTEYieldData}
          t={{
            chartTitle: "RDTY vs RDTE Yield",
            chartDescription: "Comparison of RDTY and RDTE yields",
            tooltipText: t.comparison.lineDiscontinous,
          }}
          dataKeys={["RDTY_yield", "RDTE_yield"]}
          unit="percent"
        />
      )}
      {roundhillStats && yieldmaxStats && (
          <ComparisonStatsChart
            stats1={yieldmaxStats.RDTY}
            stats2={roundhillStats.RDTE}
            symbol1="RDTY"
            symbol2="RDTE"
            chartTitle="RDTY vs RDTE Stats"
            chartDescription={t.comparison.statsComparison}
            tooltipText={t.comparison.avgStats}
          />
      )}

      {/* <NotesSection notes={[
        t.comparison.dataSource,
        t.comparison.lineDiscontinous,
      ]} /> */}
    </div>
  );
}
