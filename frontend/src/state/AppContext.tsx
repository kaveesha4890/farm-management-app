import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Tunnel = { id: string; name: string }
export type Plot = { id: string; name: string; tunnelId: string }
export type Crop = { id: string; tunnelId: string; plotId: string; name: string; variety: string; plantingDate: string; status: 'Pending' | 'Planted' | 'Completed' }
export type Harvest = { id: string; cropId: string; date: string; quantity: number; note?: string }

type AppState = {
  tunnels: Tunnel[]
  plots: Plot[]
  crops: Crop[]
  harvests: Harvest[]
  selectedTunnelId?: string
  selectedPlotId?: string
  setSelectedTunnelId: (id?: string) => void
  setSelectedPlotId: (id?: string) => void
  addCrop: (crop: Omit<Crop, 'id' | 'status'> & { status?: Crop['status'] }) => void
  updateCrop: (cropId: string, changes: Partial<Omit<Crop, 'id'>>) => void
  removeCrop: (cropId: string) => void
  addHarvest: (hv: Omit<Harvest, 'id'>) => void
  markHarvestsCompleteForCrop: (cropId: string) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedTunnelId, setSelectedTunnelId] = useState<string | undefined>()
  const [selectedPlotId, setSelectedPlotId] = useState<string | undefined>()

  const [tunnels] = useState<Tunnel[]>([
    { id: 't1', name: 'Tunnel A' },
    { id: 't2', name: 'Tunnel B' },
  ])
  const [plots] = useState<Plot[]>([
    { id: 'p1', name: 'Plot 1', tunnelId: 't1' },
    { id: 'p2', name: 'Plot 2', tunnelId: 't1' },
    { id: 'p3', name: 'Plot 1', tunnelId: 't2' },
  ])
  const [crops, setCrops] = useState<Crop[]>([])
  const [harvests, setHarvests] = useState<Harvest[]>([])

  const addCrop: AppState['addCrop'] = (crop) => {
    setCrops((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        status: crop.status ?? 'Pending',
        ...crop,
      },
    ])
  }

  const updateCrop: AppState['updateCrop'] = (cropId, changes) => {
    setCrops((prev) => prev.map((c) => (c.id === cropId ? { ...c, ...changes } : c)))
  }

  const removeCrop: AppState['removeCrop'] = (cropId) => {
    setCrops((prev) => prev.filter((c) => c.id !== cropId))
    setHarvests((prev) => prev.filter((h) => h.cropId !== cropId))
  }

  const addHarvest: AppState['addHarvest'] = (hv) => {
    setHarvests((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ...hv },
    ])
  }

  const markHarvestsCompleteForCrop: AppState['markHarvestsCompleteForCrop'] = (cropId) => {
    setCrops((prev) => prev.map((c) => (c.id === cropId ? { ...c, status: 'Completed' } : c)))
  }

  const value = useMemo<AppState>(() => ({
    tunnels,
    plots,
    crops,
    harvests,
    selectedTunnelId,
    selectedPlotId,
    setSelectedTunnelId,
    setSelectedPlotId,
    addCrop,
    updateCrop,
    removeCrop,
    addHarvest,
    markHarvestsCompleteForCrop,
  }), [tunnels, plots, crops, harvests, selectedTunnelId, selectedPlotId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}


