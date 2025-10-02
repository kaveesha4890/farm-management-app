import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'

const CROP_TYPES = [
  'Carrot', 'Tomato', 'Lettuce', 'Cabbage', 'Beans', 'Cauliflower', 'Beetroot', 'Broccoli',
  'Knokohol', 'Hot chilli', 'Green chilli', 'Capsicum', 'Kochchi', 'Radish', 
]
// Removed variety options; using batch code instead

export function AddCropPage() {
  const { selectedTunnelId, selectedPlotId, addCrop } = useApp()
  const navigate = useNavigate()
  const [type, setType] = useState('Carrot')
  const [batchCode, setBatchCode] = useState('')
  const [predictedYield, setPredictedYield] = useState<number>(0)
  const [numPlants, setNumPlants] = useState<number>(0)
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))

  

  function onAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedTunnelId || !selectedPlotId) return
    addCrop({ 
      tunnelId: selectedTunnelId, 
      plotId: selectedPlotId, 
      name: type, 
      batchCode, 
      plantingDate: date, 
      predictedYield, 
      numPlants,
      status: 'Planted' // Set status to 'Planted' so it appears in plot availability
    })
    navigate('/crops')
  }

  return (
    <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
      <div className="page-title">Add new crop</div>
      <form onSubmit={onAdd}>
        <div className="field">
          <label className="label">Crop Type</label>
          <select className="select" value={type} onChange={(e) => { setType(e.target.value) }}>
            {CROP_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="label">Batch code</label>
          <input className="input" type="text" value={batchCode} onChange={(e) => setBatchCode(e.target.value)} placeholder="Enter batch code" />
        </div>
        <div className="row">
          <div className="field col">
            <label className="label">Predicted crop yield(kg)</label>
            <input className="input" type="number" value={predictedYield} onChange={(e) => setPredictedYield(Number(e.target.value))} placeholder="e.g., 120" />
          </div>
          <div className="field col">
            <label className="label">Number of plants</label>
            <input className="input" type="number" value={numPlants} onChange={(e) => setNumPlants(Number(e.target.value))} placeholder="e.g., 50" />
          </div>
        </div>
        <div className="field">
          <label className="label">Planting Date</label>
          <input 
            className="input" 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            min="2020-01-01"
            max="2030-12-31"
            title="Select planting date"
          />
        </div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <button type="button" className="btn secondary" onClick={() => navigate('/crops')}>Back</button>
          <button className="btn" type="submit">Add</button>
        </div>
      </form>
    </div>
  )
}


