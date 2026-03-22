import './SvgCanvas.css'
import { generateGrid } from '../generateGrid'
import { renderShape } from '../shapes'

function SvgCanvas({ params }) {
  const elements = generateGrid(params)

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

  if (elements.length > 0) {
    for (const el of elements) {
      const half = (el.size || params.baseSize) / 2
      minX = Math.min(minX, el.x - half)
      minY = Math.min(minY, el.y - half)
      maxX = Math.max(maxX, el.x + half)
      maxY = Math.max(maxY, el.y + half)
    }
  } else {
    minX = 0; minY = 0; maxX = 400; maxY = 400
  }

  const padding = 20
  const vbX = minX - padding
  const vbY = minY - padding
  const vbW = (maxX - minX) + padding * 2
  const vbH = (maxY - minY) + padding * 2

  const viewBox = `${vbX} ${vbY} ${vbW} ${vbH}`

  return (
    <div className="svg-canvas-container">
      <svg
        id="svg-output"
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className="svg-output"
      >
        {elements.map((el, i) => renderShape(el, i))}
      </svg>
    </div>
  )
}

export default SvgCanvas
