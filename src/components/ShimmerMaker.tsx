import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { Spinner } from "@/components/ui/spinner"

export function ShimmerMarker() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent className="shimmer">Thinking...</MarkerContent>
      </Marker>
      <Marker variant="separator" role="status">
        <MarkerContent className="shimmer">Reading 4 files</MarkerContent>
      </Marker>
    </div>
  )
}

export function ShimmerColor() {
  return (
    <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
      <p className="shimmer shimmer-color-blue-500/60">
        Generating response&hellip;
      </p>
      <p className="shimmer shimmer-color-[#378ADD]">
        Generating response&hellip;
      </p>
    </div>
  )
}

