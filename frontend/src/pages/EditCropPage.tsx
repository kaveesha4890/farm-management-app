import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../state/AppContext'

const CROP_TYPES = ['Carrot', 'Tomato', 'Lettuce', 'Cabbage']
// Removed varieties; using batch code and numeric fields instead

export function EditCropPage() {
  const { cropId } = useParams()
  const navigate = useNavigate()
  const { crops, updateCrop } = useApp()
  const crop = crops.find((c) => c.id === cropId)

  const [type, setType] = useState(crop?.name ?? 'Carrot')
  const [batchCode, setBatchCode] = useState(crop?.batchCode ?? '')
  const [predictedYield, setPredictedYield] = useState<number>(crop?.predictedYield ?? 0)
  const [numPlants, setNumPlants] = useState<number>(crop?.numPlants ?? 0)
  const [date, setDate] = useState(crop?.plantingDate ?? new Date().toISOString().slice(0, 10))

  const varietyOptions = useMemo(() => [], [type])

  if (!crop) {
    return (
      <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="page-title">Crop not found</div>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button className="btn" onClick={() => navigate('/crops')}>Back</button>
        </div>
      </div>
    )
  }

  function onSave(e: React.FormEvent) {
    e.preventDefault()
    if (!crop) return
    updateCrop(crop.id, { name: type, batchCode, predictedYield, numPlants, plantingDate: date })
    navigate('/crops')
  }

  return (
    <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
      <div className="page-title">Edit crop</div>
      <form onSubmit={onSave}>
        <div className="field">
          <label className="label">Crop Type</label>
          <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
            {CROP_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="label">Batch code</label>
          <input className="input" type="text" value={batchCode} onChange={(e) => setBatchCode(e.target.value)} />
        </div>
        <div className="row">
          <div className="field col">
            <label className="label">Predicted crop yield</label>
            <input className="input" type="number" value={predictedYield} onChange={(e) => setPredictedYield(Number(e.target.value))} />
          </div>
          <div className="field col">
            <label className="label">Number of plants</label>
            <input className="input" type="number" value={numPlants} onChange={(e) => setNumPlants(Number(e.target.value))} />
          </div>
        </div>
        <div className="field">
          <label className="label">Planting Date</label>
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <button type="button" className="btn secondary" onClick={() => navigate('/crops')}>Back</button>
          <button className="btn" type="submit">Save</button>
        </div>
      </form>
    </div>
  )
}




