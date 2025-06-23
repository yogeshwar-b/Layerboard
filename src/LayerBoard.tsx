import React, { useRef } from 'react'
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
  const CanvasContainerRef = useRef<CanvasHandle>(null)
  const ActiveLayer: React.MutableRefObject<string> = useRef<string>(
    crypto.randomUUID()
  )

  return (
    <div className='height-max'>
      <div className='flex-col pos-abs height-max flex-col-center'>
        <Toolbox
          className='rounded-1 m-1 p-1  border-small flex-col flex-center '
          ToolPropertiesRef={ToolPropertiesRef}
        />
      </div>

      <div className='flex-col pos-abs height-max flex-col-center pos-right'>
        <LayersPanel
          className='rounded-1 m-1 p-1 border-small pos-abs pos-right pos-top'
          CanvasContainerRef={CanvasContainerRef}
          ActiveLayer={ActiveLayer}
        />
      </div>
      <ColorPalette
        ToolPropertiesRef={ToolPropertiesRef}
        className='palette rounded-1 m-1 p-1  border-small pos-bottom pos-abs width-max'
      />
      <CanvasContainer
        ref={CanvasContainerRef}
        ToolPropertiesRef={ToolPropertiesRef}
        ActiveLayer={ActiveLayer}
      />
    </div>
  )
}

export default LayerBoard
