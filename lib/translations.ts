export const translations = {
    zh: {
        // 頁面標題
        pageTitle: "零日備兌期權ETF總覽",
        pageDescription: "股價與股息資訊總覽",
        loading: "載入中...",

        // 表格標題
        date: "日期",
        price: "股價",
        dividend: "股息",
        yield: "殖利率",

        // 圖表
        chartTitle: "股價與股息趨勢圖",
        chartDescription: "折線圖顯示股價，柱狀圖顯示股息",

        // 統計
        statsTitle: "數據統計分析",
        statsDescription: "各股票近期平均股息和價格表現",
        stockSymbol: "股票代號",
        avg3MDiv: "近3個月平均股息",
        avg6MDiv: "近6個月平均股息",
        avg9MDiv: "近9個月平均股息",
        avg1YDiv: "近1年平均股息",
        avg3MPrice: "近3個月平均價格",
        avg6MPrice: "近6個月平均價格",
        avg9MPrice: "近9個月平均價格",
        avg1YPrice: "近1年平均價格",
        avg3MYield: "近3個月平均殖利率",
        avg6MYield: "近6個月平均殖利率",
        avg9MYield: "近9個月平均殖利率",
        avg1YYield: "近1年平均殖利率",

        // Legend 和 Tooltip
        priceLabel: "股價",
        dividendLabel: "股息",
        dateLabel: "日期",

        // 公司名稱
        companies: {
            XDTE: "標普500 零日備兌看漲期權",
            QDTE: "Innovation-100 零日備兌看漲期權",
            RDTE: "羅素2000 零日備兌看漲期權",
        },

        navigation: { // NEW: Navigation translations
            selectPage: "選擇頁面",
            dashboard: "總覽",
            issuerComparison: "發行商比較",
            // contact: "聯繫我們",
        },

        comparison: {
            priceDivComparison: "價格與股息比較",
            statsComparison: "統計數據比較",
            notesTitle: "註解",
            notesContent: "此區塊用於說明資料來源、計算方式以及圖表的奇怪成因。",
            dataSource: "資料來源：https://www.alphavantage.co/",
            lineDiscontinous: "線段不連續的主因，為分發配息的日子不同所導致"
        },

        issuer: {
            roundhill: "Roundhill",
            yieldmax: "Yieldmax"
        }
    },
    en: {
        // 頁面標題
        pageTitle: "0DTE Covered Call Dashboard",
        pageDescription: "Overview of stock prices and dividend information",
        loading: "Loading...",

        // 表格標題
        date: "Date",
        price: "Price",
        dividend: "Dividend",
        yield: "Yield",

        // 圖表
        chartTitle: "Stock Price and Dividend Trends",
        chartDescription: "Line chart shows stock prices, bar chart shows dividends",

        // 統計
        statsTitle: "Financial Statistics Analysis",
        statsDescription: "Recent average dividend and stock price performance of each stock",
        stockSymbol: "Stock Symbol",
        avg3MDiv: "3M Avg Div",
        avg6MDiv: "6M Avg Div",
        avg9MDiv: "9M Avg Div",
        avg1YDiv: "1Y Avg Div",
        avg3MPrice: "3M Avg Price",
        avg6MPrice: "6M Avg Price",
        avg9MPrice: "9M Avg Price",
        avg1YPrice: "1Y Avg Price",
        avg3MYield: "3M Avg Yield",
        avg6MYield: "6M Avg Yield",
        avg9MYield: "9M Avg Yield",
        avg1YYield: "1Y Avg Yield",

        // Legend 和 Tooltip
        priceLabel: "Price",
        dividendLabel: "Dividend",
        dateLabel: "Date",

        // 公司名稱
        companies: {
            XDTE: "S&P 500 0DTE Covered Call.",
            QDTE: "Innovation 100 0DTE Covered Call",
            RDTE: "Small Cap 0DTE Covered Call",
        },

        navigation: { // NEW: Navigation translations
            selectPage: "Select Page",
            dashboard: "Dashboard",
            issuerComparison: "Comparison",
            // contact: "Contact",
        },

        comparison: {
            priceDivComparison: "Price and dividend comparison",
            statsComparison: "Statistics comparison",
            notesTitle: "Notes",
            notesContent: "This section provides information on data sources, calculation methods, and unusual chart behaviors.",
            dataSource: "Data source: https://www.alphavantage.co/",
            lineDiscontinous: "The gaps in the line chart are caused by variations in dividend distribution dates, which lead to missing data points on certain days."
        },

        issuer: {
            roundhill: "Roundhill",
            yieldmax: "Yieldmax"
        }
    },
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.zh
