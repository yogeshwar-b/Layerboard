import { ReactNode, RefObject, useEffect, useRef, useState } from 'react'
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

export const CanvasLayer = ({
  canvasId,
  ToolPropertiesRef,
  ToolState
}: CanvasLayerProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const isDrawing = useRef(false)
  const points = useRef<string>('')
  const polylinesRef = useRef<(SVGPolylineElement | null)[]>([])
  const [polylines, setPolylines] = useState<string[]>([])
  const handleMouseDown = (e: React.MouseEvent) => {
    isDrawing.current = true
    points.current = getRelativePoint(e)
    setPolylines((prev) => [...prev, points.current])
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
      {polylines.map((line, index) => {
        return (
          <polyline
            points={line}
            key={index}
            ref={(el) => {
              if (el) polylinesRef.current[index] = el
            }}
            className='fill-none stroke-black stroke-2'
          ></polyline>
        )
      })}
    </svg>
  )
}
