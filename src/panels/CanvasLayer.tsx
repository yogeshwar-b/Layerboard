import { ReactNode, RefObject, useReducer, useRef, useState } from 'react'
import { Tools } from '../enums/tools'
import { CanvasIdPrefix } from '../constants'
import { ToolProperties } from './Toolbox'

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
interface polyLineState {
  points: string
  strokeWidth: number
}
export const CanvasLayer = ({
  canvasId,
  ToolPropertiesRef,
  ToolState
}: CanvasLayerProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const isDrawing = useRef(false)
  const points = useRef<string>('')
  const polylinesRef = useRef<(SVGPolylineElement | null)[]>([])
  // const [polylines, setPolylines] = useState<string[]>([])
  const [polylineStates, dispatch] = useReducer(polylineReducer, [])
  const handleMouseDown = (e: React.MouseEvent) => {
    isDrawing.current = true
    points.current = getRelativePoint(e)
    dispatch({
      type: 'add',
      polyLineState: {
        points: points.current,
        strokeWidth: ToolPropertiesRef.current?.size || 2
      }
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing.current) return

    const newPoint = getRelativePoint(e)
    points.current += ` ${newPoint}`
    console.log('points are', points.current)
    requestAnimationFrame(() => {
      polylinesRef.current[polylinesRef.current.length - 1]?.setAttribute(
        'points',
        points.current
      )
    })
  }

  const handleMouseUp = () => {
    isDrawing.current = false
  }

  const getRelativePoint = (e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return ''
    return `${e.clientX - rect.left},${e.clientY - rect.top}`
  }

  return (
    <svg
      ref={svgRef}
      className='h-full w-full'
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {polylineStates.map((state, index) => {
        return (
          <polyline
            points={state.points}
            key={index}
            ref={(el) => {
              if (el) polylinesRef.current[index] = el
            }}
            className={`fill-none stroke-black`}
            style={{ strokeWidth: state.strokeWidth }}
          ></polyline>
        )
      })}
    </svg>
  )
  interface action {
    type: string
    polyLineState: polyLineState
  }
  function polylineReducer(polylines: polyLineState[], action: action) {
    switch (action.type) {
      case 'add':
        return [...polylines, action.polyLineState]
      default:
        return polylines
    }
  }
}
