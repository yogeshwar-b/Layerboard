import '../styles/utils.css'

interface BoardProps {
  className: string
}
export const Board = (props: BoardProps) => {
  return <div className={props.className}>Board</div>
}
