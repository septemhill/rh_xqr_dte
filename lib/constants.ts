import { StockSymbol } from "@/lib/types";

interface StockInfo {
    symbol: StockSymbol;
    name: string;
}

export const stockSymbols: StockInfo[] = [
    { symbol: "XDTE", name: "S&P 500 0DTE Covered Call" },
    { symbol: "QDTE", name: "Innovation 100 0DTE Covered Call" },
    { symbol: "RDTE", name: "Small Cap 0DTE Covered Call" },
];