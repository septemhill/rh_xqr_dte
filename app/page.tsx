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

interface DividendStats {
  symbol: string
  avg3Months: number
  avg6Months: number
  avg9Months: number
}

export default function FinancialDashboard() {
  const [stocksData, setStocksData] = useState<StockData[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dividendStats, setDividendStats] = useState<DividendStats[]>([])

  const stockSymbols = [
    { symbol: "XDTE", name: "S&P 500 0DTE Covered Call" },
    { symbol: "QDTE", name: "Innovation 100 0DTE Covered Call" },
    { symbol: "RDTE", name: "Small Cap 0DTE Covered Call" },
  ]

  const [xdtePriceVisible, setXdtePriceVisible] = useState(true);
  const [xdteDividendVisible, setXdteDividendVisible] = useState(true);
  const [qdtePriceVisible, setQdtePriceVisible] = useState(true);
  const [qdteDividendVisible, setQdteDividendVisible] = useState(true);
  const [rdtePriceVisible, setRdtePriceVisible] = useState(true);
  const [rdteDividendVisible, setRdteDividendVisible] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = stockSymbols.map(async (stock) => {
          const response = await fetch(`./data/${stock.symbol}.json`)
          const data = await response.json()
          return {
            symbol: stock.symbol,
            name: stock.name,
            data: data.sort((a: FinancialData, b: FinancialData) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          }
        })

        const results = await Promise.all(promises)
        setStocksData(results)

        // 準備圖表資料 - 處理不同起始日期的資料合併
        const allDates = new Set<string>()
        results.forEach((stock) => {
          stock.data.forEach((item: FinancialData) => allDates.add(item.date))
        })

        const sortedDates = Array.from(allDates).sort()

        const combinedData = sortedDates.map((date) => {
          const dataPoint: any = { date }

          results.forEach((stock) => {
            const stockDataForDate = stock.data.find((item: FinancialData) => item.date === date)
            dataPoint[`${stock.symbol}_price`] = stockDataForDate?.price || null
            dataPoint[`${stock.symbol}_dividend`] = stockDataForDate?.dividend || null
          })

          return dataPoint
        })

        setChartData(combinedData)        

        // 計算股息統計
        const stats = results.map((stock) => {
          const now = new Date()
          const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
          const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
          const nineMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 9, now.getDate())

          const dividendData = stock.data.filter((item) => item.dividend > 0)

          const avg3Months = calculateAverageDividend(dividendData, threeMonthsAgo)
          const avg6Months = calculateAverageDividend(dividendData, sixMonthsAgo)
          const avg9Months = calculateAverageDividend(dividendData, nineMonthsAgo)

          return {
            symbol: stock.symbol,
            avg3Months,
            avg6Months,
            avg9Months,
          }
        })
        setDividendStats(stats)
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

  const calculateAverageDividend = (dividendData: FinancialData[], fromDate: Date) => {
    const filteredData = dividendData.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= fromDate && item.dividend > 0
    })

    if (filteredData.length === 0) return 0

    const total = filteredData.reduce((sum, item) => sum + Number(item.dividend), 0)

    console.log(total)
    return total / filteredData.length
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

        {/* Chart Toggles */}
        <div className="flex flex-wrap gap-2">
          <label>
            <input
              type="checkbox"
              checked={xdtePriceVisible}
              onChange={(e) => setXdtePriceVisible(e.target.checked)}
            />
            XDTE 股價
          </label>
          <label>
            <input
              type="checkbox"
              checked={xdteDividendVisible}
              onChange={(e) => setXdteDividendVisible(e.target.checked)}
            />
            XDTE 股息
          </label>
          <label>
            <input
              type="checkbox"
              checked={qdtePriceVisible}
              onChange={(e) => setQdtePriceVisible(e.target.checked)}
            />
            QDTE 股價
          </label>
          <label>
            <input
              type="checkbox"
              checked={qdteDividendVisible}
              onChange={(e) => setQdteDividendVisible(e.target.checked)}
            />
            QDTE 股息
          </label>
          <label>
            <input
              type="checkbox"
              checked={rdtePriceVisible}
              onChange={(e) => setRdtePriceVisible(e.target.checked)}
            />
            RDTE 股價
          </label>
          <label>
            <input
              type="checkbox"
              checked={rdteDividendVisible}
              onChange={(e) => setRdteDividendVisible(e.target.checked)}
            />
            RDTE 股息
          </label>
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
                  {xdteDividendVisible && <Bar
                      key="XDTE_dividend"
                      yAxisId="dividend"
                      dataKey="XDTE_dividend"
                      name="XDTE 股息"
                      fill={`hsl(0, 70%, 50%)`}
                      opacity={0.7}
                    />}
                  {qdteDividendVisible && <Bar
                      key="QDTE_dividend"
                      yAxisId="dividend"
                      dataKey="QDTE_dividend"
                      name="QDTE 股息"
                      fill={`hsl(120, 70%, 50%)`}
                      opacity={0.7}
                    />}
                  {rdteDividendVisible && <Bar
                      key="RDTE_dividend"
                      yAxisId="dividend"
                      dataKey="RDTE_dividend"
                      name="RDTE 股息"
                      fill={`hsl(240, 70%, 50%)`}
                      opacity={0.7}
                    />}

                  {/* 股價折線圖 */}
                  {xdtePriceVisible && <Line
                      key="XDTE_price"
                      yAxisId="price"
                      type="monotone"
                      dataKey="XDTE_price"
                      name="XDTE 股價"
                      stroke={`hsl(0, 70%, 40%)`}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />}
                  {qdtePriceVisible && <Line
                      key="QDTE_price"
                      yAxisId="price"
                      type="monotone"
                      dataKey="QDTE_price"
                      name="QDTE 股價"
                      stroke={`hsl(120, 70%, 40%)`}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />}
                  {rdtePriceVisible && <Line
                      key="RDTE_price"
                      yAxisId="price"
                      type="monotone"
                      dataKey="RDTE_price"
                      name="RDTE 股價"
                      stroke={`hsl(240, 70%, 40%)`}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

                {/* 股息統計 */}
        <Card>
          <CardHeader>
            <CardTitle>股息統計分析</CardTitle>
            <CardDescription>各股票近期平均股息表現</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>股票代號</TableHead>
                    <TableHead>近3個月平均股息</TableHead>
                    <TableHead>近6個月平均股息</TableHead>
                    <TableHead>近9個月平均股息</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dividendStats.map((stat) => (
                    <TableRow key={stat.symbol}>
                      <TableCell className="font-medium">{stat.symbol}</TableCell>
                      <TableCell>{formatCurrency(stat.avg3Months)}</TableCell>
                      <TableCell>{formatCurrency(stat.avg6Months)}</TableCell>
                      <TableCell>{formatCurrency(stat.avg9Months)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
