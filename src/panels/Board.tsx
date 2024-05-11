import '../styles/utils.css'
import '../styles/board.css'
import { Tools } from '../enums/tools'
import { useRef } from 'react'

interface BoardProps {
  className: string
  toolState: Tools
}
export const Board = (props: BoardProps) => {
  const cursor = props.toolState == Tools.Brush ? ' board brush-hover' : ''
  const canvasRef = useRef<HTMLCanvasElement>(null)
  return (
    <div className={props.className + cursor}>
      <canvas
        style={{ aspectRatio: 'auto 300/300' }}
        width={300}
        height={300}
        ref={canvasRef}
        onClick={() => {
          if (props.toolState == Tools.Brush) {
            const ctx: CanvasRenderingContext2D | null = canvasRef.current
              ? canvasRef.current.getContext('2d')
              : null
            if (!ctx) return
            drawHouse(ctx)
          }
        }}
      ></canvas>
    </div>
  )
}

function drawHouse(ctx: CanvasRenderingContext2D) {
  // Set line width
  ctx.lineWidth = 10

  // Wall
  ctx.strokeRect(75, 140, 150, 110)

  // Door
  ctx.fillRect(130, 190, 40, 60)

  // Roof
  ctx.beginPath()
  ctx.moveTo(50, 140)
  ctx.lineTo(150, 60)
  ctx.lineTo(250, 140)
  ctx.closePath()
  ctx.stroke()
}
