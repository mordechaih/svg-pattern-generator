import './Sidebar.css'
import Slider from './Slider'
import RangePill from './RangePill'
import ColorInput from './ColorInput'
import ShapePicker from './ShapePicker'
import PresetManager from './PresetManager'
import AngleControl from './AngleControl'
import AccordionSection from './AccordionSection'
import { downloadSvg, copySvgToClipboard } from '../export'
import { DEFAULT_PARAMS } from '../defaults'

const BLEND_MODES = ['normal','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','hard-light','soft-light','difference','exclusion']

function Sidebar({ params, setParam, loadAllParams }) {
  const isModified = (...keys) => keys.some(k => params[k] !== DEFAULT_PARAMS[k])
  const resetKeys = (...keys) => keys.forEach(k => setParam(k, DEFAULT_PARAMS[k]))

  const {
    columns, rows, baseSize,
    spacingStart, spacingEnd, spacingAngle, spacingRadial, spacingCenterX, spacingCenterY,
    scaleStart, scaleEnd, scaleAngle, scaleRadial, scaleCenterX, scaleCenterY,
    shape, textChar,
    fillColor, opacity, colorGradient, fillColorEnd, colorAngle, colorRadial,
    strokeColor, strokeWidth, fillBlendMode, strokeBlendMode, strokeGradient, strokeColorEnd, strokeGradientAngle, strokeGradientRadial,
    baseRotation, rotationGradient,
    posJitter, sizeJitter, rotJitter, seed,
    rotateX, rotateY, perspective, twistAmount, twistAxisAngle,
  } = params

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Pattern <span className="sidebar-title-accent">Studio</span></span>
      </div>

      {/* Grid */}
      <AccordionSection
        title="Grid"
        defaultOpen
        actions={isModified('columns', 'rows', 'baseSize', 'spacingStart', 'spacingEnd', 'spacingAngle', 'spacingRadial', 'spacingCenterX', 'spacingCenterY') ? (
          <>
            <span className="section-modified" />
            <button
              className="section-reset"
              onClick={e => {
                e.stopPropagation()
                resetKeys('columns', 'rows', 'baseSize', 'spacingStart', 'spacingEnd', 'spacingAngle', 'spacingRadial', 'spacingCenterX', 'spacingCenterY')
              }}
            >
              Reset
            </button>
          </>
        ) : null}
      >
        <Slider label="Columns" min={1} max={50} step={1} value={columns} onChange={v => setParam('columns', v)} />
        <Slider label="Rows" min={1} max={50} step={1} value={rows} onChange={v => setParam('rows', v)} />
        <Slider label="Base Size" min={1} max={100} step={1} value={baseSize} onChange={v => setParam('baseSize', v)} />
        <RangePill
          startValue={spacingStart} onStartChange={v => setParam('spacingStart', v)}
          endValue={spacingEnd} onEndChange={v => setParam('spacingEnd', v)}
          min={5} max={200} step={1}
        />
        <AngleControl
          angle={spacingAngle}
          onAngleChange={v => setParam('spacingAngle', v)}
          isRadial={spacingRadial}
          onRadialChange={v => setParam('spacingRadial', v)}
        />
        {spacingRadial && (
          <>
            <Slider label="Center X" min={0} max={1} step={0.01} value={spacingCenterX} onChange={v => setParam('spacingCenterX', v)} />
            <Slider label="Center Y" min={0} max={1} step={0.01} value={spacingCenterY} onChange={v => setParam('spacingCenterY', v)} />
          </>
        )}
      </AccordionSection>

      {/* Scale */}
      <AccordionSection
        title="Scale"
        defaultOpen
        actions={isModified('scaleStart', 'scaleEnd', 'scaleAngle', 'scaleRadial', 'scaleCenterX', 'scaleCenterY') ? (
          <>
            <span className="section-modified" />
            <button
              className="section-reset"
              onClick={e => {
                e.stopPropagation()
                resetKeys('scaleStart', 'scaleEnd', 'scaleAngle', 'scaleRadial', 'scaleCenterX', 'scaleCenterY')
              }}
            >
              Reset
            </button>
          </>
        ) : null}
      >
        <RangePill
          startValue={scaleStart} onStartChange={v => setParam('scaleStart', v)}
          endValue={scaleEnd} onEndChange={v => setParam('scaleEnd', v)}
          min={0.1} max={5} step={0.1}
        />
        <AngleControl
          angle={scaleAngle}
          onAngleChange={v => setParam('scaleAngle', v)}
          isRadial={scaleRadial}
          onRadialChange={v => setParam('scaleRadial', v)}
        />
        {scaleRadial && (
          <>
            <Slider label="Center X" min={0} max={1} step={0.01} value={scaleCenterX} onChange={v => setParam('scaleCenterX', v)} />
            <Slider label="Center Y" min={0} max={1} step={0.01} value={scaleCenterY} onChange={v => setParam('scaleCenterY', v)} />
          </>
        )}
      </AccordionSection>

      {/* Shape */}
      <AccordionSection
        title="Shape"
        defaultOpen
        actions={isModified('shape', 'textChar', 'customSvg') ? (
          <>
            <span className="section-modified" />
            <button
              className="section-reset"
              onClick={e => {
                e.stopPropagation()
                resetKeys('shape', 'textChar', 'customSvg')
              }}
            >
              Reset
            </button>
          </>
        ) : null}
      >
        <ShapePicker shape={shape} textChar={textChar} setParam={setParam} />
      </AccordionSection>

      {/* Color */}
      <AccordionSection
        title="Color"
        defaultOpen
        actions={isModified('fillColor', 'opacity', 'colorGradient', 'fillColorEnd', 'colorAngle', 'colorRadial', 'strokeColor', 'strokeWidth', 'fillBlendMode', 'strokeBlendMode', 'strokeGradient', 'strokeColorEnd', 'strokeGradientAngle', 'strokeGradientRadial') ? (
          <>
            <span className="section-modified" />
            <button
              className="section-reset"
              onClick={e => {
                e.stopPropagation()
                resetKeys('fillColor', 'opacity', 'colorGradient', 'fillColorEnd', 'colorAngle', 'colorRadial', 'strokeColor', 'strokeWidth', 'fillBlendMode', 'strokeBlendMode', 'strokeGradient', 'strokeColorEnd', 'strokeGradientAngle', 'strokeGradientRadial')
              }}
            >
              Reset
            </button>
          </>
        ) : null}
      >
        <ColorInput
          label="Fill Color"
          value={fillColor}
          onChange={v => setParam('fillColor', v)}
          gradientEnabled={colorGradient}
          onGradientToggle={() => setParam('colorGradient', !colorGradient)}
          gradientValue={fillColorEnd}
          onGradientChange={v => setParam('fillColorEnd', v)}
        />
        {colorGradient && (
          <AngleControl
            angle={colorAngle}
            onAngleChange={v => setParam('colorAngle', v)}
            isRadial={colorRadial}
            onRadialChange={v => setParam('colorRadial', v)}
          />
        )}
        <Slider label="Opacity" min={0} max={1} step={0.01} value={opacity} onChange={v => setParam('opacity', v)} />
        <div className="sidebar-select-label">
          <span className="sidebar-label">Fill Blend</span>
          <select className="sidebar-select" value={fillBlendMode} onChange={e => setParam('fillBlendMode', e.target.value)}>
            {BLEND_MODES.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <ColorInput
          label="Stroke Color"
          value={strokeColor}
          onChange={v => setParam('strokeColor', v)}
          gradientEnabled={strokeGradient}
          onGradientToggle={() => setParam('strokeGradient', !strokeGradient)}
          gradientValue={strokeColorEnd}
          onGradientChange={v => setParam('strokeColorEnd', v)}
        />
        {strokeGradient && (
          <AngleControl
            angle={strokeGradientAngle}
            onAngleChange={v => setParam('strokeGradientAngle', v)}
            isRadial={strokeGradientRadial}
            onRadialChange={v => setParam('strokeGradientRadial', v)}
          />
        )}
        <Slider label="Stroke Width" min={0} max={10} step={0.5} value={strokeWidth} onChange={v => setParam('strokeWidth', v)} />
        <div className="sidebar-select-label">
          <span className="sidebar-label">Stroke Blend</span>
          <select className="sidebar-select" value={strokeBlendMode} onChange={e => setParam('strokeBlendMode', e.target.value)}>
            {BLEND_MODES.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </AccordionSection>

      {/* Rotation */}
      <AccordionSection
        title="Rotation"
        actions={isModified('baseRotation', 'rotationGradient') ? (
          <>
            <span className="section-modified" />
            <button
              className="section-reset"
              onClick={e => {
                e.stopPropagation()
                resetKeys('baseRotation', 'rotationGradient')
              }}
            >
              Reset
            </button>
          </>
        ) : null}
      >
        <Slider label="Base Rotation" min={0} max={360} step={1} value={baseRotation} onChange={v => setParam('baseRotation', v)} />
        <Slider label="Rotation Gradient" min={0} max={10} step={0.1} value={rotationGradient} onChange={v => setParam('rotationGradient', v)} />
      </AccordionSection>

      {/* Jitter */}
      <AccordionSection
        title="Jitter"
        actions={isModified('posJitter', 'sizeJitter', 'rotJitter', 'seed') ? (
          <>
            <span className="section-modified" />
            <button
              className="section-reset"
              onClick={e => {
                e.stopPropagation()
                resetKeys('posJitter', 'sizeJitter', 'rotJitter', 'seed')
              }}
            >
              Reset
            </button>
          </>
        ) : null}
      >
        <Slider label="Position Jitter" min={0} max={100} step={1} value={posJitter} onChange={v => setParam('posJitter', v)} />
        <Slider label="Size Jitter" min={0} max={1} step={0.01} value={sizeJitter} onChange={v => setParam('sizeJitter', v)} />
        <Slider label="Rotation Jitter" min={0} max={360} step={1} value={rotJitter} onChange={v => setParam('rotJitter', v)} />
        <Slider label="Seed" min={0} max={999} step={1} value={seed} onChange={v => setParam('seed', v)} />
      </AccordionSection>

      {/* 3D */}
      <AccordionSection
        title="3D"
        actions={isModified('rotateX', 'rotateY', 'perspective', 'twistAmount', 'twistAxisAngle') ? (
          <>
            <span className="section-modified" />
            <button
              className="section-reset"
              onClick={e => {
                e.stopPropagation()
                resetKeys('rotateX', 'rotateY', 'perspective', 'twistAmount', 'twistAxisAngle')
              }}
            >
              Reset
            </button>
          </>
        ) : null}
      >
        <Slider label="Rotate X" min={-90} max={90} step={1} value={rotateX} onChange={v => setParam('rotateX', v)} />
        <Slider label="Rotate Y" min={-90} max={90} step={1} value={rotateY} onChange={v => setParam('rotateY', v)} />
        <Slider label="Perspective" min={100} max={2000} step={10} value={perspective} onChange={v => setParam('perspective', v)} />
        <Slider label="Twist Amount" min={-50} max={50} step={0.5} value={twistAmount} onChange={v => setParam('twistAmount', v)} />
        <Slider label="Twist Axis Angle" min={0} max={360} step={1} value={twistAxisAngle} onChange={v => setParam('twistAxisAngle', v)} />
      </AccordionSection>

      {/* Export */}
      <AccordionSection title="Export">
        <div className="export-buttons">
          <button className="export-btn" onClick={() => downloadSvg()}>Download SVG</button>
          <button className="export-btn" onClick={() => copySvgToClipboard()}>Copy SVG</button>
        </div>
        <PresetManager params={params} loadAllParams={loadAllParams} />
      </AccordionSection>
    </aside>
  )
}

export default Sidebar
