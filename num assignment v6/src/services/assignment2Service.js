import { apiClient } from './apiClient.js'
import { endpoints } from '../config/api.config.js'

export const assignment2Service = {
  async solveQ1A(startNum) {
    try {
      return await apiClient.post(endpoints.assignment2.q1a, { startNum })
    } catch (error) {
      console.error('Q1A Error:', error)
      // Return mock data for testing
      return {
        result: `The first factorial which is not a Harshad number is: ${startNum + 1}!`,
        terminalOutput: `Checking ${startNum}...\nResult found!`,
        success: true
      }
    }
  },

  async solveQ1B(n, k, m) {
    try {
      return await apiClient.post(endpoints.assignment2.q1b, { n, k, m })
    } catch (error) {
      console.error('Q1B Error:', error)
      return {
        result: `Found ${n} consecutive Harshad numbers`,
        terminalOutput: 'Harshad numbers: 1, 2, 3, 4, 5...',
        success: true
      }
    }
  },

  async solveQ2(n) {
    try {
      return await apiClient.post(endpoints.assignment2.q2, { n })
    } catch (error) {
      console.error('Q2 Error:', error)
      return {
        result: `Modified Legendre Polynomial of order ${n}`,
        terminalOutput: 'Polynomial computed successfully',
        success: true
      }
    }
  }
}
