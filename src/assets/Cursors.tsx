import { useEffect, useState } from 'react'
import ReactDOMServer from 'react-dom/server'

interface BrushCursorProps {
  fillColor: string
  size: number
}
export function useCustomCursor({
  color,
  size
}: {
  color: string
  size: number
}) {
  const [cursorUrl, setCursorUrl] = useState('')

  useEffect(() => {
    const svgString = ReactDOMServer.renderToStaticMarkup(
      <BrushCursor fillColor={color} size={size} />
    )

    const encoded = encodeURIComponent(svgString)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22')

    const hotspot = (size * 1.8) / 2
    const url = `url("data:image/svg+xml,${encoded}") ${hotspot} ${hotspot}, auto`

    setCursorUrl(url)
  }, [color, size])

  return cursorUrl
}

export function BrushCursor({ fillColor, size }: BrushCursorProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size * 1.8}
      height={size * 1.8}
      viewBox='0 0 24 24'
    >
      <circle
        cx='12'
        cy='12'
        r='9'
        fill={fillColor}
        stroke='gray'
        strokeWidth='0.4'
      />
      <circle
        cx='12'
        cy='12'
        r='11'
        fill='none'
        stroke='gray'
        strokeWidth='0.4'
      />
    </svg>
  )
}
