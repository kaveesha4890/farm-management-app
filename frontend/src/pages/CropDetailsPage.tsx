import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export function CropDetailsPage() {
  const { tunnels, plots, selectedTunnelId, selectedPlotId, crops, removeCrop } = useApp()
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
            <th>Variety</th>
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
              <td>{c.variety}</td>
              <td>{c.plantingDate}</td>
              <td>{c.status}</td>
              <td>
                <div className="row" style={{ gap: 8 }}>
                  <button className="btn xsmall secondary" onClick={() => navigate(`/crops/${c.id}/edit`)}>Edit</button>
                  <button className="btn xsmall danger" onClick={() => removeCrop(c.id)}>Remove</button>
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


