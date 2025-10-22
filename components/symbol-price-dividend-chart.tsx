"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatDate, formatCurrency } from "@/lib/utils";
import { CombinedData } from "@/lib/types";

interface SymbolPriceDividendChartProps {
  chartData: CombinedData[];
  symbol: string;
  t: {
    chartTitle: string;
    chartDescription: string;
  };
}

export function SymbolPriceDividendChart({ chartData, symbol, t }: SymbolPriceDividendChartProps) {
  const priceKey = `${symbol}_price`;
  const dividendKey = `${symbol}_dividend`;

  // 準備用於堆疊圖的數據
  const stackedChartData = chartData.map(item => {
    const price = item[priceKey] as number || 0;
    const cumulativeDividend = item[dividendKey] as number || 0;
    return {
      date: item.date,
      [priceKey]: price,
      [dividendKey]: cumulativeDividend,
      // 為了堆疊效果，我們需要一個代表總和的鍵，但這裡我們直接堆疊 price 和 dividend
    };
  }).filter(item => (item[priceKey] > 0 && item[dividendKey] > 0)); // 過濾掉沒有數據的日期

  if (!stackedChartData || stackedChartData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t.chartTitle}</CardTitle>
          <CardDescription>{t.chartDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 sm:h-96 flex items-center justify-center text-muted-foreground">
            No data available for {symbol}.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t.chartTitle}</CardTitle>
        <CardDescription>{t.chartDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={stackedChartData}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(value) => formatDate(value)} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(Number(value), 2)} />
              <Tooltip
                formatter={(value: number, name: string) => {
                  return [formatCurrency(value, 4), name];
                }}
                labelFormatter={(label) => `📅 ${formatDate(label)}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  fontWeight: "bold",
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey={priceKey} 
                stackId="1" 
                stroke="#8884d8" 
                fill="#8884d8" 
                name="Price" 
              />
              <Area 
                type="monotone" 
                dataKey={dividendKey} 
                stackId="1" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                name="Cumulative Dividend" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}