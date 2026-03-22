const STORAGE_KEY = 'svg-pattern-presets';

export function downloadSvg() {
  const svgEl = document.getElementById('svg-output');
  const svgString = new XMLSerializer().serializeToString(svgEl);
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pattern.svg';
  a.click();
  URL.revokeObjectURL(url);
}

export function copySvgToClipboard() {
  const svgEl = document.getElementById('svg-output');
  const svgString = new XMLSerializer().serializeToString(svgEl);
  return navigator.clipboard.writeText(svgString);
}

export function savePreset(name, params) {
  const presets = getPresets();
  presets[name] = { ...params, _savedAt: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

export function getPresets() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function loadPreset(name) {
  const presets = getPresets();
  return presets[name] || null;
}

export function deletePreset(name) {
  const presets = getPresets();
  delete presets[name];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}
