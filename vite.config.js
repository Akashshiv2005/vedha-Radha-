import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { getPreciousRates } from './server/ratesService.js';
import { authenticateStaff, verifySession, invalidateSession } from './server/authService.js';

// Custom Vite plugin to handle /api/auth endpoints during dev and preview
function adminAuthApiPlugin() {
  return {
    name: 'admin-auth-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/auth')) {
          res.setHeader('Content-Type', 'application/json');

          if (req.method === 'POST' && req.url.includes('/login')) {
            let bodyStr = '';
            req.on('data', chunk => { bodyStr += chunk; });
            req.on('end', async () => {
              try {
                const body = JSON.parse(bodyStr || '{}');
                const result = await authenticateStaff(body.username, body.password);
                res.statusCode = result.statusCode || (result.success ? 200 : 401);
                res.end(JSON.stringify(result));
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
              }
            });
            return;
          }

          if (req.method === 'GET' && req.url.includes('/me')) {
            const authHeader = req.headers['authorization'] || '';
            const token = authHeader.replace(/^Bearer\s+/i, '').trim();
            const user = verifySession(token);

            if (!user) {
              res.statusCode = 401;
              res.end(JSON.stringify({ success: false, error: 'Unauthorized session' }));
              return;
            }

            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, user }));
            return;
          }

          if (req.method === 'POST' && req.url.includes('/logout')) {
            const authHeader = req.headers['authorization'] || '';
            const token = authHeader.replace(/^Bearer\s+/i, '').trim();
            invalidateSession(token);

            res.statusCode = 200;
            res.end(JSON.stringify({ success: true }));
            return;
          }
        }
        next();
      });
    }
  };
}

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
    plugins: [
      react(),
      adminAuthApiPlugin(),
      preciousRatesApiPlugin(env)
    ],
  };
});
