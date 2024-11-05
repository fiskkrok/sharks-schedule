import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) =>
{
  const isDevelopment = command === 'serve';

  return {
    plugins: [react()],
    base: '/sharks-schedule/',
    server: isDevelopment
      ? {
        proxy: {
          '/api': {
            target: 'https://api-web.nhle.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
          '/static': {
            target: 'https://www-league.nhlstatic.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/static/, ''),
          },
        },
      }
      : {},
  };
});
