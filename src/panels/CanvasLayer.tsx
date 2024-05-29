import { ForwardedRef, ReactNode, forwardRef, useRef, useState } from 'react'
import { Tools } from '../enums/tools'

interface CanvasLayerProps {
  canvasId: string
  toolRef: React.MutableRefObject<Tools>
  ActiveLayer: React.MutableRefObject<number>
  className: string
}

var isDrawing: boolean = false

export const CanvasLayer = ({
  canvasId,
  toolRef,
  ActiveLayer,
  className
}: CanvasLayerProps) => {
  const ActivePolyLineRef = useRef<SVGPolylineElement>(null)
  const [PolyLineList, changePolyLineList] = useState<Array<ReactNode>>([])
  let CanvasLayerId = 'DrawingBoard' + canvasId
  return (
    <div
      id={CanvasLayerId}
      className='drawing-board'
      onMouseDown={MouseDownHandle}
      onMouseMove={MouseMoveHandle}
      // onMouseOut={MouseOutHandle}
      onMouseUp={MouseUpHandle}
      style={{ height: '100%' }}
    >
      {PolyLineList.map((i) => {
        return i
      })}
    </div>
  )
  function MouseDownHandle(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (toolRef.current == Tools.Brush) {
      isDrawing = true
      var rect = document.getElementById(CanvasLayerId)?.getBoundingClientRect()

      if (rect) {
        var points1 = ` ${e.clientX - rect.left},${e.clientY - rect.top}`
        const polylineelement = (
          <PolyLineSVG points={points1} ref={ActivePolyLineRef} />
        )
        changePolyLineList([...PolyLineList, polylineelement])
      }
    }
    // console.log(points1)
  }

  function MouseMoveHandle(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    console.log('mouse moved but isDrawing is ' + isDrawing)

    if (toolRef.current == Tools.Brush && isDrawing) {
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
    if (toolRef.current == Tools.Brush) isDrawing = false
  }
}

interface PolyLineSVGProps {
  points: string
}
const PolyLineSVG = forwardRef(
  ({ points }: PolyLineSVGProps, ref: ForwardedRef<SVGPolylineElement>) => {
    return (
      <svg height={'100%'} width={'100%'} style={{ position: 'absolute' }}>
        <polyline
          id='mypolyline'
          points={points}
          style={{
            strokeWidth: '5px',
            stroke: 'red',
            fill: 'none',
            color: 'red'
          }}
          ref={ref}
        ></polyline>
      </svg>
    )
  }
)
