import '../styles/utils.css'
import '../styles/board.css'
import { Tools } from '../enums/tools'

interface BoardProps {
  className: string
  toolState: Tools
}
export const Board = (props: BoardProps) => {
  const cursor = props.toolState == Tools.Brush ? ' board brush-hover' : ''
  return <div className={props.className + cursor}>Board</div>
}
