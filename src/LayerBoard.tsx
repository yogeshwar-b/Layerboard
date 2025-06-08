import { useRef } from 'react'
import { ColorPalette } from './panels/ColorPalette'
import { LayersPanel } from './panels/LayersPanel'
import { Toolbox } from './panels/Toolbox'
import './styles/utils.css'
import { Tools } from './enums/tools'
import { CanvasContainer, CanvasHandle } from './panels/CanvasContainer'

function LayerBoard() {
  const ToolRef = useRef<Tools>(Tools.Brush)
  const CanvasContainerRef = useRef<CanvasHandle>(null)
  const ActiveLayer = useRef<number>(1)
  const ColorRef= useRef<`#${string}`>('#000000')

  return (
    <div className='height-max'>
      <div className='flex-col pos-abs height-max flex-col-center'>
        <Toolbox
          className='rounded-1 m-1 p-1  border-small flex-col flex-center'
          ToolRef={ToolRef}
        />
      </div>
      {/* <Board
          className='flex-grow height-auto rounded-1 m-1 p-1 shadow-1 border-small board'
          toolRef={ToolRef}
          ref={BoardRef}
        /> */}
      <div className='flex-col pos-abs height-max flex-col-center pos-right'>
        <LayersPanel
          className='rounded-1 m-1 p-1 border-small pos-abs pos-right pos-top'
          CanvasContainerRef={CanvasContainerRef}
          ActiveLayer={ActiveLayer}
        />
      </div>
      <ColorPalette colorState={ColorRef}  className='palette rounded-1 m-1 p-1  border-small pos-bottom pos-abs width-max' />
      <CanvasContainer
        ref={CanvasContainerRef}
        ToolRef={ToolRef}
        ActiveLayer={ActiveLayer}
        ColorRef={ColorRef}
      />
    </div>
  )
}

export default LayerBoard
