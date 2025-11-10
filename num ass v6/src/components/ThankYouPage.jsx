import { useNavigate, useContext } from 'react-router-dom'
import { CompletionContext } from '../context/CompletionContext.jsx'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'
import './ThankYouPage.css'

function ThankYouPage() {
  const navigate = useNavigate()
  const { resetCompletion } = useContext(CompletionContext)

  useEffect(() => {
    // Trigger fireworks burst
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }

      confetti({
        particleCount: 50,
        angle: 55 + Math.random() * 70,
        spread: 50 + Math.random() * 20,
        origin: { 
          x: Math.random() * 0.8 + 0.1, 
          y: Math.random() - 0.2 
        },
        colors: ['#00d9ff', '#4f46e5', '#ff00ff', '#ffd700']
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  const handleReturnHome = () => {
    resetCompletion()
    navigate('/')
  }

  const handleDownloadReport = () => {
    const report = `Numerical Methods Assignment - Completion Report
=============================================

Assignment 2:
✓ Q1.A - First Non-Harshad Factorial: Completed
✓ Q1.B - Consecutive Harshad Numbers: Completed
✓ Q2 - Modified Legendre Polynomial: Completed

Assignment 3:
✓ Q1 - Gauss-Legendre Polynomial: Completed
✓ Q2 - ODE Gauss-Legendre Method: Completed

Total Progress: 5/5 Completed (100%)

Presented by:
xyz - Roll No. 1
yzx - Roll No. 2
zxy - Roll No. 3

Completion Date: ${new Date().toLocaleDateString()}
`
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(report))
    element.setAttribute('download', 'assignment-report.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <motion.div 
      className="thank-you-page"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="thank-you-content">
        <motion.h1 
          className="thank-you-heading"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Mission Complete! 🎓
        </motion.h1>

        <motion.h2 
          className="thank-you-subheading"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          You've Successfully Mastered Numerical Methods
        </motion.h2>

        <motion.div 
          className="mathematical-quote"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <p className="quote-text">"Mathematics is the music of reason"</p>
          <p className="quote-author">— Galileo Galilei</p>
        </motion.div>

        <motion.div 
          className="completion-summary"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="summary-grid">
            <motion.div 
              className="summary-card"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <h3>Assignment 2</h3>
              <div className="summary-items">
                <p>✓ Q1.A - Harshad Numbers</p>
                <p>✓ Q1.B - Consecutive Search</p>
                <p>✓ Q2 - Legendre Polynomial</p>
              </div>
            </motion.div>

            <motion.div 
              className="summary-card"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <h3>Assignment 3</h3>
              <div className="summary-items">
                <p>✓ Q1 - Gauss-Legendre</p>
                <p>✓ Q2 - ODE Solver</p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="progress-final"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.3, type: 'spring' }}
          >
            <h4>Total Progress</h4>
            <p className="progress-text">5 / 5 Questions Complete</p>
            <div className="progress-bar-final">
              <motion.div 
                className="progress-fill-final"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1.5, duration: 2, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="team-credits"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <h4>Presented by</h4>
          <div className="team-members-final">
            <p>xyz - Roll No. 1</p>
            <p>yzx - Roll No. 2</p>
            <p>zxy - Roll No. 3</p>
          </div>
        </motion.div>

        <motion.div 
          className="thank-you-buttons"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <motion.button 
            className="download-btn"
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadReport}
          >
            📥 Download Report
          </motion.button>
          
          <motion.button 
            className="home-btn"
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReturnHome}
          >
            🏠 Return to Home
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ThankYouPage
