import { Dispatch, SetStateAction } from 'react'
import { Tools } from '../enums/tools'
import { ToolButton } from '../components/ToolButton'
import { toolbuttons } from '../constants'

interface ToolboxProps {
  className: string
  ToolPropertiesRef: React.RefObject<ToolProperties>
  ToolState: Tools
  changeToolState: Dispatch<SetStateAction<Tools>>
}
export interface ToolProperties {
  color?: `#${string}`
  size?: number
  tool: Tools
}
//@todo - remove button
export const Toolbox = ({
  className,
  ToolPropertiesRef,
  ToolState,
  changeToolState
}: ToolboxProps) => {
  function changeToolState1(x: Tools) {
    const r = document.querySelector(':root') as HTMLElement | null

    switch (x) {
      case Tools.None:
        r?.style.setProperty(
          '--mouse-cursor',
          "url('/Layerboard/icons/mousearrow.svg'), default"
        )
        break
      case Tools.Brush:
        r?.style.setProperty('--mouse-cursor', 'crosshair')
        break
      case Tools.Eraser:
        r?.style.setProperty(
          '--mouse-cursor',
          "url('/Layerboard/icons/eraser.svg'), cell"
        )
        break
      case Tools.Move:
        r?.style.setProperty(
          '--mouse-cursor',
          "url('/Layerboard/icons/move.svg'), all-scroll"
        )
        break
      default:
        break
    }
    ToolPropertiesRef.current.tool = x
    changeToolState(x)
  }
  return (
    <div className='flex flex-col'>
      <div className={className + ' z-110 w-20'}>
        <div>Toolbox</div>
        {toolbuttons.map((t) => {
          return (
            <ToolButton
              name={t.name}
              id={t.name}
              iconpath={t.iconPath}
              toolNum={t.toolNum}
              changeToolState={changeToolState1}
              toolState={ToolState}
              key={t.name}
            ></ToolButton>
          )
        })}
        {ToolState === Tools.Brush ? (
          <input
            type='range'
            name='brushSize'
            id='brushSize'
            className='my-2 w-full'
            onInput={(e) => {
              ToolPropertiesRef.current.size = parseInt(
                (e.target as HTMLInputElement).value
              )
            }}
            defaultValue={ToolPropertiesRef.current.size || 5}
            min={1}
            max={25}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
