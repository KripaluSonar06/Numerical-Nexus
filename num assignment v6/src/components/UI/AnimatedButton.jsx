import { motion } from 'framer-motion'
import './AnimatedButton.css'

export default function AnimatedButton({ 
  children, 
  variant = 'primary',
  onClick,
  className = '',
  ...props 
}) {
  const variants = {
    hover: { scale: 1.08, y: -3 },
    tap: { scale: 0.95 }
  }

  return (
    <motion.button
      className={`animated-btn btn-${variant} ${className}`}
      onClick={onClick}
      whileHover={variants.hover}
      whileTap={variants.tap}
      {...props}
    >
      {children}
    </motion.button>
  )
}
