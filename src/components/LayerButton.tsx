import '../styles/utils.css'

interface LayerButtonProps {
  name: string
  onSelected: (x: string) => void
  onChecked: (layerId: string, isChecked: boolean) => void
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
      className='flex flex-row transition-all duration-150 hover:scale-105'
      onDragStart={() => props.handleDragStart(props.id)}
      onDragEnter={() => props.handleDragEnter(props.id)}
      onDragEnd={props.handleDragEnd}
      onDragOver={props.handleDragOver}
      draggable='true'
    >
      <input
        onClick={() => {
          props.onSelected(props.id)
        }}
        type='radio'
        id={props.id}
        name={'layer-select'}
        className='peer hidden'
        defaultChecked={props.ActiveLayer.current === props.id}
      />
      <label
        htmlFor={props.id}
        className='align-right mt-1 mb-1 w-full cursor-pointer rounded-lg p-1 shadow-[0_0_5px_rgba(0,0,0,0.2)] peer-checked:bg-blue-200'
      >
        {props.name}
        <input
          className='ml-1'
          type='checkbox'
          name='layerVisible'
          id='layerVisible'
          defaultChecked
          onChange={(e) => {
            console.log(` ${props.id} is ${e.target.checked}`)
            props.onChecked(props.id, e.target.checked)
          }}
        />
      </label>
    </div>
  )
}
