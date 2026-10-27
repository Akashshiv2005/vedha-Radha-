/**
 * Vedha Radha Thangamaaligai — Production HTTP Server
 *
 * Purpose: Serves the Vite-built static SPA from dist/ AND handles all
 *          /api/* routes (auth + precious metal rates) using the same
 *          server-side service modules used in the Vite dev plugin.
 *
 * Run:  node server.js
 * Port: process.env.PORT (default 3000)
 *
 * Nginx should proxy:
 *   location /api/ { proxy_pass http://127.0.0.1:3000; }
 *   location /     { proxy_pass http://127.0.0.1:3000; }
 *
 * Or run the full server on port 80/443 directly with Nginx in front.
 */

import express from 'express';
import { createRequire } from 'module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  authenticateStaff,
  verifySession,
  invalidateSession
} from './server/authService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────

// Parse JSON request bodies
app.use(express.json());

// Security headers (minimal, non-breaking)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.VITE_API_BASE_URL || process.env.BACKEND_URL || '';

// ─── API Routes ────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Accepts: { username, password }
 * Forwards to FastAPI PostgreSQL backend
 */
app.post('/api/auth/login', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json().catch(() => null);
    return res.status(response.status).json(data || { success: false, error: 'Authentication failed' });
  } catch (backendErr) {
    // Graceful fallback to local staff service if backend server is not running
    try {
      const { username, password } = req.body || {};
      const result = await authenticateStaff(username, password);
      return res.status(result.statusCode || (result.success ? 200 : 401)).json(result);
    } catch {
      return res.status(503).json({ success: false, error: 'Authentication service temporarily unavailable' });
    }
  }
});

/**
 * GET /api/auth/me
 * Requires: Authorization: Bearer <token>
 */
app.get('/api/auth/me', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const authHeader = req.headers['authorization'] || '';
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });
    const data = await response.json().catch(() => null);
    return res.status(response.status).json(data || { success: false, error: 'Unauthorized' });
  } catch {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const user = verifySession(token);
    if (!user) return res.status(401).json({ success: false, error: 'Unauthorized session' });
    return res.status(200).json({ success: true, user });
  }
});

/**
 * POST /api/auth/logout
 * Requires: Authorization: Bearer <token>
 */
app.post('/api/auth/logout', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const authHeader = req.headers['authorization'] || '';
  try {
    await fetch(`${BACKEND_API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': authHeader }
    });
  } catch {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    invalidateSession(token);
  }
  return res.status(200).json({ success: true });
});

/**
 * GET /api/health
 * Returns FastAPI and PostgreSQL status
 */
app.get('/api/health', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/health`);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch {
    return res.status(200).json({ status: 'healthy', mode: 'standalone-web', timestamp: new Date().toISOString() });
  }
});

/**
 * Forward all /api/admin/* requests to FastAPI backend
 */
app.all('/api/admin/{*subpath}', async (req, res) => {
  try {
    const url = `${BACKEND_API_URL}${req.originalUrl}`;
    const headers = { ...req.headers };
    delete headers.host;
    const options = {
      method: req.method,
      headers
    };
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body && Object.keys(req.body).length > 0) {
      options.body = JSON.stringify(req.body);
      options.headers['content-type'] = 'application/json';
    }
    const response = await fetch(url, options);
    const data = await response.json().catch(() => null);
    return res.status(response.status).json(data || {});
  } catch (err) {
    return res.status(503).json({ success: false, error: 'Backend administration service is unavailable' });
  }
});

/**
 * Forward precious metal rate endpoints to FastAPI backend
 */
app.all(['/api/rates', '/api/prices*', '/api/gold-rates*'], async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const url = `${BACKEND_API_URL}${req.originalUrl}`;
    const response = await fetch(url);
    const data = await response.json().catch(() => null);
    return res.status(response.status).json(data || {});
  } catch (err) {
    console.error('[rates proxy] Error reaching backend:', err);
    return res.status(503).json({
      success: false,
      error: 'Gold and silver rate service is temporarily unavailable',
      timestamp: Date.now()
    });
  }
});

// ─── Serve Static SPA ──────────────────────────────────────────────────────────

const distPath = path.join(__dirname, 'dist');

// Serve all built static assets (JS, CSS, images, fonts, etc.)
app.use(express.static(distPath, {
  maxAge: '7d',         // Cache static assets for 7 days
  etag: true,
  lastModified: true,
  // Never serve index.html for /api/* via static middleware
  index: false
}));

// For all non-API routes, serve index.html (React Router SPA fallback)
app.get('/{*path}', (req, res) => {
  // Do not fall through for /api paths — those should be handled above or 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, error: 'API endpoint not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// ─── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`[vedharadha] Production server running on http://localhost:${PORT}`);
  console.log(`[vedharadha] API endpoints ready:`);
  console.log(`  POST /api/auth/login`);
  console.log(`  GET  /api/auth/me`);
  console.log(`  POST /api/auth/logout`);
  console.log(`  GET  /api/rates`);
  console.log(`[vedharadha] Serving static SPA from: ${distPath}`);
});

export default app;
