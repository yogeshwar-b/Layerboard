import { useEffect, useReducer, useRef } from 'react'
import { LayerButton } from '../components/LayerButton'
import '../styles/utils.css'

interface LayersPanelProps {
  className: string
}

export const LayersPanel = (props: LayersPanelProps) => {
  const [layerButtons, dispatch]: [number[], React.Dispatch<action>] =
    useReducer(layerButtonsReducer, [1, 2])
  const layerPanelRef = useRef<HTMLDivElement>(null)
  const activeLayer = useRef<number>(2)
  function handleChange(i: string) {
    // console.log('something changed in ' + i)
    activeLayer.current = Number(i)
  }

  useEffect(() => {
    const radio = layerPanelRef.current?.getElementsByTagName('input')
    if (radio)
      for (let i = 0; i < radio.length; i++) {
        if (radio[i] && radio[i].id == String(activeLayer.current))
          radio[i].checked = true
      }

    console.log(radio)
  })

  return (
    <div className={props.className} ref={layerPanelRef}>
      <div>LayersPanel</div>
      {layerButtons.map((i) => {
        return (
          <LayerButton
            key={String(i)}
            name={String(i)}
            onChecked={handleChange}
          />
        )
      })}
      <div className='pos-abs pos-bottom'>
        <button
          onClick={() => {
            dispatch({ type: 'Add', activeLayer: activeLayer.current })
          }}
        >
          Add Layer +
        </button>
        <button
          onClick={() => {
            dispatch({ type: 'Delete', activeLayer: activeLayer.current })
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
