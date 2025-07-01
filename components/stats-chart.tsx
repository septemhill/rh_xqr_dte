"use client"

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DividendStats, StockSymbol } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface StatsChartProps {
  stats: DividendStats;
  t: {
    statsTitle: string;
    statsDescription: string;
    avg3MDiv: string;
    avg6MDiv: string;
    avg9MDiv: string;
    avg1YDiv: string;
    avg3MPrice: string;
    avg6MPrice: string;
    avg9MPrice: string;
    avg1YPrice: string;
    avg3MYield: string;
    avg6MYield: string;
    avg9MYield: string;
    avg1YYield: string;
    dividend: string;
    price: string;
    yield: string;
  };
  selectedDataSource: "roundhill" | "yieldmax";
}

type ChartType = "dividend" | "price" | "yield";

export function StatsChart({ stats, t }: StatsChartProps) {
  const [chartType, setChartType] = useState<ChartType>("dividend");

  const currentDataSourceStats = stats;
  const currentStockSymbols = currentDataSourceStats ? (Object.keys(currentDataSourceStats) as StockSymbol[]).sort() : [];

  if (!currentDataSourceStats || currentStockSymbols.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.statsTitle}</CardTitle>
          <CardDescription>{t.statsDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            No statistics available for the selected data source.
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    { name: "3M", ...Object.fromEntries(currentStockSymbols.map(s => [s, currentDataSourceStats[s][`avg3Months${chartType === 'dividend' ? '' : chartType.charAt(0).toUpperCase() + chartType.slice(1)}` as keyof typeof currentDataSourceStats[StockSymbol]]])) },
    { name: "6M", ...Object.fromEntries(currentStockSymbols.map(s => [s, currentDataSourceStats[s][`avg6Months${chartType === 'dividend' ? '' : chartType.charAt(0).toUpperCase() + chartType.slice(1)}` as keyof typeof currentDataSourceStats[StockSymbol]]])) },
    { name: "9M", ...Object.fromEntries(currentStockSymbols.map(s => [s, currentDataSourceStats[s][`avg9Months${chartType === 'dividend' ? '' : chartType.charAt(0).toUpperCase() + chartType.slice(1)}` as keyof typeof currentDataSourceStats[StockSymbol]]])) },
    { name: "1Y", ...Object.fromEntries(currentStockSymbols.map(s => [s, currentDataSourceStats[s][`avg1Year${chartType === 'dividend' ? '' : chartType.charAt(0).toUpperCase() + chartType.slice(1)}` as keyof typeof currentDataSourceStats[StockSymbol]]])) },
  ];

  const yAxisFormatter = (value: number) => {
    if (chartType === 'price') return formatCurrency(value, 2);
    if (chartType === 'yield') return `${value.toFixed(2)}%`;
    return formatCurrency(value, 6);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.statsTitle}</CardTitle>
        <CardDescription>{t.statsDescription}</CardDescription>
        <div className="pt-4">
          <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dividend">{t.dividend}</SelectItem>
              <SelectItem value="price">{t.price}</SelectItem>
              <SelectItem value="yield">{t.yield}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={yAxisFormatter} tickCount={8} />
            <Tooltip formatter={yAxisFormatter} />
            <Legend />
            {currentStockSymbols.map((symbol, index) => (
              <Bar key={symbol} dataKey={symbol} fill={`hsl(${index * 137.5}, 70%, 50%)`} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
