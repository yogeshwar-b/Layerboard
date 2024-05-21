import '../styles/utils.css'

interface LayerButtonProps {
  name: string
  onChecked: (x: string) => void
  ActiveLayer: React.MutableRefObject<number>
}

export const LayerButton = (props: LayerButtonProps) => {
  return (
    <div className='border-small flex-row'>
      <input
        onChange={() => {
          console.log('onchange layerbutton called')
          props.onChecked(props.name)
        }}
        type='radio'
        id={props.name + 'radio'}
        name='test'
        defaultChecked={String(props.ActiveLayer.current) == props.name}
      />
      <label
        htmlFor={props.name + 'radio'}
        style={{ flex: 1, textAlign: 'center' }}
      >
        {props.name} Layer
      </label>
    </div>
  )
}
