import { RefObject, useReducer, useRef, useState } from 'react'
import { Tools } from '../enums/tools'
import { CanvasIdPrefix } from '../constants'
import { ToolProperties } from './Toolbox'

interface CanvasLayerProps {
  canvasId: string
  ToolPropertiesRef: RefObject<ToolProperties>
  ToolState: Tools
}

interface polyLineState {
  points: string
  strokeWidth: number
  strokeColor: string
  translateX: number
  translateY: number
}

type Action =
  | { type: 'add'; polyLineState: polyLineState }
  | { type: 'translate'; index: number; dx: number; dy: number }

export const CanvasLayer = ({
  canvasId,
  ToolPropertiesRef,
  ToolState
}: CanvasLayerProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const isDrawing = useRef(false)
  const isDragging = useRef(false)
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const points = useRef<string>('')

  const polylinesRef = useRef<(SVGPolylineElement | null)[]>([])
  const selectedPolylineIndexRef = useRef<number>(-1)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const [polylineStates, dispatch] = useReducer(polylineReducer, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (ToolState == Tools.Brush && !isDrawing.current) {
      isDrawing.current = true
      points.current = getRelativePoint(e)
      dispatch({
        type: 'add',
        polyLineState: {
          points: points.current,
          strokeWidth: ToolPropertiesRef.current?.size || 2,
          strokeColor: ToolPropertiesRef.current?.color || 'Black',
          translateX: 0,
          translateY: 0
        }
      })
    }

    if (ToolState == Tools.Move) {
      const index = selectedPolylineIndexRef.current
      if (index >= 0) {
        isDragging.current = true
        const { x, y } = getMouseCoords(e)
        dragStart.current = { x, y }
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing.current && ToolState == Tools.Brush) {
      const newPoint = getRelativePoint(e)
      points.current += ` ${newPoint}`
      requestAnimationFrame(() => {
        polylinesRef.current[polylinesRef.current.length - 1]?.setAttribute(
          'points',
          points.current
        )
      })
    }

    if (isDragging.current && ToolState == Tools.Move) {
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
  }

  const handleMouseUp = () => {
    if (ToolState == Tools.Brush) {
      isDrawing.current = false
    }

    if (ToolState == Tools.Move) {
      isDragging.current = false
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
      className='absolute h-full w-full'
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      id={CanvasIdPrefix + canvasId}
    >
      {polylineStates.map((state, index) => (
        <polyline
          key={index}
          points={state.points}
          ref={(el) => {
            if (el) polylinesRef.current[index] = el
          }}
          className={`fill-none ${
            selectedIndex == index && ToolState == Tools.Move
              ? 'outline-2 outline-offset-3 outline-blue-400'
              : ''
          }`}
          style={{
            strokeWidth: state.strokeWidth,
            stroke: state.strokeColor,
            translate: `${state.translateX}px ${state.translateY}px`,
            pointerEvents: 'visibleStroke'
          }}
          onMouseDown={(e) => {
            if (ToolState == Tools.Move) {
              selectedPolylineIndexRef.current = index
              setSelectedIndex(index)
              e.stopPropagation()
            }
          }}
        />
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
      default:
        return polylines
    }
  }
}
