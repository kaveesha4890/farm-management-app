import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export function HarvestsPage() {
  const { crops, harvests, markHarvestsCompleteForCrop } = useApp()
  const navigate = useNavigate()
  const { cropId } = useParams()

  const crop = crops.find((c) => c.id === cropId)
  const rows = harvests.filter((h) => h.cropId === crop?.id)

  return (
    <div className="card">
      <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="page-title">Harvests {crop ? `- ${crop.name}` : ''}</div>
        <button className="btn small" onClick={() => navigate(`/crops/${crop?.id}/harvests/new`)} disabled={!crop}>Add Harvest</button>
      </div>
      <div className="spacer" />
      <table className="table">
        <thead>
          <tr>
            <th>Harvest date</th>
            <th>Quantity</th>
            <th>Number of harvest plants</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={4} className="muted">No harvests yet</td></tr>
          )}
          {rows.map((h) => (
            <tr key={h.id}>
              <td>{h.date}</td>
              <td>{h.quantity}</td>
              <td>{h.numHarvestPlants}</td>
              <td>{h.note ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="spacer" />
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <Link to="/crops" className="btn secondary">Back</Link>
        <button className="btn" onClick={() => crop && markHarvestsCompleteForCrop(crop.id)} disabled={!crop}>Mark as complete</button>
      </div>
    </div>
  )
}


