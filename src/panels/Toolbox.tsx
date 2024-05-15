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
      {toolbuttons.map((t) => {
        return (
          <ToolButton
            name='toolbar'
            id={t.name}
            iconpath={t.iconPath}
            toolNum={t.toolNum}
            changeToolState={props.changeToolState}
          ></ToolButton>
        )
      })}
    </div>
  )
}
