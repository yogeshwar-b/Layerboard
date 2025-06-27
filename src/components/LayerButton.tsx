import '../styles/utils.css'

interface LayerButtonProps {
  name: string
  onChecked: (x: string) => void
  ActiveLayer: React.RefObject<string>
  order: number
  id: string
  handleDragStart: (layerId: string) => void
  handleDragEnter: (layerId: string) => void
  handleDragEnd: () => void
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void
}

export const LayerButton = (props: LayerButtonProps) => {
  return (
    <div
      className=' flex-row'
      onDragStart={() => props.handleDragStart(props.id)}
      onDragEnter={() => props.handleDragEnter(props.id)}
      onDragEnd={props.handleDragEnd}
      onDragOver={props.handleDragOver}
      draggable='true'
    >
      <input
        onClick={() => {
          props.onChecked(props.id)
        }}
        type='radio'
        id={props.id}
        name={'layer-select'}
        defaultChecked={props.ActiveLayer.current === props.id}
      />
      <label htmlFor={props.id} style={{ flex: 1, textAlign: 'center' }}>
        {props.name}
      </label>
    </div>
  )
}
