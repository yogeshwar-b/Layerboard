import '../styles/utils.css'

interface LayerButtonProps {
  name: string
  onChecked: (x: string) => void
}

export const LayerButton = (props: LayerButtonProps) => {
  return (
    <div className='border-small flex-row'>
      <input
        onChange={() => {
          props.onChecked(props.name)
        }}
        type='radio'
        id={props.name + 'radio'}
        name='test'
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
