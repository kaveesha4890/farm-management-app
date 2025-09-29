import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export function AddHarvestPage() {
  const { crops, addHarvest } = useApp()
  const navigate = useNavigate()
  const { cropId } = useParams()
  const crop = crops.find((c) => c.id === cropId)

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [quantity, setQuantity] = useState<number>(0)
  const [numHarvestPlants, setNumHarvestPlants] = useState<number>(0)
  const [note, setNote] = useState('')

  function onAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!crop) return
    addHarvest({ cropId: crop.id, date, quantity: Number(quantity), numHarvestPlants: Number(numHarvestPlants), note: note || undefined })
    navigate(`/crops/${crop.id}/harvests`)
  }

  return (
    <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
      <div className="page-title">Add harvest</div>
      <form onSubmit={onAdd}>
        <div className="field">
          <label className="label">Harvest Date</label>
          <input 
            className="input" 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            min="2020-01-01"
            max="2030-12-31"
            title="Select harvest date"
          />
        </div>
        <div className="field">
          <label className="label">Harvest Quantity(kg)</label>
          <input className="input" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </div>
        <div className="field">
          <label className="label">Number of Harvest plants</label>
          <input className="input" type="number" value={numHarvestPlants} onChange={(e) => setNumHarvestPlants(Number(e.target.value))} />
        </div>
        <div className="field">
          <label className="label">Note (Optional)</label>
          <textarea className="textarea" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <button type="button" className="btn secondary" onClick={() => navigate(`/crops/${crop?.id}/harvests`)}>Back</button>
          <button className="btn" type="submit" disabled={!crop}>Add</button>
        </div>
      </form>
    </div>
  )
}


