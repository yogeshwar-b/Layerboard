import { useReducer, useRef } from 'react'
import { LayerButton } from '../components/LayerButton'
import '../styles/utils.css'
import { CanvasHandle } from './CanvasContainer'
import '../styles/layerpanel.css'
import { CanvasIdPrefix } from '../constants'

interface LayersPanelProps {
  className: string
  CanvasContainerRef: React.RefObject<CanvasHandle>
  ActiveLayer: React.MutableRefObject<number>
}

export const LayersPanel = ({
  className,
  ActiveLayer,
  CanvasContainerRef
}: LayersPanelProps) => {
  const [layerButtons, dispatch]: [number[], React.Dispatch<action>] =
    useReducer(layerButtonsReducer, [1])
  const layerPanelRef = useRef<HTMLDivElement>(null)
  function setActiveLayer(i: string) {
    ActiveLayer.current = Number(i)
  }

  function setTopMostLayer() {
    document
      .getElementById(CanvasIdPrefix + String(ActiveLayer.current))
      ?.classList.remove('topmost-layer')

    document
      .getElementById(CanvasIdPrefix + String(ActiveLayer.current))
      ?.classList.add('topmost-layer')
  }

  return (
    <div className={className + ' layer-panel'} ref={layerPanelRef}>
      <div>Layers</div>
      <div className=''>
        <button
          className='flat-button'
          onClick={() => {
            if (CanvasContainerRef?.current)
              CanvasContainerRef.current.CanvasAdd(
                String(
                  layerButtons.length > 0 ? Math.max(...layerButtons) + 1 : '1'
                )
              )
            setActiveLayer(
              String(
                layerButtons.length > 0 ? Math.max(...layerButtons) + 1 : '1'
              )
            )

            setTopMostLayer()
            dispatch({ type: 'Add', activeLayer: ActiveLayer })
          }}
        >
          +
        </button>
        <button
          className='flat-button'
          onClick={() => {
            dispatch({ type: 'Delete', activeLayer: ActiveLayer })
            if (CanvasContainerRef?.current)
              CanvasContainerRef.current.CanvasDel(String(ActiveLayer.current))
          }}
        >
          -
        </button>
      </div>
      {layerButtons.map((i) => {
        return (
          <LayerButton
            key={String(i)}
            name={String(i)}
            onChecked={setActiveLayer}
            ActiveLayer={ActiveLayer}
          />
        )
      })}
    </div>
  )
}

interface action {
  type: string
  activeLayer: React.MutableRefObject<number>
}

function layerButtonsReducer(layerButtons: number[], action: action) {
  switch (action.type) {
    case 'Add':
      return [
        ...layerButtons,
        layerButtons.length > 0 ? Math.max(...layerButtons) + 1 : 1
      ]
    case 'Delete':
      console.log('deleting ' + action.activeLayer.current + ' in layer panel')
      return layerButtons.filter((x) => {
        if (x != action.activeLayer.current) return x
      })
    default:
      return layerButtons
  }
}
