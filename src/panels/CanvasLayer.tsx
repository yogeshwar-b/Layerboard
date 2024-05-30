import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useId,
  useRef,
  useState,
} from 'react'
import { Tools } from '../enums/tools'
import { CanvasIdPrefix } from '../constants'

interface CanvasLayerProps {
  canvasId: string
  ToolRef: React.MutableRefObject<Tools>
  // ActiveLayer: React.MutableRefObject<number>
  className: string
}

var isDrawing: boolean = false

export const CanvasLayer = ({ canvasId, ToolRef }: CanvasLayerProps) => {
  const ActivePolyLineRef = useRef<SVGPolylineElement>(null)
  const [PolyLineList, changePolyLineList] = useState<Array<ReactNode>>([])
  let CanvasLayerId = CanvasIdPrefix + canvasId
  return (
    <div
      id={CanvasLayerId}
      className='drawing-board'
      onMouseDown={MouseDownHandle}
      onMouseMove={MouseMoveHandle}
      // onMouseOut={MouseOutHandle}
      onMouseUp={MouseUpHandle}
      style={{ height: '100%', width: '100%', position: 'absolute' }}
    >
      {PolyLineList.map((i) => {
        return i
      })}
    </div>
  )
  function MouseDownHandle(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    // console.log('mouse moved but isDrawing is ' + isDrawing)

    if (ToolRef.current == Tools.Brush) {
      isDrawing = true
      var rect = document.getElementById(CanvasLayerId)?.getBoundingClientRect()

      if (rect) {
        var points1 = ` ${e.clientX - rect.left},${e.clientY - rect.top}`
        const polylineelement = (
          <PolyLineSVG
            points={points1}
            ref={ActivePolyLineRef}
            ToolRef={ToolRef}
          />
        )
        changePolyLineList([...PolyLineList, polylineelement])
      }
    }
    // console.log(points1)
  }

  function MouseMoveHandle(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    // console.log('mouse moved but isDrawing is ' + isDrawing)

    if (ToolRef.current == Tools.Brush && isDrawing) {
      var rect = document.getElementById(CanvasLayerId)?.getBoundingClientRect()
      var points1 = ActivePolyLineRef.current?.getAttribute('points')
      if (rect) {
        points1 += ` ${e.clientX - rect.left},${e.clientY - rect.top}`
        ActivePolyLineRef.current?.setAttribute(
          'points',
          points1 ? points1 : ''
        )
      }
    }
  }

  // function MouseOutHandle() {
  //   console.log('mouseOut')
  //   if (toolRef.current == Tools.Brush) isDrawing = false
  // }

  function MouseUpHandle() {
    console.log('mouseUp')
    if (ToolRef.current == Tools.Brush) isDrawing = false
  }
}

interface PolyLineSVGProps {
  points: string
  ToolRef: React.MutableRefObject<Tools>
}
const PolyLineSVG = forwardRef(
  (
    { points, ToolRef }: PolyLineSVGProps,
    ref: ForwardedRef<SVGPolylineElement>
  ) => {
    const id = useId()
    return (
      <svg
        height={'100%'}
        width={'100%'}
        style={{ position: 'absolute', pointerEvents: 'none' }}
      >
        <g>
          <polyline
            id={id}
            points={points}
            style={{
              strokeWidth: '5px',
              stroke: 'red',
              fill: 'none',
              color: 'red',
              pointerEvents: 'all',
            }}
            ref={ref}
            onMouseMove={() => {
              // console.log(ToolRef.current, Tools.Eraser)
              if (ToolRef.current == Tools.Eraser)
                console.log(
                  `mousemoved with tool clicked on ${(ToolRef.current, id)}`
                )
              // points = []
              // if (ToolRef.current == Tools.Eraser) {
              //   ref?.current?.setAttribute(points, '')
              // }
            }}
          ></polyline>
        </g>
      </svg>
    )
  }
)
