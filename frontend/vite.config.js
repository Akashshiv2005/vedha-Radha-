import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { getPreciousRates } from './server/ratesService.js';

// Custom Vite plugin to handle /api/rates endpoint during dev and preview
function preciousRatesApiPlugin(env) {
  return {
    name: 'precious-rates-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/rates')) {
          try {
            const urlObj = new URL(req.url, 'http://localhost');
            const force = urlObj.searchParams.get('force') === 'true' || urlObj.searchParams.get('refresh') === '1';
            
            const rateData = await getPreciousRates(env, force);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(rateData));
            return;
          } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({
              success: false,
              error: 'Failed to process rates API request',
              details: err.message
            }));
            return;
          }
        }
        next();
      });
    }
  };
}

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

