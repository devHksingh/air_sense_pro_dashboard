import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip" // ADDED
import { Separator } from "@/components/ui/separator"
import { StatsCard } from "@/components/dashboard/stats-card"
import { SensorHistoryChart } from "@/components/chart-area-interactive"
import { Thermometer, Droplets, Wind, Gauge } from "lucide-react"
import { useLatestReading, useBackendHealth } from "@/hooks/useAirSenseQueries"

function App() {
  const { data: latest, dataUpdatedAt } = useLatestReading()
  const { data: health } = useBackendHealth()

  const [secondsAgo, setSecondsAgo] = useState<number | null>(null)

  useEffect(() => {
    if (!dataUpdatedAt) return

    const update = () => setSecondsAgo(Math.floor((Date.now() - dataUpdatedAt) / 1000))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [dataUpdatedAt])

  return (
    <TooltipProvider> {/* ADDED — sidebar.tsx uses Tooltip internally for collapsed-icon labels */}
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-auto min-h-16 shrink-0 items-center gap-3 border-b border-border bg-card sticky top-0 z-10 px-4 py-3 md:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 hidden md:block data-[orientation=vertical]:h-4" />
            <div className="flex-1">
              <h1 className="text-lg md:text-xl font-bold text-foreground">AirSense Pro</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Live indoor air quality monitoring</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              health?.mqttConnected ? "bg-success/20 text-success-foreground" : "bg-destructive/20 text-destructive"
            }`}>
              {health?.mqttConnected ? "● Live" : "○ Offline"}
            </span>
          </header>

          <div className="flex flex-1 flex-col gap-4 md:gap-6 p-4 md:p-6 bg-background">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <StatsCard
                title="Temperature"
                value={latest ? `${latest.bmeTemp.toFixed(1)} °C` : "—"}
                subtitle={secondsAgo !== null ? `Updated ${secondsAgo}s ago` : "Loading…"}
                percentage={latest && latest.bmeTemp > 40 ? "High" : "Normal"}
                icon={Thermometer}
                trend={latest && latest.bmeTemp > 40 ? "down" : "up"}
                variant="default"
              />
              <StatsCard
                title="Humidity"
                value={latest ? `${latest.bmeHum.toFixed(1)} %` : "—"}
                subtitle={latest && latest.bmeHum >= 30 && latest.bmeHum <= 60 ? "Comfortable range" : "Outside comfort range"}
                percentage={latest && latest.bmeHum >= 30 && latest.bmeHum <= 60 ? "OK" : "Watch"}
                icon={Droplets}
                trend={latest && latest.bmeHum >= 30 && latest.bmeHum <= 60 ? "up" : "down"}
                variant="dark"
              />
              <StatsCard
                title="eCO2"
                value={latest ? `${latest.eco2} ppm` : "—"}
                subtitle={latest ? (latest.eco2 < 800 ? "Good" : latest.eco2 < 1000 ? "Moderate" : latest.eco2 < 1500 ? "Poor" : "Bad") : "Loading…"}
                percentage={latest && latest.eco2 < 800 ? "Good" : "Check"}
                icon={Wind}
                trend={latest && latest.eco2 < 800 ? "up" : "down"}
                variant="dark"
              />
              <StatsCard
                title="TVOC"
                value={latest ? `${latest.tvoc} ppb` : "—"}
                subtitle="Total volatile organic compounds"
                percentage={latest && latest.tvoc < 220 ? "Good" : "Elevated"}
                icon={Gauge}
                trend={latest && latest.tvoc < 220 ? "up" : "down"}
                variant="dark"
              />
            </div>

            <SensorHistoryChart />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default App