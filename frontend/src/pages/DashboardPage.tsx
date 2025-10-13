
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { PlotAvailabilityPage } from './PlotAvailabilityPage'

export function DashboardPage() {
  const { tunnels, plots, selectedTunnelId, selectedPlotId, setSelectedTunnelId, setSelectedPlotId } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    // Reset plot when tunnel changes
    if (selectedPlotId && plots.find((p) => p.id === selectedPlotId)?.tunnelId !== selectedTunnelId) {
      setSelectedPlotId(undefined)
    }
  }, [selectedTunnelId])

  const filteredPlots = plots.filter((p) => !selectedTunnelId || p.tunnelId === selectedTunnelId)

  return (
    <>
      <PlotAvailabilityPage/>
      <div className="spacer" />
      <div className="card">
      <div className="page-title">Add Crops and Harvests</div>
      <div className="row">
        <div className="col">
          <label className="label">Select Tunnel</label>
          <select className="select" value={selectedTunnelId ?? ''} onChange={(e) => setSelectedTunnelId(e.target.value || undefined)}>
            <option value="">Select Tunnel</option>
            {tunnels.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <label className="label">Select Plot</label>
          <select className="select" value={selectedPlotId ?? ''} onChange={(e) => setSelectedPlotId(e.target.value || undefined)}>
            <option value="">Select Plot</option>
            {filteredPlots.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="spacer" />
      <div className="row">
        <button className="btn" onClick={() => navigate('/crops')} disabled={!selectedTunnelId || !selectedPlotId}>Next</button>
      </div>
      </div>

    </>
  )
}


