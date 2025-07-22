import { Dispatch, SetStateAction } from 'react'
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

  return (
    <div
      className={`absolute bottom-2 z-[100] flex w-full ${ToolState.tool != Tools.Brush ? 'opacity-0' : 'opacity-100'} justify-center transition-all duration-300`}
    >
      <div className='flex rounded-lg p-1 shadow-[0_0_5px_rgba(0,0,0,0.2)]'>
        <label className='relative flex h-10 w-10 cursor-pointer flex-col overflow-hidden rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.2)]'>
          <input
            type='color'
            className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
            id='colorpicker'
            name='colorpicker'
            onChange={(e) => {
              changeToolState({
                ...ToolState,
                color: (e.target as HTMLInputElement).value as `#${string}`
              })
            }}
          />
          <div
            className='h-1/2 w-full'
            style={{ backgroundColor: ToolState.color }}
          ></div>
          <div className='h-1/2 w-full bg-[linear-gradient(to_right,_red,_orange,_yellow,_green,_blue,_indigo,_violet)]'></div>
        </label>

        {paletteColors.map((color, index) => (
          <div
            key={index}
            className={`m-1.5 h-7 w-7 cursor-pointer rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.2)] transition-all duration-150 hover:scale-140 ${
              ToolState.color === color ? 'scale-130' : 'border-none'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => {
              console.log(`Selected color: ${color}`)
              changeToolState({
                ...ToolState,
                color: color as `#${string}`
              })
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}
