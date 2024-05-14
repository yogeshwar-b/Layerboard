import { Tools } from './enums/tools'

interface ToolButton {
  iconPath: string
  toolNum: Tools
  name: string
}

export const toolbuttons: ToolButton[] = [
  {
    name: 'mouse',
    iconPath: '/LayerBoard/icons/mousearrow.svg',
    toolNum: Tools.None
  },
  {
    name: 'brush',
    iconPath: '/LayerBoard/icons/brush.svg',
    toolNum: Tools.Brush
  },
  {
    name: 'eraser',
    iconPath: '/LayerBoard/icons/eraser.svg',
    toolNum: Tools.Eraser
  },
  { name: 'move', iconPath: '/LayerBoard/icons/move.svg', toolNum: Tools.Move }
]
