import fetch from 'node-fetch'; // You might need to install node-fetch: npm install node-fetch @types/node-fetch

// Ensure your environment variable ALPHAVANTAGE_API_KEY is set
const ALPHAVANTAGE_API_KEY = process.env.ALPHAVANTAGE_API_KEY;

if (!ALPHAVANTAGE_API_KEY) {
    console.error('Error: ALPHAVANTAGE_API_KEY environment variable is not set.');
    process.exit(1);
}

const symbols: string[] = ['XDTE', 'QDTE', 'RDTE'];

const DailyPriceAPI_Base = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY';
const DividendAPI_Base = 'https://www.alphavantage.co/query?function=DIVIDENDS';

async function fetchData() {
    for (const symbol of symbols) {
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
            const dailyPriceData = await dailyPriceResponse.json();
            console.log(`Daily Price Data for ${symbol}:`, dailyPriceData);

            // Fetch Dividend Data
            const dividendResponse = await fetch(dividendUrl);
            if (!dividendResponse.ok) {
                throw new Error(`HTTP error! status: ${dividendResponse.status} for ${dividendUrl}`);
            }
            const dividendData = await dividendResponse.json();
            console.log(`Dividend Data for ${symbol}:`, dividendData);

        } catch (error) {
            console.error(`Failed to fetch data for ${symbol}:`, error);
        }
        console.log('---'); // Separator for better readability
    }
}

fetchData();

console.log(process.env.ALPHAVANTAGE_API_KEY)