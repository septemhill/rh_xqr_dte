import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency, formatDate } from "@/lib/utils";

interface FinancialChartProps {
  chartData: any[];
  t: {
    chartTitle: string;
    chartDescription: string;
  };
}

export function FinancialChart({ chartData, t }: FinancialChartProps) {
  const [visibility, setVisibility] = useState({
    XDTE_price: true,
    XDTE_dividend: true,
    QDTE_price: true,
    QDTE_dividend: true,
    RDTE_price: true,
    RDTE_dividend: true,
  });

  const handleLegendClick = (dataKey: any) => {
    const key = dataKey.dataKey as keyof typeof visibility;
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const series = [
    { dataKey: "XDTE_dividend", name: "XDTE Dividend", color: "hsl(0, 70%, 50%)", type: "bar" },
    { dataKey: "QDTE_dividend", name: "QDTE Dividend", color: "hsl(120, 70%, 50%)", type: "bar" },
    { dataKey: "RDTE_dividend", name: "RDTE Dividend", color: "hsl(240, 70%, 50%)", type: "bar" },
    { dataKey: "XDTE_price", name: "XDTE Price", color: "hsl(0, 70%, 40%)", type: "line" },
    { dataKey: "QDTE_price", name: "QDTE Price", color: "hsl(120, 70%, 40%)", type: "line" },
    { dataKey: "RDTE_price", name: "RDTE Price", color: "hsl(240, 70%, 40%)", type: "line" },
  ] as const;

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
              <YAxis yAxisId="price" orientation="left" tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value}`} tickCount={8} />
              <YAxis yAxisId="dividend" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value}`} tickCount={8} />
              <Tooltip
                formatter={(value: any, name: string) => [formatCurrency(Number(value), 6), name.split(' ')[0]]}
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
                      yAxisId="dividend"
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
                    yAxisId="price"
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