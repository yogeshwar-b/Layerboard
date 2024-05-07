import { Board } from './panels/Board'
import { ColorPalette } from './panels/ColorPalette'
import { LayersPanel } from './panels/LayersPanel'
import { Toolbox } from './panels/Toolbox'
import './styles/utils.css'

function LayerBoard() {
  return (
    <div className='flex-col height-max'>
      <h1>LayerBoard</h1>
      <div className='flex-row flex-grow'>
        <Toolbox />
        <div className='flex-grow'>
          <Board />
        </div>
        <LayersPanel />
      </div>
      <ColorPalette />
    </div>
  )
}

export default LayerBoard
