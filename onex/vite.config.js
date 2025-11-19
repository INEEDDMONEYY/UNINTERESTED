import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://uninterested.onrender.com/api', // backend port
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
