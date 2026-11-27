import axios from 'axios'

// VITE_BACKEND_URL is set in the Vercel frontend project's env vars.
// Example: https://tricky-king-backend.vercel.app
// Locally the Vite dev proxy handles /api → localhost:5000,
// so BASE_URL stays empty and the proxy kicks in.
const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? ''

const api = axios.create({ baseURL: `${BASE_URL}/api` })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('tk_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export default api
