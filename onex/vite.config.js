import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5020', // local backend
        changeOrigin: true,
        secure: false,
      },
    },
    host: '0.0.0.0', // ✅ allow external connections
    hmr: {
      protocol: 'wss',
      clientPort: 443, // ✅ browser connects over HTTPS
    },
  },
})
