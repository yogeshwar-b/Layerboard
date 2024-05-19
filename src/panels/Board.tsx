import '../styles/utils.css'
import '../styles/board.css'
import { Tools } from '../enums/tools'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react'
import React from 'react'

interface BoardProps {
  className: string
  toolRef: React.MutableRefObject<Tools>
}
export interface LayersHandle {
  addLayer: (layerName: string) => void
  deleteLayer: (layerName: string) => void
}

export const Board = React.memo(
  forwardRef<LayersHandle, BoardProps>(({ className, toolRef }, ref) => {
    const isDrawing = useRef<boolean>(false)
    const [layersList, dispatch]: [string[], React.Dispatch<action>] =
      useReducer(layersListReducer, ['1'])
    useImperativeHandle(ref, () => ({
      addLayer(layerName) {
        console.log('adding ' + layerName)
        dispatch({ type: 'add', layerName })
      },
      deleteLayer(layerName) {
        console.log('delete layer called')
        dispatch({ type: 'delete', layerName })
      },
    }))
    // useEffect(() => {
    //   if (canvasRef.current) {
    //     const rect = canvasRef.current.parentElement?.getBoundingClientRect()
    //     if (rect) {
    //       canvasRef.current.height = (rect?.bottom - rect?.top) * 0.98
    //       canvasRef.current.width = (rect?.right - rect?.left) * 0.98
    //     }
    //   }
    // })
    return (
      <div className={className}>
        {layersList.map((i) => {
          return (
            <BoardLayer isDrawing={isDrawing} toolRef={toolRef} layerName={i} />
          )
        })}
      </div>
    )
  })
)

interface action {
  type: string
  layerName: string
}
function layersListReducer(layersList: string[], action: action) {
  switch (action.type) {
    case 'add':
      return [...layersList, action.layerName]
    case 'delete':
      console.log(
        `delete layer reducer called deleting ${action.layerName} from ${layersList}`
      )

      return layersList.filter((x) => {
        if (x != action.layerName) {
          return x
        }
      })
    default:
      return layersList
  }
}

interface BoardLayerProps {
  isDrawing: React.MutableRefObject<boolean>
  toolRef: React.MutableRefObject<Tools>
  layerName: string
}
const BoardLayer = React.memo(
  ({ isDrawing, toolRef, layerName }: BoardLayerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    let prevX = 0
    let prevY = 0

    useEffect(() => {
      console.log('reloading ' + layerName)
      if (canvasRef.current) {
        const rect = canvasRef.current.parentElement?.getBoundingClientRect()
        if (rect) {
          canvasRef.current.height = (rect?.bottom - rect?.top) * 0.3
          canvasRef.current.width = (rect?.right - rect?.left) * 0.3
        }
      }
    })

    return (
      <canvas
        id={layerName}
        className='canvas-1 board'
        ref={canvasRef}
        onMouseDown={(e) => {
          if (toolRef.current == Tools.Brush) {
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
              ctx.closePath()
              ctx.save()
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
      />
    )
  }
)
