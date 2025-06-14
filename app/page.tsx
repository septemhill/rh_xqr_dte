"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ThemeToggle } from "@/components/theme-toggle"

interface FinancialData {
  date: string
  dividend: number
  price: number
}

interface StockData {
  symbol: string
  name: string
  data: FinancialData[]
}

export default function FinancialDashboard() {
  const [stocksData, setStocksData] = useState<StockData[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const stockSymbols = [
    { symbol: "XDTE", name: "S&P 500 0DTE Covered Call" },
    { symbol: "QDTE", name: "Innovation 100 0DTE Covered Call" },
    { symbol: "RDTE", name: "Small Cap 0DTE Covered Call" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = stockSymbols.map(async (stock) => {
          const response = await fetch(`./data/${stock.symbol}.json`)
          const data = await response.json()
          return {
            symbol: stock.symbol,
            name: stock.name,
            data: data,
          }
        })

        const results = await Promise.all(promises)
        setStocksData(results)

        // 準備圖表資料 - 處理不同起始日期的資料合併
        const allDates = new Set<string>()
        results.forEach((stock) => {
          stock.data.forEach((item) => allDates.add(item.date))
        })

        const sortedDates = Array.from(allDates).sort()

        const combinedData = sortedDates.map((date) => {
          const dataPoint: any = { date }

          results.forEach((stock) => {
            const stockDataForDate = stock.data.find((item) => item.date === date)
            dataPoint[`${stock.symbol}_price`] = stockDataForDate?.price || null
            dataPoint[`${stock.symbol}_dividend`] = stockDataForDate?.dividend || null
          })

          return dataPoint
        })

        setChartData(combinedData)        
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 6,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-TW")
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">金融資訊瀏覽</h1>
          <p className="text-muted-foreground">載入中...</p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <ThemeToggle />
      <div className="container mx-auto p-4 pt-16 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">金融資訊瀏覽</h1>
          <p className="text-muted-foreground">股價與股息資訊總覽</p>
        </div>

        {/* 三張資料表格 */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {stocksData.map((stock) => (
            <Card key={stock.symbol} className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                <CardDescription>{stock.name}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="h-80 overflow-auto border rounded-md">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm border-b">日期</TableHead>
                        <TableHead className="text-xs sm:text-sm border-b">股價</TableHead>
                        <TableHead className="text-xs sm:text-sm border-b">股息</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stock.data.map((item, index) => (
                        <TableRow key={index} className="hover:bg-muted/50">
                          <TableCell className="text-xs sm:text-sm font-medium">{formatDate(item.date)}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{formatCurrency(item.dividend)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 組合圖表 */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>股價與股息趨勢圖</CardTitle>
            <CardDescription>折線圖顯示股價，柱狀圖顯示股息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-80 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(value) => formatDate(value)} />
                  <YAxis
                    yAxisId="price"
                    orientation="left"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <YAxis
                    yAxisId="dividend"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    formatter={(value: any, name: string) => {
                      const symbol = name.split('_')[0];
                      return [
                        formatCurrency(Number(value)),
                        `${symbol}`,
                      ];
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
                  <Legend />

                  {/* 股息柱狀圖 */}
                  {stockSymbols.map((stock, index) => (
                    <Bar
                      key={`${stock.symbol}_dividend`}
                      yAxisId="dividend"
                      dataKey={`${stock.symbol}_dividend`}
                      name={`${stock.symbol} 股息`}
                      fill={`hsl(${index * 120}, 70%, 50%)`}
                      opacity={0.7}
                    />
                  ))}

                  {/* 股價折線圖 */}
                  {stockSymbols.map((stock, index) => (
                    <Line
                      key={`${stock.symbol}_price`}
                      yAxisId="price"
                      type="monotone"
                      dataKey={`${stock.symbol}_price`}
                      name={`${stock.symbol} 股價`}
                      stroke={`hsl(${index * 120}, 70%, 40%)`}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  ))}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
