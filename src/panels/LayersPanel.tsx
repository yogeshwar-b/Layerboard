import { RefObject, useReducer, useRef } from 'react'
import { LayerButton } from '../components/LayerButton'
import '../styles/utils.css'
import { CanvasHandle } from './CanvasContainer'
import { CanvasIdPrefix } from '../constants'

interface LayersPanelProps {
  className: string
  CanvasContainerRef: RefObject<CanvasHandle | null>
  ActiveLayer: RefObject<string>
}
interface LayerState {
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
  const [layerStates, dispatch] = useReducer(layerButtonsReducer, [
    { name: 'Layer 1', id: ActiveLayer.current, order: 0, checked: true }
  ])
  const layerPanelRef = useRef<HTMLDivElement>(null)
  const draggedLayer = useRef<string>('')
  const draggedOverLayer = useRef<string>('')
  function setActiveLayer(currLayer: string) {
    let prevlayer = document.getElementById(
      CanvasIdPrefix + String(ActiveLayer.current)
    )
    if (prevlayer) prevlayer.style.pointerEvents = 'none'
    ActiveLayer.current = currLayer
    let newlayer = document.getElementById(
      CanvasIdPrefix + String(ActiveLayer.current)
    )
    if (newlayer) newlayer.style.pointerEvents = 'auto'
  }

  const handleDragStart = (layerId: string) => {
    draggedLayer.current = layerId
  }

  const handleDragEnter = (layerId: string) => {
    draggedOverLayer.current = layerId
  }

  const handleDragEnd = () => {
    console.log('dragging ended')
    if (
      draggedLayer.current !== '' &&
      draggedOverLayer.current !== '' &&
      draggedOverLayer.current !== draggedLayer.current
    ) {
      const fromIdx: number = layerStates.findIndex(
        (x) => x.id === draggedLayer.current
      )
      const toIdx: number = layerStates.findIndex(
        (x) => x.id === draggedOverLayer.current
      )
      dispatch({
        type: 'DragAndDrop',
        fromIdx: fromIdx,
        toIdx: toIdx,
        id: draggedLayer.current
      })
      if (CanvasContainerRef?.current) {
        CanvasContainerRef.current.CanvasSync(fromIdx, toIdx)
      }
      draggedLayer.current = ''
      draggedOverLayer.current = ''
    }
  }
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div
      className={className + ' z-113 flex flex-col items-center select-none'}
      ref={layerPanelRef}
    >
      <div>Layers</div>
      <div>
        <button
          className='active:bg-[rgba(0, 0, 0, 0.2)] mr-1 h-8 w-8 cursor-pointer rounded-lg border-1 border-solid border-black bg-transparent p-1 hover:bg-[rgba(0,0,0,0.1)]'
          onClick={() => {
            let layername = 'Layer ' + (layerStates.length + 1)
            let layerId = crypto.randomUUID()
            if (CanvasContainerRef?.current)
              CanvasContainerRef.current.CanvasAdd(layerId)
            dispatch({
              type: 'Add',
              activeLayer: ActiveLayer,
              name: layername,
              id: layerId
            })
            setActiveLayer(layerId)
          }}
        >
          +
        </button>
        <button
          className='active:bg-[rgba(0, 0, 0, 0.2)] mr-1 h-8 w-8 cursor-pointer rounded-lg border-1 border-solid border-black bg-transparent p-1 hover:bg-[rgba(0,0,0,0.1)]'
          onClick={() => {
            console.log(
              'on click deleting  ' + ActiveLayer.current + ' in layer panel'
            )
            dispatch({
              type: 'Delete',
              activeLayer: ActiveLayer,
              id: ActiveLayer.current
            })
            if (CanvasContainerRef?.current)
              CanvasContainerRef.current.CanvasDel(String(ActiveLayer.current))
          }}
        >
          -
        </button>
      </div>
      <div className='flex flex-col-reverse'>
        {layerStates.map((i) => {
          return (
            <LayerButton
              key={i.order}
              name={i.name}
              id={i.id}
              onChecked={setActiveLayer}
              ActiveLayer={ActiveLayer}
              order={i.order}
              handleDragStart={handleDragStart}
              handleDragEnter={handleDragEnter}
              handleDragEnd={handleDragEnd}
              handleDragOver={handleDragOver}
            />
          )
        })}
      </div>
    </div>
  )
}

//@todo use typeguards here to ensure that the action is of type action
interface action {
  type: string
  activeLayer?: React.RefObject<string>
  name?: string
  id: string
  fromIdx?: number
  toIdx?: number
}

function layerButtonsReducer(layerStates: Array<LayerState>, action: action) {
  switch (action.type) {
    case 'Add':
      return [
        ...layerStates,
        {
          name: action.name ?? `Layer ${layerStates.length + 1}`,
          id: action.id,
          order: layerStates.length,
          checked: false
        }
      ]
    case 'Delete':
      console.log('deleting ' + action.id + ' in layer panel')
      return layerStates.filter((x) => {
        if (x.id != action.id) return x
      })
    case 'DragAndDrop':
      if (action.fromIdx !== undefined && action.toIdx !== undefined) {
        const updatedItems = [...layerStates]
        const [removed] = updatedItems.splice(action.fromIdx, 1)
        updatedItems.splice(action.toIdx, 0, removed)
        return updatedItems
      } else {
        return layerStates
      }
    default:
      return layerStates
  }
}
