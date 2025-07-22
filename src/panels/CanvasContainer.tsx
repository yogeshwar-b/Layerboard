import { useImperativeHandle, useReducer } from 'react'
import '../styles/utils.css'
import { CanvasLayer } from './CanvasLayer'
import { ToolProperties } from './Toolbox'
import { Tools } from '../enums/tools'
import { useCustomCursor } from '../assets/Cursors'

export interface CanvasHandle {
  CanvasAdd: (name: string) => void
  CanvasDel: (name: string) => void
  CanvasSync: (fromIdx: number, toIdx: number) => void
  CanvasToggleVisibility: (name: string, isVisible: Boolean) => void
}
interface CanvasContainerProps {
  ActiveLayer: React.RefObject<string>
  ref: React.RefObject<CanvasHandle | null>
  ToolState: ToolProperties
}

export interface CanvasState {
  Id: string
  isVisible: Boolean
}

export const CanvasContainer = ({
  ActiveLayer,
  ref,
  ToolState
}: CanvasContainerProps) => {
  const [CanvasList, dispatch]: [CanvasState[], React.Dispatch<Action>] =
    useReducer(CanvasReducer, [{ Id: ActiveLayer.current, isVisible: true }])
  useImperativeHandle(ref, () => ({
    test() {
      console.log('testcalled')
    },
    CanvasDel(name: string) {
      console.log(`deleting ${name} from ${CanvasList}`)
      if (CanvasList.find((c) => c.Id === name)) {
        dispatch({ type: 'delete', canvasName: name })
      } else {
        console.log('not found')
      }
    },
    CanvasAdd(name: string) {
      if (CanvasList.find((c) => c.Id === name)) {
        dispatch({ type: 'add', canvasName: name + '(1)' })
      } else {
        dispatch({ type: 'add', canvasName: name })
      }
    },
    CanvasSync(fromIdx: number, toIdx: number) {
      dispatch({
        type: 'syncWithLayerPanel',
        canvasName: '',
        fromIdx: fromIdx,
        toIdx: toIdx
      })
    },
    CanvasToggleVisibility(name: string, isVisible: Boolean) {
      dispatch({
        type: 'toggleVisibility',
        canvasName: name,
        isVisible: isVisible
      })
    }
  }))
  const customCursor = useCustomCursor({
    color: ToolState.tool == Tools.Brush ? ToolState.color : 'white',
    size: ToolState.tool == Tools.Brush ? ToolState.size : 24
  })
  return (
    <div
      className={`top-left canvas-container absolute h-full w-full`}
      style={{
        cursor:
          ToolState.tool == Tools.Brush || ToolState.tool == Tools.Eraser
            ? customCursor
            : 'auto'
      }}
    >
      {CanvasList.map((canvasState) => {
        return (
          <CanvasLayer
            canvasState={canvasState}
            key={canvasState.Id}
            ToolState={ToolState}
          />
        )
      })}
    </div>
  )
}

type Action =
  | { type: 'add'; canvasName: string }
  | { type: 'delete'; canvasName: string }
  | {
      type: 'syncWithLayerPanel'
      fromIdx?: number
      toIdx?: number
      canvasName: string
    }
  | { type: 'toggleVisibility'; canvasName: string; isVisible: Boolean }
const CanvasReducer = (CanvasList: CanvasState[], action: Action) => {
  switch (action.type) {
    case 'add':
      return [...CanvasList, { Id: action.canvasName, isVisible: true }]
    case 'delete':
      console.log(`deleting ${action.canvasName} from ${CanvasList}`)
      return CanvasList.filter((c) => {
        if (c.Id != action.canvasName) return c
      })
    case 'syncWithLayerPanel':
      if (action.fromIdx !== undefined && action.toIdx !== undefined) {
        const updatedItems = [...CanvasList]
        const [removed] = updatedItems.splice(action.fromIdx, 1)
        updatedItems.splice(action.toIdx, 0, removed)
        return updatedItems
      } else {
        return CanvasList
      }
    case 'toggleVisibility':
      return CanvasList.map((canvasState) => {
        if (canvasState.Id === action.canvasName) {
          return { ...canvasState, isVisible: action.isVisible }
        } else {
          return canvasState
        }
      })

    default:
      return CanvasList
  }
}
