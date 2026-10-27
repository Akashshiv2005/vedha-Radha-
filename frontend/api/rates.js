/**
 * Serverless Handler for /api/rates (forwards to FastAPI backend)
 */
export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_API_URL || process.env.VITE_API_BASE_URL || process.env.BACKEND_URL || '';
  const force = req.query && (req.query.force === 'true' || req.query.refresh === '1');
  const targetEndpoint = `${backendUrl}/api/gold-rates/live${force ? '?force=true' : ''}`;

  try {
    const response = await fetch(targetEndpoint);
    const data = await response.json().catch(() => null);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    return res.status(response.status).json(data || {});
  } catch (error) {
    return res.status(503).json({
      success: false,
      error: 'Gold and silver rate service is temporarily unavailable',
      timestamp: Date.now()
    });
  }
}
