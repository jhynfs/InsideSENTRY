import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api goes to your C# backend
      '/api': {
        target: 'https://localhost:5246', // <-- VERIFY YOUR C# PORT HERE
        changeOrigin: true,
        secure: false, // Bypasses local SSL certificate errors
      }
    }
  }
})