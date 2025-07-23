import '../styles/utils.css'

interface LayerButtonProps {
  name: string
  onSelected: (x: string) => void
  onChecked: (layerId: string, isChecked: boolean) => void
  ActiveLayer: string
  id: string
  handleDragStart: (layerId: string) => void
  handleDragEnter: (layerId: string) => void
  handleDragEnd: () => void
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void
}

export const LayerButton = ({
  onChecked,
  onSelected,
  name,
  ActiveLayer,
  id,
  handleDragEnd,
  handleDragEnter,
  handleDragStart,
  handleDragOver
}: LayerButtonProps) => {
  return (
    <div
      className='flex flex-row transition-all duration-150 hover:scale-105'
      onDragStart={() => handleDragStart(id)}
      onDragEnter={() => handleDragEnter(id)}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      draggable='true'
    >
      <input
        onClick={() => {
          onSelected(id)
        }}
        type='radio'
        id={id}
        name={'layer-select'}
        className='peer hidden'
        defaultChecked={ActiveLayer === id}
      />
      <label
        htmlFor={id}
        className='align-right mt-1 mb-1 w-full cursor-pointer rounded-lg p-1 shadow-[0_0_5px_rgba(0,0,0,0.2)] peer-checked:bg-blue-200'
      >
        {name}
        <input
          className='ml-1'
          type='checkbox'
          name='layerVisible'
          id='layerVisible'
          defaultChecked
          onChange={(e) => {
            onChecked(id, e.target.checked)
          }}
        />
      </label>
    </div>
  )
}
