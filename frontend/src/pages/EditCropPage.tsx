import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../state/AppContext'

const CROP_TYPES = ['Carrot', 'Tomato', 'Lettuce', 'Cabbage']
const VARIETIES: Record<string, string[]> = {
  Carrot: ['Nantes', 'Imperator', 'Danvers'],
  Tomato: ['Roma', 'Cherry', 'Beefsteak'],
  Lettuce: ['Butterhead', 'Romaine', 'Iceberg'],
  Cabbage: ['Green', 'Red', 'Savoy'],
}

export function EditCropPage() {
  const { cropId } = useParams()
  const navigate = useNavigate()
  const { crops, updateCrop } = useApp()
  const crop = crops.find((c) => c.id === cropId)

  const [type, setType] = useState(crop?.name ?? 'Carrot')
  const [variety, setVariety] = useState(crop?.variety ?? '')
  const [date, setDate] = useState(crop?.plantingDate ?? new Date().toISOString().slice(0, 10))

  const varietyOptions = useMemo(() => VARIETIES[type] ?? [], [type])

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
    updateCrop(crop.id, { name: type, variety, plantingDate: date })
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
          <label className="label">Variety</label>
          <select className="select" value={variety} onChange={(e) => setVariety(e.target.value)}>
            <option value="">Select variety</option>
            {varietyOptions.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
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



