import { RefObject, useReducer, useRef } from 'react'
import { LayerButton } from '../components/LayerButton'
import '../styles/utils.css'
import { CanvasHandle } from './CanvasContainer'

interface LayersPanelProps {
  className: string
  CanvasContainerRef: RefObject<CanvasHandle | null>
  ActiveLayer: string
  setActiveLayer: React.Dispatch<React.SetStateAction<string>>
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
  CanvasContainerRef,
  setActiveLayer
}: LayersPanelProps) => {
  const [layerStates, dispatch]: [LayerState[], React.Dispatch<Action>] =
    useReducer(layerButtonsReducer, [
      { name: 'Layer 1', id: ActiveLayer, order: 0, checked: true }
    ])
  const layerPanelRef = useRef<HTMLDivElement>(null)
  const draggedLayer = useRef<string>('')
  const draggedOverLayer = useRef<string>('')

  function handleActiveLayerChange(currLayer: string) {
    setActiveLayer(currLayer)
  }

  const handleVisibilityToggle = (layerId: string, isChecked: boolean) => {
    if (CanvasContainerRef?.current) {
      CanvasContainerRef.current.CanvasToggleVisibility(layerId, isChecked)
    }
  }

  const handleDragStart = (layerId: string) => {
    draggedLayer.current = layerId
  }

  const handleDragEnter = (layerId: string) => {
    draggedOverLayer.current = layerId
  }

  const handleDragEnd = () => {
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
          className='active:bg-[rgba(0, 0, 0, 0.2)] mr-1 h-8 w-8 cursor-pointer rounded-lg bg-transparent p-1 shadow-[0_0_5px_rgba(0,0,0,0.2)] transition-all duration-150 hover:scale-105 hover:bg-[rgba(0,0,0,0.1)]'
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
            handleActiveLayerChange(layerId)
          }}
        >
          +
        </button>
        <button
          className='active:bg-[rgba(0, 0, 0, 0.2)] mr-1 h-8 w-8 cursor-pointer rounded-lg bg-transparent p-1 shadow-[0_0_5px_rgba(0,0,0,0.2)] transition-all duration-150 hover:scale-105 hover:bg-[rgba(0,0,0,0.1)]'
          onClick={() => {
            dispatch({
              type: 'Delete',
              activeLayer: ActiveLayer,
              id: ActiveLayer
            })
            if (CanvasContainerRef?.current)
              CanvasContainerRef.current.CanvasDel(String(ActiveLayer))
          }}
        >
          -
        </button>
      </div>
      <div className='flex w-full flex-col-reverse'>
        {layerStates.map((i) => {
          return (
            <LayerButton
              key={i.order}
              name={i.name}
              id={i.id}
              onSelected={setActiveLayer}
              onChecked={handleVisibilityToggle}
              ActiveLayer={ActiveLayer}
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
type Action =
  | { type: 'Add'; name: string; id: string; activeLayer: string }
  | { type: 'Delete'; id: string; activeLayer: string }
  | { type: 'DragAndDrop'; fromIdx: number; toIdx: number; id: string }

function layerButtonsReducer(layerStates: Array<LayerState>, action: Action) {
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
