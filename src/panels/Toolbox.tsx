import { Dispatch, SetStateAction, useState } from 'react'
import { Tools } from '../enums/tools'
import { ToolButton } from '../components/ToolButton'
import { toolbuttons } from '../constants'
import '../styles/toolbox.css'

interface ToolboxProps {
  className: string
  ToolPropertiesRef: React.MutableRefObject<ToolProperties>
}
export interface ToolProperties {
  tool: Tools
  color?: `#${string}`
  size?: number
}
//@todo - remove button
export const Toolbox = (props: ToolboxProps) => {
  const [ToolState, changeToolState]: [Tools, Dispatch<SetStateAction<Tools>>] =
    useState<Tools>(props.ToolPropertiesRef.current.tool)

  function changeToolState1(x: Tools) {
    const canvaselement = document.getElementById('canvas-id')
    switch (props.ToolPropertiesRef.current.tool) {
      case Tools.None:
        canvaselement?.classList.remove('none-hover')
        break
      case Tools.Brush:
        canvaselement?.classList.remove('brush-hover')
        break
      case Tools.Eraser:
        canvaselement?.classList.remove('eraser-hover')
        break
      case Tools.Move:
        canvaselement?.classList.remove('move-hover')
        break
      default:
        break
    }
    props.ToolPropertiesRef.current.tool = x
    switch (props.ToolPropertiesRef.current.tool) {
      case Tools.None:
        canvaselement?.classList.add('none-hover')
        break
      case Tools.Brush:
        canvaselement?.classList.add('brush-hover')
        break
      case Tools.Eraser:
        canvaselement?.classList.add('eraser-hover')
        break
      case Tools.Move:
        canvaselement?.classList.add('move-hover')
        break
      default:
        break
    }
    changeToolState(x)
  }
  return (
    <div className='flex-col '>
      <div className={props.className + ' tool-box'}>
        <div>Toolbox</div>
        {toolbuttons.map((t) => {
          return (
            <ToolButton
              name='toolbar'
              id={t.name}
              iconpath={t.iconPath}
              toolNum={t.toolNum}
              changeToolState={changeToolState1}
              toolState={ToolState}
              key={t.name}
            ></ToolButton>
          )
        })}
      </div>
      {ToolState === Tools.Brush ? <div> brush adjustment</div> : <></>}
    </div>
  )
}
