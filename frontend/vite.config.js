import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // Always load environment variables from the frontend directory regardless of invocation cwd
  const env = loadEnv(mode, __dirname, '');
  const backendTarget = env.BACKEND_URL || env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

  return {
    root: __dirname,
    envDir: __dirname,
    css: {
      postcss: {
        plugins: [
          tailwindcss({
            config: path.resolve(__dirname, 'tailwind.config.js'),
          }),
          autoprefixer(),
        ],
      },
    },
    server: {
      port: 5173,
      host: true,
      proxy: {
        // Universal proxy for all backend /api endpoints routed strictly to FastAPI
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('error', (err) => {
              console.warn('[vite proxy] FastAPI unreachable:', err.message);
            });
          },
        },
      },
    },
    plugins: [
      react(),
    ],
  };
});
