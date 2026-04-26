import json
import os
from ticker_info import get_full_distribution_data


def update_ticker_files(config_map: dict):
    """
    根據 config_map 更新 JSON 檔案。
    config_map 格式: { "file_path.json": ["TICKER1", "TICKER2"], ... }
    """
    for file_path, tickers in config_map.items():
        print(f"Processing file: {file_path} for tickers: {tickers}")

        file_data = {}

        # 遍歷該檔案所需的所有 ticker
        for ticker in tickers:
            print(f"  Fetching {ticker}...")
            try:
                distribution_data = get_full_distribution_data(ticker)
                file_data[ticker] = distribution_data
            except Exception as e:
                print(f"  Error fetching {ticker}: {e}")
                file_data[ticker] = []

        # 將資料寫入 JSON 檔案
        try:
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(file_data, f, indent=2, ensure_ascii=False)
            print(f"Successfully saved to {file_path}")
        except Exception as e:
            print(f"Failed to save {file_path}: {e}")


if __name__ == "__main__":
    # 範例 Map 記錄
    # 您可以根據需求修改這個 map，或者將其抽離到獨立的 config.json 中
    ticker_config = {
        "public/data/roundhill.json": ["XDTE", "QDTE", "RDTE", "TOPW"],
        "public/data/yieldmax.json": ["SDTY", "QDTY", "RDTY", "YMAX"],
        "public/data/neos.json": ["SPYI", "QQQI", "IWMI", "XQQI"],
    }

    update_ticker_files(ticker_config)
