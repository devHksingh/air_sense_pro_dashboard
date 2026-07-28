
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSensorHistory, type HistoryRange } from "@/hooks/useAirSenseQueries"
import { useState } from "react"

const chartConfig = {
  bmeTemp: { label: "Temperature (°C)", color: "var(--chart-3)" },
  bmeHum: { label: "Humidity (%)", color: "var(--chart-4)" },
} satisfies ChartConfig

export function TempHumidityChart() {
  const [range, setRange] = useState<HistoryRange>("today")
  const { data, isLoading, isError } = useSensorHistory(range)

  const tickFormat =
    range === "today"
      ? { hour: "2-digit" as const, minute: "2-digit" as const }
      : { month: "short" as const, day: "numeric" as const }

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Weather Trend</CardTitle>
          <CardDescription>Temperature and humidity over the selected period</CardDescription>
        </div>
        <Select value={range} onValueChange={(v) => setRange(v as HistoryRange)}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex" aria-label="Select a range">
            <SelectValue placeholder="Today" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="today" className="rounded-lg">Today</SelectItem>
            <SelectItem value="3d" className="rounded-lg">Last 3 days</SelectItem>
            <SelectItem value="5d" className="rounded-lg">Last 5 days</SelectItem>
            <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">
            Loading readings…
          </div>
        ) : isError || !data || data.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">
            No data available for this period.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fillTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-bmeTemp)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-bmeTemp)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillHum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-bmeHum)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-bmeHum)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="ts"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => new Date(value).toLocaleString("en-IN", tickFormat)}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area dataKey="bmeTemp" type="natural" fill="url(#fillTemp)" stroke="var(--color-bmeTemp)" />
              <Area dataKey="bmeHum" type="natural" fill="url(#fillHum)" stroke="var(--color-bmeHum)" />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
