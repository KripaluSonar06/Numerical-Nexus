
import { createContext, useState } from 'react'

export const CompletionContext = createContext()

export function CompletionProvider({ children }) {
  const [completionStatus, setCompletionStatus] = useState({
    assignment2: { q1a: false, q1b: false, q2: false },
    assignment3: { q1: false, q2: false }
  })

  const updateCompletion = (assignment, question, completed) => {
    setCompletionStatus(prev => ({
      ...prev,
      [assignment]: {
        ...prev[assignment],
        [question]: completed
      }
    }))
  }

  const getProgress = (assignment) => {
    const questions = Object.values(completionStatus[assignment] || {})
    const completed = questions.filter(Boolean).length
    return { completed, total: questions.length, percentage: (completed / questions.length) * 100 }
  }

  const checkAllComplete = () => {
    return (
      completionStatus.assignment2.q1a &&
      completionStatus.assignment2.q1b &&
      completionStatus.assignment2.q2 &&
      completionStatus.assignment3.q1 &&
      completionStatus.assignment3.q2
    )
  }

  const resetCompletion = () => {
    setCompletionStatus({
      assignment2: { q1a: false, q1b: false, q2: false },
      assignment3: { q1: false, q2: false }
    })
  }

  return (
    <CompletionContext.Provider value={{
      completionStatus,
      updateCompletion,
      getProgress,
      checkAllComplete,
      resetCompletion
    }}>
      {children}
    </CompletionContext.Provider>
  )
}
