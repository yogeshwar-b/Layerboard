import { Dispatch, RefObject, SetStateAction, useRef, useState } from 'react'
import { ColorPalette } from './panels/ColorPalette'
import { LayersPanel } from './panels/LayersPanel'
import { Toolbox } from './panels/Toolbox'
import './styles/utils.css'
import { Tools } from './enums/tools'
import { CanvasContainer, CanvasHandle } from './panels/CanvasContainer'
import { ToolProperties } from './panels/Toolbox'

function LayerBoard() {
  const CanvasContainerRef: RefObject<CanvasHandle | null> =
    useRef<CanvasHandle>(null)
  const [ActiveLayer, setActiveLayer] = useState<string>(crypto.randomUUID())

  const [ToolState, changeToolState]: [
    ToolProperties,
    Dispatch<SetStateAction<ToolProperties>>
  ] = useState<ToolProperties>({
    tool: Tools.Brush,
    color: '#000000',
    size: 12
  })
  return (
    <div className='h-full'>
      <div className='absolute top-55 flex flex-col'>
        <Toolbox
          className='m-1 flex flex-col items-center rounded-md p-1 shadow-[0_0_5px_rgba(0,0,0,0.2)]'
          ToolState={ToolState}
          changeToolState={changeToolState}
        />
      </div>

      <LayersPanel
        className='absolute top-0 right-0 m-1 rounded-md p-1 shadow-[0_0_5px_rgba(0,0,0,0.2)]'
        CanvasContainerRef={CanvasContainerRef}
        ActiveLayer={ActiveLayer}
        setActiveLayer={setActiveLayer}
      />
      <ColorPalette ToolState={ToolState} changeToolState={changeToolState} />
      <CanvasContainer
        ref={CanvasContainerRef}
        ToolState={ToolState}
        setActiveLayer={setActiveLayer}
        ActiveLayer={ActiveLayer}
      />
    </div>
  )
}

export default LayerBoard
