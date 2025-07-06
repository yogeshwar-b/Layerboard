import { useState } from 'react'
import { ToolProperties } from './Toolbox'

interface ColorPaletteProps {
  className: string
  // colorState: React.RefObject<`#${string}`>
  ToolPropertiesRef: React.RefObject<ToolProperties>
}

export const ColorPalette = (props: ColorPaletteProps) => {
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
    props.ToolPropertiesRef.current.color || '#000000'
  )

  return (
    <div className='absolute bottom-2 z-[100] flex w-full justify-center'>
      <div className='flex flex-wrap rounded-lg border-2 border-solid border-black p-1'>
        {paletteColors.map((color, index) => (
          <div
            key={index}
            className={`m-1.5 h-7 w-7 cursor-pointer rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.2)] ${
              colorState === color ? 'border-2 border-black' : 'border-none'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => {
              console.log(`Selected color: ${color}`)
              props.ToolPropertiesRef.current.color = color as `#${string}`
              setColorState(color as `#${string}`)
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}
