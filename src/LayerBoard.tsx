import { useRef } from 'react'
import { Board, LayersHandle } from './panels/Board'
import { ColorPalette } from './panels/ColorPalette'
import { LayersPanel } from './panels/LayersPanel'
import { Toolbox } from './panels/Toolbox'
import './styles/utils.css'
import { Tools } from './enums/tools'
import { CanvasContainer, CanvasHandle } from './panels/CanvasContainer'

function LayerBoard() {
  const ToolRef = useRef<Tools>(Tools.None)
  const BoardRef = useRef<LayersHandle>(null)
  const CanvasContainerRef = useRef<CanvasHandle>(null)

  return (
    <div className='flex-col height-max'>
      <h1 className='text-center'>LayerBoard</h1>
      <div className='flex-row flex-grow'>
        <Toolbox
          className='rounded-1 m-1 p-1 shadow-1 border-small flex-col flex-center'
          ToolRef={ToolRef}
        />
        {/* <Board
          className='flex-grow height-auto rounded-1 m-1 p-1 shadow-1 border-small board'
          toolRef={ToolRef}
          ref={BoardRef}
        /> */}
        <CanvasContainer ref={CanvasContainerRef} ToolRef={ToolRef} />
        <LayersPanel
          className='rounded-1 m-1 p-1 shadow-1 border-small pos-rel'
          BoardRef={BoardRef}
          CanvasContainerRef={CanvasContainerRef}
        />
      </div>
      <ColorPalette className='palette rounded-1 m-1 p-1 shadow-1 border-small' />
    </div>
  )
}

export default LayerBoard
