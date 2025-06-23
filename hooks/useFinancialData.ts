import { useState, useEffect } from "react";
import { translations, type Language } from "@/lib/translations";
import { calculateAverage, calculateAllStats } from "@/lib/utils";
import type { StockData, FinancialData, DividendStats } from "@/lib/types";

export type DataSource = "roundhill" | "yieldmax";

export function useFinancialData(language: Language, dataSource: DataSource = "roundhill") {
    const [stocksData, setStocksData] = useState<StockData[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [dividendStats, setDividendStats] = useState<DividendStats | null>(null);
    const [loading, setLoading] = useState(true);
    const t = translations[language];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const baseUrl = process.env.NODE_ENV === 'development' ? '/data' : 'https://raw.githubusercontent.com/septemhill/rh_xqr_dte/gh-pages/data';
                const response = await fetch(`${baseUrl}/${dataSource}.json`);
                const issuerData: Record<string, FinancialData[]> = await response.json();

                const symbols = Object.keys(issuerData).map(symbol => ({ symbol }));

                const results = symbols.map((stock) => ({
                    symbol: stock.symbol,
                    name: t.companies[stock.symbol],
                    data: issuerData[stock.symbol].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
                }));

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
                        dataPoint[`${stock.symbol}_yield`] = stockDataForDate?.yield || null;
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
    }, [language, t.companies, dataSource]);

    return { stocksData, chartData, dividendStats, loading };
}
