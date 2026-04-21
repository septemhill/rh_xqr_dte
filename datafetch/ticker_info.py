import yfinance as yf
import pandas as pd
from datetime import datetime
from typing import List, Dict, Any


def get_ticker_history_metadata(ticker_symbol: str, date: datetime) -> Dict[str, Any]:
    """
    1. 取得特定 ticker 在指定日期的 closed price 和 volume
    """
    ticker = yf.Ticker(ticker_symbol)
    start_date = date - pd.Timedelta(days=7)
    end_date = date + pd.Timedelta(days=1)
    history = ticker.history(start=start_date, end=end_date)

    if history.empty:
        return {"price": 0.0, "volume": 0}

    if date in history.index:
        row = history.loc[date]
    else:
        available_dates = history.index[history.index <= date]
        row = (
            history.loc[available_dates[-1]]
            if not available_dates.empty
            else history.iloc[-1]
        )

    return {"price": float(row["Close"]), "volume": int(row["Volume"])}


def get_ticker_dividends(ticker_symbol: str) -> List[Dict[str, Any]]:
    """
    2. 取得特定 ticker 的 history dividend
    """
    ticker = yf.Ticker(ticker_symbol)
    # 透過 history(period="max") 確保載入所有歷史股息
    ticker.history(period="max")
    dividends = ticker.dividends

    results = []
    for date, dividend in dividends.items():
        results.append(
            {
                "date": date,
                "date_str": date.strftime("%Y-%m-%d"),
                "dividend": float(dividend),
            }
        )
    return results


def get_full_distribution_data(ticker_symbol: str) -> List[Dict[str, Any]]:
    """
    整合功能，整理出指定 ticker 的所有歷史 distribution 資料
    設定 auto_adjust=False 以取得標準收盤價（僅拆股調整，不含股息調整）
    """
    ticker = yf.Ticker(ticker_symbol)
    # auto_adjust=False: 取得原始收盤價 (Close) 與 調整後收盤價 (Adj Close)
    # 我們使用 Close 欄位，這通常是僅經過拆股調整的價格，符合大多數財經網站的呈現
    history = ticker.history(period="max", auto_adjust=False)
    dividends = ticker.dividends

    if dividends.empty:
        return []

    final_results = []
    for date, dividend in dividends.items():
        if date in history.index:
            row = history.loc[date]
        else:
            available_dates = history.index[history.index <= date]
            if not available_dates.empty:
                row = history.loc[available_dates[-1]]
            else:
                continue

        # 使用 float 儲存，確保不丟失來自 yfinance 的精度
        dividend_val = float(dividend)
        price = float(row["Close"])
        volume = int(row["Volume"])

        # yield = 當次股息 / 當時收盤價
        yield_val = float(dividend_val / price) * 52 * 100 if price > 0 else 0.0

        final_results.append(
            {
                "date": date.strftime("%Y-%m-%d"),
                "dividend": dividend_val,
                "price": round(price, 2),  # 取到小數點後兩位
                "yield": round(yield_val, 2),  # 取到小數點後兩位
                "volume": volume,
            }
        )

        # }
        # )
    return final_results

    # return final_results


if __name__ == "__main__":
    import sys
    import json

    symbol = sys.argv[1] if len(sys.argv) > 1 else "AAPL"
    print(f"Fetching ALL historical data for {symbol}...")
    data = get_full_distribution_data(symbol)

    if data:
        print(f"Total records found: {len(data)}")
        print(f"Earliest dividend: {data[0]['date']}")
        print(f"Latest dividend: {data[-1]['date']}")
        print("\nLatest 5 records:")
        print(json.dumps(data[:], indent=2))
    else:
        print("No dividend data found.")
