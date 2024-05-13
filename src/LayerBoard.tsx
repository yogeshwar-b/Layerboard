import { Dispatch, SetStateAction, useState } from 'react'
import { Board } from './panels/Board'
import { ColorPalette } from './panels/ColorPalette'
import { LayersPanel } from './panels/LayersPanel'
import { Toolbox } from './panels/Toolbox'
import './styles/utils.css'
import { Tools } from './enums/tools'

function LayerBoard() {
  const [ToolState, changeToolState]: [Tools, Dispatch<SetStateAction<Tools>>] =
    useState<Tools>(Tools.None)

  return (
    <div className='flex-col height-max'>
      <h1 className='text-center'>LayerBoard</h1>
      <div className='flex-row flex-grow'>
        <Toolbox
          className='rounded-1 m-1 p-1 shadow-1 border-small'
          toolState={ToolState}
          changeToolState={changeToolState}
        />
        <Board
          className='flex-grow height-auto rounded-1 m-1 p-1 shadow-1 border-small board'
          toolState={ToolState}
        />
        <LayersPanel className='rounded-1 m-1 p-1 shadow-1 border-small' />
      </div>
      <ColorPalette className='palette rounded-1 m-1 p-1 shadow-1 border-small' />
    </div>
  )
}

export default LayerBoard
