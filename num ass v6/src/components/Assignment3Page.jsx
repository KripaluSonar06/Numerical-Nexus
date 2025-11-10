import { useNavigate, useContext } from 'react-router-dom'
import { CompletionContext } from '../context/CompletionContext'
import { motion } from 'framer-motion'
import ProgressBar from './Navigation/ProgressBar.jsx'
import BreadCrumb from './Navigation/BreadCrumb.jsx'
import './Assignment3Page.css'

function Assignment3Page() {
  const navigate = useNavigate()
  const { getProgress } = useContext(CompletionContext)

  const questions = [
    { id: 'q1', title: 'Q1 - Gauss-Legendre Polynomial', description: 'Determine roots, weights, and matrices' },
    { id: 'q2', title: 'Q2 - ODE Gauss-Legendre Method', description: 'Solve ODE and compare with analytical solution' }
  ]

  const progress = getProgress('assignment3')

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Assignments', path: '/assignments' },
    { label: 'Assignment 3' }
  ]

  return (
    <motion.div 
      className="assignment3-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="assignment3-content">
        <BreadCrumb items={breadcrumbItems} />

        <motion.div 
          className="assignment3-header"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1>Assignment 3</h1>
          <p>Gaussian Quadrature & Gauss-Legendre ODE Method</p>
        </motion.div>

        <ProgressBar 
          progress={progress.percentage}
          label={`Progress: ${progress.completed}/${progress.total}`}
        />

        <div className="questions-grid">
          {questions.map((q, idx) => (
            <motion.div 
              key={q.id}
              className="question-card glass-card"
              onClick={() => navigate(`/assignment/3/question/${q.id}`)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <h3>{q.title}</h3>
              <p>{q.description}</p>
              <button className="question-card-btn">Solve →</button>
            </motion.div>
          ))}
        </div>

        <motion.button 
          className="back-btn glass-button"
          onClick={() => navigate('/assignments')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          ← Back to Assignments
        </motion.button>
      </div>
    </motion.div>
  )
}

export default Assignment3Page
