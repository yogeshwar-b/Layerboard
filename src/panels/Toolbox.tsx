import { Dispatch, SetStateAction } from 'react'
import { Tools } from '../enums/tools'
import { ToolButton } from '../components/ToolButton'
import { toolbuttons } from '../constants'

interface ToolboxProps {
  className: string
  toolState: Tools
  changeToolState: Dispatch<SetStateAction<Tools>>
}
//@todo - remove button
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
      {toolbuttons.map((t) => {
        return <ToolButton name={t.name} iconpath={t.iconPath}></ToolButton>
      })}
    </div>
  )
}
