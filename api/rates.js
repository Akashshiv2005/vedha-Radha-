import { getPreciousRates } from '../server/ratesService.js';

/**
 * Serverless / Backend Handler for /api/rates
 */
export default async function handler(req, res) {
  try {
    const force = req.query && (req.query.force === 'true' || req.query.refresh === '1');
    const rateData = await getPreciousRates(process.env, force);
    
    // Send response with caching headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    return res.status(200).json(rateData);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal error processing precious metal rates',
      timestamp: Date.now()
    });
  }
}
