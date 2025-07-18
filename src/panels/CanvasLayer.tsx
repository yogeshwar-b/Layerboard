import { RefObject, useReducer, useRef } from 'react'
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
        strokeWidth: ToolPropertiesRef.current?.size || 2,
        strokeColor: ToolPropertiesRef.current?.color || 'Black'
      }
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing.current) return

    const newPoint = getRelativePoint(e)
    points.current += ` ${newPoint}`
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
      className='absolute h-full w-full'
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      id={CanvasIdPrefix + canvasId}
    >
      {polylineStates.map((state, index) => {
        return (
          <polyline
            points={state.points}
            key={index}
            ref={(el) => {
              if (el) polylinesRef.current[index] = el
            }}
            className={`fill-none stroke-black ${ToolState == Tools.Move ? 'cursor-move' : ''}`}
            style={{
              strokeWidth: state.strokeWidth,
              stroke: state.strokeColor
            }}
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
