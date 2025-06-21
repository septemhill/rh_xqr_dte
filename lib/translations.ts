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
        avg3DivMonths: "近3個月平均股息",
        avg6DivMonths: "近6個月平均股息",
        avg9DivMonths: "近9個月平均股息",
        avg3PriceMonths: "近3個月平均價格",
        avg6PriceMonths: "近6個月平均價格",
        avg9PriceMonths: "近9個月平均價格",
        avg3YieldMonths: "近3個月平均殖利率",
        avg6YieldMonths: "近6個月平均殖利率",
        avg9YieldMonths: "近9個月平均殖利率",

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
            dashboard: "首頁",
            issuerComparison: "發行商比較",
            // contact: "聯繫我們",
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
        avg3DivMonths: "3M Avg Div",
        avg6DivMonths: "6M Avg Div",
        avg9DivMonths: "9M Avg Div",
        avg3PriceMonths: "3M Avg Price",
        avg6PriceMonths: "6M Avg Price",
        avg9PriceMonths: "9M Avg Price",
        avg3YieldMonths: "3M Avg Yield",
        avg6YieldMonths: "6M Avg Yield",
        avg9YieldMonths: "9M Avg Yield",

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

        issuer: {
            roundhill: "Roundhill",
            yieldmax: "Yieldmax"
        }
    },
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.zh
