// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   base: '/fiskkrok/',
//   server: {
//     proxy: {
//       '/api/v1': {
//         target: 'https://api-web.nhle.com',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ''),
//         followRedirects: true,
//         secure: false
//       },
//       '/api/logos': {
//         target: 'https://www-league.nhlstatic.com',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api\/logos/, ''),
//         secure: false
//       }
//     }
//   }
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) =>
{
  const isDevelopment = command === 'serve'

  return {
    plugins: [react()],
    base: '/',
    server: isDevelopment ? {
      proxy: {
        '/api/v1': {
          target: 'https://api-web.nhle.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false
        },
        '/api/logos': {
          target: 'https://www-league.nhlstatic.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/logos/, ''),
          secure: false
        }
      }
    } : {}
  }
})