"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Helper function to generate random walk price data with crypto-like volatility
const generatePriceData = (initialPrice: number, numPoints: number, volatility: number) => {
  const data = []
  let currentPrice = initialPrice
  
  for (let i = 0; i < numPoints; i++) {
    // Base random walk with extremely high volatility
    const randomChange = (Math.random() - 0.5) * volatility * 4
    const drift = Math.random() * 0.4 - 0.2 // Random drift between -20% and +20%
    currentPrice = currentPrice * (1 + randomChange + drift)
    
    // 30% chance of a large move (typical in crypto)
    if (Math.random() < 0.3) {
      const largeMove = (Math.random() - 0.5) * volatility * 6 // Much larger moves
      currentPrice = currentPrice * (1 + largeMove)
    }
    
    // 10% chance of an extreme move (crypto flash crashes/pumps)
    if (Math.random() < 0.1) {
      const extremeMove = (Math.random() - 0.5) * volatility * 12 // Extreme volatility
      currentPrice = currentPrice * (1 + extremeMove)
    }
    
    // Ensure price doesn't go below 1% of initial (crypto rarely goes to zero)
    currentPrice = Math.max(currentPrice, initialPrice * 0.01)
    
    data.push(currentPrice)
  }
  
  return data
}

// Generate more granular data for different timeframes
const generateTimeframeData = (initialPrice: number, volatility: number, timeframe: TimeFrame) => {
  const now = new Date()
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
  switch (timeframe) {
    case "today":
      // 288 points (5-minute intervals for 24 hours) with extremely high volatility
      const hourlyData = generatePriceData(initialPrice, 288, volatility * 4)
      return Array.from({ length: 288 }, (_, i) => {
        const minutes = (i * 5) % 60
        const hour = Math.floor((i * 5) / 60)
        return {
          date: `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
          value: Math.round(hourlyData[i])
        }
      }).reverse()
    
    case "week":
      // 168 points (hourly data for 7 days) with high volatility
      const dailyData = generatePriceData(initialPrice, 168, volatility * 3)
      return Array.from({ length: 168 }, (_, i) => {
        const date = new Date(now)
        date.setHours(date.getHours() - i)
        return {
          date: `${monthNames[date.getMonth()]} ${date.getDate()} ${date.getHours()}:00`,
          value: Math.round(dailyData[i])
        }
      }).reverse()
    
    case "month":
      // 120 points (6-hour intervals for 30 days)
      const weeklyData = generatePriceData(initialPrice, 120, volatility * 2)
      return Array.from({ length: 120 }, (_, i) => {
        const date = new Date(now)
        date.setHours(date.getHours() - i * 6)
        return {
          date: `${monthNames[date.getMonth()]} ${date.getDate()} ${date.getHours()}:00`,
          value: Math.round(weeklyData[i])
        }
      }).reverse()
    
    case "6month":
      // 180 points (daily data for 6 months)
      const monthlyData = generatePriceData(initialPrice, 180, volatility * 1.5)
      return Array.from({ length: 180 }, (_, i) => {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        return {
          date: `${monthNames[date.getMonth()]} ${date.getDate()}`,
          value: Math.round(monthlyData[i])
        }
      }).reverse()
    
    case "year":
      // 365 points (daily data for a year)
      const yearlyData = generatePriceData(initialPrice, 365, volatility)
      return Array.from({ length: 365 }, (_, i) => {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        return {
          date: `${monthNames[date.getMonth()]} ${date.getDate()}`,
          value: Math.round(yearlyData[i])
        }
      }).reverse()
    
    default:
      return []
  }
}

// Helper function to calculate Simple Moving Average
const calculateSMA = (data: number[], period: number) => {
  const sma = []
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null)
      continue
    }
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
    sma.push(sum / period)
  }
  return sma
}

type TimeFrame = "today" | "week" | "month" | "6month" | "year"
type MovingAverage = "none" | "sma_short" | "sma_medium" | "sma_long"

interface StatsChartProps {
  network: "Ethereum" | "Solana"
  timeFrame: TimeFrame
  movingAverage: MovingAverage
}

export function StatsChart({ network, timeFrame, movingAverage }: StatsChartProps) {
  // Set initial prices and much higher volatilities for crypto
  const initialPrices = {
    Ethereum: 2000,
    Solana: 100
  }
  
  const volatilities = {
    Ethereum: 0.12, // 12% daily volatility (typical for ETH)
    Solana: 0.18    // 18% daily volatility (typical for SOL)
  }
  
  const data = generateTimeframeData(
    initialPrices[network],
    volatilities[network],
    timeFrame
  )
  
  // Calculate moving averages based on timeframe
  const smaPeriods = {
    today: { short: 12, medium: 24, long: 48 },    // 1h, 2h, 4h
    week: { short: 24, medium: 72, long: 168 },    // 1d, 3d, 7d
    month: { short: 5, medium: 10, long: 20 },     // 1d, 2d, 4d
    "6month": { short: 7, medium: 14, long: 30 },  // 1w, 2w, 1m
    year: { short: 7, medium: 30, long: 90 }       // 1w, 1m, 3m
  }

  const priceData = data.map(d => d.value)
  const smaData = {
    none: null,
    sma_short: calculateSMA(priceData, smaPeriods[timeFrame].short),
    sma_medium: calculateSMA(priceData, smaPeriods[timeFrame].medium),
    sma_long: calculateSMA(priceData, smaPeriods[timeFrame].long)
  }

  const lineColor = network === "Ethereum" ? "#ff6b00" : "#00ff9d"
  const smaColor = network === "Ethereum" ? "#ff9d00" : "#00cc7d"

  // Calculate min and max values for Y axis with more padding for volatile data
  const minValue = Math.min(...data.map(d => d.value))
  const maxValue = Math.max(...data.map(d => d.value))
  const yAxisPadding = Math.max(200, (maxValue - minValue) * 0.3) // 30% padding or 200, whichever is larger

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
          <XAxis 
            dataKey="date" 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            domain={[minValue - yAxisPadding, maxValue + yAxisPadding]}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Value</span>
                        <span className="font-bold text-muted-foreground">${payload[0].value.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                        <span className="font-bold">{payload[0].payload.date}</span>
                      </div>
                    </div>
                    {movingAverage !== "none" && payload[1] && (
                      <div className="mt-2 flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          {movingAverage === "sma_short" ? "SMA Short" : 
                           movingAverage === "sma_medium" ? "SMA Medium" : "SMA Long"}
                        </span>
                        <span className="font-bold text-muted-foreground">${payload[1].value.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )
              }
              return null
            }}
          />
          <Line 
            type="step" 
            dataKey="value" 
            stroke={lineColor} 
            strokeWidth={1} 
            dot={false}
            activeDot={{ r: 2, fill: lineColor }}
            connectNulls={true}
          />
          {movingAverage !== "none" && (
            <Line 
              type="monotone"
              dataKey={movingAverage}
              stroke={smaColor}
              strokeWidth={2}
              dot={false}
              activeDot={false}
              connectNulls={true}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
