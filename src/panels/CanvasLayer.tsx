import { MutableRefObject, ReactNode, RefObject, useRef, useState } from 'react'
import { Tools } from '../enums/tools'
import { CanvasIdPrefix } from '../constants'
import '../styles/svg.css'
import '../styles/canvaslayer.css'

var offsetX = 0,
  offsetY = 0
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
  const ActivePolyLineRef = useRef<RefObject<SVGPolylineElement> | null>(null)
  const [PolyLineList, changePolyLineList] = useState<Array<ReactNode>>([])
  const isToolActive = useRef<boolean>(false)
  const [MoveToolOverlay, changeMoveToolOverlay] = useState<MoveToolOverlay>({
    ShowMoveToolOverlay: false,
    PolyLineRef: null,
    name: ''
  })
  const CanvasLayerId = CanvasIdPrefix + canvasId

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
          // draggable='true'
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
          onPointerDown={(e) => {
            //True if Tool is not None
            isToolActive.current = ToolRef.current != Tools.None
            if (ToolRef.current == Tools.Move) {
              let draggableDiv = e.target as HTMLDivElement
              offsetX = e.clientX - draggableDiv.offsetLeft
              offsetY = e.clientY - draggableDiv.offsetTop
              setIsMoving(true)
              console.log('move activated')
            }
          }}
          onPointerMove={(e: React.MouseEvent) => {
            if (ToolRef.current == Tools.Move && isMoving.current) {
              {
                const draggableDiv: HTMLDivElement = e.target as HTMLDivElement
                let oldLeft: Number = Number(
                  draggableDiv.style.left.slice(0, -2)
                )
                let oldTop: Number = Number(draggableDiv.style.top.slice(0, -2))
                draggableDiv.style.left = `${e.clientX - offsetX}px`
                draggableDiv.style.top = `${e.clientY - offsetY}px`

                if (MoveToolOverlay.PolyLineRef?.current) {
                  var numberPattern = /-?\d+\.?\d+|\d+/g

                  let matrix: Array<Number> | undefined =
                    MoveToolOverlay.PolyLineRef.current.style.transform
                      .match(numberPattern)
                      ?.map(Number)

                  if (matrix && matrix.length > 5) {
                    matrix[4] =
                      Number(e.clientX) -
                      Number(offsetX) -
                      Number(oldLeft) +
                      Number(matrix[4])
                    matrix[5] =
                      Number(e.clientY) -
                      Number(offsetY) -
                      Number(oldTop) +
                      Number(matrix[5])
                    MoveToolOverlay.PolyLineRef.current.style.transform = `matrix(${matrix.join(
                      ','
                    )})`
                  }
                }
              }
            }
          }}
          onPointerUp={() => {
            setIsMoving(false)
            console.log('is moving deactivated')
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

      let points1 = ActivePolyLineRef?.current?.current?.getAttribute('points')
      if (rect) {
        points1 += ` ${e.clientX - rect.left},${e.clientY - rect.top}`
        ActivePolyLineRef?.current?.current?.setAttribute(
          'points',
          points1 ? points1 : ''
        )
      }
    }
  }

  function MouseUpHandle() {
    isToolActive.current = false
  }
}

interface PolyLineSVGProps {
  points: string
  ToolRef: React.MutableRefObject<Tools>
  isToolActive: React.MutableRefObject<boolean>
  name: string
  changeMoveToolOverlay: React.Dispatch<React.SetStateAction<MoveToolOverlay>>
  ActivePolyLineRef: MutableRefObject<RefObject<SVGPolylineElement> | null>
}
const PolyLineSVG = ({
  points,
  ToolRef,
  isToolActive,
  name,
  changeMoveToolOverlay,
  ActivePolyLineRef
}: PolyLineSVGProps) => {
  const newPolyLineRef = useRef<SVGPolylineElement>(null)
  // PolylinesRef.current = [...PolylinesRef.current, newPolyLineRef]
  ActivePolyLineRef.current = newPolyLineRef
  return (
    <svg
      height={'100%'}
      width={'100%'}
      style={{ position: 'absolute', pointerEvents: 'none' }}
      onPointerMove={(e: React.MouseEvent) => {
        if (isToolActive.current && ToolRef.current == Tools.Eraser) {
          ;(e.target as SVGPolylineElement).points.clear()
        }
      }}
    >
      <g>
        {/* isMoving?<div>something moving</div> */}
        <polyline
          points={points}
          className='poly-line'
          ref={newPolyLineRef}
          style={{ transform: 'matrix(1, 0, 0, 1, 0, 0)' }}
          name={name}
          onPointerDown={() => {
            //True if Tool is not None
            isToolActive.current = ToolRef.current != Tools.None
            if (ToolRef.current == Tools.Move) {
              changeMoveToolOverlay({
                ShowMoveToolOverlay: true,
                PolyLineRef: newPolyLineRef,
                name: name
              })
            }
          }}
        ></polyline>
      </g>
    </svg>
  )
}
