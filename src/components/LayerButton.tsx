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
      className='flex flex-row'
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
        className='peer hidden'
        defaultChecked={props.ActiveLayer.current === props.id}
      />
      <label
        htmlFor={props.id}
        className='align-right mt-1 mb-1 w-full cursor-pointer rounded-lg p-1 peer-checked:bg-blue-200'
      >
        {props.name}
        <input
          className='ml-1'
          type='checkbox'
          name='layerEnable'
          id='layerEnable'
        />
      </label>
    </div>
  )
}
