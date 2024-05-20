import { RefObject, useEffect, useReducer, useRef } from 'react'
import { LayerButton } from '../components/LayerButton'
import { LayersHandle } from './Board'
import '../styles/utils.css'
import { CanvasHandle } from './CanvasContainer'

interface LayersPanelProps {
  className: string
  BoardRef: RefObject<LayersHandle>
  CanvasContainerRef: React.RefObject<CanvasHandle>
  ActiveLayer: React.MutableRefObject<number>
}

export const LayersPanel = ({
  className,
  BoardRef,
  ActiveLayer,
  CanvasContainerRef,
}: LayersPanelProps) => {
  const [layerButtons, dispatch]: [number[], React.Dispatch<action>] =
    useReducer(layerButtonsReducer, [1])
  const layerPanelRef = useRef<HTMLDivElement>(null)
  function handleChange(i: string) {
    // console.log('Active Layer is- ' + i)
    ActiveLayer.current = Number(i)
  }

  useEffect(() => {
    const radio = layerPanelRef.current?.getElementsByTagName('input')
    if (radio)
      for (let i = 0; i < radio.length; i++) {
        if (radio[i] && radio[i].id == String(ActiveLayer.current))
          radio[i].checked = true
      }
  })

  return (
    <div className={className} ref={layerPanelRef}>
      <div>LayersPanel</div>
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
      <div className='pos-abs pos-bottom'>
        <button
          onClick={() => {
            dispatch({ type: 'Add', activeLayer: ActiveLayer.current })
            // if (BoardRef?.current) {
            //   BoardRef.current.addLayer(String(Math.max(...layerButtons) + 1))
            // }
            if (CanvasContainerRef?.current)
              CanvasContainerRef.current.CanvasAdd(
                String(Math.max(...layerButtons) + 1)
              )
          }}
        >
          Add Layer +
        </button>
        <button
          onClick={() => {
            // if (BoardRef?.current) {
            //   BoardRef.current.deleteLayer(String(activeLayer.current))
            // }

            dispatch({ type: 'Delete', activeLayer: ActiveLayer.current })
            if (CanvasContainerRef?.current)
              CanvasContainerRef.current.CanvasDel(String(ActiveLayer.current))
          }}
        >
          Delete Layer -
        </button>
      </div>
    </div>
  )
}

interface action {
  type: string
  activeLayer: number
}

function layerButtonsReducer(layerButtons: number[], action: action) {
  switch (action.type) {
    case 'Add':
      return [...layerButtons, Math.max(...layerButtons) + 1]
    case 'Delete':
      return layerButtons.filter((x) => {
        if (x != action.activeLayer) return x
      })
    default:
      return layerButtons
  }
}
