function hexagonPoints(r) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    points.push(`${r * Math.cos(angle)},${r * Math.sin(angle)}`);
  }
  return points.join(' ');
}

function starPoints(outerR, innerR, numPoints) {
  const points = [];
  const total = numPoints * 2;
  for (let i = 0; i < total; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / numPoints) * i - Math.PI / 2;
    points.push(`${r * Math.cos(angle)},${r * Math.sin(angle)}`);
  }
  return points.join(' ');
}

const HEXAGON_POINTS = hexagonPoints(10);
const STAR_POINTS = starPoints(10, 4, 5);

const blendStyle = (mode) => mode && mode !== 'normal' ? { mixBlendMode: mode } : undefined;

// Returns the base shape element with explicit fill/stroke overrides
function getShapeBase(el, fill, stroke, strokeWidth) {
  switch (el.shape) {
    case 'circle':
      return <circle cx={0} cy={0} r={10} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
    case 'square':
      return <rect x={-10} y={-10} width={20} height={20} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
    case 'triangle':
      return <polygon points="0,-10 10,10 -10,10" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
    case 'hexagon':
      return <polygon points={HEXAGON_POINTS} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
    case 'star':
      return <polygon points={STAR_POINTS} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
    case 'diamond':
      return <polygon points="0,-10 10,0 0,10 -10,0" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
    default:
      return <circle cx={0} cy={0} r={10} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
  }
}

const FILLED_SHAPES = new Set(['circle', 'square', 'triangle', 'hexagon', 'star', 'diamond']);

function getShapeSvg(el) {
  if (FILLED_SHAPES.has(el.shape)) {
    return (
      <>
        <g style={blendStyle(el.fillBlendMode)}>
          {getShapeBase(el, el.fill, 'none', 0)}
        </g>
        {el.strokeWidth > 0 && (
          <g style={blendStyle(el.strokeBlendMode)}>
            {getShapeBase(el, 'none', el.strokeColor, el.strokeWidth)}
          </g>
        )}
      </>
    );
  }

  switch (el.shape) {
    case 'line':
      return (
        <line
          x1={-10} y1={0}
          x2={10} y2={0}
          stroke={el.fill}
          strokeWidth={3}
          strokeLinecap="round"
          style={blendStyle(el.strokeBlendMode)}
        />
      );

    case 'cross':
      return (
        <g style={blendStyle(el.strokeBlendMode)}>
          <line x1={-10} y1={0} x2={10} y2={0} stroke={el.fill} strokeWidth={3} strokeLinecap="round" />
          <line x1={0} y1={-10} x2={0} y2={10} stroke={el.fill} strokeWidth={3} strokeLinecap="round" />
        </g>
      );

    case 'text':
      return (
        <text
          x={0}
          y={0}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={20}
          fill={el.fill}
          fontFamily="sans-serif"
          style={blendStyle(el.fillBlendMode)}
        >
          {el.textChar}
        </text>
      );

    case 'custom':
      return <g dangerouslySetInnerHTML={{ __html: el.customSvg || '' }} />;

    default:
      return <circle cx={0} cy={0} r={10} fill={el.fill} />;
  }
}

export function renderShape(el, index) {
  return (
    <g
      key={index}
      transform={`translate(${el.x}, ${el.y}) rotate(${el.rotation}) scale(${el.size / 20})`}
      opacity={el.opacity}
    >
      {getShapeSvg(el)}
    </g>
  );
}

export const SHAPE_LIST = [
  'circle',
  'square',
  'triangle',
  'hexagon',
  'star',
  'line',
  'cross',
  'diamond',
  'text',
  'custom',
];
