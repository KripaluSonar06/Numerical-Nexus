import { useParams, useNavigate, useContext } from 'react-router-dom'
import { CompletionContext } from '../context/CompletionContext.jsx'
import { motion } from 'framer-motion'
import './CompletionPage.css'

function CompletionPage() {
  const { assignmentId } = useParams()
  const navigate = useNavigate()
  const { completionStatus, checkAllComplete } = useContext(CompletionContext)

  const handleContinue = () => {
    if (assignmentId === '2') {
      navigate('/assignments')
    }
  }

  const handleAllDone = () => {
    if (checkAllComplete()) {
      navigate('/thank-you')
    }
  }

  const allInAssignmentComplete = assignmentId === '2' 
    ? completionStatus.assignment2.q1a && completionStatus.assignment2.q1b && completionStatus.assignment2.q2
    : completionStatus.assignment3.q1 && completionStatus.assignment3.q2

  return (
    <motion.div 
      className="completion-page"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="completion-content">
        <motion.div 
          className="completion-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          ✓
        </motion.div>

        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Assignment {assignmentId} Completed!
        </motion.h1>

        <motion.div 
          className="completion-items"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {assignmentId === '2' ? (
            <>
              <div className="item">✓ Q1.A - First Non-Harshad Factorial</div>
              <div className="item">✓ Q1.B - Consecutive Harshad Numbers</div>
              <div className="item">✓ Q2 - Modified Legendre Polynomial</div>
            </>
          ) : (
            <>
              <div className="item">✓ Q1 - Gauss-Legendre Polynomial</div>
              <div className="item">✓ Q2 - ODE Gauss-Legendre Method</div>
            </>
          )}
        </motion.div>

        <motion.div 
          className="button-group"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {assignmentId === '2' && (
            <motion.button 
              className="btn btn-primary"
              onClick={handleContinue}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue to Assignment 3 →
            </motion.button>
          )}
          
          {assignmentId === '3' && checkAllComplete() && (
            <motion.button 
              className="btn btn-primary"
              onClick={handleAllDone}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All Done! 🎉 Go to Thank You Page
            </motion.button>
          )}

          <motion.button 
            className="btn btn-secondary"
            onClick={() => navigate(`/assignment/${assignmentId}`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Assignment {assignmentId}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default CompletionPage
