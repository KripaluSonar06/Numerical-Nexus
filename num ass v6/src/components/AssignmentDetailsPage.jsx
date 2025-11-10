import { useParams, useNavigate, useContext } from 'react-router-dom'
import { CompletionContext } from '../context/CompletionContext.jsx'
import { motion } from 'framer-motion'
import './AssignmentDetailsPage.css'

function AssignmentDetailsPage() {
  const { assignmentId } = useParams()
  const navigate = useNavigate()
  const { completionStatus } = useContext(CompletionContext)

  const questions = assignmentId === '2' ? [
    { id: 'q1a', title: 'Q1.A - First Non-Harshad Factorial', description: 'Find the first factorial which is not a Harshad number' },
    { id: 'q1b', title: 'Q1.B - Consecutive Harshad Numbers', description: 'Find n consecutive Harshad numbers' },
    { id: 'q2', title: 'Q2 - Modified Legendre Polynomial', description: 'Determine polynomial and related computations' }
  ] : [
    { id: 'q1', title: 'Q1 - Gauss-Legendre Polynomial', description: 'Determine roots, weights, and matrices' },
    { id: 'q2', title: 'Q2 - ODE Gauss-Legendre Method', description: 'Solve ODE and compare with analytical solution' }
  ]

  return (
    <motion.div 
      className="assignment-details-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="details-content">
        <motion.div 
          className="header"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <button onClick={() => navigate('/assignments')} className="back-btn">← Back</button>
          <h1>Assignment {assignmentId}</h1>
        </motion.div>

        <div className="questions-grid">
          {questions.map((q, idx) => (
            <motion.div 
              key={q.id}
              className="question-card glass-card"
              onClick={() => navigate(`/assignment/${assignmentId}/question/${q.id}`)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="card-header">
                <h3>{q.title}</h3>
                {completionStatus[`assignment${assignmentId}`]?.[q.id] && <span className="checkmark">✓</span>}
              </div>
              <p>{q.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default AssignmentDetailsPage
