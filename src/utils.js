export function clampToStep(v, min, max, step) {
  const clamped = Math.min(max, Math.max(min, v))
  return parseFloat((Math.round(clamped / step) * step).toFixed(10))
}
