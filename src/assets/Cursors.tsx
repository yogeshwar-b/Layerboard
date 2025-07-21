interface BrushCursorProps {
  fillColor: string
}
export function BrushCursor({ fillColor }: BrushCursorProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='48'
      height='48'
      viewBox='0 0 24 24'
    >
      <circle
        cx='12'
        cy='12'
        r='10'
        fill={fillColor}
        stroke='#000'
        stroke-width='2'
        data-darkreader-inline-stroke=''
        data-darkreader-inline-fill=''
      ></circle>
    </svg>
  )
}
