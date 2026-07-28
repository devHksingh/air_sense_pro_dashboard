import { Info } from "lucide-react"

export function MetricNotes() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-5">
      <div className="flex items-start gap-3">
        <Info className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
        <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">eCO2 (ppm)</span> — Estimated CO2
            equivalent, derived from the air-quality sensor's gas readings. It is not a direct
            CO2 measurement. Below 800 ppm is considered good for indoor air.
          </p>
          <p>
            <span className="font-semibold text-foreground">TVOC (ppb)</span> — Total Volatile
            Organic Compounds, gases released from everyday sources like paints, cleaning
            products, and furnishings. Lower values indicate fresher indoor air.
          </p>
        </div>
      </div>
    </div>
  )
}