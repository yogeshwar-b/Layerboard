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
  function handleChange(i: string) {
    document
      .getElementById(CanvasIdPrefix + String(ActiveLayer.current))
      ?.classList.remove('topmost-layer')

    ActiveLayer.current = Number(i)
    console.log('Active Layer is- ' + i)

    document
      .getElementById(CanvasIdPrefix + String(ActiveLayer.current))
      ?.classList.add('topmost-layer')
  }

  return (
    <div className={className + ' layer-panel'} ref={layerPanelRef}>
      <div>LayersPanel</div>
      <div className=''>
        <button
          onClick={() => {
            if (CanvasContainerRef?.current)
              CanvasContainerRef.current.CanvasAdd(
                String(
                  layerButtons.length > 0 ? Math.max(...layerButtons) + 1 : '1'
                )
              )
            handleChange(
              String(
                layerButtons.length > 0 ? Math.max(...layerButtons) + 1 : '1'
              )
            )
            dispatch({ type: 'Add', activeLayer: ActiveLayer })
          }}
        >
          Add Layer +
        </button>
        <button
          onClick={() => {
            dispatch({ type: 'Delete', activeLayer: ActiveLayer })
            if (CanvasContainerRef?.current)
              CanvasContainerRef.current.CanvasDel(String(ActiveLayer.current))
          }}
        >
          Delete Layer -
        </button>
      </div>
      {layerButtons.map((i) => {
        return (
          <LayerButton
            key={String(i)}
            name={String(i)}
            onChecked={handleChange}
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
