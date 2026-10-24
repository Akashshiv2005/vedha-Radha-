import { authenticateStaff, verifySession, invalidateSession } from '../server/authService.js';

/**
 * Serverless / Backend Handler for /api/auth/*
 */
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const action = req.query?.action || (req.url ? req.url.split('?')[0].split('/').pop() : 'login');

  if (req.method === 'POST' && (action === 'login' || req.url.endsWith('/login'))) {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { username, password } = body;
      const result = await authenticateStaff(username, password);

      res.statusCode = result.statusCode || (result.success ? 200 : 401);
      return res.end(JSON.stringify(result));
    } catch (err) {
      res.statusCode = 400;
      return res.end(JSON.stringify({
        success: false,
        error: 'Invalid request payload'
      }));
    }
  }

  if (req.method === 'GET' && (action === 'me' || req.url.endsWith('/me'))) {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const user = verifySession(token);

    if (!user) {
      res.statusCode = 401;
      return res.end(JSON.stringify({
        success: false,
        error: 'Unauthorized session'
      }));
    }

    res.statusCode = 200;
    return res.end(JSON.stringify({
      success: true,
      user
    }));
  }

  if (req.method === 'POST' && (action === 'logout' || req.url.endsWith('/logout'))) {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    invalidateSession(token);

    res.statusCode = 200;
    return res.end(JSON.stringify({ success: true }));
  }

  res.statusCode = 404;
  return res.end(JSON.stringify({ success: false, error: 'Endpoint not found' }));
}
