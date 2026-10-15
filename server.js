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

import { getPreciousRates } from './server/ratesService.js';

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

// ─── API Routes ────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Accepts: { username, password }
 * Returns: { success, token, user } | { success: false, error }
 */
app.post('/api/auth/login', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { username, password } = req.body || {};
    const result = await authenticateStaff(username, password);
    return res
      .status(result.statusCode || (result.success ? 200 : 401))
      .json(result);
  } catch (err) {
    console.error('[auth/login] Unexpected error:', err);
    return res.status(400).json({
      success: false,
      error: 'Invalid request payload'
    });
  }
});

/**
 * GET /api/auth/me
 * Requires: Authorization: Bearer <token>
 * Returns: { success, user } | { success: false, error }
 */
app.get('/api/auth/me', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const user = verifySession(token);

  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized session' });
  }

  return res.status(200).json({ success: true, user });
});

/**
 * POST /api/auth/logout
 * Requires: Authorization: Bearer <token>
 * Returns: { success: true }
 */
app.post('/api/auth/logout', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  invalidateSession(token);
  return res.status(200).json({ success: true });
});

/**
 * GET /api/rates
 * Returns precious metal rate data (cached, with 60-second TTL)
 */
app.get('/api/rates', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const force = req.query.force === 'true' || req.query.refresh === '1';
    const rateData = await getPreciousRates(process.env, force);

    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    return res.status(200).json(rateData);
  } catch (err) {
    console.error('[api/rates] Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal error processing precious metal rates',
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
