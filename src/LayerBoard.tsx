import { Dispatch, RefObject, SetStateAction, useRef, useState } from 'react'
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

  const [ToolState, changeToolState]: [Tools, Dispatch<SetStateAction<Tools>>] =
    useState<Tools>(Tools.Brush)
  return (
    <div className='h-full'>
      <div className='absolute top-55 flex flex-col'>
        <Toolbox
          className='m-1 flex flex-col items-center rounded-md border-2 p-1'
          ToolPropertiesRef={ToolPropertiesRef}
          ToolState={ToolState}
          changeToolState={changeToolState}
        />
      </div>

      <LayersPanel
        className='absolute top-0 right-0 m-1 rounded-md border-2 p-1'
        CanvasContainerRef={CanvasContainerRef}
        ActiveLayer={ActiveLayer}
      />
      <ColorPalette
        ToolPropertiesRef={ToolPropertiesRef}
        ToolState={ToolState}
      />
      <CanvasContainer
        ref={CanvasContainerRef}
        ToolPropertiesRef={ToolPropertiesRef}
        ActiveLayer={ActiveLayer}
        ToolState={ToolState}
      />
    </div>
  )
}

export default LayerBoard
