import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import type { FinancialData, StockData, DividendStats, StockSymbol } from "@/lib/types";

export const formatCurrency = (value: number, digits: number) => {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
  }).format(value);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("zh-TW");
};

export const calculateAverage = (
  data: FinancialData[],
  fromDate: Date,
  key: "dividend" | "price"
): number => {
  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= fromDate && item[key] > 0;
  });

  if (filteredData.length === 0) return 0;

  const total = filteredData.reduce(
    (sum, item) => sum + Number(item[key]),
    0
  );

  return total / filteredData.length;
};

export const calculateGeometricMean = (
  data: FinancialData[],
  fromDate: Date,
  key: "yield"
): number => {
  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= fromDate && item[key] > 0;
  });

  if (filteredData.length === 0) return 0;

  const product = filteredData.reduce(
    (acc, item) => acc * ((100 + Number(item[key])) / 100),
    1
  );

  return Math.pow(product, 1 / filteredData.length);
};

export const calculateAllStats = (stocksData: StockData[]): DividendStats => {
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
  const nineMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 9, now.getDate());

  const stats: Partial<DividendStats> = {};

  stocksData.forEach((stock) => {
    const dividendData = stock.data.filter((item) => item.dividend > 0);
    const priceData = stock.data.filter((item) => item.price > 0);
    const yieldData = stock.data.filter((item) => item.yield > 0);

    stats[stock.symbol as StockSymbol] = {
      avg3Months: calculateAverage(dividendData, threeMonthsAgo, "dividend"),
      avg6Months: calculateAverage(dividendData, sixMonthsAgo, "dividend"),
      avg9Months: calculateAverage(dividendData, nineMonthsAgo, "dividend"),
      avg3MonthsPrice: calculateAverage(priceData, threeMonthsAgo, "price"),
      avg6MonthsPrice: calculateAverage(priceData, sixMonthsAgo, "price"),
      avg9MonthsPrice: calculateAverage(priceData, nineMonthsAgo, "price"),
      avg3MonthsYield: (calculateGeometricMean(yieldData, threeMonthsAgo, "yield") - 1) * 100,
      avg6MonthsYield: (calculateGeometricMean(yieldData, sixMonthsAgo, "yield") - 1) * 100,
      avg9MonthsYield: (calculateGeometricMean(yieldData, nineMonthsAgo, "yield") - 1) * 100,
    };
  });

  return stats as DividendStats;
};
