import '../styles/utils.css'
import '../styles/toolbutton.css'
import { Tools } from '../enums/tools'
import { Dispatch, SetStateAction } from 'react'

interface ToolButtonProps {
  name: string
  iconpath: string
  id: string
  toolNum: Tools
  changeToolState: Dispatch<SetStateAction<Tools>>
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
      />
      <img src={props.iconpath} alt='some icon' className='icon' />
    </label>
  )
}
