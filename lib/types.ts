export interface FinancialData {
    date: string;
    dividend: number;
    price: number;
    yield: number;
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
    avg3MonthsPrice: number;
    avg6MonthsPrice: number;
    avg9MonthsPrice: number;
}

export type DividendStats = Record<StockSymbol, Stats>;

// export interface DividendStats {
//     roundhill: {
//         [key: string]: { // key will be like "XDTE", "QDTE", "RDTE"
//             avg3Months: number;
//             avg6Months: number;
//             avg9Months: number;
//             avg3MonthsPrice: number;
//             avg6MonthsPrice: number;
//             avg9MonthsPrice: number;
//         };
//     };
//     yieldmax: {
//         [key: string]: { // key will be like "YMAX", "OARK"
//             avg3Months: number;
//             avg6Months: number;
//             avg9Months: number;
//             avg3MonthsPrice: number;
//             avg6MonthsPrice: number;
//             avg9MonthsPrice: number;
//         };
//     };
//     // Add other data sources if needed
// }