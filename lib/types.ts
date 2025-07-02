export interface FinancialData {
    date: string;
    dividend: number;
    price: number;
    yield: number;
    volume: number;
}

export interface StockData {
    symbol: string;
    name: string;
    data: FinancialData[];
}

export type StockSymbol = "XDTE" | "QDTE" | "RDTE" | "SDTY" | "QDTY" | "RDTY";

export interface Stats {
    avg3Months: number;
    avg6Months: number;
    avg9Months: number;
    avg1Year: number;
    avg3MonthsPrice: number;
    avg6MonthsPrice: number;
    avg9MonthsPrice: number;
    avg1YearPrice: number;
    avg3MonthsYield: number;
    avg6MonthsYield: number;
    avg9MonthsYield: number;
    avg1YearYield: number;
}

export type DividendStats = Record<StockSymbol, Stats>;

export interface CombinedData {
    date: string;
    [key: string]: string | number | null;
}

