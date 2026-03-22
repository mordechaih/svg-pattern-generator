import { createRng } from './random.js';
import { project3d } from './math3d.js';

const SQRT_HALF = Math.sqrt(0.5);

function computeGradientT(nx, ny, isRadial, centerX, centerY, dirX, dirY, maxRange) {
  if (isRadial) {
    const dx = nx - centerX;
    const dy = ny - centerY;
    return Math.min(1, Math.max(0, Math.sqrt(dx * dx + dy * dy) / SQRT_HALF));
  }
  const raw = dirX * (nx - 0.5) + dirY * (ny - 0.5);
  return maxRange > 0 ? Math.min(1, Math.max(0, raw / maxRange * 0.5 + 0.5)) : 0.5;
}

function linearDir(angle) {
  const rad = angle * Math.PI / 180;
  const dirX = Math.sin(rad);
  const dirY = -Math.cos(rad);
  const maxRange = (Math.abs(dirX) + Math.abs(dirY)) * 0.5;
  return { dirX, dirY, maxRange };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function parseHex(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
}

function lerpColor(rgb1, rgb2, t) {
  const toHex = (v) => v.toString(16).padStart(2, '0');
  const r = Math.round(lerp(rgb1[0], rgb2[0], t));
  const g = Math.round(lerp(rgb1[1], rgb2[1], t));
  const b = Math.round(lerp(rgb1[2], rgb2[2], t));
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function generateGrid(params) {
  const {
    seed,
    rows,
    columns,
    baseSize,
    baseRotation,
    rotationGradient,
    spacingStart,
    spacingEnd,
    spacingAngle,
    spacingRadial,
    spacingCenterX,
    spacingCenterY,
    scaleStart,
    scaleEnd,
    scaleAngle,
    scaleRadial,
    scaleCenterX,
    scaleCenterY,
    fillColor,
    fillColorEnd,
    strokeColor,
    strokeWidth,
    fillBlendMode,
    strokeBlendMode,
    strokeGradient,
    strokeColorEnd,
    strokeGradientAngle,
    strokeGradientRadial,
    colorGradient,
    colorAngle,
    colorRadial,
    opacity,
    shape,
    textChar,
    customSvg,
    posJitter,
    sizeJitter,
    rotJitter,
    rotateX,
    rotateY,
    perspective,
    twistAmount,
    twistAxisAngle,
  } = params;

  const rng = createRng(seed);
  const elements = [];

  const spacingDir = spacingRadial ? null : linearDir(spacingAngle);
  const scaleDir = scaleRadial ? null : linearDir(scaleAngle);
  const colorDir = colorRadial ? null : linearDir(colorAngle);
  const strokeDir = strokeGradientRadial ? null : linearDir(strokeGradientAngle);

  const fillRgb = parseHex(fillColor);
  const fillEndRgb = colorGradient ? parseHex(fillColorEnd) : null;
  const strokeRgb = parseHex(strokeColor);
  const strokeEndRgb = strokeGradient ? parseHex(strokeColorEnd) : null;

  const use3d =
    (rotateX !== 0 && rotateX != null) ||
    (rotateY !== 0 && rotateY != null) ||
    (twistAmount !== 0 && twistAmount != null);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const nx = columns > 1 ? col / (columns - 1) : 0;
      const ny = rows > 1 ? row / (rows - 1) : 0;

      // Spacing gradient
      const spacingT = computeGradientT(
        nx, ny,
        spacingRadial,
        spacingCenterX, spacingCenterY,
        spacingDir?.dirX, spacingDir?.dirY, spacingDir?.maxRange
      );
      const spacing = lerp(spacingStart, spacingEnd, spacingT);

      // Position
      let x = col * spacing;
      let y = row * spacing;

      // Scale gradient
      const scaleT = computeGradientT(
        nx, ny,
        scaleRadial,
        scaleCenterX, scaleCenterY,
        scaleDir?.dirX, scaleDir?.dirY, scaleDir?.maxRange
      );
      let scale = lerp(scaleStart, scaleEnd, scaleT);
      let size = baseSize * scale;

      // Rotation
      let rotation = baseRotation + rotationGradient * spacingT * 360;

      // Color
      let fill;
      if (colorGradient) {
        const colorT = computeGradientT(
          nx, ny,
          colorRadial,
          0.5, 0.5,
          colorDir?.dirX, colorDir?.dirY, colorDir?.maxRange
        );
        fill = lerpColor(fillRgb, fillEndRgb, colorT);
      } else {
        fill = fillColor;
      }

      // Stroke color
      let finalStrokeColor = strokeColor;
      if (strokeGradient) {
        const strokeT = computeGradientT(
          nx, ny,
          strokeGradientRadial,
          0.5, 0.5,
          strokeDir?.dirX, strokeDir?.dirY, strokeDir?.maxRange
        );
        finalStrokeColor = lerpColor(strokeRgb, strokeEndRgb, strokeT);
      }

      // Jitter
      x += (rng() - 0.5) * posJitter;
      y += (rng() - 0.5) * posJitter;
      size *= 1 + (rng() - 0.5) * sizeJitter;
      rotation += (rng() - 0.5) * rotJitter;

      // 3D projection
      let depth = 0;
      if (use3d) {
        const gridWidth = (columns - 1) * lerp(spacingStart, spacingEnd, 0.5);
        const gridHeight = (rows - 1) * lerp(spacingStart, spacingEnd, 0.5);
        const proj = project3d(x, y, gridWidth, gridHeight, {
          rotateX: rotateX || 0,
          rotateY: rotateY || 0,
          perspective: perspective || 800,
          twistAmount: twistAmount || 0,
          twistAxisAngle: twistAxisAngle || 0,
        });
        x = proj.x;
        y = proj.y;
        size *= proj.scale;
        depth = proj.depth;
        rotation += proj.twistRotation;
      }

      elements.push({
        x,
        y,
        size,
        rotation,
        fill,
        opacity: opacity != null ? opacity : 1,
        shape,
        textChar,
        customSvg,
        depth,
        strokeColor: finalStrokeColor,
        strokeWidth,
        fillBlendMode,
        strokeBlendMode,
      });
    }
  }

  // Sort back to front (higher depth = farther away, draw first)
  elements.sort((a, b) => b.depth - a.depth);

  return elements;
}
