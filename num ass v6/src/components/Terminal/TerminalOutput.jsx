import { useState, useEffect } from 'react'
import './TerminalOutput.css'

export default function TerminalOutput({ lines = [] }) {
  const [displayedLines, setDisplayedLines] = useState([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)

  useEffect(() => {
    if (currentLineIndex < lines.length) {
      const timer = setTimeout(() => {
        setDisplayedLines([...displayedLines, lines[currentLineIndex]])
        setCurrentLineIndex(currentLineIndex + 1)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [currentLineIndex, displayedLines, lines])

  return (
    <div className="terminal-window glass-card">
      <div className="terminal-header">
        <div className="traffic-lights">
          <div className="traffic-light close"></div>
          <div className="traffic-light minimize"></div>
          <div className="traffic-light maximize"></div>
        </div>
        <span className="terminal-title">Solution.py</span>
      </div>
      
      <div className="terminal-content">
        {displayedLines.map((line, idx) => (
          <div key={idx} className="terminal-line">
            <span className="terminal-prompt">$</span>
            <span className={`terminal-text ${line.type || ''}`}>
              {line.text}
            </span>
          </div>
        ))}
        {currentLineIndex < lines.length && <div className="terminal-cursor"></div>}
      </div>
    </div>
  )
}
