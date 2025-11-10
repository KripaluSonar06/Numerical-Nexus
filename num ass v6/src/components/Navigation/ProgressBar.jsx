import { motion } from 'framer-motion'
import './ProgressBar.css'

export default function ProgressBar({ progress = 0, label = '', showLabel = true }) {
  return (
    <div className="progress-bar-container">
      {showLabel && (
        <div className="progress-bar-label">
          <span>{label}</span>
          <span className="progress-percentage">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="progress-bar-background">
        <motion.div
          className="progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
