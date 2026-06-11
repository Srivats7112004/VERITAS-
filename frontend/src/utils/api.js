import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const analyzeIdentity = (data) => {
  return apiClient.post('/analyze', data)
}

export const detectTwin = (data) => {
  return apiClient.post('/twin-detection', data)
}

export const getSimulationScenarios = () => {
  return apiClient.get('/simulations')
}

// Alias for older component imports
export const getSimulations = () => {
  return apiClient.get('/simulations')
}

export const submitSimulationResponse = (scenarioId, response) => {
  return apiClient.post(`/simulations/${scenarioId}/response`, { response })
}

export const getDashboardStats = () => {
  return apiClient.get('/dashboard/stats')
}

export const getDeceptionGraph = () => {
  return apiClient.get('/deception-graph')
}

export const healthCheck = () => {
  return apiClient.get('/health')
}

export default apiClient