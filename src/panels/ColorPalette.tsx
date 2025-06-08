import { useState } from 'react'

interface ColorPaletteProps {
  className: string
  colorState: React.MutableRefObject<`#${string}`>
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
    '#008080',
  ]

  const [colorState, setColorState] = useState<`#${string}`>(
    props.colorState.current || '#000000'
  )

  return (
    <div className={props.className}>
      <div style={{ display: 'flex' }}>
        {paletteColors.map((color, index) => (
          <div
            key={index}
            className='color-box'
            style={{
              backgroundColor: color,
              width: '30px',
              height: '30px',
              margin: '5px',
              cursor: 'pointer',
              borderRadius: '5px',
              boxShadow: '0 0 5px rgba(0,0,0,0.2)',
              border: colorState === color ? '2px solid black' : 'none',
            }}
            onClick={() => {
              console.log(`Selected color: ${color}`)
              props.colorState.current = color as `#${string}` 
              setColorState(color as `#${string}`) 
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}
