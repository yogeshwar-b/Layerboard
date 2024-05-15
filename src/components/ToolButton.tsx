import '../styles/utils.css'
import '../styles/toolbutton.css'
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
        className='disp-no'
        type='radio'
        name={props.name}
        id={props.id}
        title={props.id}
        onChange={(e) => {
          props.changeToolState(props.toolNum)
          console.log(`Selected - ${e.currentTarget.title}`)
        }}
        checked={props.toolState == props.toolNum}
      />
      <img src={props.iconpath} alt='some icon' className='icon' />
    </label>
  )
}
