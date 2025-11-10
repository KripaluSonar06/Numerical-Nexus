import { useParams, useNavigate, useContext, useState } from 'react-router-dom'
import { CompletionContext } from '../context/CompletionContext.jsx'
import { motion } from 'framer-motion'
import './QuestionPage.css'

function QuestionPage() {
  const { assignmentId, questionId } = useParams()
  const navigate = useNavigate()
  const { updateCompletion, completionStatus } = useContext(CompletionContext)
  const [showSolution, setShowSolution] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [isCompleted, setIsCompleted] = useState(completionStatus[`assignment${assignmentId}`]?.[questionId] || false)

  const questions = {
    q1a: {
      title: 'Q1.A - First Non-Harshad Factorial',
      question: 'Find the first factorial which is not a Harshad number. You have to take input of a number from where you have to start searching.',
      inputs: [{ label: 'Starting Number', key: 'startNum', type: 'number' }],
    },
    q1b: {
      title: 'Q1.B - Consecutive Harshad Numbers',
      question: 'Find n consecutive Harshad numbers. You have to take input of n & k from where you have to find and m till what number you have to find.',
      inputs: [
        { label: 'N (Count)', key: 'n', type: 'number' },
        { label: 'K (Start From)', key: 'k', type: 'number' },
        { label: 'M (Search Until)', key: 'm', type: 'number' }
      ],
    },
    q2a: {
      title: 'Q2 - Modified Legendre Polynomial',
      question: 'Determine the modified Legendre polynomial of the nth order and related computations.',
      inputs: [{ label: 'N (Order)', key: 'n', type: 'number' }],
    },
    q1: {
      title: 'Q1 - Gauss-Legendre Polynomial',
      question: 'Determine the roots and weights of the Gauss-Legendre Polynomial using eigenvalues.',
      inputs: [
        { label: 'N (Polynomial Order)', key: 'n', type: 'number' },
        { label: 'M (Collocation Points)', key: 'm', type: 'number' }
      ],
    },
    q2: {
      title: 'Q2 - ODE Gauss-Legendre Method',
      question: 'Solve the ODE by Gauss-Legendre method and compare with analytical solution.',
      inputs: [{ label: 'N (Number of Points)', key: 'n', type: 'number' }],
    }
  }

  const currentQuestion = questions[questionId] || questions.q1a
  const [inputs, setInputs] = useState({})

  const handleGetSolution = () => {
    setShowSolution(true)
  }

  const handleMarkComplete = (checked) => {
    setIsCompleted(checked)
    updateCompletion(`assignment${assignmentId}`, questionId, checked)
  }

  const handleBack = () => {
    navigate(`/assignment/${assignmentId}`)
  }

  const mockTerminalOutput = `$ solution.py
Checking 2 ...
It is a Prime and ... 2 is not a Wieferich Prime
Checking 3 ...
It is a Prime and ... 3 is not a Wieferich Prime
No primes found in this interval
Done!
=== Done ===`

  const mockAnswer = `The first factorial which is not a Harshad number is: 4! = 24`

  return (
    <motion.div 
      className="question-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="question-container">
        <button onClick={handleBack} className="back-btn">← Back to Assignment {assignmentId}</button>

        <motion.div 
          className="question-box glass-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2>{currentQuestion.title}</h2>
          <p className="question-text">{currentQuestion.question}</p>

          <div className="input-section">
            {currentQuestion.inputs.map((input) => (
              <div key={input.key} className="input-group">
                <label>{input.label}</label>
                <input 
                  type={input.type}
                  placeholder="Enter value"
                  value={inputs[input.key] || ''}
                  onChange={(e) => setInputs({...inputs, [input.key]: e.target.value})}
                  className="glass-input"
                />
              </div>
            ))}
          </div>

          <motion.button 
            className="get-solution-btn"
            onClick={handleGetSolution}
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Solution
          </motion.button>

          {showSolution && !showCode && (
            <motion.div 
              className="solution-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3>Terminal Output:</h3>
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
                  {mockTerminalOutput.split('\n').map((line, idx) => (
                    <div key={idx} className="terminal-line">
                      <span className="terminal-prompt">$</span>
                      <span className="terminal-text">{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="final-answer">
                <label className="final-answer-label">✓ Final Answer</label>
                <p className="final-answer-text">{mockAnswer}</p>
              </div>

              <div className="completion-section">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={isCompleted}
                    onChange={(e) => handleMarkComplete(e.target.checked)}
                  />
                  <span className="checkmark-text">
                    {isCompleted ? '✓ Marked as Complete' : '☐ Mark as Complete'}
                  </span>
                </label>
              </div>

              <motion.button 
                className="show-code-btn"
                onClick={() => setShowCode(true)}
                whileHover={{ scale: 1.05 }}
              >
                { } Show Code
              </motion.button>
            </motion.div>
          )}

          {showCode && (
            <motion.div 
              className="code-viewer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button onClick={() => setShowCode(false)} className="close-code-btn">✕ Close</button>
              <pre className="code-content">{`def is_harshad(n):
    digit_sum = sum(int(d) for d in str(n))
    return n % digit_sum == 0

def first_non_harshad_factorial(start):
    factorial = 1
    for i in range(1, start + 1):
        factorial *= i
    
    n = start
    while True:
        factorial *= n
        if not is_harshad(factorial):
            return n, factorial
        n += 1

# Main execution
starting_num = int(input("Enter starting number: "))
n, result = first_non_harshad_factorial(starting_num)
print(f"The first factorial which is not a Harshad number is: {n}! = {result}")`}</pre>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default QuestionPage
