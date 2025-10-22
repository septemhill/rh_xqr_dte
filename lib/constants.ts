import { StockSymbol } from "@/lib/types";

interface StockInfo {
    symbol: StockSymbol;
    name: string;
}

export const stockSymbols: StockInfo[] = [
    { symbol: "XDTE", name: "S&P 500 0DTE Covered Call" },
    { symbol: "QDTE", name: "Innovation 100 0DTE Covered Call" },
    { symbol: "RDTE", name: "Small Cap 0DTE Covered Call" },
    { symbol: "WPAY", name: "WeeklyPay™ Universe ETF" },
    { symbol: "SDTY", name: "S&P 500 0DTE Covered Call" },
    { symbol: "QDTY", name: "Innovation 100 0DTE Covered Call" },
    { symbol: "RDTY", name: "Small Cap 0DTE Covered Call" },
    { symbol: "YMAX", name: "Universe Fund of Option Income ETF" },
];