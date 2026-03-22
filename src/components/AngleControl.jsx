import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AngleControl.css';

const springConfig = { type: 'spring', stiffness: 400, damping: 25, mass: 0.8 };

const COLLAPSED_SIZE = 28;
const EXPANDED_SIZE = 120;
const SVG_SIZE = 120;
const CENTER = SVG_SIZE / 2;
const RADIUS = 50;

const CARDINAL_ANGLES = [0, 90, 180, 270];
const DIAGONAL_ANGLES = [45, 135, 225, 315];
const ALL_SNAP_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function polarToCartesian(angleDeg, r, cx = CENTER, cy = CENTER) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function AngleControl({ angle, onAngleChange, isRadial = false, onRadialChange }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const containerRef = useRef(null);

  const handlePointerEvent = useCallback(
    (e) => {
      const rect = svgRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      let deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      deg = ((deg % 360) + 360) % 360;

      if (!e.shiftKey) {
        for (const snap of ALL_SNAP_ANGLES) {
          if (
            Math.abs(deg - snap) < 8 ||
            Math.abs(deg - snap + 360) < 8 ||
            Math.abs(deg - snap - 360) < 8
          ) {
            deg = snap;
            break;
          }
        }
      }

      onAngleChange(deg === 360 ? 0 : Math.round(deg));
    },
    [onAngleChange]
  );

  const handlePointerDown = useCallback(
    (e) => {
      if (!isExpanded) return;
      e.preventDefault();
      setIsDragging(true);
      svgRef.current.setPointerCapture(e.pointerId);
      handlePointerEvent(e);
    },
    [isExpanded, handlePointerEvent]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging) return;
      e.preventDefault();
      handlePointerEvent(e);
    },
    [isDragging, handlePointerEvent]
  );

  const handlePointerUp = useCallback(
    (e) => {
      if (!isDragging) return;
      setIsDragging(false);
      svgRef.current.releasePointerCapture(e.pointerId);
    },
    [isDragging]
  );

  const handleMouseEnter = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);
    setIsExpanded(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 325);
  }, [isDragging]);

  useEffect(() => {
    const section = containerRef.current?.closest('.sidebar-section');
    if (!section) return;
    section.style.zIndex = isExpanded ? '50' : '';
  }, [isExpanded]);

  const arrowTip = polarToCartesian(angle, RADIUS * 0.8);

  const currentSize = isExpanded ? EXPANDED_SIZE : COLLAPSED_SIZE;

  return (
    <div className="angle-control" ref={containerRef}>
      <div className="angle-control-row">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="compass-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsExpanded(false)}
            />
          )}
        </AnimatePresence>
        <motion.div
          className="compass-wrapper"
          initial={{ width: COLLAPSED_SIZE, height: COLLAPSED_SIZE, y: 0 }}
          animate={{
            width: currentSize,
            height: currentSize,
            y: isExpanded ? -(EXPANDED_SIZE - COLLAPSED_SIZE) / 2 : 0,
          }}
          transition={springConfig}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <svg
            ref={svgRef}
            className="compass-svg"
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            width="100%"
            height="100%"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Outer ring */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="var(--border, #2A2A32)"
              strokeWidth="1"
            />

            {/* Cardinal tick marks (N, E, S, W) */}
            {CARDINAL_ANGLES.map((a) => {
              const outer = polarToCartesian(a, RADIUS);
              const inner = polarToCartesian(a, RADIUS - 8);
              return (
                <line
                  key={`cardinal-${a}`}
                  x1={outer.x}
                  y1={outer.y}
                  x2={inner.x}
                  y2={inner.y}
                  stroke="var(--text-muted, #56565F)"
                  strokeWidth="1.2"
                />
              );
            })}

            {/* Diagonal tick marks */}
            {DIAGONAL_ANGLES.map((a) => {
              const outer = polarToCartesian(a, RADIUS);
              const inner = polarToCartesian(a, RADIUS - 5);
              return (
                <line
                  key={`diagonal-${a}`}
                  x1={outer.x}
                  y1={outer.y}
                  x2={inner.x}
                  y2={inner.y}
                  stroke="var(--text-muted, #56565F)"
                  strokeWidth="0.8"
                  opacity="0.5"
                />
              );
            })}

            {/* Center dot */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={2}
              fill="var(--text-muted, #56565F)"
            />

            {isRadial ? (
              /* Radial mode: concentric rings */
              <g className="radial-rings">
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS * 0.3}
                  fill="none"
                  stroke="var(--accent, #D4A853)"
                  strokeWidth="1"
                  opacity="0.7"
                >
                  <animate
                    attributeName="opacity"
                    values="0.4;0.8;0.4"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS * 0.55}
                  fill="none"
                  stroke="var(--accent, #D4A853)"
                  strokeWidth="0.8"
                  opacity="0.5"
                >
                  <animate
                    attributeName="opacity"
                    values="0.3;0.7;0.3"
                    dur="2.5s"
                    begin="0.4s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS * 0.8}
                  fill="none"
                  stroke="var(--accent, #D4A853)"
                  strokeWidth="0.6"
                  opacity="0.3"
                >
                  <animate
                    attributeName="opacity"
                    values="0.2;0.5;0.2"
                    dur="2.5s"
                    begin="0.8s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ) : (
              /* Direction arrow */
              <g className="direction-arrow">
                {/* Tail dot */}
                <circle cx={CENTER} cy={CENTER} r={3} fill="var(--accent, #D4A853)" opacity="0.4" />
                {/* Arrow line */}
                <line
                  x1={CENTER}
                  y1={CENTER}
                  x2={arrowTip.x}
                  y2={arrowTip.y}
                  stroke="var(--accent, #D4A853)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Arrow tip - round dot instead of triangle */}
                <circle cx={arrowTip.x} cy={arrowTip.y} r={4.5} fill="var(--accent, #D4A853)" />
              </g>
            )}

            {/* Cardinal labels when expanded */}
            {isExpanded && (
              <g className="cardinal-labels" opacity="0.5">
                <text
                  x={CENTER}
                  y={CENTER - RADIUS - 4}
                  textAnchor="middle"
                  fill="var(--text-muted, #56565F)"
                  fontSize="7"
                  fontFamily="var(--font-mono, monospace)"
                >
                  N
                </text>
                <text
                  x={CENTER + RADIUS + 6}
                  y={CENTER + 2.5}
                  textAnchor="middle"
                  fill="var(--text-muted, #56565F)"
                  fontSize="7"
                  fontFamily="var(--font-mono, monospace)"
                >
                  E
                </text>
                <text
                  x={CENTER}
                  y={CENTER + RADIUS + 10}
                  textAnchor="middle"
                  fill="var(--text-muted, #56565F)"
                  fontSize="7"
                  fontFamily="var(--font-mono, monospace)"
                >
                  S
                </text>
                <text
                  x={CENTER - RADIUS - 6}
                  y={CENTER + 2.5}
                  textAnchor="middle"
                  fill="var(--text-muted, #56565F)"
                  fontSize="7"
                  fontFamily="var(--font-mono, monospace)"
                >
                  W
                </text>
              </g>
            )}

            {/* Angle readout at center */}
            <circle cx={CENTER} cy={CENTER} r={12} fill="var(--accent)" />
            <text
              x={CENTER}
              y={CENTER}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--bg-deep)"
              fontSize="8"
              fontFamily="var(--font-mono, monospace)"
              fontWeight="500"
            >
              {Math.round(angle)}&deg;
            </text>
          </svg>
        </motion.div>

        {onRadialChange && <button
          className={`radial-toggle ${isRadial ? 'active' : ''}`}
          onClick={() => onRadialChange(!isRadial)}
          title="Radial mode"
          aria-label="Radial mode"
          aria-pressed={isRadial}
        >
          <svg viewBox="0 0 16 16" width="14" height="14">
            <circle
              cx="8"
              cy="8"
              r="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <circle
              cx="8"
              cy="8"
              r="5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle
              cx="8"
              cy="8"
              r="7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </svg>
        </button>}
      </div>
    </div>
  );
}

export default AngleControl;
