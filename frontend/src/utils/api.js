import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Analyze user input for risk assessment
 */
export const analyzeIdentity = (data) => {
  return apiClient.post('/analyze', data)
}

/**
 * Detect twin/impersonation identities
 */
export const detectTwin = (data) => {
  return apiClient.post('/twin-detection', data)
}

/**
 * Get simulation scenarios
 */
export const getSimulationScenarios = () => {
  return apiClient.get('/simulations')
}

/**
 * Submit simulation response
 */
export const submitSimulationResponse = (scenarioId, response) => {
  return apiClient.post(`/simulations/${scenarioId}/response`, { response })
}

/**
 * Get dashboard statistics
 */
export const getDashboardStats = () => {
  return apiClient.get('/dashboard/stats')
}

/**
 * Get deception graph data
 */
export const getDeceptionGraph = () => {
  return apiClient.get('/deception-graph')
}

export default apiClient
