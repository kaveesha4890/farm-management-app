import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import {Pencil, Trash2} from 'lucide-react'

export function HarvestsPage() {
  const { crops, harvests, markHarvestsCompleteForCrop, removeHarvest } = useApp()
  const navigate = useNavigate()
  const { cropId } = useParams()

  const crop = crops.find((c) => c.id === cropId)
  const rows = harvests.filter((h) => h.cropId === crop?.id)

  return (
    <div className="card">
      <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="page-title">Harvests {crop ? `- ${crop.name}` : ''}</div>
        <button className="btn small" onClick={() => navigate(`/crops/${crop?.id}/harvests/new`)} disabled={!crop || crop?.status === 'Completed'}>Add Harvest</button>
      </div>
      <div className="spacer" />
      <div className='table-container'>
        <table className="table">
        <thead>
          <tr>
            <th>Harvest date</th>
            <th>Quantity(kg)</th>
            <th>Number of harvest plants</th>
            <th>Note</th>
            <th>Actions</th>
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
              <td>
                <div className="row" style={{ gap: 8 }}>
                  <button 
                    className="btn xsmall secondary"
                    onClick={() => navigate(`/crops/${crop?.id}/harvests/${h.id}/edit`)}
                  >
                    <Pencil size={20} />
                  </button>
                  <button 
                    className="btn xsmall danger"
                    onClick={() => removeHarvest(h.id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="spacer" />
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <Link to="/crops" className="btn secondary">Back</Link>
        <button className={`btn ${crop?.status === 'Completed' ? 'secondary' : ''}`} onClick={() => crop && markHarvestsCompleteForCrop(crop.id)} disabled={!crop || crop.status === 'Completed'}>{crop?.status === 'Completed'? "Mark as completed":"Mark as complete"}</button>
      </div>
    </div>
  )
}


