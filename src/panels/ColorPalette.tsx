import { Dispatch, SetStateAction, useState } from 'react'
import { ToolProperties } from './Toolbox'
import { Tools } from '../enums/tools'

interface ColorPaletteProps {
  ToolState: ToolProperties
  changeToolState: Dispatch<SetStateAction<ToolProperties>>
}

export const ColorPalette = ({
  ToolState,
  changeToolState
}: ColorPaletteProps) => {
  const paletteColors = [
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
    '#FFFFFF',
    '#000000',
    '#808080',
    '#800000',
    '#008000',
    '#000080',
    '#808000',
    '#800080',
    '#008080'
  ]

  const [colorState, setColorState] = useState<`#${string}`>(
    ToolState.color || '#000000'
  )

  return (
    <div
      className={`absolute bottom-2 z-[100] flex w-full overflow-clip ${ToolState.tool != Tools.Brush ? 'opacity-0' : 'opacity-100'} justify-center transition-all duration-300`}
    >
      <div className='flex rounded-lg border-2 border-solid border-black p-1'>
        {paletteColors.map((color, index) => (
          <div
            key={index}
            className={`m-1.5 h-7 w-7 cursor-pointer rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.2)] ${
              colorState === color ? 'border-2 border-black' : 'border-none'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => {
              console.log(`Selected color: ${color}`)
              changeToolState({
                ...ToolState,
                color: color as `#${string}`
              })
              setColorState(color as `#${string}`)
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}
