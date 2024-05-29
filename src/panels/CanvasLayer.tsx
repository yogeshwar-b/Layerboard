import { forwardRef, useRef, useState } from 'react'
import { Tools } from '../enums/tools'

interface CanvasLayerProps {
  canvasId: string
  toolRef: React.MutableRefObject<Tools>
  ActiveLayer: React.MutableRefObject<number>
  className: string
}

var isDrawing: boolean = false
var path2 = []

export const CanvasLayer = ({
  canvasId,
  toolRef,
  ActiveLayer,
  className
}: CanvasLayerProps) => {
  const ActivePolyLineRef = useRef<HTMLElement>(null)
  // const [PolyLineList, changePolyLineList] = useState([])
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
      {<PolyLineSVG ref={ActivePolyLineRef} points={''} />}
      {/* {PolyLineList.map((i) => {
        return i
      })} */}
    </div>
  )
  function MouseDownHandle(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    isDrawing = true
    path2 = []
    var rect = document.getElementById(CanvasLayerId)?.getBoundingClientRect()

    if (rect) {
      var points1 = ` ${e.clientX - rect.left},${e.clientY - rect.top}`
      document.getElementById('mypolyline')?.setAttribute('points', points1)
      // const polylineelement = (
      //   <PolyLineSVG points={points1} ref={ActivePolyLineRef} />
      // )
      // changePolyLineList([...PolyLineList, polylineelement])
    }
    // console.log(points1)
  }

  function MouseMoveHandle(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    console.log('mouse moved but isDrawing is ' + isDrawing)

    if (isDrawing) {
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
  //   console.log("mouseOut");
  //   isDrawing = false;
  // }

  function MouseUpHandle() {
    console.log('mouseUp')

    isDrawing = false
  }
}

const PolyLineSVG = forwardRef(({ points }, ref) => {
  return (
    <svg height={'100%'} width={'100%'}>
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
})
