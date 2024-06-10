import {
  ForwardedRef,
  MutableRefObject,
  ReactNode,
  RefObject,
  forwardRef,
  useEffect,
  useRef,
  useState
} from 'react'
import { Tools } from '../enums/tools'
import { CanvasIdPrefix } from '../constants'
import '../styles/svg.css'
import '../styles/canvaslayer.css'
var xdef = -1
var ydef = -1
interface CanvasLayerProps {
  canvasId: string
  ToolRef: React.MutableRefObject<Tools>
  className: string
}
interface MoveToolOverlay {
  ShowMoveToolOverlay: boolean
  PolyLineRef: RefObject<SVGPolylineElement> | null
  name: string
}
export const CanvasLayer = ({ canvasId, ToolRef }: CanvasLayerProps) => {
  const ActivePolyLineRef = useRef(null)
  // const PolylinesRef = useRef([])
  const [PolyLineList, changePolyLineList] = useState<Array<ReactNode>>([])
  const isToolActive = useRef<boolean>(false)
  const [MoveToolOverlay, changeMoveToolOverlay] = useState<MoveToolOverlay>({
    ShowMoveToolOverlay: false,
    PolyLineRef: null,
    name: ''
  })
  const CanvasLayerId = CanvasIdPrefix + canvasId
  useEffect(() => {
    if (MoveToolOverlay.ShowMoveToolOverlay) {
      console.log(
        `layerUseEffect ${
          MoveToolOverlay.name
        } is activated ${MoveToolOverlay.PolyLineRef?.current.getAttribute(
          'name'
        )}  ${
          MoveToolOverlay.PolyLineRef?.current?.getBoundingClientRect().height
        } ${
          MoveToolOverlay.PolyLineRef?.current?.getBoundingClientRect().width
        }`
      )
    }
  })
  const isMoving = useRef(false)
  function setIsMoving(val: boolean) {
    isMoving.current = val
  }
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
      {MoveToolOverlay.ShowMoveToolOverlay ? (
        <div
          draggable='true'
          className='move-overlay'
          style={{
            zIndex: 120,
            height:
              MoveToolOverlay.PolyLineRef?.current?.getBoundingClientRect()
                .height,
            width:
              MoveToolOverlay.PolyLineRef?.current?.getBoundingClientRect()
                .width,
            top: MoveToolOverlay.PolyLineRef?.current?.getBoundingClientRect()
              .top,
            left: MoveToolOverlay.PolyLineRef?.current?.getBoundingClientRect()
              .left,
            transform: 'matrix(1, 0, 0, 1, 0, 0)'
          }}
          onPointerDown={(e: React.MouseEvent) => {
            //True if Tool is not None
            isToolActive.current = ToolRef.current != Tools.None
            if (ToolRef.current == Tools.Move) {
              xdef = e.clientX
              ydef = e.clientY
              setIsMoving(true)
            }
          }}
          onDrag={(e: React.MouseEvent) => {
            if (isToolActive.current && ToolRef.current == Tools.Eraser) {
              ;(e.target as SVGPolylineElement).points.clear()
            }
            if (ToolRef.current == Tools.Move) {
              if (isMoving.current) {
                console.log(`${e.clientX} ${e.clientY}`)

                var x = window.getComputedStyle(e.target, null).transform
                var numberPattern = /-?\d+\.?\d+|\d+/g
                var { top, left, bottom, right, height, width } =
                  e.target.getBoundingClientRect()
                var matrix = x.match(numberPattern)
                // console.log(x, window.getComputedStyle(e.target, null))
                var transx = e.clientX - xdef
                var transy = e.clientY - ydef
                xdef = e.clientX
                ydef = e.clientY
                matrix[4] = transx + Number(matrix[4])
                matrix[5] = transy + Number(matrix[5])
                // console.log(transx, transy);
                // console.log(xdef, ydef, transx, transy)
                e.target.style.transform = `matrix(${matrix.join(',')})`
                if (MoveToolOverlay.PolyLineRef?.current)
                  MoveToolOverlay.PolyLineRef.current.style.transform = `matrix(${matrix.join(
                    ','
                  )})`
              }
            }
          }}
          onDragEnd={(e: React.MouseEvent) => {
            if (isToolActive.current && ToolRef.current == Tools.Eraser) {
              ;(e.target as SVGPolylineElement).points.clear()
            }
            if (ToolRef.current == Tools.Move) {
              if (isMoving.current) {
                // console.log(`${e.clientX} ${e.clientY}`);

                var x = window.getComputedStyle(e.target, null).transform
                var numberPattern = /-?\d+\.?\d+|\d+/g
                var { top, left, bottom, right, height, width } =
                  e.target.getBoundingClientRect()
                var matrix = x.match(numberPattern)
                // console.log(x, window.getComputedStyle(e.target, null))
                var transx = e.clientX - xdef
                var transy = e.clientY - ydef
                xdef = e.clientX
                ydef = e.clientY
                matrix[4] = transx + Number(matrix[4])
                matrix[5] = transy + Number(matrix[5])
                // console.log(transx, transy);
                // console.log(xdef, ydef, transx, transy)
                e.target.style.transform = `matrix(${matrix.join(',')})`
                if (MoveToolOverlay.PolyLineRef?.current)
                  MoveToolOverlay.PolyLineRef.current.style.transform = `matrix(${matrix.join(
                    ','
                  )})`
              }
            }
          }}
          onPointerUp={() => {
            console.log('is moving deactivated')
            // xdef = -1
            // ydef = -1
            setIsMoving(false)
          }}
        ></div>
      ) : (
        <></>
      )}
      {PolyLineList.map((i) => {
        return i
      })}
    </div>
  )
  function MouseDownHandle(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    // console.log('mouse moved but isDrawing is ' + isDrawing)
    isToolActive.current = true

    if (ToolRef.current == Tools.Brush) {
      const rect = document
        .getElementById(CanvasLayerId)
        ?.getBoundingClientRect()

      if (rect) {
        const points1 = ` ${e.clientX - rect.left},${e.clientY - rect.top}`
        // PolylinesRef.current = [...PolylinesRef.current, useRef(null)]
        const polylineelement = (
          <PolyLineSVG
            points={points1}
            // ref={(el) => (PolylinesRef.current = [...PolylinesRef.current, el])}
            // PolylinesRef={PolylinesRef}
            ActivePolyLineRef={ActivePolyLineRef}
            ToolRef={ToolRef}
            setIsMoving={setIsMoving}
            isToolActive={isToolActive}
            changeMoveToolOverlay={changeMoveToolOverlay}
            //random string name
            name={String(PolyLineList.length)}
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
      const rect = document
        .getElementById(CanvasLayerId)
        ?.getBoundingClientRect()

      let points1 = ActivePolyLineRef?.current?.current.getAttribute('points')
      if (rect) {
        points1 += ` ${e.clientX - rect.left},${e.clientY - rect.top}`
        ActivePolyLineRef?.current?.current.setAttribute(
          'points',
          points1 ? points1 : ''
        )

        // let points1 =
        //   PolylinesRef.current[
        //     PolylinesRef.current.length - 1
        //   ]?.current.getAttribute('points')
        // if (rect) {
        //   points1 += ` ${e.clientX - rect.left},${e.clientY - rect.top}`
        //   PolylinesRef.current[
        //     PolylinesRef.current.length - 1
        //   ]?.current.setAttribute('points', points1 ? points1 : '')
      }
    }
  }

  // function MouseOutHandle() {
  //   console.log('mouseOut')
  //   if (toolRef.current == Tools.Brush) isDrawing = false
  // }

  function MouseUpHandle() {
    isToolActive.current = false
    // PolylinesRef.current[PolylinesRef.current.length - 1]?.classList.add(
    //   'poly-line-done'
    // )
  }
}

interface PolyLineSVGProps {
  points: string
  ToolRef: React.MutableRefObject<Tools>
  isToolActive: React.MutableRefObject<boolean>
  name: string
  changeMoveToolOverlay: React.Dispatch<React.SetStateAction<MoveToolOverlay>>
}
const PolyLineSVG = forwardRef(
  (
    {
      points,
      ToolRef,
      isToolActive,
      name,
      changeMoveToolOverlay,
      PolylinesRef,
      ActivePolyLineRef,
      setIsMoving
    }: PolyLineSVGProps,
    ref: ForwardedRef<SVGPolylineElement>
  ) => {
    const newPolyLineRef = useRef(null)
    // PolylinesRef.current = [...PolylinesRef.current, newPolyLineRef]
    ActivePolyLineRef.current = newPolyLineRef
    return (
      <svg
        height={'100%'}
        width={'100%'}
        style={{ position: 'absolute', pointerEvents: 'none' }}
      >
        <g>
          {/* isMoving?<div>something moving</div> */}
          <polyline
            points={points}
            className='poly-line'
            ref={newPolyLineRef}
            name={name}
            onPointerDown={(e: React.MouseEvent) => {
              //True if Tool is not None
              isToolActive.current = ToolRef.current != Tools.None
              if (ToolRef.current == Tools.Move) {
                console.log(
                  `ismoving activated on  + ${e.target.getAttribute(
                    'name'
                  )} ${newPolyLineRef.current.getAttribute('name')}`
                )
                changeMoveToolOverlay({
                  ShowMoveToolOverlay: true,
                  PolyLineRef: newPolyLineRef,
                  name: name
                })
                // xdef = e.clientX
                // ydef = e.clientY
                // setIsMoving(true)
              }
            }}
            // onPointerMove={(e: React.MouseEvent) => {
            //   if (isToolActive.current && ToolRef.current == Tools.Eraser) {
            //     ;(e.target as SVGPolylineElement).points.clear()
            //   }
            //   if (ToolRef.current == Tools.Move) {
            //     if (isMoving.current) {
            //       // console.log(`${e.clientX} ${e.clientY}`);

            //       var x = window.getComputedStyle(e.target, null).transform
            //       var numberPattern = /-?\d+\.?\d+|\d+/g
            //       var { top, left, bottom, right, height, width } =
            //         e.target.getBoundingClientRect()
            //       var matrix = x.match(numberPattern)
            //       // console.log(x, window.getComputedStyle(e.target, null))
            //       var transx = e.clientX - xdef
            //       var transy = e.clientY - ydef
            //       xdef = e.clientX
            //       ydef = e.clientY
            //       matrix[4] = transx + Number(matrix[4])
            //       matrix[5] = transy + Number(matrix[5])
            //       // console.log(transx, transy);
            //       console.log(xdef, ydef, transx, transy)
            //       e.target.style.transform = `matrix(${matrix.join(',')})`
            //     }
            //   }
            // }}
            // onPointerUp={() => {
            //   console.log('is moving deactivated')
            //   // xdef = -1
            //   // ydef = -1
            //   setIsMoving(false)
            // }}
          ></polyline>
        </g>
      </svg>
    )
  }
)
