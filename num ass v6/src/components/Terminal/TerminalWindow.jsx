import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './TerminalWindow.css'

export default function TerminalWindow({ 
  title = 'Terminal', 
  lines = [], 
  isLoading = false,
  onClose = null 
}) {
  const [displayedLines, setDisplayedLines] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (lines.length === 0) return

    setIsAnimating(true)
    setDisplayedLines([])
    
    lines.forEach((line, idx) => {
      setTimeout(() => {
        setDisplayedLines(prev => [...prev, line])
      }, idx * 100)
    })

    setTimeout(() => {
      setIsAnimating(false)
    }, lines.length * 100)
  }, [lines])

  return (
    <motion.div 
      className="terminal-window glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="traffic-lights">
          <div className="traffic-light close" onClick={onClose}></div>
          <div className="traffic-light minimize"></div>
          <div className="traffic-light maximize"></div>
        </div>
        <span className="terminal-title">{title}</span>
        <div style={{ width: '70px' }}></div>
      </div>

      {/* Terminal Content */}
      <div className="terminal-content">
        {displayedLines.length === 0 && !isLoading && (
          <div className="terminal-empty">$ Ready...</div>
        )}

        {displayedLines.map((line, idx) => (
          <motion.div 
            key={idx}
            className="terminal-line"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="terminal-prompt">$</span>
            <span className={`terminal-text ${line.type || ''}`}>
              {line.text}
            </span>
          </motion.div>
        ))}

        {isLoading || isAnimating ? (
          <div className="terminal-cursor">
            <span></span>
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}
