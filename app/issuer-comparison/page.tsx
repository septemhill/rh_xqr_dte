"use client"

import { FinancialChart } from "@/components/financial-chart";
import { useFinancialData } from "@/hooks/useFinancialData";
import { useLanguage } from '@/context/language-context';

export default function IssuerComparisonPage() {
  const { language, t } = useLanguage();
  const { chartData: roundhillData } = useFinancialData(language, "roundhill");
  const { chartData: yieldmaxData } = useFinancialData(language, "yieldmax");

  // Create a Map to store combined data, using the date as the key for efficient lookups.
  const combinedChartDataMap = new Map<string, any>();

  // --- Step 1: Add all data from roundhillData to the map ---
  roundhillData?.forEach((item) => {
    if (item.date) { // Ensure date exists
      // Initialize an object for this date, including all expected fields from both sources.
      // Set YieldMax fields to null initially, as they will be merged later.
      combinedChartDataMap.set(item.date, {
        date: item.date,
        // Roundhill fields (example, adjust to your actual data keys)
        XDTE_price: item.XDTE_price || null,
        XDTE_dividend: item.XDTE_dividend || null,
        QDTE_price: item.QDTE_price || null, // Assuming QDTE/RDTE are also in Roundhill for consistency based on your earlier code
        QDTE_dividend: item.QDTE_dividend || null,
        RDTE_price: item.RDTE_price || null,
        RDTE_dividend: item.RDTE_dividend || null,

        // YieldMax fields (initialized to null, will be populated if found)
        SDTY_price: null, 
        SDTY_dividend: null, 
        QDTY_price: null,
        QDTY_dividend: null,
        RDTY_price: null,
        RDTY_dividend: null,
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
        existingEntry.QDTY_price = item.QDTY_price || null;
        existingEntry.QDTY_dividend = item.QDTY_dividend || null;
        existingEntry.RDTY_price = item.RDTY_price || null;
        existingEntry.RDTY_dividend = item.RDTY_dividend || null;
        existingEntry.SDTY_price = item.SDTY_price || null;
        existingEntry.SDTY_dividend = item.SDTY_dividend || null;
        // Also update QDTE/RDTE if they exist in YieldMax and Roundhill has null for them,
        // or if YieldMax data should take precedence for these
        existingEntry.QDTE_price = item.QDTE_price || existingEntry.QDTE_price || null;
        existingEntry.QDTE_dividend = item.QDTE_dividend || existingEntry.QDTE_dividend || null;
        existingEntry.RDTE_price = item.RDTE_price || existingEntry.RDTE_price || null;
        existingEntry.RDTE_dividend = item.RDTE_dividend || existingEntry.RDTE_dividend || null;
        existingEntry.XDTE_price = item.XDTE_price || existingEntry.XDTE_price || null;
        existingEntry.XDTE_dividend = item.XDTE_dividend || existingEntry.XDTE_dividend || null;

        // If there are other YieldMax specific symbols, merge them here
      } else {
        // If no entry exists for this date (meaning it's a date only present in yieldmaxData), add a new one
        combinedChartDataMap.set(item.date, {
          date: item.date,
          // Roundhill fields (initialized to null as they're not in this YieldMax item)
          XDTE_price: null,
          XDTE_dividend: null,
          QDTE_price: null,
          QDTE_dividend: null,
          RDTE_price: null,
          RDTE_dividend: null,
          // YieldMax fields (from the current item)
          SDTY_price: item.SDTY_price || null,
          SDTY_dividend: item.SDTY_dividend || null,
          QDTY_price: item.QDTY_price || null,
          QDTY_dividend: item.QDTY_dividend || null,
          RDTY_price: item.RDTY_price || null,
          RDTY_dividend: item.RDTY_dividend || null,
          // If there are other YieldMax specific symbols, add them here
        });
      }
    }
  });

  // --- Step 3: Convert the Map to an array and sort by date ---
  // Assuming 'date' is in a sortable string format (e.g., "YYYY-MM-DD")
  const combinedChartData = Array.from(combinedChartDataMap.values()).sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return 0;
  });

  // console.log("roundhillData", roundhillData);
  // console.log("yieldmaxData", yieldmaxData);
  // console.log("combinedChartData", combinedChartData);

  const SDTYXDTEData = combinedChartData.map((item) => ({
    date: item.date,
    SDTY_price: item.SDTY_price,
    SDTY_dividend: item.SDTY_dividend,
    XDTE_price: item.XDTE_price,
    XDTE_dividend: item.XDTE_dividend,
  }));

  const QDTYQDTEData = combinedChartData.map((item) => ({
    date: item.date,
    QDTY_price: item.QDTY_price,
    QDTY_dividend: item.QDTY_dividend,
    QDTE_price: item.QDTE_price,
    QDTE_dividend: item.QDTE_dividend,
  }));

  const RDTYRDTEData = combinedChartData.map((item) => ({
    date: item.date,
    RDTY_price: item.RDTY_price,
    RDTY_dividend: item.RDTY_dividend,
    RDTE_price: item.RDTE_price,
    RDTE_dividend: item.RDTE_dividend,
  })).filter((item) => (item.RDTY_price !== null && item.RDTY_dividend !== null) || (item.RDTE_price !== null && item.RDTE_dividend !== null));

  return (
    <div className="container mx-auto p-4 pt-16 space-y-6">
      {SDTYXDTEData.length > 0 && (
        <FinancialChart
          chartData={SDTYXDTEData}
          t={{
            chartTitle: "SDTY vs XDTE",
            chartDescription: t.comparison.priceDivComparison,
          }}
        />
      )}
      {QDTYQDTEData.length > 0 && (
        <FinancialChart
          chartData={QDTYQDTEData}
          t={{
            chartTitle: "QDTY vs QDTE",
            chartDescription: t.comparison.priceDivComparison,
          }}
        />
      )}
      {RDTYRDTEData.length > 0 && (
        <FinancialChart
          chartData={RDTYRDTEData}
          t={{
            chartTitle: "RDTY vs RDTE",
            chartDescription: t.comparison.priceDivComparison,
          }}
        />
      )}
    </div>
  );
};
