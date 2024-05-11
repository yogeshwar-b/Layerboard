import { Dispatch, SetStateAction } from 'react'
import { Tools } from '../enums/tools'

interface ToolboxProps {
  className: string
  toolState: Tools
  changeToolState: Dispatch<SetStateAction<Tools>>
}
export const Toolbox = (props: ToolboxProps) => {
  return (
    <div className={props.className}>
      <div>Toolbox</div>
      <button
        onClick={() => {
          props.changeToolState(Tools.Brush)
        }}
      >
        Brush
      </button>
    </div>
  )
}
