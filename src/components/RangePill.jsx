import { useState, useRef, useCallback } from 'react'
import { clampToStep } from '../utils'
import './RangePill.css'

function ScrubValue({ value, onChange, min, max, step }) {
  const ref = useRef(null)
  const dragging = useRef(false)
  const startX = useRef(0)
  const startVal = useRef(0)

  const format = (v) => step < 1 ? v.toFixed(1) : String(Math.round(v))

  const clamp = useCallback((v) => clampToStep(v, min, max, step), [min, max, step])

  const handlePointerDown = (e) => {
    e.preventDefault()
    ref.current.setPointerCapture(e.pointerId)
    dragging.current = true
    startX.current = e.clientX
    startVal.current = value
  }

  const handlePointerMove = (e) => {
    if (!dragging.current) return
    const delta = (e.clientX - startX.current) / 2
    onChange(clamp(startVal.current + delta * step))
  }

  const handlePointerUp = (e) => {
    if (!dragging.current) return
    dragging.current = false
    ref.current.releasePointerCapture(e.pointerId)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      onChange(clamp(value + step))
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      onChange(clamp(value - step))
    }
  }

  return (
    <span
      ref={ref}
      className="range-pill-val"
      role="spinbutton"
      tabIndex={0}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
    >
      {format(value)}
    </span>
  )
}

function RangePill({ startValue, onStartChange, endValue, onEndChange, min, max, step }) {
  const [rangeEnabled, setRangeEnabled] = useState(() => startValue !== endValue)

  const toggleRange = () => {
    if (rangeEnabled) onEndChange(startValue)
    setRangeEnabled(r => !r)
  }

  return (
    <div className={`range-pill${rangeEnabled ? ' range-active' : ''}`}>
      <div className="range-pill-start">
        <span className="range-pill-tag">Start</span>
        <ScrubValue value={startValue} onChange={onStartChange} min={min} max={max} step={step} />
      </div>
      <div className="range-pill-end-wrap">
        <div className="range-pill-end">
          <span className="range-pill-tag">End</span>
          <div className="range-pill-end-inner">
            <span className="range-pill-arrow">→</span>
            <ScrubValue value={endValue} onChange={onEndChange} min={min} max={max} step={step} />
          </div>
        </div>
      </div>
      <button className="range-pill-toggle" type="button" aria-label="Toggle range" aria-pressed={rangeEnabled} onClick={toggleRange}>↔</button>
    </div>
  )
}

export default RangePill
