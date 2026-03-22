import './ShapePicker.css'
import { SHAPE_LIST } from '../shapes'

const SHAPE_ICONS = {
  circle: <circle cx="9" cy="9" r="6" fill="currentColor" />,
  square: <rect x="3" y="3" width="12" height="12" fill="currentColor" />,
  triangle: <polygon points="9,2 16,16 2,16" fill="currentColor" />,
  hexagon: <polygon points="9,2 15,5.5 15,12.5 9,16 3,12.5 3,5.5" fill="currentColor" />,
  star: <polygon points="9,1 11.2,6.5 17,7 12.5,11 14,17 9,13.8 4,17 5.5,11 1,7 6.8,6.5" fill="currentColor" />,
  line: <line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />,
  cross: <><line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="2.2" /><line x1="9" y1="3" x2="9" y2="15" stroke="currentColor" strokeWidth="2.2" /></>,
  diamond: <polygon points="9,2 16,9 9,16 2,9" fill="currentColor" />,
  text: <text x="9" y="13" textAnchor="middle" fill="currentColor" fontSize="13" fontFamily="serif" fontWeight="600">A</text>,
  custom: <><path d="M5,3 L13,3 L15,5 L15,15 L3,15 L3,5 Z" fill="none" stroke="currentColor" strokeWidth="1.2" /><text x="9" y="12" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="sans-serif">SVG</text></>,
}

function ShapePicker({ shape, textChar, setParam }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const svgText = ev.target.result
      const match = svgText.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)
      const innerSvg = match ? match[1].trim() : svgText
      setParam('customSvg', innerSvg)
    }
    reader.readAsText(file)
  }

  return (
    <div className="shape-picker">
      <div className="shape-grid">
        {SHAPE_LIST.map((s) => (
          <button
            key={s}
            className={`shape-btn${shape === s ? ' active' : ''}`}
            onClick={() => setParam('shape', s)}
            title={s}
            aria-label={s}
            aria-pressed={shape === s}
          >
            <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              {SHAPE_ICONS[s] || SHAPE_ICONS.circle}
            </svg>
          </button>
        ))}
      </div>

      {shape === 'text' && (
        <div className="shape-extra">
          <label className="shape-extra-label">
            Character
            <input
              type="text"
              className="shape-text-input"
              value={textChar}
              maxLength={2}
              onChange={e => setParam('textChar', e.target.value)}
            />
          </label>
        </div>
      )}

      {shape === 'custom' && (
        <div className="shape-extra">
          <label className="shape-upload-label">
            Upload SVG
            <input
              type="file"
              accept=".svg,image/svg+xml"
              className="shape-file-input"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      )}
    </div>
  )
}

export default ShapePicker
