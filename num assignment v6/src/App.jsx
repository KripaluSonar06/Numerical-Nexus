import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CompletionProvider } from './context/CompletionContext.jsx'
import HomePage from './components/HomePage.jsx'
import AssignmentsPage from './components/AssignmentsPage.jsx'
import AssignmentDetailsPage from './components/AssignmentDetailsPage.jsx'
import QuestionPage from './components/QuestionPage.jsx'
import CompletionPage from './components/CompletionPage.jsx'
import ThankYouPage from './components/ThankYouPage.jsx'

function App() {
  return (
    <CompletionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/assignment/:assignmentId" element={<AssignmentDetailsPage />} />
          <Route path="/assignment/:assignmentId/question/:questionId" element={<QuestionPage />} />
          <Route path="/assignment/:assignmentId/complete" element={<CompletionPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </BrowserRouter>
    </CompletionProvider>
  )
}

export default App