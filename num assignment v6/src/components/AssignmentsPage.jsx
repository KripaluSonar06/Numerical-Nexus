import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { CompletionContext } from '../context/CompletionContext.jsx'
import { motion } from 'framer-motion'
import './AssignmentsPage.css'

function AssignmentsPage() {
  const navigate = useNavigate()
  const { getProgress } = useContext(CompletionContext)

  const assignments = [
    {
      id: 2,
      title: 'Assignment 2',
      description: '1. Harshad Numbers  2. Modified Legendre Polynomial'
    },
    {
      id: 3,
      title: 'Assignment 3',
      description: '1. Gaussian Quadrature  2. Gauss-Legendre ODE Method'
    }
  ]

  return (
    <motion.div 
      className="assignments-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="assignments-content">
        <motion.h1 
          className="page-heading"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Select Your Assignment
        </motion.h1>

        <div className="assignments-grid">
          {assignments.map((assignment, idx) => {
            const progress = getProgress(`assignment${assignment.id}`)
            return (
              <motion.div 
                key={assignment.id}
                className="assignment-card glass-card"
                onClick={() => navigate(`/assignment/${assignment.id}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ y: -5, boxShadow: '0 12px 48px rgba(0, 217, 255, 0.2)' }}
              >
                <h2>{assignment.title}</h2>
                <p className="description">{assignment.description}</p>
                
                <div className="progress-section">
                  <div className="progress-bar">
                    <motion.div 
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.percentage}%` }}
                      transition={{ delay: idx * 0.2 + 0.5, duration: 1 }}
                    />
                  </div>
                  <p className="progress-text">{progress.completed}/{progress.total} Completed</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

export default AssignmentsPage
