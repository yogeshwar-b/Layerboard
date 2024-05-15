import '../styles/utils.css'
import '../styles/board.css'
import { Tools } from '../enums/tools'
import { useEffect, useRef } from 'react'

interface BoardProps {
  className: string
  toolState: Tools
}
export const Board = (props: BoardProps) => {
  const cursor = props.toolState == Tools.Brush ? ' board brush-hover' : ''
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef<boolean>(false)
  let prevX = 0
  let prevY = 0
  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.parentElement?.getBoundingClientRect()
      if (rect) {
        canvasRef.current.height = (rect?.bottom - rect?.top) * 0.98
        canvasRef.current.width = (rect?.right - rect?.left) * 0.98
      }
    }
  })
  return (
    <div className={props.className + cursor}>
      <canvas
        className='canvas-1'
        ref={canvasRef}
        onMouseDown={(e) => {
          if (props.toolState == Tools.Brush) {
            isDrawing.current = true
            if (canvasRef.current) {
              const rect: DOMRect = canvasRef.current?.getBoundingClientRect()
              prevX = e.clientX - rect.left
              prevY = e.clientY - rect.top
            }
          }
        }}
        onMouseMove={(e) => {
          if (isDrawing.current) {
            const ctx: CanvasRenderingContext2D | null = canvasRef.current
              ? canvasRef.current.getContext('2d')
              : null
            if (canvasRef.current) {
              const rect: DOMRect = canvasRef.current?.getBoundingClientRect()
              const currX = e.clientX - rect.left
              const currY = e.clientY - rect.top
              if (!ctx) return
              ctx.beginPath()
              ctx.moveTo(prevX, prevY)
              ctx.lineTo(currX, currY)
              ctx.strokeStyle = 'black'
              ctx.lineWidth = 2
              ctx.stroke()
              prevX = currX
              prevY = currY
            }
          }
        }}
        onMouseUp={() => {
          isDrawing.current = false
        }}
        onMouseOut={() => {
          isDrawing.current = false
        }}
      ></canvas>
    </div>
  )
}
