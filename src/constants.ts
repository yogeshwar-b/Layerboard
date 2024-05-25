import { Tools } from './enums/tools'

interface ToolButton {
  iconPath: string
  toolNum: Tools
  name: string
}

export const toolbuttons: ToolButton[] = [
  {
    name: 'mouse',
    iconPath: './icons/mousearrow.svg',
    toolNum: Tools.None
  },
  {
    name: 'brush',
    iconPath: './icons/brush.svg',
    toolNum: Tools.Brush
  },
  {
    name: 'eraser',
    iconPath: './icons/eraser.svg',
    toolNum: Tools.Eraser
  },
  { name: 'move', iconPath: './icons/move.svg', toolNum: Tools.Move }
]
