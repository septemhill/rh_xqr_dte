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

// 更新 DividendStats 介面以包含股價平均
interface DividendStats {
  XDTE: {
    avg3Months: number;
    avg6Months: number;
    avg9Months: number;
    avg3MonthsPrice: number;
    avg6MonthsPrice: number;
    avg9MonthsPrice: number;
  };
  QDTE: {
    avg3Months: number;
    avg6Months: number;
    avg9Months: number;
    avg3MonthsPrice: number;
    avg6MonthsPrice: number;
    avg9MonthsPrice: number;
  };
  RDTE: {
    avg3Months: number;
    avg6Months: number;
    avg9Months: number;
    avg3MonthsPrice: number;
    avg6MonthsPrice: number;
    avg9MonthsPrice: number;
  };
}

export default function FinancialDashboard() {
  const [stocksData, setStocksData] = useState<StockData[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  // 更新 dividendStats 的初始狀態
  const [dividendStats, setDividendStats] = useState<DividendStats>({
    XDTE: { avg3Months: 0, avg6Months: 0, avg9Months: 0, avg3MonthsPrice: 0, avg6MonthsPrice: 0, avg9MonthsPrice: 0 },
    QDTE: { avg3Months: 0, avg6Months: 0, avg9Months: 0, avg3MonthsPrice: 0, avg6MonthsPrice: 0, avg9MonthsPrice: 0 },
    RDTE: { avg3Months: 0, avg6Months: 0, avg9Months: 0, avg3MonthsPrice: 0, avg6MonthsPrice: 0, avg9MonthsPrice: 0 },
  });

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

        // 計算股息和股價統計 (修改後的邏輯)
        const newDividendStats: DividendStats = {
          XDTE: { avg3Months: 0, avg6Months: 0, avg9Months: 0, avg3MonthsPrice: 0, avg6MonthsPrice: 0, avg9MonthsPrice: 0 },
          QDTE: { avg3Months: 0, avg6Months: 0, avg9Months: 0, avg3MonthsPrice: 0, avg6MonthsPrice: 0, avg9MonthsPrice: 0 },
          RDTE: { avg3Months: 0, avg6Months: 0, avg9Months: 0, avg3MonthsPrice: 0, avg6MonthsPrice: 0, avg9MonthsPrice: 0 },
        };

        results.forEach((stock) => {
          const now = new Date();
          const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          const nineMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 9, now.getDate());

          const dividendData = stock.data.filter((item) => item.dividend > 0);
          const priceData = stock.data.filter((item) => item.price > 0); // 用於股價計算的數據

          const avg3MonthsDividend = calculateAverageDividend(dividendData, threeMonthsAgo);
          const avg6MonthsDividend = calculateAverageDividend(dividendData, sixMonthsAgo);
          const avg9MonthsDividend = calculateAverageDividend(dividendData, nineMonthsAgo);

          const avg3MonthsPrice = calculateAveragePrice(priceData, threeMonthsAgo); // 計算股價平均
          const avg6MonthsPrice = calculateAveragePrice(priceData, sixMonthsAgo);
          const avg9MonthsPrice = calculateAveragePrice(priceData, nineMonthsAgo);

          // 根據 symbol 將計算結果賦值到對應的屬性
          if (stock.symbol === "XDTE") {
            newDividendStats.XDTE = { 
              avg3Months: avg3MonthsDividend, 
              avg6Months: avg6MonthsDividend, 
              avg9Months: avg9MonthsDividend,
              avg3MonthsPrice, 
              avg6MonthsPrice,
              avg9MonthsPrice,
            };
          } else if (stock.symbol === "QDTE") {
            newDividendStats.QDTE = { 
              avg3Months: avg3MonthsDividend, 
              avg6Months: avg6MonthsDividend, 
              avg9Months: avg9MonthsDividend,
              avg3MonthsPrice,
              avg6MonthsPrice,
              avg9MonthsPrice,
            };
          } else if (stock.symbol === "RDTE") {
            newDividendStats.RDTE = { 
              avg3Months: avg3MonthsDividend, 
              avg6Months: avg6MonthsDividend, 
              avg9Months: avg9MonthsDividend,
              avg3MonthsPrice,
              avg6MonthsPrice,
              avg9MonthsPrice,
            };
          }
        });
        setDividendStats(newDividendStats);
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

  const calculateAverageDividend = (dividendData: FinancialData[], fromDate: Date): number => {
    const filteredData = dividendData.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= fromDate && item.dividend > 0
    })

    if (filteredData.length === 0) return 0

    const total = filteredData.reduce((sum, item) => sum + Number(item.dividend), 0)

    return total / filteredData.length
  }

  // 新增 calculateAveragePrice 函式
  const calculateAveragePrice = (priceData: FinancialData[], fromDate: Date): number => {
    const filteredData = priceData.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= fromDate && item.price > 0
    })

    if (filteredData.length === 0) return 0

    const total = filteredData.reduce((sum, item) => sum + Number(item.price), 0)
    return total / filteredData.length
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-TW")
  }

  const handleLegendClick = (dataKey: any) => {
    switch (dataKey.dataKey) {
      case "XDTE_price":
        setXdtePriceVisible(!xdtePriceVisible);
        break;
      case "XDTE_dividend":
        setXdteDividendVisible(!xdteDividendVisible);
        break;
      case "QDTE_price":
        setQdtePriceVisible(!qdtePriceVisible);
        break;
      case "QDTE_dividend":
        setQdteDividendVisible(!qdteDividendVisible);
        break;
      case "RDTE_price":
        setRdtePriceVisible(!rdtePriceVisible);
        break;
      case "RDTE_dividend":
        setRdteDividendVisible(!rdteDividendVisible);
        break;
      default:
        break;
    }
  };


  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Financial Dashboard</h1>
          <p className="text-muted-foreground">Loading...</p>
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
          <h1 className="text-3xl font-bold mb-2">Financial Dashboard</h1>
          <p className="text-muted-foreground">Overview of stock prices and dividend information</p>
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
                        <TableHead className="text-xs sm:text-sm border-b">Date</TableHead>
                        <TableHead className="text-xs sm:text-sm border-b">Price</TableHead>
                        <TableHead className="text-xs sm:text-sm border-b">Dividend</TableHead>
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
            <CardTitle>Stock Price and Dividend Trend Chart</CardTitle>
            <CardDescription>Line chart shows stock price, bar chart shows dividend</CardDescription>
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
                  <Legend
                    onClick={handleLegendClick}
                    wrapperStyle={{ cursor: "pointer" }}
                  />

                  {/* 股息柱狀圖 */}
                  <Bar
                      key="XDTE_dividend"
                      yAxisId="dividend"
                      dataKey="XDTE_dividend"
                      name="XDTE Dividend"
                      fill={xdteDividendVisible ? `hsl(0, 70%, 50%)` : `hsl(0, 0%, 70%)`}
                      opacity={xdteDividendVisible ? 0.7 : 0.4}
                    />
                  <Bar
                      key="QDTE_dividend"
                      yAxisId="dividend"
                      dataKey="QDTE_dividend"
                      name="QDTE Dividend"
                      fill={qdteDividendVisible ? `hsl(120, 70%, 50%)` : `hsl(0, 0%, 70%)`}
                      opacity={qdteDividendVisible ? 0.7 : 0.4}
                    />
                  <Bar
                      key="RDTE_dividend"
                      yAxisId="dividend"
                      dataKey="RDTE_dividend"
                      name="RDTE Dividend"
                      fill={rdteDividendVisible ? `hsl(240, 70%, 50%)` : `hsl(0, 0%, 70%)`}
                      opacity={rdteDividendVisible ? 0.7 : 0.4}
                    />

                  {/* 股價折線圖 */}
                  <Line
                      key="XDTE_price"
                      yAxisId="price"
                      type="monotone"
                      dataKey="XDTE_price"
                      name="XDTE Price"
                      stroke={xdtePriceVisible ? `hsl(0, 70%, 40%)` : `hsl(0, 0%, 70%)`}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  <Line
                      key="QDTE_price"
                      yAxisId="price"
                      type="monotone"
                      dataKey="QDTE_price"
                      name="QDTE Price"
                      stroke={qdtePriceVisible ? `hsl(120, 70%, 40%)` : `hsl(0, 0%, 70%)`}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  <Line
                      key="RDTE_price"
                      yAxisId="price"
                      type="monotone"
                      dataKey="RDTE_price"
                      name="RDTE Price"
                      stroke={rdtePriceVisible ? `hsl(240, 70%, 40%)` : `hsl(0, 0%, 70%)`}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Financial Statistics Analysis (Modified rendering and titles) */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Statistics Analysis</CardTitle>
            <CardDescription>Recent average dividend and stock price performance of each stock</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Statistics</TableHead>
                    {stockSymbols.map((stock) => (
                      <TableHead key={stock.symbol}>{stock.symbol}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Dividend Statistics Row */}
                  <TableRow>
                    <TableCell className="font-medium">3M Div Avg</TableCell>
                    {stockSymbols.map((stock) => (
                      <TableCell key={stock.symbol}>{formatCurrency(dividendStats[stock.symbol as keyof DividendStats].avg3Months)}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">6M Div Avg</TableCell>
                    {stockSymbols.map((stock) => (
                      <TableCell key={stock.symbol}>{formatCurrency(dividendStats[stock.symbol as keyof DividendStats].avg6Months)}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">9M Div Avg</TableCell>
                    {stockSymbols.map((stock) => (
                      <TableCell key={stock.symbol}>{formatCurrency(dividendStats[stock.symbol as keyof DividendStats].avg9Months)}</TableCell>
                    ))}
                  </TableRow>
                  {/* Stock Price Statistics Row */}
                  <TableRow>
                    <TableCell className="font-medium">3M Price Avg</TableCell>
                    {stockSymbols.map((stock) => (
                      <TableCell key={stock.symbol}>{formatCurrency(dividendStats[stock.symbol as keyof DividendStats].avg3MonthsPrice)}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">6M Price Avg</TableCell>
                    {stockSymbols.map((stock) => (
                      <TableCell key={stock.symbol}>{formatCurrency(dividendStats[stock.symbol as keyof DividendStats].avg6MonthsPrice)}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">9M Price Avg</TableCell>
                    {stockSymbols.map((stock) => (
                      <TableCell key={stock.symbol}>{formatCurrency(dividendStats[stock.symbol as keyof DividendStats].avg9MonthsPrice)}</TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
