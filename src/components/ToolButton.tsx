import '../styles/utils.css'
import '../styles/toolbox.css'
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
        className='hidden'
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
      <img
        src={props.iconpath}
        alt='some icon'
        className='icon active:bg-[rgba(0, 0, 0, 0.2)] m-[0.1em] cursor-pointer rounded-[0.3rem] border border-[0.1px] bg-transparent px-[0.8em] py-[0.1em] hover:bg-[rgba(0,0,0,0.1)]'
      />
    </label>
  )
}
