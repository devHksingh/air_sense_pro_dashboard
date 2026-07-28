import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_BACKEND_URL,
  headers: { "Content-Type": "application/json" },
})

export interface SensorReading {
  _id: string
  ts: string
  bmeTemp: number
  bmeHum: number
  bmePres: number
  ahtTemp: number
  ahtHum: number
  eco2: number
  tvoc: number
  createdAt: string
  updatedAt: string
}

export interface SensorStats {
  [field: string]: { min: number; max: number; avg: number }
}

export const getLatestReading = async (): Promise<SensorReading> => {
  const res = await api.get("/api/sensor/latest")
  return res.data.data
}

export const getSensorHistory = async (params: {
  from?: string
  to?: string
  limit?: number
}): Promise<SensorReading[]> => {
  const res = await api.get("/api/sensor/history", { params })
  return res.data.data
}

export const getSensorStats = async (params: {
  from?: string
  to?: string
}): Promise<SensorStats> => {
  const res = await api.get("/api/sensor/stats", { params })
  return res.data.data
}

export const getHealth = async (): Promise<{ success: boolean; mqttConnected: boolean }> => {
  const res = await api.get("/api/health")
  return res.data
}