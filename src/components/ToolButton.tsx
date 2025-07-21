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
        className='cursor-pointer rounded-[0.3rem] border-4 border-transparent p-1 peer-checked:border-black hover:bg-gray-700'
      />
    </label>
  )
}
