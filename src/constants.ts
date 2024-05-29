import { Tools } from './enums/tools'
import brushIcon from '/icons/brush.svg'
import eraserIcon from '/icons/eraser.svg'
import mousearrowIcon from '/icons/mousearrow.svg'
import moveIcon from '/icons/move.svg'

interface ToolButton {
  iconPath: string
  toolNum: Tools
  name: string
}

export const toolbuttons: ToolButton[] = [
  {
    name: 'mouse',
    iconPath: mousearrowIcon,
    toolNum: Tools.None
  },
  {
    name: 'brush',
    iconPath: brushIcon,
    toolNum: Tools.Brush
  },
  {
    name: 'eraser',
    iconPath: eraserIcon,
    toolNum: Tools.Eraser
  },
  { name: 'move', iconPath: moveIcon, toolNum: Tools.Move }
]

export const CanvasIdPrefix: string = 'CanvasLayer'
