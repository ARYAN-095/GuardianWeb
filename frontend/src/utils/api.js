import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const analyzeWebsite = async (url) => {
  const response = await axios.post(`${API_BASE}/analyze`, { url })
  return {
    ...response.data,
    scanId: response.data.scan_metadata.scan_date
  }
}

export const getScanResults = async (scanId) => {
  const response = await axios.get(`${API_BASE}/scans/${scanId}`)
  return response.data
}

export const getScanHistory = async () => {
  const response = await axios.get(`${API_BASE}/history`)
  return response.data
}