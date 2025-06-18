export interface FinancialData {
    date: string;
    dividend: number;
    price: number;
}

export interface StockData {
    symbol: string;
    name: string;
    data: FinancialData[];
}

export type StockSymbol = "XDTE" | "QDTE" | "RDTE";

export interface Stats {
    avg3Months: number;
    avg6Months: number;
    avg9Months: number;
    avg3MonthsPrice: number;
    avg6MonthsPrice: number;
    avg9MonthsPrice: number;
}

export type DividendStats = Record<StockSymbol, Stats>;