import axios from 'axios'

// In production Vercel injects VITE_BACKEND_URL via the service binding.
// Locally the Vite dev proxy handles /api → localhost:5000, so the
// empty-string fallback keeps local dev working without any extra config.
const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? ''

const api = axios.create({ baseURL: `${BASE_URL}/api` })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('tk_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export default api
