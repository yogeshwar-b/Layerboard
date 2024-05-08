import { Board } from './panels/Board'
import { ColorPalette } from './panels/ColorPalette'
import { LayersPanel } from './panels/LayersPanel'
import { Toolbox } from './panels/Toolbox'
import './styles/utils.css'

function LayerBoard() {
  return (
    <div className='flex-col height-max'>
      <h1 className='text-center'>LayerBoard</h1>
      <div className='flex-row flex-grow'>
        <Toolbox className='rounded-1 m-1 p-1 shadow-1 border-small' />
        <Board className='flex-grow height-auto rounded-1 m-1 p-1 shadow-1 border-small' />
        <LayersPanel className='rounded-1 m-1 p-1 shadow-1 border-small' />
      </div>
      <ColorPalette className='palette rounded-1 m-1 p-1 shadow-1 border-small' />
    </div>
  )
}

export default LayerBoard
