import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { useAnalysisLatest } from "@/hooks/useAirSenseQueries"
import { cn } from "@/lib/utils"

function IndicatorRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={cn(
          "flex items-center gap-1.5 text-sm font-medium",
          ok ? "text-success-foreground" : "text-destructive"
        )}
      >
        {ok ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
        {ok ? "Yes" : "No"}
      </span>
    </div>
  )
}

export function WeatherHealthCard() {
  const { data: analysis, isLoading, isError } = useAnalysisLatest()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Health</CardTitle>
          <CardDescription>Live air quality analysis</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Loading analysis…</CardContent>
      </Card>
    )
  }

  if (isError || !analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Health</CardTitle>
          <CardDescription>Live air quality analysis</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No analysis available yet.
        </CardContent>
      </Card>
    )
  }

  const { airGood, needVent, humiOk, tempExt, outdoorOk } = analysis.data

  // Overall verdict requires every sub-check to be in the good state —
  // needVent and tempExt are inverted (1 = bad), unlike the other three.
  const isHealthy =
    airGood === 1 && needVent === 0 && humiOk === 1 && tempExt === 0 && outdoorOk === 1

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Weather Health
          {isHealthy ? (
            <CheckCircle2 className="size-5 text-success-foreground" />
          ) : (
            <AlertTriangle className="size-5 text-destructive" />
          )}
        </CardTitle>
        <CardDescription>Live air quality analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "rounded-lg px-4 py-3 mb-2 text-center font-semibold",
            isHealthy
              ? "bg-success/15 text-success-foreground"
              : "bg-destructive/15 text-destructive"
          )}
        >
          {isHealthy ? "Healthy" : "Needs Attention"}
        </div>
        <IndicatorRow label="Air Quality Good" ok={airGood === 1} />
        <IndicatorRow label="Ventilation Not Needed" ok={needVent === 0} />
        <IndicatorRow label="Humidity Comfortable" ok={humiOk === 1} />
        <IndicatorRow label="Temperature Normal" ok={tempExt === 0} />
        <IndicatorRow label="Good for Outdoor Activity" ok={outdoorOk === 1} />
      </CardContent>
    </Card>
  )
}