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
  className,
}: CanvasLayerProps) => {
  return (
    <div
      id='DrawingBoard'
      className='drawing-board'
      onMouseDown={MouseDownHandle}
      onMouseMove={MouseMoveHandle}
      // onMouseOut={MouseOutHandle}
      onMouseUp={MouseUpHandle}
      style={{ height: '100%' }}
    >
      {<PolyLineSVG />}
    </div>
  )
  function MouseDownHandle(e) {
    isDrawing = true
    path2 = []
    var rect = document.getElementById('DrawingBoard').getBoundingClientRect()

    var points1 = document.getElementById('mypolyline').getAttribute('points')
    points1 = ` ${e.clientX - rect.left},${e.clientY - rect.top}`
    document.getElementById('mypolyline').setAttribute('points', points1)
    console.log(points1)
  }

  function MouseMoveHandle(e) {
    console.log('mouse moved but isDrawing is ' + isDrawing)

    if (isDrawing) {
      var rect = document.getElementById('DrawingBoard').getBoundingClientRect()
      var points1 = document.getElementById('mypolyline').getAttribute('points')
      points1 += ` ${e.clientX - rect.left},${e.clientY - rect.top}`
      document.getElementById('mypolyline').setAttribute('points', points1)
      // console.log(points1);
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

const PolyLineSVG = () => {
  return (
    <svg height={'100%'} width={'auto'}>
      <polyline
        id='mypolyline'
        points={''}
        style={{
          strokeWidth: '5px',
          stroke: 'red',
          fill: 'none',
          color: 'red',
        }}
      ></polyline>
    </svg>
  )
}
