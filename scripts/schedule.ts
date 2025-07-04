import fetch from 'node-fetch'; // You might need to install node-fetch: npm install node-fetch @types/node-fetch

// Ensure your environment variable ALPHAVANTAGE_API_KEY is set
const ALPHAVANTAGE_API_KEY = process.env.ALPHAVANTAGE_API_KEY;

if (!ALPHAVANTAGE_API_KEY) {
    console.error('Error: ALPHAVANTAGE_API_KEY environment variable is not set.');
    process.exit(1);
}

const issuer: Record<string, string[]> = {
    'roundhill': ['XDTE', 'QDTE', 'RDTE'],
    'yieldmax': ['SDTY', 'QDTY', 'RDTY']
}

const DailyPriceAPI_Base = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY';
const DividendAPI_Base = 'https://www.alphavantage.co/query?function=DIVIDENDS';

interface DividendPrice {
    date: string;
    dividend: number;
    price: number;
    yield: number;
    volume: number;
}

interface DividendResponse {
    symbol: string;
    data: { ex_dividend_date: string, declaration_date: string, record_date: string, payment_date: string, amount: string }[]
}

interface PriceResponse {
    'Time Series (Daily)': {
        [date: string]: {
            '1. open': string, '2. high': string, '3. low': string, '4. close': string, '5. volume': string
        }
    };
}

async function fetchData() {
    const m = new Map<string, Record<string, DividendPrice[]>>();
    let hasErrors = false;

    for (const issuerName in issuer) {
        if (issuer.hasOwnProperty(issuerName)) {
            const symbols = issuer[issuerName];
            const issuerData: Record<string, DividendPrice[]> = {};

            for (const symbol of symbols) {
                let dividendData: DividendPrice[] = [];

                // Construct Daily Price API URL
                const dailyPriceUrl = `${DailyPriceAPI_Base}&symbol=${symbol}&apikey=${ALPHAVANTAGE_API_KEY}&outputsize=full`;
                console.log(`Fetching daily price for ${symbol} from: ${dailyPriceUrl}`);

                // Construct Dividend API URL
                const dividendUrl = `${DividendAPI_Base}&symbol=${symbol}&apikey=${ALPHAVANTAGE_API_KEY}`;
                console.log(`Fetching dividends for ${symbol} from: ${dividendUrl}`);

                try {
                    // Fetch Daily Price Data
                    const dailyPriceResponse = await fetch(dailyPriceUrl);
                    if (!dailyPriceResponse.ok) {
                        throw new Error(`HTTP error! status: ${dailyPriceResponse.status} for ${dailyPriceUrl}`);
                    }
                    const dailyPriceAPIData: any = await dailyPriceResponse.json();

                    // Fetch Dividend Data
                    const dividendResponse = await fetch(dividendUrl);
                    if (!dividendResponse.ok) {
                        throw new Error(`HTTP error! status: ${dividendResponse.status} for ${dividendUrl}`);
                    }
                    const dividendAPIData: any = await dividendResponse.json();

                    // Extract and convert data to numbers
                    dividendData = dividendAPIData.data.map((item: any) => {
                        const amount = parseFloat(item.amount);
                        const closePrice = parseFloat(dailyPriceAPIData['Time Series (Daily)']?.[item.ex_dividend_date]?.['4. close']);
                        const volume = parseFloat(dailyPriceAPIData['Time Series (Daily)']?.[item.ex_dividend_date]?.['5. volume']);

                        // Handle potential NaN values if data is missing or invalid
                        const calculatedYield = (!isNaN(amount) && !isNaN(closePrice) && closePrice !== 0) ? ((amount / closePrice) * 52 * 100) : 0;

                        return {
                            date: item.ex_dividend_date as string,
                            dividend: amount,
                            price: closePrice,
                            yield: parseFloat(calculatedYield.toFixed(2)), // Ensure yield is a number and formatted
                            volume: volume,
                        };
                    });

                    // Sort the dividend data by date in ascending order
                    dividendData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                    issuerData[symbol] = dividendData;

                } catch (error) {
                    console.error(`Failed to fetch data for ${symbol}:`, error);
                    hasErrors = true;
                }
                console.log('---'); // Separator for better readability
            }

            // Save the data in the map
            m.set(issuerName, issuerData);
        }
    }

    if (hasErrors) {
        throw new Error('One or more fetch operations failed. No files will be written.');
    }

    return m
}

import * as fs from 'fs';

fetchData().then(data => {
    data.forEach((value, key) => {
        const filename = `${key}.json`;
        const filePath = `public/data/${filename}`;
        const jsonData = JSON.stringify(value, null, 2);

        fs.writeFile(filePath, jsonData, (err) => {
            if (err) {
                console.error(`Failed to write file ${filename}:`, err);
            } else {
                console.log(`Successfully wrote file ${filename}`);
            }
        });
    });
}).catch(error => {
    console.error(error.message);
});