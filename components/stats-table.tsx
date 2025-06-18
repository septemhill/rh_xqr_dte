import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { stockSymbols } from "@/lib/constants";
import { DividendStats, StockSymbol } from "@/lib/types";
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
  };
}

export function StatsTable({ stats, t }: StatsTableProps) {
  const statRows = [
    { label: t.avg3DivMonths, key: "avg3Months", digits: 6 },
    { label: t.avg6DivMonths, key: "avg6Months", digits: 6 },
    { label: t.avg9DivMonths, key: "avg9Months", digits: 6 },
    { label: t.avg3PriceMonths, key: "avg3MonthsPrice", digits: 2 },
    { label: t.avg6PriceMonths, key: "avg6MonthsPrice", digits: 2 },
    { label: t.avg9PriceMonths, key: "avg9MonthsPrice", digits: 2 },
  ] as const;

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
                {stockSymbols.map((stock) => (
                  <TableHead key={stock.symbol}>{stock.symbol}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {statRows.map((row) => (
                <TableRow key={row.key}>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  {stockSymbols.map((stock) => (
                    <TableCell key={stock.symbol}>
                      {formatCurrency(stats[stock.symbol as StockSymbol][row.key], row.digits)}
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