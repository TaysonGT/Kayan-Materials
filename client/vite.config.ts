import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Proxy all /api requests to backend server in development
    // This allows client calls to /api/* without CORS issues during development
    // proxy: {
    //   '/': {
    //     target: 'http://localhost:5000',
    //     // changeOrigin: true,
    //     // Remove the /api prefix when forwarding to backend
    //     // so /api/materials becomes /materials on the backend
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
  },
})
