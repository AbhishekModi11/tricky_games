import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Local dev: proxy /api to the Flask server so VITE_BACKEND_URL can stay empty
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
