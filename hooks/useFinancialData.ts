import { useState, useEffect } from "react";
import { translations, type Language } from "@/lib/translations";
import { stockSymbols } from "@/lib/constants";
import { calculateAverage, calculateAllStats } from "@/lib/utils";
import type { StockData, FinancialData, DividendStats } from "@/lib/types";

export function useFinancialData(language: Language) {
    const [stocksData, setStocksData] = useState<StockData[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [dividendStats, setDividendStats] = useState<DividendStats | null>(null);
    const [loading, setLoading] = useState(true);
    const t = translations[language];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const promises = stockSymbols.map(async (stock) => {
                    const response = await fetch(`./data/${stock.symbol}.json`);
                    const data: FinancialData[] = await response.json();
                    return {
                        symbol: stock.symbol,
                        name: t.companies[stock.symbol],
                        data: data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
                    };
                });

                const results = await Promise.all(promises);
                setStocksData(results);

                const allDates = new Set<string>();
                results.forEach((stock) => {
                    stock.data.forEach((item) => allDates.add(item.date));
                });

                const sortedDates = Array.from(allDates).sort();

                const combinedData = sortedDates.map((date) => {
                    const dataPoint: any = { date };
                    results.forEach((stock) => {
                        const stockDataForDate = stock.data.find((item) => item.date === date);
                        dataPoint[`${stock.symbol}_price`] = stockDataForDate?.price || null;
                        dataPoint[`${stock.symbol}_dividend`] = stockDataForDate?.dividend || null;
                    });
                    return dataPoint;
                });

                setChartData(combinedData);

                const stats = calculateAllStats(results);
                setDividendStats(stats);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [language, t.companies]);

    return { stocksData, chartData, dividendStats, loading };
}