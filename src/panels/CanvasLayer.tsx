import { ReactNode, RefObject, useEffect, useRef, useState } from 'react'
import { Tools } from '../enums/tools'
import { CanvasIdPrefix } from '../constants'
import { ToolProperties } from './Toolbox'

var offsetX = 0,
  offsetY = 0
interface CanvasLayerProps {
  canvasId: string
  className: string
  ToolPropertiesRef: React.RefObject<ToolProperties>
  ToolState: Tools
}
interface MoveToolOverlay {
  ShowMoveToolOverlay: boolean
  PolyLineRef: RefObject<SVGSVGElement | null> | null
  name: string
}
export const CanvasLayer = ({
  canvasId,
  ToolPropertiesRef,
  ToolState
}: CanvasLayerProps) => {
  const ActivePolyLineRef = useRef<RefObject<SVGSVGElement> | null>(null)
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
      className='absolute h-full w-full'
      onMouseDown={MouseDownHandle}
      onMouseMove={MouseMoveHandle}
      // onMouseOut={MouseOutHandle}
      onMouseUp={MouseUpHandle}
    >
      {MoveToolOverlay.ShowMoveToolOverlay ? (
        <div
          // draggable='true'
          className='absolute outline-2 outline-offset-3 outline-blue-600 outline-dashed'
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
            isToolActive.current = ToolPropertiesRef.current.tool != Tools.None
            if (ToolPropertiesRef.current.tool == Tools.Move) {
              let draggableDiv = e.target as HTMLDivElement
              offsetX = e.clientX - draggableDiv.offsetLeft
              offsetY = e.clientY - draggableDiv.offsetTop
              setIsMoving(true)
              console.log('move activated')
            }
          }}
          onPointerMove={(e: React.MouseEvent) => {
            if (
              ToolPropertiesRef.current.tool == Tools.Move &&
              isMoving.current
            ) {
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

    if (ToolPropertiesRef.current.tool == Tools.Brush) {
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
            isToolActive={isToolActive}
            changeMoveToolOverlay={changeMoveToolOverlay}
            //random string name
            name={String(PolyLineList.length)}
            //These are the line components so the key will never be used and does not matter
            key={PolyLineList.length + 1}
            ToolPropertiesRef={ToolPropertiesRef}
            ToolState={ToolState}
          />
        )

        changePolyLineList([...PolyLineList, polylineelement])
      }
    }
  }

  function MouseMoveHandle(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    // console.log('mouse moved is drawing ')

    if (ToolPropertiesRef.current.tool == Tools.Brush && isToolActive.current) {
      const rect = document
        .getElementById(CanvasLayerId)
        ?.getBoundingClientRect()

      const firstPolyline =
        ActivePolyLineRef?.current?.current?.querySelector('polyline')
      let points1 = firstPolyline?.getAttribute('points')

      if (rect) {
        // console.log('points1 is ', points1)
        points1 += ` ${e.clientX - rect.left},${e.clientY - rect.top}`
        ActivePolyLineRef?.current?.current
          ?.getElementsByTagName('polyline')[0]
          .setAttribute('points', points1 ? points1 : '')
      }
    }
  }

  function MouseUpHandle() {
    isToolActive.current = false
  }
}

interface PolyLineSVGProps {
  points: string
  isToolActive: React.RefObject<boolean>
  name: string
  changeMoveToolOverlay: React.Dispatch<React.SetStateAction<MoveToolOverlay>>
  ActivePolyLineRef: RefObject<RefObject<SVGSVGElement | null> | null>
  ToolPropertiesRef: React.RefObject<ToolProperties>
  ToolState: Tools
}
const PolyLineSVG = ({
  points,
  ToolPropertiesRef,
  isToolActive,
  name,
  changeMoveToolOverlay,
  ActivePolyLineRef,
  ToolState
}: PolyLineSVGProps) => {
  //@todo - Remove Use Effect
  useEffect(() => {
    console.log('inside useeffect polyline', ToolState)
  })

  const newSVGRef = useRef<SVGSVGElement>(null)
  // PolylinesRef.current = [...PolylinesRef.current, newPolyLineRef]
  ActivePolyLineRef.current = newSVGRef
  return (
    <svg
      height={'100%'}
      width={'100%'}
      style={{
        position: 'absolute',
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        stroke: ToolPropertiesRef.current.color,
        strokeWidth: ToolPropertiesRef.current.size,
        pointerEvents: 'none'
      }}
      onPointerMove={(e: React.MouseEvent) => {
        if (
          isToolActive.current &&
          ToolPropertiesRef.current.tool == Tools.Eraser
        ) {
          ;(e.target as SVGSVGElement)
            .getElementsByTagName('polyline')[0]
            .points.clear()
        } else {
          console.log('pointer is on it with Tool State-', Tools[ToolState])
        }
      }}
      ref={newSVGRef}
      name={name}
      onPointerDown={() => {
        //True if Tool is not None
        console.log(
          'pointer down on line ',
          name,
          ToolPropertiesRef.current.tool,
          Tools.Move
        )
        isToolActive.current = ToolPropertiesRef.current.tool != Tools.None
        if (ToolPropertiesRef.current.tool == Tools.Move) {
          changeMoveToolOverlay({
            ShowMoveToolOverlay: true,
            PolyLineRef: newSVGRef,
            name: name
          })
        }
      }}
    >
      <g>
        {/* isMoving?<div>something moving</div> */}
        <polyline
          points={points}
          className={`pointer-events-auto transform-none fill-none ${ToolState == Tools.Move ? 'hover:cursor-pointer' : ''}`}
        ></polyline>
      </g>
    </svg>
  )
}
