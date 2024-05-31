import { ForwardedRef, ReactNode, forwardRef, useRef, useState } from 'react'
import { Tools } from '../enums/tools'
import { CanvasIdPrefix } from '../constants'

interface CanvasLayerProps {
  canvasId: string
  ToolRef: React.MutableRefObject<Tools>
  className: string
}

export const CanvasLayer = ({ canvasId, ToolRef }: CanvasLayerProps) => {
  const ActivePolyLineRef = useRef<SVGPolylineElement>(null)
  const [PolyLineList, changePolyLineList] = useState<Array<ReactNode>>([])
  const isToolActive = useRef<boolean>(false)

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
    isToolActive.current = true

    if (ToolRef.current == Tools.Brush) {
      var rect = document.getElementById(CanvasLayerId)?.getBoundingClientRect()

      if (rect) {
        var points1 = ` ${e.clientX - rect.left},${e.clientY - rect.top}`
        const polylineelement = (
          <PolyLineSVG
            points={points1}
            ref={ActivePolyLineRef}
            ToolRef={ToolRef}
            isToolActive={isToolActive}
            //These are the line components so the key will never be used and does not matter
            key={PolyLineList.length + 1}
          />
        )
        changePolyLineList([...PolyLineList, polylineelement])
      }
    }
  }

  function MouseMoveHandle(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    // console.log('mouse moved but isDrawing is ' + isDrawing)

    if (ToolRef.current == Tools.Brush && isToolActive.current) {
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
    isToolActive.current = false
  }
}

interface PolyLineSVGProps {
  points: string
  ToolRef: React.MutableRefObject<Tools>
  isToolActive: React.MutableRefObject<boolean>
}
const PolyLineSVG = forwardRef(
  (
    { points, ToolRef, isToolActive }: PolyLineSVGProps,
    ref: ForwardedRef<SVGPolylineElement>
  ) => {
    return (
      <svg
        height={'100%'}
        width={'100%'}
        style={{ position: 'absolute', pointerEvents: 'none' }}
      >
        <g>
          <polyline
            points={points}
            style={{
              strokeWidth: '5px',
              stroke: 'red',
              fill: 'none',
              color: 'red',
              pointerEvents: 'all'
            }}
            ref={ref}
            onMouseDown={() => {
              //True if Tool is not None
              isToolActive.current = ToolRef.current != Tools.None
            }}
            onMouseMove={(e: React.MouseEvent) => {
              if (isToolActive.current && ToolRef.current == Tools.Eraser) {
                ;(e.target as SVGPolylineElement).points.clear()
              }
            }}
          ></polyline>
        </g>
      </svg>
    )
  }
)
