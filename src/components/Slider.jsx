import { useState, useRef, useCallback } from 'react'
import { clampToStep } from '../utils'
import './Slider.css'

function Slider({ label, min, max, step, value, onChange }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const trackRef = useRef(null)
  const inputRef = useRef(null)

  const formatValue = (v) => {
    if (typeof v !== 'number') return String(v)
    return Number.isInteger(step) ? String(v) : v.toFixed(2)
  }

  const clampAndRound = useCallback((raw) => clampToStep(raw, min, max, step), [min, max, step])

  const getValueFromPointer = useCallback((e) => {
    const rect = trackRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    return clampAndRound(min + x * (max - min))
  }, [min, max, clampAndRound])

  const handlePointerDown = useCallback((e) => {
    if (isEditing) return
    e.preventDefault()
    trackRef.current.setPointerCapture(e.pointerId)
    setIsDragging(true)
    onChange(getValueFromPointer(e))
  }, [isEditing, getValueFromPointer, onChange])

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return
    e.preventDefault()
    onChange(getValueFromPointer(e))
  }, [isDragging, getValueFromPointer, onChange])

  const handlePointerUp = useCallback((e) => {
    if (!isDragging) return
    setIsDragging(false)
    trackRef.current.releasePointerCapture(e.pointerId)
  }, [isDragging])

  const handleFocus = () => {
    setIsEditing(true)
    setEditValue(formatValue(value))
    setTimeout(() => inputRef.current?.select(), 0)
  }

  const commitValue = () => {
    setIsEditing(false)
    const parsed = parseFloat(editValue)
    if (isNaN(parsed)) return
    onChange(clampAndRound(parsed))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      commitValue()
      inputRef.current?.blur()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      inputRef.current?.blur()
    }
  }

  const percent = Math.max(0, Math.min(1, (value - min) / (max - min)))
  const displayValue = isEditing ? editValue : formatValue(value)
  const inputWidth = `${Math.max(2, displayValue.length + 1)}ch`

  return (
    <div
      ref={trackRef}
      className={`slider${isDragging ? ' dragging' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="slider-fill" style={{ width: `${percent * 100}%` }} />
      <div className="slider-inner">
        <span className="slider-label">{label}</span>
        <input
          ref={inputRef}
          type="text"
          className={`slider-value-input${isEditing ? ' editing' : ''}`}
          value={displayValue}
          style={{ width: inputWidth }}
          onChange={e => setEditValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={commitValue}
          onKeyDown={handleKeyDown}
          onPointerDown={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
        />
      </div>
    </div>
  )
}

export default Slider
