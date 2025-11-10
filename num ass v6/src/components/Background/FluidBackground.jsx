import { useMousePosition } from '../../hooks/useMousePosition.js'
import './FluidBackground.css'

export default function FluidBackground({ children }) {
  const { x, y } = useMousePosition()

  return (
    <div 
      className="fluid-background"
      style={{
        '--mouse-x': `${x}%`,
        '--mouse-y': `${y}%`,
      }}
    >
      {children}
    </div>
  )
}
