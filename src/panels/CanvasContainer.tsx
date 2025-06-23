import { forwardRef, useImperativeHandle, useReducer } from 'react'
// import { Tools } from '../enums/tools'
import '../styles/utils.css'
import { CanvasLayer } from './CanvasLayer'
import { ToolProperties } from './Toolbox'

export interface CanvasHandle {
  CanvasAdd: (name: string) => void
  CanvasDel: (name: string) => void
}
interface CanvasContainerProps {
  ActiveLayer: React.MutableRefObject<string>
  ToolPropertiesRef: React.MutableRefObject<ToolProperties>
}
export const CanvasContainer = forwardRef(
  ({ ToolPropertiesRef,ActiveLayer }: CanvasContainerProps, ref) => {
    const [CanvasList, dispatch] = useReducer(CanvasReducer, [ActiveLayer.current])
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
)

interface action {
  type: string
  canvasName: string
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
    default:
      return CanvasList
  }
}
