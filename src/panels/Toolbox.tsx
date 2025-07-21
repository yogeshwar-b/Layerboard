import { Dispatch, SetStateAction } from 'react'
import { Tools } from '../enums/tools'
import { ToolButton } from '../components/ToolButton'
import { toolbuttons } from '../constants'

interface ToolboxProps {
  className: string
  ToolState: ToolProperties
  changeToolState: Dispatch<SetStateAction<ToolProperties>>
}
export interface ToolProperties {
  color?: `#${string}`
  size?: number
  tool: Tools
}
//@todo - remove button
export const Toolbox = ({
  className,

  ToolState,
  changeToolState
}: ToolboxProps) => {
  function changeToolState1(x: Tools) {
    changeToolState({ ...ToolState, tool: x })
  }
  return (
    <div className='z-110 flex w-20 flex-col pl-2 select-none'>
      <div className={className}>
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
      </div>
      {ToolState.tool === Tools.Brush ? (
        <input
          type='range'
          name='brushSize'
          id='brushSize'
          className='my-2 w-full transition-all duration-300'
          onInput={(e) => {
            changeToolState({
              ...ToolState,
              size: parseInt((e.target as HTMLInputElement).value)
            })
          }}
          defaultValue={ToolState.size || 5}
          min={1}
          max={25}
        />
      ) : (
        <></>
      )}
    </div>
  )
}
