interface ToolboxProps {
  className: string
  brushState: string
  changeBrushState: React.Dispatch<React.SetStateAction<string>>
}
export const Toolbox = (props: ToolboxProps) => {
  return (
    <div className={props.className}>
      <div>Toolbox</div>
      <button
        onClick={() => {
          props.changeBrushState('brush')
        }}
      >
        Brush
      </button>
    </div>
  )
}
