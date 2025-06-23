import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from "recharts";
import { formatCurrency, formatDate } from "@/lib/utils";

interface FinancialChartProps {
  chartData: any[]; // chartData 的具體結構取決於你的 JSON 數據，這裡保持 any[]
  t: {
    chartTitle: string;
    chartDescription: string;
  };
  dataKeys?: string[];
  unit?: 'dollar' | 'percent';
}

export function FinancialChart({ chartData, t, dataKeys, unit = 'dollar' }: FinancialChartProps) {
  const pathname = usePathname();
  // 動態生成 initialVisibilityState
  const getInitialVisibility = (data: any[]) => {
    if (!data || data.length === 0) return {};
    const firstDataItem = data[0];
    const keys = dataKeys || Object.keys(firstDataItem).filter(key => key !== 'date');
    const initialState: { [key: string]: boolean } = {};
    keys.forEach(key => {
      initialState[key] = true; // 預設所有數據線都可見
    });
    return initialState;
  };

  const [visibility, setVisibility] = useState<{ [key: string]: boolean }>(getInitialVisibility(chartData));

  // 當 chartData 改變時，重設 visibility 狀態
  useEffect(() => {
    setVisibility(getInitialVisibility(chartData));
  }, [chartData]);


  const handleLegendClick = (dataKey: any) => {
    const key = dataKey.dataKey as string; // 將 dataKey 轉為 string
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 動態生成 series 陣列
  const dynamicSeries = () => {
    if (!chartData || chartData.length === 0) return [];

    const firstDataItem = chartData[0];
    const keys = dataKeys || Object.keys(firstDataItem).filter(key => key !== 'date'); // 排除 'date' 鍵

    const generatedSeries = keys.map(key => {
      const isDividend = key.endsWith('_dividend');
      const isYield = key.endsWith('_yield');
      const fundName = key.replace(/_price|_dividend|_yield/, ''); // 從鍵中提取基金名稱，例如 "XDTE"

      // 定義一個簡單的顏色生成邏輯，可以根據基金名稱hash或索引分配顏色
      // 這裡使用一個基礎色系，你可以根據實際需求調整
      let colorBase;
      const isIssuerComparisonPage = pathname === '/issuer-comparison/';

      switch (fundName) {
        case 'XDTE': colorBase = 'hsl(0, 70%, 50%)'; break; // 紅色系
        case 'SDTY': colorBase = isIssuerComparisonPage ? 'hsl(60, 70%, 50%)' : 'hsl(0, 70%, 50%)'; break; // 黃色系 or 紅色系
        case 'QDTE': colorBase = 'hsl(120, 70%, 50%)'; break; // 綠色系
        case 'QDTY': colorBase = isIssuerComparisonPage ? 'hsl(60, 70%, 50%)' : 'hsl(120, 70%, 50%)'; break; // 黃色系 or 綠色系
        case 'RDTE': colorBase = 'hsl(240, 70%, 50%)'; break; // 藍色系
        case 'RDTY': colorBase = isIssuerComparisonPage ? 'hsl(30, 70%, 50%)' : 'hsl(240, 70%, 70%)'; break; // 橘色系 or 藍色系
        // 如果有其他基金，可以在這裡添加更多顏色
        default: colorBase = `hsl(${Math.random() * 360}, 70%, 50%)`; // 隨機色
      }

      const seriesName = `${fundName} ${isDividend ? 'Dividend' : (isYield ? 'Yield' : 'Price')}`;
      const seriesType = isDividend ? 'bar' : 'line';
      const yAxisId = isDividend ? 'dividend' : 'price';
      const strokeColor = isDividend ? colorBase : colorBase.replace('50%)', '40%)'); // 價格線條顏色可以稍深

      return {
        dataKey: key,
        name: seriesName,
        color: strokeColor,
        type: seriesType,
        yAxisId: yAxisId,
      };
    });

    // 可選：可以對生成的 series 進行排序，例如先顯示價格再顯示股息
    return generatedSeries.sort((a, b) => {
      if (a.type === 'line' && b.type === 'bar') return -1;
      if (a.type === 'bar' && b.type === 'line') return 1;
      return a.name.localeCompare(b.name);
    });
  };

  const series = dynamicSeries(); // 使用動態生成的 series

  // 如果 chartData 為空，則不渲染圖表，顯示提示訊息
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
        <CardTitle>{t.chartTitle}</CardTitle>
        <CardDescription>{t.chartDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(value) => formatDate(value)} />
              <YAxis yAxisId="price" orientation="left" tick={{ fontSize: 12 }} tickFormatter={(value) => (unit === 'dollar' ? `$${value}` : `${value.toFixed(2)}%`)} tickCount={8} />
              <YAxis yAxisId="dividend" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(value) => (unit === 'dollar' ? `$${value}` : `${value.toFixed(2)}%`)} tickCount={8} />
              <Brush dataKey="date" height={20} stroke="#8884d8" />
              <Tooltip
                formatter={(value: any, name: string) => {
                  const formattedValue = unit === 'dollar' ? formatCurrency(Number(value), 6) : `${Number(value).toFixed(2)}%`;
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
                  return (
                    <Bar
                      key={s.dataKey}
                      yAxisId={s.yAxisId} // 使用動態生成的 yAxisId
                      dataKey={s.dataKey}
                      name={s.name}
                      fill={isVisible ? s.color : `hsl(0, 0%, 70%)`}
                      opacity={isVisible ? 0.7 : 0.4}
                      hide={!isVisible}
                    />
                  );
                }
                return (
                  <Line
                    key={s.dataKey}
                    yAxisId={s.yAxisId} // 使用動態生成的 yAxisId
                    type="monotone"
                    dataKey={s.dataKey}
                    name={s.name}
                    stroke={isVisible ? s.color : `hsl(0, 0%, 70%)`}
                    strokeWidth={2}
                    dot={{ r: 1 }}
                    hide={!isVisible}
                  />
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
