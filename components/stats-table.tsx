// src/components/stats-table.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { stockSymbols } from "@/lib/constants"; // We will no longer directly use stockSymbols constant
import { DividendStats, StockSymbol } from "@/lib/types"; // Make sure DividendStats type is updated as discussed above
import { formatCurrency } from "@/lib/utils";

interface StatsTableProps {
  stats: DividendStats;
  t: {
    statsTitle: string;
    statsDescription: string;
    avg3DivMonths: string;
    avg6DivMonths: string;
    avg9DivMonths: string;
    avg3PriceMonths: string;
    avg6PriceMonths: string;
    avg9PriceMonths: string;
    avg3YieldMonths: string;
    avg6YieldMonths: string;
    avg9YieldMonths: string;
  };
  selectedDataSource: "roundhill" | "yieldmax"; // <--- Add this prop
}

export function StatsTable({ stats, t, selectedDataSource }: StatsTableProps) {
  const statRows = [
    { label: t.avg3DivMonths, key: "avg3Months", digits: 6 },
    { label: t.avg6DivMonths, key: "avg6Months", digits: 6 },
    { label: t.avg9DivMonths, key: "avg9Months", digits: 6 },
    { label: t.avg3PriceMonths, key: "avg3MonthsPrice", digits: 2 },
    { label: t.avg6PriceMonths, key: "avg6MonthsPrice", digits: 2 },
    { label: t.avg9PriceMonths, key: "avg9MonthsPrice", digits: 2 },
    { label: t.avg3YieldMonths, key: "avg3MonthsYield", digits: 2 },
    { label: t.avg6YieldMonths, key: "avg6MonthsYield", digits: 2 },
    { label: t.avg9YieldMonths, key: "avg9MonthsYield", digits: 2 },
  ] as const;

  // Get the specific data for the selected data source
  // This will be like stats.roundhill or stats.yieldmax
  // const currentDataSourceStats = stats[selectedDataSource];
  const currentDataSourceStats = stats;

  console.log("Current Data Source Stats:", currentDataSourceStats, selectedDataSource, stats);

  // Dynamically get the stock symbols available in the current data source
  // This ensures we only display columns for stocks present in the selected dataset
  const currentStockSymbols = currentDataSourceStats ? Object.keys(currentDataSourceStats).sort() : []; // Sort for consistent order

  // If there's no data for the selected source, display a message
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.statsTitle}</CardTitle>
        <CardDescription>{t.statsDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Statistics</TableHead>
                {/* Dynamically render TableHeads based on currentStockSymbols */}
                {currentStockSymbols.map((symbol) => (
                  <TableHead key={symbol}>{symbol}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {statRows.map((row) => (
                <TableRow key={row.key}>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  {/* Dynamically render TableCells for each stock in the current data source */}
                  {currentStockSymbols.map((symbol) => (
                    <TableCell key={symbol}>
                      {/* Access data like currentDataSourceStats["XDTE"].avg3Months */}
                      {formatCurrency(currentDataSourceStats[symbol][row.key], row.digits)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}