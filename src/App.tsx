import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { StatsCard } from "@/components/dashboard/stats-card"
import { SensorHistoryChart } from "@/components/chart-area-interactive"
import { TempHumidityChart } from "@/components/dashboard/temp-humidity-chart"
import { WeatherHealthCard } from "@/components/dashboard/weather-health-card"
import { Thermometer, Droplets, Wind, FlaskConical, Gauge } from "lucide-react"
import { useLatestReading, useBackendHealth } from "@/hooks/useAirSenseQueries"
import { MetricNotes } from "@/components/dashboard/metric-notes"


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
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-auto min-h-16 shrink-0 items-center gap-3 border-b border-border bg-card sticky top-0 z-10 px-4 py-3 md:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 hidden md:block data-[orientation=vertical]:h-4" />
            <div className="flex-1">
              <h1 className="text-lg md:text-xl font-bold text-foreground">AirSense Pro</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Live indoor air quality monitoring
              </p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              health?.mqttConnected ? "bg-success/20 text-success-foreground" : "bg-destructive/20 text-destructive"
            }`}>
              {health?.mqttConnected ? "● Live" : "○ Offline"}
            </span>
          </header>

          <div className="flex flex-1 flex-col gap-4 md:gap-6 p-4 md:p-6 bg-background">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
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
                info="Estimated CO2 equivalent, derived from the air-quality sensor's gas readings — not a direct CO2 measurement. Measured in parts per million (ppm). Below 800 ppm is considered good for indoor air."
              />
              <StatsCard
                title="TVOC"
                value={latest ? `${latest.tvoc} ppb` : "—"}
                subtitle="Total volatile organic compounds"
                percentage={latest && latest.tvoc < 220 ? "Good" : "Elevated"}
                icon={FlaskConical}
                trend={latest && latest.tvoc < 220 ? "up" : "down"}
                variant="dark"
                info="Total Volatile Organic Compounds — gases released from everyday sources like paints, cleaning products, and furnishings. Measured in parts per billion (ppb). Lower values indicate fresher indoor air."
              />
              <StatsCard
                title="Pressure"
                value={latest ? `${latest.bmePres.toFixed(1)} hPa` : "—"}
                subtitle="Atmospheric pressure"
                percentage="Normal"
                icon={Gauge}
                trend="up"
                variant="dark"
                info="Barometric (atmospheric) pressure measured by the BME280 sensor, in hectopascals (hPa). Typical sea-level pressure is around 1013 hPa; it varies with weather and altitude."
              />
            </div>
            <MetricNotes />
            <div className="h-px bg-border" />
            <h2 className="text-lg md:text-xl font-bold text-foreground">Charts</h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Interactive charts for the last 24 hours of sensor readings.
            </p>
            <div className="h-px bg-border" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-start">
              <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
                <SensorHistoryChart />
                <TempHumidityChart />
              </div>
              <WeatherHealthCard />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default App