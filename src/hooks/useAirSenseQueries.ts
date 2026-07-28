/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from "@tanstack/react-query"
import {
  getLatestReading,
  getSensorHistory,
  getSensorStats,
  getHealth,
  getAnalysisLatest,
} from "@/http/api"



export function useLatestReading() {
  return useQuery({
    queryKey: ["latestReading"],
    queryFn: getLatestReading,
    staleTime: 40 * 1000,
    refetchInterval: 42 * 1000, // matches ESP32's own publish cadence exactly
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false, // avoids an extra fetch on top of the 42s heartbeat
  })
}

export function useAnalysisLatest() {
  return useQuery({
    queryKey: ["analysisLatest"],
    queryFn: getAnalysisLatest,
    staleTime: 40 * 1000,
    refetchInterval: 42 * 1000, // matches ESP32's publish cadence, same as useLatestReading
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

export type HistoryRange = "today" | "3d" | "5d" | "7d"

function rangeToDates(range: HistoryRange) {
  const now = new Date()
  const to = now.toISOString()
  let from: Date

  if (range === "today") {
    from = new Date(now)
    from.setHours(0, 0, 0, 0)
  } else {
    const days = range === "3d" ? 3 : range === "5d" ? 5 : 7
    from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  }

  return { from: from.toISOString(), to }
}

const RANGE_CONFIG: Record<HistoryRange, { refetchMs: number; staleMs: number; limit: number }> = {
  today: { refetchMs: 60 * 1000, staleMs: 55 * 1000, limit: 3000 },
  "3d": { refetchMs: 3 * 60 * 1000, staleMs: 2.5 * 60 * 1000, limit: 6000 },
  "5d": { refetchMs: 5 * 60 * 1000, staleMs: 4.5 * 60 * 1000, limit: 10000 },
  "7d": { refetchMs: 10 * 60 * 1000, staleMs: 9 * 60 * 1000, limit: 15000 },
}

// Keeps the SVG chart smooth regardless of how many raw points came back.
function thinForChart<T>(data: T[], maxPoints = 500): T[] {
  if (data.length <= maxPoints) return data
  const step = Math.ceil(data.length / maxPoints)
  return data.filter((_, i) => i % step === 0)
}

export function useSensorHistory(range: HistoryRange) {
  const { from, to } = rangeToDates(range)
  const cfg = RANGE_CONFIG[range]

  return useQuery({
    queryKey: ["sensorHistory", range],
    queryFn: () => getSensorHistory({ from, to, limit: cfg.limit }),
    staleTime: cfg.staleMs,
    refetchInterval: cfg.refetchMs,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    select: (data) => thinForChart(data, 500),
  })
}

export function useBackendHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    staleTime: 25 * 1000,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}