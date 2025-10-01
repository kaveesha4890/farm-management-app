import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export function PlotAvailabilityPage() {
  const { tunnels, plots, crops, harvests } = useApp()
  const navigate = useNavigate()
  const [selectedTunnelId, setSelectedTunnelId] = useState<string | null>(null)

  const selectedTunnel = tunnels.find(t => t.id === selectedTunnelId)
  const tunnelPlots = plots.filter(p => p.tunnelId === selectedTunnelId)

  // Get plot details with crop information - using useMemo to ensure recalculation when data changes
  const plotDetails = useMemo(() => {
    const details: Array<{
      plotId: string;
      plotName: string;
      cropName: string;
      plantCount: number;
      status: string;
      totalPlanted: number;
      totalHarvested: number;
      cropId?: string;
    }> = []

    tunnelPlots.forEach(plot => {
      const plotCrops = crops.filter(crop => crop.plotId === plot.id && crop.tunnelId === plot.tunnelId)
      const activeCrops = plotCrops.filter(crop => crop.status === 'Planted') // Only show planted crops, exclude completed
      
      if (activeCrops.length === 0) {
        // Show empty plot
        details.push({
          plotId: plot.id,
          plotName: plot.name,
          cropName: 'Empty',
          plantCount: 0,
          status: 'Available',
          totalPlanted: 0,
          totalHarvested: 0
        })
      } else {
        // Show separate row for each active crop
        activeCrops.forEach(crop => {
          const cropHarvests = harvests.filter(harvest => harvest.cropId === crop.id)
          const totalHarvestedPlants = cropHarvests.reduce((sum: number, harvest) => sum + harvest.numHarvestPlants, 0)
          const currentPlantCount = crop.numPlants - totalHarvestedPlants
          
          details.push({
            plotId: plot.id,
            plotName: plot.name,
            cropName: crop.name,
            plantCount: Math.max(0, currentPlantCount),
            status: 'Occupied',
            totalPlanted: crop.numPlants,
            totalHarvested: totalHarvestedPlants,
            cropId: crop.id
          })
        })
      }
    })

    return details
  }, [tunnelPlots, crops, harvests])

  const handleTunnelSelect = (tunnelId: string) => {
    setSelectedTunnelId(tunnelId)
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }

  return (
    <div className="card">
      <div className="page-title">Plot Availability</div>
      
      {!selectedTunnelId ? (
        <div>
          <p className="text-muted">Select a tunnel to view plot availability:</p>
          <div className="tunnel-grid">
            {tunnels.map(tunnel => (
              <button
                key={tunnel.id}
                className="btn btn-tunnel"
                onClick={() => handleTunnelSelect(tunnel.id)}
              >
                {tunnel.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="tunnel-header">
            <h3>{selectedTunnel?.name} - Plot Details</h3>
            <div className="row" style={{ gap: '8px' }}>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setSelectedTunnelId(null)}
              >
                Back to Tunnels
              </button>
            </div>
          </div>
          
          {/* Debug info - can be removed later */}
          <div className="debug-info" style={{ fontSize: '12px', color: '#a9b0bb', marginBottom: '16px' }}>
            <p>Total crops in system: {crops.length} | Total harvests: {harvests.length}</p>
            <p>Active crops in this tunnel: {crops.filter(c => c.tunnelId === selectedTunnelId && c.status === 'Planted').length}</p>
            <p>Completed crops in this tunnel: {crops.filter(c => c.tunnelId === selectedTunnelId && c.status === 'Completed').length}</p>
          </div>
          
          <div className="spacer" />
          
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Plot Name</th>
                  <th>Crop Name</th>
                  <th>Planted</th>
                  <th>Harvested</th>
                  <th>Current Plants</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {plotDetails.map((plot, index) => (
                  <tr key={plot.cropId ? `${plot.plotId}-${plot.cropId}` : `${plot.plotId}-empty-${index}`}>
                    <td>{plot.plotName}</td>
                    <td>{plot.cropName}</td>
                    <td>{plot.totalPlanted}</td>
                    <td>{plot.totalHarvested}</td>
                    <td><strong>{plot.plantCount}</strong></td>
                    <td>
                      <span className={`status-badge ${plot.status.toLowerCase()}`}>
                        {plot.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="spacer" />
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={handleBackToDashboard}>
          Back to Dashboard
        </button>
        {selectedTunnelId && (
          <button 
            className="btn" 
            onClick={() => navigate('/dashboard')}
          >
            Add New Crop
          </button>
        )}
      </div>
    </div>
  )
}
