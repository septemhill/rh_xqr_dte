import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Brush } from "recharts";
import { formatDate } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';
import { CombinedData } from "@/lib/types";
import { Payload } from 'recharts/types/component/DefaultLegendContent'; // 導入 Recharts 的 Payload 類型

const getInitialVisibility = (data: CombinedData[], dataKeys?: string[]) => {
  if (!data || data.length === 0) return {};
  const firstDataItem = data[0];
  const keys = dataKeys || Object.keys(firstDataItem).filter(key => key !== 'date');
  const initialState: { [key: string]: boolean } = {};
  keys.forEach(key => {
    initialState[key] = true;
  });
  return initialState;
};

const formatYAxisTick = (value: number, unit?: 'dollar' | 'percent' | 'volume' | 'yield' | 'dividend' | 'price') => {
  if (typeof value !== 'number') {
    return value;
  }

  switch (unit) {
    case 'volume':
      if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(1)}B`;
      }
      if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`;
      }
      if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1)}K`;
      }
      return value.toString();
    case 'yield':
      return `${value.toFixed(2)}%`;
    case 'price':
      return value.toFixed(2);
    case 'dividend':
      return value.toFixed(6);
    default:
      return value.toString();
  }
};

interface FinancialChartProps {
  chartData: CombinedData[];
  t: {
    chartTitle: string;
    chartDescription: string;
    tooltipText?: string;
  };
  dataKeys?: string[];
  unit?: 'dollar' | 'percent' | 'volume' | 'yield' | 'dividend' | 'price';
}

export function FinancialChart({ chartData, t, dataKeys, unit = 'dollar' }: FinancialChartProps) {
  const pathname = usePathname();
  const [visibility, setVisibility] = useState<{ [key: string]: boolean }>(getInitialVisibility(chartData, dataKeys));

  useEffect(() => {
    setVisibility(getInitialVisibility(chartData, dataKeys));
  }, [chartData, dataKeys]);

  // 更新 handleLegendClick 函數，使用 Recharts 的 Payload 類型
  // Payload 包含 dataKey 和其他資訊
  const handleLegendClick = (data: Payload) => {
    // 檢查 dataKey 是否存在且為字串
    if (typeof data.dataKey === 'string') {
      const key = data.dataKey;
      setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const dynamicSeries = () => {
    if (!chartData || chartData.length === 0) return [];
    const firstDataItem = chartData[0];
    const keys = dataKeys || Object.keys(firstDataItem).filter(key => key !== 'date');

    const generatedSeries = keys.map(key => {
      const isDividend = key.endsWith('_dividend');
      const isYield = key.endsWith('_yield');
      const isVolume = key.endsWith('_volume');
      const fundName = key.replace(/_price|_dividend|_yield|_volume/, '');
      let colorBase;
      const isIssuerComparisonPage = pathname === '/issuer-comparison/';
      switch (fundName) {
        case 'XDTE': colorBase = 'hsl(0, 85%, 50%)'; break;
        case 'SDTY': colorBase = isIssuerComparisonPage ? 'hsl(60, 70%, 50%)' : 'hsl(0, 70%, 50%)'; break;
        case 'QDTE': colorBase = 'hsl(160, 75%, 45%)'; break;
        case 'QDTY': colorBase = isIssuerComparisonPage ? 'hsl(60, 70%, 50%)' : 'hsl(120, 70%, 50%)'; break;
        case 'RDTE': colorBase = 'hsl(220, 90%, 50%)'; break;
        case 'RDTY': colorBase = isIssuerComparisonPage ? 'hsl(30, 70%, 50%)' : 'hsl(240, 70%, 70%)'; break;
        case 'WPAY': colorBase = 'hsl(300, 70%, 50%)'; break;
        case 'YMAX': colorBase = isIssuerComparisonPage ? 'hsl(60, 70%, 50%)' : 'hsl(60, 70%, 50%)'; break;
        default: colorBase = `hsl(${Math.random() * 360}, 70%, 50%)`;
      }
      const seriesName = `${fundName} ${isDividend ? 'Dividend' : (isYield ? 'Yield' : (isVolume ? 'Volume' : 'Price'))}`;
      const seriesType = isDividend ? 'bar' : 'line';
      const yAxisId = isDividend ? 'dividend' : 'price';
      const strokeColor = isDividend ? colorBase : colorBase.replace('50%)', '40%)');
      return { dataKey: key, name: seriesName, color: strokeColor, type: seriesType, yAxisId: yAxisId };
    });

    return generatedSeries.sort((a, b) => {
      if (a.type === 'line' && b.type === 'bar') return -1;
      if (a.type === 'bar' && b.type === 'line') return 1;
      return a.name.localeCompare(b.name);
    });
  };

  const series = dynamicSeries();

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t.chartTitle}</CardTitle>
          <CardDescription>{t.chartDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 sm:h-96 flex items-center justify-center text-muted-foreground">
            No chart data available for the selected dataset.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle>{t.chartTitle}</CardTitle>
          {t.tooltipText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 cursor-pointer">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t.tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <CardDescription>{t.chartDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(value) => formatDate(value)} />
              <YAxis yAxisId="price" orientation="left" tick={{ fontSize: 12 }} tickFormatter={(value) => formatYAxisTick(value, unit)} tickCount={8} />
              <YAxis yAxisId="dividend" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(value) => formatYAxisTick(value, 'dividend')} tickCount={8} />
              <Brush dataKey="date" height={20} stroke="#8884d8" />
              <RechartsTooltip
                formatter={(value: string | number, name: string) => {
                  const formattedValue = formatYAxisTick(Number(value), unit);
                  return [formattedValue, name];
                }}
                labelFormatter={(label) => `📅 ${formatDate(label)}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  fontWeight: "bold",
                  marginBottom: "4px",
                  fontSize: "14px",
                }}
              />
              <Legend onClick={handleLegendClick} wrapperStyle={{ cursor: "pointer" }} />
              {series.map(s => {
                const isVisible = visibility[s.dataKey];
                if (s.type === 'bar') {
                  return <Bar key={s.dataKey} yAxisId={s.yAxisId} dataKey={s.dataKey} name={s.name} fill={isVisible ? s.color : `hsl(0, 0%, 70%)`} opacity={isVisible ? 0.7 : 0.4} hide={!isVisible} />;
                }
                return <Line key={s.dataKey} connectNulls={true} yAxisId={s.yAxisId} type="monotone" dataKey={s.dataKey} name={s.name} stroke={isVisible ? s.color : `hsl(0, 0%, 70%)`} strokeWidth={2} dot={{ r: 1 }} hide={!isVisible} />;
              })}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}