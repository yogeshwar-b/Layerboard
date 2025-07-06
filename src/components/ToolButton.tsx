import '../styles/utils.css'
import { Tools } from '../enums/tools'

interface ToolButtonProps {
  name: string
  iconpath: string
  id: string
  toolNum: Tools
  changeToolState: (x: Tools) => void
  toolState: Tools //Selected Tool
}

export const ToolButton = (props: ToolButtonProps) => {
  return (
    <label htmlFor={props.id} title={props.name}>
      <input
        className='peer hidden'
        type='radio'
        name='toolradio'
        id={props.id}
        title={props.id}
        onChange={(e) => {
          props.changeToolState(props.toolNum)
          console.log(`Selected - ${e.currentTarget.title}`)
        }}
        checked={props.toolState == props.toolNum}
      />
      <img
        src={props.iconpath}
        alt='some icon'
        className='cursor-pointer rounded-[0.3rem] border-4 border-transparent p-1 peer-checked:border-black hover:bg-gray-700'
      />
    </label>
  )
}
