import { forwardRef, useImperativeHandle, useReducer } from 'react'
import { Tools } from '../enums/tools'
import '../styles/utils.css'
import '../styles/canvasbox.css'
import { CanvasLayer } from './CanvasLayer'

// type posRef = {
//   prevX: number
//   prevY: number
// }
export interface CanvasHandle {
  CanvasAdd: (name: string) => void
  CanvasDel: (name: string) => void
}
interface CanvasContainerProps {
  ToolRef: React.MutableRefObject<Tools>
  ActiveLayer: React.MutableRefObject<number>
}
export const CanvasContainer = forwardRef(
  ({ ToolRef, ActiveLayer }: CanvasContainerProps, ref) => {
    const [CanvasList, dispatch] = useReducer(CanvasReducer, ['1'])
    useImperativeHandle(ref, () => ({
      test() {
        console.log('testcalled')
      },
      CanvasDel(name: string) {
        console.log(`deleting ${name} from ${CanvasList}`)
        if (CanvasList.includes(name)) {
          dispatch({ type: 'delete', canvasName: name })
        } else {
          console.log('not found')
        }
      },
      CanvasAdd(name: string) {
        // console.log("testcalled");
        if (CanvasList.includes(name)) {
          dispatch({ type: 'add', canvasName: name + '(1)' })
        } else {
          dispatch({ type: 'add', canvasName: name })
        }
      },
    }))
    return (
      <div className='top-left pos-abs height-max width-max'>
        {CanvasList.map((c: string) => {
          return (
            <CanvasLayer
              className='top-left pos-abs'
              canvasId={c}
              key={c}
              toolRef={ToolRef}
              ActiveLayer={ActiveLayer}
            />
          )
        })}
      </div>
    )
  }
)

// interface CanvasBoxProps {
//   canvasId: string
//   toolRef: React.MutableRefObject<Tools>
//   ActiveLayer: React.MutableRefObject<number>
//   className: string
// }
// const CanvasBox = ({
//   canvasId,
//   toolRef,
//   ActiveLayer,
//   className,
// }: CanvasBoxProps) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const posRef = useRef<posRef>({
//     prevX: 0,
//     prevY: 0,
//   })
//   const isDrawing = useRef<boolean>(false)

//   // useEffect(() => {
//   //   console.log('reloading ' + canvasId)
//   //   if (canvasRef.current) {
//   //     const rect = canvasRef.current.parentElement?.getBoundingClientRect()
//   //     if (rect) {
//   //       canvasRef.current.height = (rect?.bottom - rect?.top) * 0.98
//   //       canvasRef.current.width = (rect?.right - rect?.left) * 0.98
//   //       // canvasRef.current.height = 400
//   //       // canvasRef.current.width = 400
//   //     }
//   //   }
//   // })

//   return (
//     <div className={'height-max width-max ' + className}>
//       <h3 className='grid-center'>Canvas {canvasId}</h3>
//       <canvas
//         id={canvasId}
//         ref={canvasRef}
//         style={{ border: 'solid 2px white' }}
//         className={className}
//         height={innerHeight}
//         width={innerWidth}
//         onMouseDown={(e) => {
//           if (
//             toolRef.current == Tools.Brush &&
//             String(ActiveLayer.current) == canvasId
//           )
//             MouseDownHandle(e, isDrawing, canvasRef, posRef)
//         }}
//         onMouseMove={(e) => {
//           if (
//             toolRef.current == Tools.Brush &&
//             String(ActiveLayer.current) == canvasId
//           )
//             MouseMoveHandle(e, isDrawing, canvasRef, posRef)
//         }}
//         onMouseUp={() => {
//           isDrawing.current = false
//         }}
//         onMouseOut={() => {
//           isDrawing.current = false
//         }}
//       ></canvas>
//     </div>
//   )
// }

interface action {
  type: string
  canvasName: string
}
const CanvasReducer = (CanvasList: string[], action: action) => {
  switch (action.type) {
    case 'add':
      return [...CanvasList, action.canvasName]
    case 'delete':
      console.log(`deleting ${action.canvasName} from ${CanvasList}`)
      return CanvasList.filter((c) => {
        if (c != action.canvasName) return c
      })
    default:
      return CanvasList
  }
}

//Mouse related functions dont care about these

// function MouseDownHandle(
//   e: MouseEvent,
//   isDrawing: React.MutableRefObject<boolean>,
//   canvasRef: React.RefObject<HTMLCanvasElement>,
//   posRef: React.MutableRefObject<posRef>
// ) {
//   isDrawing.current = true
//   const rect: DOMRect | undefined = canvasRef.current?.getBoundingClientRect()
//   if (rect) {
//     posRef.current.prevX = e.clientX - rect.left
//     posRef.current.prevY = e.clientY - rect.top
//   }
// }

// function MouseMoveHandle(
//   e: MouseEvent,
//   isDrawing: React.MutableRefObject<boolean>,
//   canvasRef: React.RefObject<HTMLCanvasElement>,
//   posRef: React.MutableRefObject<posRef>
// ) {
//   if (isDrawing.current && canvasRef.current) {
//     const ctx = canvasRef.current.getContext('2d')
//     if (canvasRef.current) {
//       const rect: DOMRect = canvasRef.current?.getBoundingClientRect()
//       const currX = e.clientX - rect.left
//       const currY = e.clientY - rect.top
//       if (!ctx) return
//       ctx.beginPath()
//       ctx.moveTo(posRef.current.prevX, posRef.current.prevY)
//       ctx.lineTo(currX, currY)
//       ctx.strokeStyle = 'white'
//       ctx.lineWidth = 5
//       ctx.stroke()
//       posRef.current.prevX = currX
//       posRef.current.prevY = currY
//     }
//   }
// }
