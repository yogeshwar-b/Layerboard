import '../styles/utils.css'

interface ToolButtonProps {
  name: string
  iconpath: string
}

export const ToolButton = (props: ToolButtonProps) => {
  return (
    <label htmlFor={props.name} title={props.name}>
      <img src={props.iconpath} alt='some icon' />
      <input
        className='disp-no'
        type='radio'
        id={props.name}
        title={props.name}
      />
    </label>
  )
}
