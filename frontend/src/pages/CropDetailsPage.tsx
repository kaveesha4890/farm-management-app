import { Trash2, Pencil } from 'lucide-react';
import 
{ Link, useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export function CropDetailsPage() {
  const { tunnels, plots, selectedTunnelId, selectedPlotId, crops, harvests, removeCrop } = useApp()
  const navigate = useNavigate()

  const tunnelName = tunnels.find((t) => t.id === selectedTunnelId)?.name
  const plotName = plots.find((p) => p.id === selectedPlotId)?.name

  const rows = crops.filter((c) => c.tunnelId === selectedTunnelId && c.plotId === selectedPlotId)

  return (
    <div className="card">
      <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="page-title">{tunnelName} / {plotName}</div>
        <button className="btn small" onClick={() => navigate('/crops/new')}>Add new crop</button>
      </div>
      <div className="spacer" />
      <table className="table">
        <thead>
          <tr>
            <th>Crop</th>
            <th>Batch code</th>
            <th>Predicted yield</th>
            <th>Number of plants</th>
            <th>Total harvest</th>
            <th>Planting date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={5} className="muted">No crops yet</td></tr>
          )}
          {rows.map((c) => (
            <tr key={c.id}>
              <td>
                <button className="link" onClick={() => navigate(`/crops/${c.id}/harvests`)}>{c.name}</button>
              </td>
              <td>{c.batchCode}</td>
              <td>{c.predictedYield}</td>
              <td>{c.numPlants}</td>
              <td>{harvests.filter((h) => h.cropId === c.id).reduce((sum, h) => sum + h.quantity, 0)}</td>
              <td>{c.plantingDate}</td>
              <td>{c.status}</td>
              <td>
                <div className="row" style={{ gap: 8 }}>
                  <button className="btn xsmall secondary" onClick={() => navigate(`/crops/${c.id}/edit`)}><Pencil size={20}/></button>
                  <button className="btn xsmall danger" onClick={() => removeCrop(c.id)}><Trash2 size={20}/></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="spacer" />
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <Link to="/dashboard" className="btn secondary">Back</Link>
        <div />
      </div>
    </div>
  )
}


