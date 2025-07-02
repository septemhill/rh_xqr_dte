"use client"

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stats } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';

interface ComparisonStatsChartProps {
  stats1: Stats;
  stats2: Stats;
  symbol1: string;
  symbol2: string;
  chartTitle: string;
  chartDescription: string;
  tooltipText?: string;
}

type ChartType = "dividend" | "price" | "yield" | "volume";

export function ComparisonStatsChart({ stats1, stats2, symbol1, symbol2, chartTitle, chartDescription, tooltipText }: ComparisonStatsChartProps) {
  const [chartType, setChartType] = useState<ChartType>("dividend");
  const { t } = useLanguage();

  if (!stats1 || !stats2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{chartTitle}</CardTitle>
          <CardDescription>{chartDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            No statistics available for comparison.
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    { name: "3M", [symbol1]: stats1[`avg3Months${chartType === 'dividend' ? '' : chartType.charAt(0).toUpperCase() + chartType.slice(1)}` as keyof Stats], [symbol2]: stats2[`avg3Months${chartType === 'dividend' ? '' : chartType.charAt(0).toUpperCase() + chartType.slice(1)}` as keyof Stats] },
    { name: "6M", [symbol1]: stats1[`avg6Months${chartType === 'dividend' ? '' : chartType.charAt(0).toUpperCase() + chartType.slice(1)}` as keyof Stats], [symbol2]: stats2[`avg6Months${chartType === 'dividend' ? '' : chartType.charAt(0).toUpperCase() + chartType.slice(1)}` as keyof Stats] },
    { name: "9M", [symbol1]: stats1[`avg9Months${chartType === 'dividend' ? '' : chartType.charAt(0).toUpperCase() + chartType.slice(1)}` as keyof Stats], [symbol2]: stats2[`avg9Months${chartType === 'dividend' ? '' : chartType.charAt(0).toUpperCase() + chartType.slice(1)}` as keyof Stats] },
    { name: "1Y", [symbol1]: stats1[`avg1Year${chartType === 'dividend' ? '' : chartType.charAt(0).toUpperCase() + chartType.slice(1)}` as keyof Stats], [symbol2]: stats2[`avg1Year${chartType === 'dividend' ? '' : chartType.charAt(0).toUpperCase() + chartType.slice(1)}` as keyof Stats] },
  ];

  const yAxisFormatter = (value: number) => {
    if (chartType === 'price') return formatCurrency(value, 2);
    if (chartType === 'yield') return `${value.toFixed(2)}%`;
    if (chartType === 'volume') {
        if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
        if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
        if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
        return value.toString();
    }
    return formatCurrency(value, 6);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle>{chartTitle}</CardTitle>
          {tooltipText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 cursor-pointer">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <CardDescription>{chartDescription}</CardDescription>
        <div className="pt-4">
          <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dividend">{t.dividend}</SelectItem>
              <SelectItem value="price">{t.price}</SelectItem>
              <SelectItem value="yield">{t.yield}</SelectItem>
              <SelectItem value="volume">{t.volume}</SelectItem>
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
            <RechartsTooltip 
              formatter={yAxisFormatter}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                color: "hsl(var(--foreground))"
              }}
              labelStyle={{
                color: "hsl(var(--foreground))",
                fontWeight: "bold"
              }}
            />
            <Legend />
            <Bar dataKey={symbol1} fill="hsl(var(--chart-1))" />
            <Bar dataKey={symbol2} fill="hsl(var(--chart-2))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
