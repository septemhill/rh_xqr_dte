import { type NextRequest, NextResponse } from "next/server"

// 模擬金融資料
const generateMockData = (symbol: string) => {
  const basePrice = symbol === "AAPL" ? 150 : symbol === "GOOGL" ? 2500 : 300
  const data = []

  for (let i = 0; i < 12; i++) {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - i))

    // 模擬股價波動
    const priceVariation = (Math.random() - 0.5) * 0.2
    const price = basePrice * (1 + priceVariation + i * 0.01)

    // 模擬股息（每季發放）
    const dividend = i % 3 === 0 ? Math.random() * 5 + 1 : 0

    data.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price * 100) / 100,
      dividend: Math.round(dividend * 100) / 100,
    })
  }

  return data
}

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  const { symbol } = params

  // 模擬 API 延遲
  await new Promise((resolve) => setTimeout(resolve, 500))

  const data = generateMockData(symbol)

  return NextResponse.json(data)
}
