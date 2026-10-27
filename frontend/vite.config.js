import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables from .env based on current mode
  const env = loadEnv(mode, process.cwd(), '');
  const backendTarget = env.BACKEND_URL || env.VITE_API_BASE_URL;

  return {
    server: {
      ...(backendTarget
        ? {
            proxy: {
              // Universal proxy for all backend /api endpoints routed strictly to backend from .env
              '/api': {
                target: backendTarget,
                changeOrigin: true,
                secure: false,
              },
            },
          }
        : {}),
    },
    plugins: [
      react(),
    ],
  };
});
