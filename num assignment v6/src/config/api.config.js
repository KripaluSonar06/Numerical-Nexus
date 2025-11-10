const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173'

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

export const endpoints = {
  assignment2: {
    q1a: '/api/assignment2/q1a',
    q1b: '/api/assignment2/q1b',
    q2: '/api/assignment2/q2'
  },
  assignment3: {
    q1: '/api/assignment3/q1',
    q2: '/api/assignment3/q2'
  }
}
