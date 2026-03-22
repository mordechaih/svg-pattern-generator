import { useState, useEffect } from 'react'
import { getPresets, savePreset, loadPreset, deletePreset } from '../export'
import './PresetManager.css'

function PresetManager({ params, loadAllParams }) {
  const [presetNames, setPresetNames] = useState([])
  const [selected, setSelected] = useState('')

  const refresh = () => {
    const p = getPresets()
    setPresetNames(Object.keys(p))
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleSave = () => {
    const name = window.prompt('Enter preset name:')
    if (!name || !name.trim()) return
    savePreset(name.trim(), params)
    refresh()
    setSelected(name.trim())
  }

  const handleLoad = () => {
    if (!selected) return
    const params = loadPreset(selected)
    if (params) loadAllParams(params)
  }

  const handleDelete = () => {
    if (!selected) return
    deletePreset(selected)
    setSelected('')
    refresh()
  }

  return (
    <div className="preset-manager">
      <div className="preset-row">
        <select
          className="preset-select"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="">-- select preset --</option>
          {presetNames.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>
      <div className="preset-buttons">
        <button className="preset-btn" onClick={handleSave}>Save</button>
        <button className="preset-btn" onClick={handleLoad} disabled={!selected}>Load</button>
        <button className="preset-btn preset-btn-danger" onClick={handleDelete} disabled={!selected}>Delete</button>
      </div>
    </div>
  )
}

export default PresetManager
