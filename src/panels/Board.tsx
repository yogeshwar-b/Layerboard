import '../styles/utils.css'
import '../styles/board.css'

interface BoardProps {
  className: string
  brushState: string
}
export const Board = (props: BoardProps) => {
  const cursor = props.brushState == 'brush' ? ' board brush-hover' : ''
  return <div className={props.className + cursor}>Board</div>
}
