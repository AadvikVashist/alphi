'use client'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MetricsCard } from "@/components/metrics-card"
import { StatsChart } from "@/components/stats-chart"
import { VaultTable } from "@/components/vault-table"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { cn } from "@/lib/utils"

type TimeFrame = "today" | "week" | "month" | "6month" | "year"
type MovingAverage = "none" | "sma_short" | "sma_medium" | "sma_long"

export default function Page() {
  const [selectedNetwork, setSelectedNetwork] = useState("Ethereum")
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("month")
  const [selectedMovingAverage, setSelectedMovingAverage] = useState<MovingAverage>("none")

  return (
    <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Overview</h1>
              <div className="text-sm text-muted-foreground">Aug 13, 2023 - Aug 18, 2023</div>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    {selectedNetwork} Network
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedNetwork("Ethereum")}>
                    Ethereum Network
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedNetwork("Solana")}>
                    Solana Network
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    {selectedMovingAverage === "none" ? "No MA" : 
                     selectedMovingAverage === "sma_short" ? "SMA Short" :
                     selectedMovingAverage === "sma_medium" ? "SMA Medium" : "SMA Long"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedMovingAverage("none")}>
                    No Moving Average
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedMovingAverage("sma_short")}>
                    SMA Short
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedMovingAverage("sma_medium")}>
                    SMA Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedMovingAverage("sma_long")}>
                    SMA Long
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricsCard
              title="Your Balance"
              value="$74,892"
              change={{ value: "$1,340", percentage: "-2.1%", isPositive: false }}
            />
            <MetricsCard
              title="Your Deposits"
              value="$54,892"
              change={{ value: "$1,340", percentage: "+13.2%", isPositive: true }}
            />
            <MetricsCard
              title="Accrued Yield"
              value="$20,892"
              change={{ value: "$1,340", percentage: "+1.2%", isPositive: true }}
            />
          </div>
          <Card className="mt-6 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">General Statistics</h2>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={selectedTimeFrame === "today" ? "default" : "ghost"}
                  onClick={() => setSelectedTimeFrame("today")}
                >
                  Today
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedTimeFrame === "week" ? "default" : "ghost"}
                  onClick={() => setSelectedTimeFrame("week")}
                >
                  Last week
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedTimeFrame === "month" ? "default" : "ghost"}
                  onClick={() => setSelectedTimeFrame("month")}
                >
                  Last month
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedTimeFrame === "6month" ? "default" : "ghost"}
                  onClick={() => setSelectedTimeFrame("6month")}
                >
                  Last 6 month
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedTimeFrame === "year" ? "default" : "ghost"}
                  onClick={() => setSelectedTimeFrame("year")}
                >
                  Year
                </Button>
              </div>
            </div>
            <StatsChart 
              network={selectedNetwork as "Ethereum" | "Solana"} 
              timeFrame={selectedTimeFrame}
              movingAverage={selectedMovingAverage}
            />
          </Card>
          <div className="mt-6">
            <VaultTable />
          </div>
    </div>
  )
}
