import { useState, useRef, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'
import './ColorInput.css'

function ColorInput({ label, value, onChange, gradientEnabled, onGradientToggle, gradientValue, onGradientChange }) {
  const [openPicker, setOpenPicker] = useState(null) // 'start' | 'end' | null
  const containerRef = useRef(null)
  const endColor = gradientValue ?? '#ffffff'

  const activeColor = openPicker === 'start' ? value : openPicker === 'end' ? endColor : value
  const setActive = openPicker === 'start' ? onChange : openPicker === 'end' ? onGradientChange : onChange

  useEffect(() => {
    if (!openPicker) return
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenPicker(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openPicker])

  return (
    <div className="color-input" ref={containerRef}>
      {label && <span className="color-input-label">{label}</span>}

      {/* cpill — NO overflow:hidden so the picker popup can escape */}
      <div className={`cpill${gradientEnabled ? ' cpill-range' : ''}`}>
        {/* cpill-inner has overflow:hidden for the slide animation */}
        <div className="cpill-inner">
          <button
            className="cpill-half"
            type="button"
            aria-label={`Choose ${label ? label.toLowerCase() + ' ' : ''}start color, current: ${value.toUpperCase()}`}
            aria-expanded={openPicker === 'start'}
            onMouseDown={e => e.preventDefault()}
            onClick={() => setOpenPicker(p => p === 'start' ? null : 'start')}
          >
            <div className={`cpill-swatch${gradientEnabled ? ' cpill-swatch-sm' : ''}`} style={{ background: value }} />
            <div className="cpill-text">
              <span className="cpill-tag">Start</span>
              <span className="cpill-hex">{value.toUpperCase()}</span>
            </div>
          </button>

          <div className="cpill-end-wrap">
            <button
              className="cpill-half cpill-half-end"
              type="button"
              aria-label={`Choose ${label ? label.toLowerCase() + ' ' : ''}end color, current: ${endColor.toUpperCase()}`}
              aria-expanded={openPicker === 'end'}
              onMouseDown={e => e.preventDefault()}
              onClick={() => setOpenPicker(p => p === 'end' ? null : 'end')}
            >
              <span className="cpill-arrow">→</span>
              <div className="cpill-swatch cpill-swatch-sm" style={{ background: endColor }} />
              <div className="cpill-text">
                <span className="cpill-tag">End</span>
                <span className="cpill-hex">{endColor.toUpperCase()}</span>
              </div>
            </button>
          </div>
        </div>

        {onGradientToggle && (
          <button
            className="cpill-toggle"
            type="button"
            aria-label="Toggle gradient"
            aria-pressed={gradientEnabled}
            onClick={() => { onGradientToggle(); setOpenPicker(null) }}
          >
            ↔
          </button>
        )}
      </div>

      {/* picker popup — sibling of cpill, outside overflow:hidden */}
      {openPicker && (
        <div className="cpill-picker" onMouseDown={e => e.stopPropagation()}>
          <HexColorPicker color={activeColor} onChange={setActive} />
          <input
            className="cpill-picker-hex"
            aria-label="Hex color value"
            value={activeColor.toUpperCase()}
            onChange={e => {
              const v = e.target.value
              if (/^#[0-9a-fA-F]{6}$/.test(v)) setActive(v)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default ColorInput
