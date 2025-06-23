import { useReducer, useRef } from 'react'
import { LayerButton } from '../components/LayerButton'
import '../styles/utils.css'
import { CanvasHandle } from './CanvasContainer'
import '../styles/layerpanel.css'
import { CanvasIdPrefix } from '../constants'

interface LayersPanelProps {
  className: string
  CanvasContainerRef: React.RefObject<CanvasHandle>
  ActiveLayer: React.MutableRefObject<string>
}
interface LayerState{
  name: string
  id: string
  order: number
  checked: boolean
}

export const LayersPanel = ({
  className,
  ActiveLayer,
  CanvasContainerRef
}: LayersPanelProps) => {
  const [layerStates, dispatch]: [Array<LayerState>, React.Dispatch<action>] =
    useReducer(layerButtonsReducer, [{ name: 'Layer 1', id: ActiveLayer.current, order: 0, checked: true }])
  const layerPanelRef = useRef<HTMLDivElement>(null)
  function setActiveLayer(currLayer: string) {
    let prevlayer=document
      .getElementById(CanvasIdPrefix + String(ActiveLayer.current))
    if(prevlayer)prevlayer.style.pointerEvents = 'none'
    ActiveLayer.current = currLayer
    let newlayer=document
      .getElementById(CanvasIdPrefix + String(ActiveLayer.current))
    if(newlayer)newlayer.style.pointerEvents = 'auto'
  }


  return (
    <div className={className + ' layer-panel'} ref={layerPanelRef}>
      <div>Layers</div>
      <div className=''>
        <button
          className='flat-button'
          onClick={() => {
            let layername= 'Layer ' + (layerStates.length + 1)
            let layerId = crypto.randomUUID()
            if (CanvasContainerRef?.current)
              CanvasContainerRef.current.CanvasAdd(
                layerId
              )
            dispatch({ type: 'Add', activeLayer: ActiveLayer,name: layername, id: layerId})
            setActiveLayer(
              layerId
            )
          }}
        >
          +
        </button>
        <button
          className='flat-button'
          onClick={() => {
            console.log('on click deleting  ' + ActiveLayer.current + ' in layer panel')
            dispatch({ type: 'Delete', activeLayer: ActiveLayer , id: ActiveLayer.current })
            if (CanvasContainerRef?.current)
              CanvasContainerRef.current.CanvasDel(String(ActiveLayer.current))
          }}
        >
          -
        </button>
      </div>
      {layerStates.map((i) => {
        return (
          <LayerButton
            key={i.order}
            name={i.name}
            id={i.id}
            onChecked={setActiveLayer}
            ActiveLayer={ActiveLayer}
            order={i.order}
          />
        )
      })}
    </div>
  )
}

interface action {
  type: string
  activeLayer: React.MutableRefObject<string>
  name?: string
  id: string
}

function layerButtonsReducer(layerStates: Array<LayerState>, action: action) {
  switch (action.type) {
    case 'Add':
      return [
        ...layerStates,
        { name: action.name ?? `Layer ${layerStates.length + 1}`, id: action.id, order: layerStates.length, checked: false }
      ]
    case 'Delete':
      console.log('deleting ' + action.id + ' in layer panel')
      return layerStates.filter((x) => {
        if (x.id != action.id) return x
      })
    default:
      return layerStates
  }
}
