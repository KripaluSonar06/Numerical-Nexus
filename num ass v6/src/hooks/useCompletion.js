import { useContext } from 'react'
import { CompletionContext } from '../context/CompletionContext.jsx'

export function useCompletion() {
  return useContext(CompletionContext)
}
