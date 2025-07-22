import '../styles/utils.css'
import { Tools } from '../enums/tools'
import { ToolProperties } from '../panels/Toolbox'

interface ToolButtonProps {
  name: string
  iconpath: string
  id: string
  toolNum: Tools
  changeToolState: (x: Tools) => void
  toolState: ToolProperties
}

export const ToolButton = ({
  toolState,
  id,
  toolNum,
  changeToolState,
  name,
  iconpath
}: ToolButtonProps) => {
  return (
    <label htmlFor={id} title={name}>
      <input
        className='peer hidden'
        type='radio'
        name='toolradio'
        id={id}
        title={id}
        onChange={(e) => {
          changeToolState(toolNum)
          console.log(`Selected - ${e.currentTarget.title}`)
        }}
        checked={toolState.tool == toolNum}
      />
      <img
        src={iconpath}
        alt='some icon'
        className='m-1 cursor-pointer rounded-[0.3rem] border-4 border-transparent p-1 shadow-[0_0_5px_rgba(0,0,0,0.2)] transition-all duration-150 peer-checked:border-black hover:scale-110 hover:bg-gray-700'
      />
    </label>
  )
}
