import { useReducer, useRef } from 'react'
import { LayerButton } from '../components/LayerButton'
import '../styles/utils.css'
import { CanvasHandle } from './CanvasContainer'
import '../styles/layerpanel.css'

interface LayersPanelProps {
  className: string
  CanvasContainerRef: React.RefObject<CanvasHandle>
  ActiveLayer: React.MutableRefObject<number>
}

export const LayersPanel = ({
  className,
  ActiveLayer,
  CanvasContainerRef,
}: LayersPanelProps) => {
  const [layerButtons, dispatch]: [number[], React.Dispatch<action>] =
    useReducer(layerButtonsReducer, [1])
  const layerPanelRef = useRef<HTMLDivElement>(null)
  function handleChange(i: string) {
    document
      .getElementById(String(ActiveLayer.current))
      ?.classList.remove('topmost-layer')
    ActiveLayer.current = Number(i)
    console.log('Active Layer is- ' + i)

    document
      .getElementById(String(ActiveLayer.current))
      ?.classList.add('topmost-layer')
  }

  // useEffect(() => {
  //   const radio = layerPanelRef.current?.getElementsByTagName('input')
  //   if (radio)
  //     for (let i = 0; i < radio.length; i++) {
  //       if (radio[i] && radio[i].id == String(ActiveLayer.current))
  //         radio[i].checked = true
  //     }
  // })

  return (
    <div className={className + ' layer-panel'} ref={layerPanelRef}>
      <div>LayersPanel</div>
      <div className=''>
        <button
          onClick={() => {
            // if (BoardRef?.current) {
            //   BoardRef.current.addLayer(String(Math.max(...layerButtons) + 1))
            // }
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
            // ActiveLayer.current = Math.max(...layerButtons) + 1
            dispatch({ type: 'Add', activeLayer: ActiveLayer })
          }}
        >
          Add Layer +
        </button>
        <button
          onClick={() => {
            // if (BoardRef?.current) {
            //   BoardRef.current.deleteLayer(String(activeLayer.current))
            // }
            // var newLayer = ActiveLayer.current
            // if (layerButtons.indexOf(ActiveLayer.current) - 1 >= 0) {
            //   newLayer =
            //     layerButtons[layerButtons.indexOf(ActiveLayer.current) - 1]
            // } else {
            //   newLayer = -1
            // }
            dispatch({ type: 'Delete', activeLayer: ActiveLayer })
            // handleChange(String(newLayer))
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
        layerButtons.length > 0 ? Math.max(...layerButtons) + 1 : 1,
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
