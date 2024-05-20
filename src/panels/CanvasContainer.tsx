import {
  MouseEvent,
  forwardRef,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react'
import { Tools } from '../enums/tools'
import '../styles/utils.css'

type posRef = {
  prevX: number
  prevY: number
}
export interface CanvasHandle {
  CanvasAdd: (name: string) => void
  CanvasDel: (name: string) => void
}
interface CanvasContainerProps {
  ToolRef: React.MutableRefObject<Tools>
  ActiveLayer: React.MutableRefObject<number>
}
export const CanvasContainer = forwardRef(
  ({ ToolRef, ActiveLayer }: CanvasContainerProps, ref) => {
    const [CanvasList, dispatch] = useReducer(CanvasReducer, ['1'])
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
        // console.log("testcalled");
        if (CanvasList.includes(name)) {
          dispatch({ type: 'add', canvasName: name + '(1)' })
        } else {
          dispatch({ type: 'add', canvasName: name })
        }
      },
    }))
    function handleDelete(canvasId: string) {
      dispatch({ type: 'delete', canvasName: canvasId })
    }
    return (
      <div className='flex-row flex-wrap'>
        {CanvasList.map((c: string) => {
          return (
            <CanvasBox
              canvasId={c}
              handleDelete={handleDelete}
              key={c}
              toolRef={ToolRef}
              ActiveLayer={ActiveLayer}
            />
          )
        })}
      </div>
    )
  }
)

interface CanvasBoxProps {
  canvasId: string
  handleDelete: (canvasId: string) => void
  toolRef: React.MutableRefObject<Tools>
  ActiveLayer: React.MutableRefObject<number>
}
const CanvasBox = ({
  canvasId,
  handleDelete,
  toolRef,
  ActiveLayer,
}: CanvasBoxProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const posRef = useRef<posRef>({
    prevX: 0,
    prevY: 0,
  })
  const isDrawing = useRef<boolean>(false)

  return (
    <div>
      <h3>Canvas {canvasId}</h3>
      <canvas
        id={canvasId}
        ref={canvasRef}
        style={{ border: 'solid 2px white' }}
        onMouseDown={(e) => {
          if (
            toolRef.current == Tools.Brush &&
            String(ActiveLayer.current) == canvasId
          )
            MouseDownHandle(e, isDrawing, canvasRef, posRef)
        }}
        onMouseMove={(e) => {
          if (
            toolRef.current == Tools.Brush &&
            String(ActiveLayer.current) == canvasId
          )
            MouseMoveHandle(e, isDrawing, canvasRef, posRef)
        }}
        onMouseUp={() => {
          isDrawing.current = false
        }}
        onMouseOut={() => {
          isDrawing.current = false
        }}
      ></canvas>
      {/* <button
        onClick={() => {
          handleDelete(canvasId)
        }}
      >
        Delete Canvas
      </button> */}
    </div>
  )
}

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

//Mouse related functions dont care about these

function MouseDownHandle(
  e: MouseEvent,
  isDrawing: React.MutableRefObject<boolean>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  posRef: React.MutableRefObject<posRef>
) {
  isDrawing.current = true
  const rect: DOMRect | undefined = canvasRef.current?.getBoundingClientRect()
  if (rect) {
    posRef.current.prevX = e.clientX - rect.left
    posRef.current.prevY = e.clientY - rect.top
  }
}

function MouseMoveHandle(
  e: MouseEvent,
  isDrawing: React.MutableRefObject<boolean>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  posRef: React.MutableRefObject<posRef>
) {
  if (isDrawing.current && canvasRef.current) {
    const ctx = canvasRef.current.getContext('2d')
    if (canvasRef.current) {
      const rect: DOMRect = canvasRef.current?.getBoundingClientRect()
      const currX = e.clientX - rect.left
      const currY = e.clientY - rect.top
      if (!ctx) return
      ctx.beginPath()
      ctx.moveTo(posRef.current.prevX, posRef.current.prevY)
      ctx.lineTo(currX, currY)
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.stroke()
      posRef.current.prevX = currX
      posRef.current.prevY = currY
    }
  }
}
