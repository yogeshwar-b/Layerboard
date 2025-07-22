import { RefObject, useEffect, useReducer, useRef, useState } from 'react'
import { Tools } from '../enums/tools'
import { CanvasIdPrefix } from '../constants'
import { ToolProperties } from './Toolbox'
import { CanvasState } from './CanvasContainer'

interface CanvasLayerProps {
  canvasState: CanvasState
  ToolState: ToolProperties
}

interface polyLineState {
  points: string
  id: string
  strokeWidth: number
  strokeColor: string
  translateX: number
  translateY: number
}

type Action =
  | { type: 'add'; polyLineState: polyLineState }
  | { type: 'translate'; index: number; dx: number; dy: number }
  | { type: 'erase'; index: number }

export const CanvasLayer = ({
  canvasState: { Id: canvasId, isVisible },
  ToolState
}: CanvasLayerProps) => {
  useEffect(() => {
    if (ToolState.tool != Tools.Move) {
      selectedPolylineIndexRef.current = -1
      setSelectedIndex(-1)
    }
  }, [ToolState])

  const svgRef = useRef<SVGSVGElement>(null)
  const isDrawing = useRef(false)
  const isDragging = useRef(false)
  const isErasing = useRef(false)
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const points = useRef<string>('')

  const polylinesRef = useRef<(SVGPolylineElement | null)[]>([])
  const selectedPolylineIndexRef = useRef<number>(-1)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  const [polylineStates, dispatch] = useReducer(polylineReducer, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (ToolState.tool == Tools.Brush && !isDrawing.current) {
      isDrawing.current = true
      points.current = getRelativePoint(e)
      dispatch({
        type: 'add',
        polyLineState: {
          id: crypto.randomUUID(),
          points: points.current,
          strokeWidth: ToolState.size || 2,
          strokeColor: ToolState.color || 'Black',
          translateX: 0,
          translateY: 0
        }
      })
    }

    if (ToolState.tool == Tools.Move) {
      const index = selectedPolylineIndexRef.current
      if (index >= 0) {
        isDragging.current = true
        const { x, y } = getMouseCoords(e)
        dragStart.current = { x, y }
      }
    }
    if (ToolState.tool == Tools.Eraser) {
      isErasing.current = true
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing.current && ToolState.tool == Tools.Brush) {
      const newPoint = getRelativePoint(e)
      points.current += ` ${newPoint}`
      requestAnimationFrame(() => {
        polylinesRef.current[polylinesRef.current.length - 1]?.setAttribute(
          'points',
          points.current
        )
      })
    }

    if (isDragging.current && ToolState.tool == Tools.Move) {
      const index = selectedPolylineIndexRef.current
      if (index >= 0) {
        const { x, y } = getMouseCoords(e)
        const dx = x - dragStart.current.x
        const dy = y - dragStart.current.y
        dragStart.current = { x, y }

        dispatch({
          type: 'translate',
          index,
          dx,
          dy
        })
      }
    }
    if (isErasing.current && ToolState.tool == Tools.Eraser) {
    }
  }

  const handleMouseUp = () => {
    if (ToolState.tool == Tools.Brush) {
      isDrawing.current = false
    }

    if (ToolState.tool == Tools.Move) {
      isDragging.current = false
    }
    if (ToolState.tool == Tools.Eraser) {
      isErasing.current = false
    }
  }

  const getRelativePoint = (e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return ''
    return `${e.clientX - rect.left},${e.clientY - rect.top}`
  }

  const getMouseCoords = (e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect()
    return {
      x: e.clientX - (rect?.left ?? 0),
      y: e.clientY - (rect?.top ?? 0)
    }
  }

  return (
    <svg
      ref={svgRef}
      className={`absolute h-full w-full ${isVisible ? '' : 'hidden'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      id={CanvasIdPrefix + canvasId}
    >
      {polylineStates.map((state, index) => (
        <g key={state.id}>
          {selectedIndex == index && (
            <MoveBoxSVG polylinesRef={polylinesRef} polylineIndex={index} />
          )}
          <polyline
            points={state.points}
            ref={(el) => {
              if (el) polylinesRef.current[index] = el
            }}
            className={`fill-none ${
              selectedIndex == index && ToolState.tool == Tools.Move
                ? 'pointer-events-none'
                : ToolState.tool == Tools.Move
                  ? 'pointer-events-auto hover:cursor-pointer'
                  : ''
            }`}
            style={{
              strokeWidth: state.strokeWidth,
              stroke: state.strokeColor,
              translate: `${state.translateX}px ${state.translateY}px`
            }}
            onClick={(e) => {
              if (ToolState.tool == Tools.Move) {
                selectedPolylineIndexRef.current = index
                setSelectedIndex(index)
                e.stopPropagation()
              }
            }}
            onMouseEnter={(e) => {
              if (ToolState.tool == Tools.Eraser && isErasing.current) {
                dispatch({
                  type: 'erase',
                  index
                })
                e.stopPropagation()
              }
            }}
          />
        </g>
      ))}
    </svg>
  )

  function polylineReducer(
    polylines: polyLineState[],
    action: Action
  ): polyLineState[] {
    switch (action.type) {
      case 'add':
        return [...polylines, action.polyLineState]
      case 'translate':
        return polylines.map((poly, i) => {
          if (i !== action.index) return poly
          return {
            ...poly,
            translateX: poly.translateX + action.dx,
            translateY: poly.translateY + action.dy
          }
        })
      case 'erase':
        return polylines.filter((_, i) => i !== action.index)
      default:
        return polylines
    }
  }
}

const MoveBoxSVG = ({
  polylinesRef,
  polylineIndex
}: {
  polylinesRef: RefObject<(SVGPolylineElement | null)[]>
  polylineIndex: number
}) => {
  const polylineRect =
    polylinesRef.current[polylineIndex]?.getBoundingClientRect()
  // console.log(polylineRect)
  return (
    <svg className='absolute fill-blue-50 opacity-75 hover:cursor-move'>
      <rect
        width={polylineRect?.width}
        height={polylineRect?.height}
        x={polylineRect?.x}
        y={polylineRect?.y}
        stroke-width='1.5'
        stroke='lightsteelblue'
      />
    </svg>
  )
}
