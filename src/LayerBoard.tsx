import { RefObject, useRef } from 'react'
import { ColorPalette } from './panels/ColorPalette'
import { LayersPanel } from './panels/LayersPanel'
import { Toolbox } from './panels/Toolbox'
import './styles/utils.css'
import { Tools } from './enums/tools'
import { CanvasContainer, CanvasHandle } from './panels/CanvasContainer'
import { ToolProperties } from './panels/Toolbox'

function LayerBoard() {
  const ToolPropertiesRef = useRef<ToolProperties>({
    tool: Tools.Brush,
    color: '#000000',
    size: 5
  })
  const CanvasContainerRef: RefObject<CanvasHandle | null> =
    useRef<CanvasHandle>(null)
  const ActiveLayer: RefObject<string> = useRef<string>(crypto.randomUUID())

  return (
    <div className='h-full'>
      <div className='absolute flex h-full flex-col justify-center'>
        <Toolbox
          className='m-1 flex flex-col items-center rounded-md border-2 p-1'
          ToolPropertiesRef={ToolPropertiesRef}
        />
      </div>

      <LayersPanel
        className='absolute top-0 right-0 m-1 rounded-md border-2 p-1'
        CanvasContainerRef={CanvasContainerRef}
        ActiveLayer={ActiveLayer}
      />
      <ColorPalette ToolPropertiesRef={ToolPropertiesRef} className='' />
      <CanvasContainer
        ref={CanvasContainerRef}
        ToolPropertiesRef={ToolPropertiesRef}
        ActiveLayer={ActiveLayer}
      />
    </div>
  )
}

export default LayerBoard
