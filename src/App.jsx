import { useReducer } from 'react'
import './App.css'
import { DEFAULT_PARAMS } from './defaults'
import Sidebar from './components/Sidebar'
import SvgCanvas from './components/SvgCanvas'

function paramsReducer(state, action) {
  if (action.type === 'LOAD_PRESET') return { ...DEFAULT_PARAMS, ...action.params }
  return { ...state, [action.key]: action.value }
}

function App() {
  const [params, dispatch] = useReducer(paramsReducer, DEFAULT_PARAMS)

  const setParam = (key, value) => dispatch({ key, value })
  const loadAllParams = (params) => dispatch({ type: 'LOAD_PRESET', params })

  return (
    <div className="app">
      <Sidebar params={params} setParam={setParam} loadAllParams={loadAllParams} />
      <SvgCanvas params={params} />
    </div>
  )
}

export default App
