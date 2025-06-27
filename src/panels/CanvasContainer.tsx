import { useImperativeHandle, useReducer } from 'react'
// import { Tools } from '../enums/tools'
import '../styles/utils.css'
import { CanvasLayer } from './CanvasLayer'
import { ToolProperties } from './Toolbox'

export interface CanvasHandle {
  CanvasAdd: (name: string) => void
  CanvasDel: (name: string) => void
  CanvasSync: (layerState: string[]) => void
}
interface CanvasContainerProps {
  ActiveLayer: React.RefObject<string>
  ToolPropertiesRef: React.RefObject<ToolProperties>
  ref: React.RefObject<CanvasHandle | null>
}
export const CanvasContainer = ({
  ToolPropertiesRef,
  ActiveLayer,
  ref
}: CanvasContainerProps) => {
  const [CanvasList, dispatch] = useReducer(CanvasReducer, [
    ActiveLayer.current
  ])
  useImperativeHandle(ref, () => ({
    test() {
      console.log('testcalled')
    },
    CanvasDel(name: string) {
      console.log(`deleting ${name} from ${CanvasList}`)
      if (CanvasList.includes(name)) {
        dispatch({ type: 'delete', canvasName: name })
      } else {
        console.log('not found')
      }
    },
    CanvasAdd(name: string) {
      if (CanvasList.includes(name)) {
        dispatch({ type: 'add', canvasName: name + '(1)' })
      } else {
        dispatch({ type: 'add', canvasName: name })
      }
    },
    CanvasSync(layerState: string[]) {
      dispatch({
        type: 'syncWithLayerPanel',
        canvasName: '',
        layerState: layerState
      })
    }
  }))
  return (
    <div className='top-left pos-abs height-max width-max canvas-container'>
      {CanvasList.map((c: string) => {
        return (
          <CanvasLayer
            className='top-left pos-abs'
            canvasId={c}
            key={c}
            ToolPropertiesRef={ToolPropertiesRef}
          />
        )
      })}
    </div>
  )
}

interface action {
  type: string
  canvasName: string
  layerState?: string[]
}
const CanvasReducer = (CanvasList: string[], action: action) => {
  switch (action.type) {
    case 'add':
      return [...CanvasList, action.canvasName]
    case 'delete':
      console.log(`deleting ${action.canvasName} from ${CanvasList}`)
      return CanvasList.filter((c) => {
        if (c != action.canvasName) return c
      })
    case 'syncWithLayerPanel':
      return action.layerState ? action.layerState : CanvasList

    default:
      return CanvasList
  }
}
