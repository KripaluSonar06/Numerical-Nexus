import { useNavigate, useContext } from 'react-router-dom'
import { CompletionContext } from '../context/CompletionContext.jsx'
import { motion } from 'framer-motion'
import ProgressBar from './Navigation/ProgressBar.jsx'
import BreadCrumb from './Navigation/BreadCrumb.jsx'
import './Assignment2Page.css'

function Assignment2Page() {
  const navigate = useNavigate()
  const { getProgress } = useContext(CompletionContext)

  const questions = [
    { id: 'q1a', title: 'Q1.A - First Non-Harshad Factorial', description: 'Find the first factorial which is not a Harshad number' },
    { id: 'q1b', title: 'Q1.B - Consecutive Harshad Numbers', description: 'Find n consecutive Harshad numbers' },
    { id: 'q2', title: 'Q2 - Modified Legendre Polynomial', description: 'Determine polynomial and related computations' }
  ]

  const progress = getProgress('assignment2')

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Assignments', path: '/assignments' },
    { label: 'Assignment 2' }
  ]

  return (
    <motion.div 
      className="assignment2-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="assignment2-content">
        <BreadCrumb items={breadcrumbItems} />

        <motion.div 
          className="assignment2-header"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1>Assignment 2</h1>
          <p>Harshad Numbers & Modified Legendre Polynomials</p>
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
              onClick={() => navigate(`/assignment/2/question/${q.id}`)}
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

export default Assignment2Page
