import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  console.log(env.VITE_DEBUG)

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
      ...(env.VITE_DEBUG === "true" && {
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