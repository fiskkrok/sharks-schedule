import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/sharks-schedule/',
  server: {
    proxy: {
      '/api/v1': {
        target: 'https://api-web.nhle.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        followRedirects: true,
        secure: false
      },
      '/api/logos': {
        target: 'https://www-league.nhlstatic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/logos/, ''),
        secure: false
      }
    }
  }
})