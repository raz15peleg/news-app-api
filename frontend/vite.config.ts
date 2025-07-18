import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  console.log('Environment:', {
    VITE_DEBUG: env.VITE_DEBUG,
    VITE_API_URL: env.VITE_API_URL,
    mode: mode,
    command: command
  })

  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: true,
      allowedHosts: [
        'localhost',
        '.ngrok.io',
        '.ngrok-free.app',
        '.ngrok.app',
        'all'
      ],
      // Only use proxy in development when VITE_API_URL is not set
      ...(command === 'serve' && !env.VITE_API_URL && {
        proxy: {
          '/api': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
            secure: false,
          },
        },
      })
    },
    define: {
      global: 'globalThis',
    },
    optimizeDeps: {
      include: ['react', 'react-dom']
    },
    build: {
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  }
}) 