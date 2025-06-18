import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StockData } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface StockDataTableProps {
  stock: StockData;
  t: {
    date: string;
    price: string;
    dividend: string;
  };
}

export function StockDataTable({ stock, t }: StockDataTableProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{stock.symbol}</CardTitle>
        <CardDescription>{stock.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 overflow-auto border rounded-md">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="text-xs sm:text-sm border-b">{t.date}</TableHead>
                <TableHead className="text-xs sm:text-sm border-b">{t.price}</TableHead>
                <TableHead className="text-xs sm:text-sm border-b">{t.dividend}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stock.data.map((item, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="text-xs sm:text-sm font-medium">{formatDate(item.date)}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{formatCurrency(item.price, 2)}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{formatCurrency(item.dividend, 6)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}