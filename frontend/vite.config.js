import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load server-side environment variables from .env without exposing secret keys to client
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      proxy: {
        '/api/auth': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
        '/api/admin': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
        '/api/products': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
        '/api/prices': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
        '/api/gold-rates': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
        '/api/rates': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
      },
    },
    plugins: [
      react(),
    ],
  };
});
