import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Proxy API calls to backend server in development
    proxy: {
      '/materials': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/suppliers': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/supplier-materials': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/transactions': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
