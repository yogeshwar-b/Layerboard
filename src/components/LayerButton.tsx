import '../styles/utils.css'

interface LayerButtonProps {
  name: string
  onChecked: (x: string) => void
  ActiveLayer: React.RefObject<string>
  order: number
  id: string
}

export const LayerButton = (props: LayerButtonProps) => {
  return (
    <div className=' flex-row'>
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
