import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export function EditHarvestPage() {
  const { cropId, harvestId } = useParams()
  const { harvests, updateHarvest } = useApp()
  const navigate = useNavigate()

  const harvest = harvests.find((h) => h.id === harvestId)
  const [date, setDate] = useState(harvest?.date || new Date().toISOString().slice(0, 10))
  const [quantity, setQuantity] = useState<number>(harvest?.quantity || 0)
  const [numHarvestPlants, setNumHarvestPlants] = useState<number>(harvest?.numHarvestPlants || 0)
  const [note, setNote] = useState(harvest?.note || '')

  if (!harvest) {
    return (
      <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="page-title">Harvest not found</div>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button className="btn" onClick={() => navigate(`/crops/${cropId}/harvests`)}>Back</button>
        </div>
      </div>
    )
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    await updateHarvest(harvest.id, { date, quantity, numHarvestPlants, note })
    navigate(`/crops/${cropId}/harvests`)
  }

  return (
    <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
      <div className="page-title">Edit Harvest</div>
      <form onSubmit={onSave}>
        <div className="field">
          <label className="label">Harvest Date</label>
          <input 
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="label">Quantity (kg)</label>
          <input 
            className="input"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label className="label">Number of Harvest Plants</label>
          <input 
            className="input"
            type="number"
            value={numHarvestPlants}
            onChange={(e) => setNumHarvestPlants(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label className="label">Note</label>
          <textarea 
            className="textarea"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <button 
            type="button"
            className="btn secondary"
            onClick={() => navigate(`/crops/${cropId}/harvests`)}
          >
            Back
          </button>
          <button className="btn" type="submit">Save</button>
        </div>
      </form>
    </div>
  )
}
