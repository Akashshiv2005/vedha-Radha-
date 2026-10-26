import { parseGoldApiResponse, formatInr, formatTimestampIST } from './rateCalculations.js';

/**
 * In-memory cache for precious metal rates
 */
let rateCache = {
  data: null,
  timestamp: 0,
  isLive: false,
  error: null
};

// Fallback baseline indicative rates (used only when no API key configured)
const DEFAULT_INDICATIVE_RATES = {
  raw: {
    gold24kGram: 7355,
    gold22kGram: 6742,
    gold18kGram: 5516,
    silver999Gram: 102.16,
    silver925Gram: 94.50,
    changeGram: 32,
    isUp: true,
    timestamp: Date.now()
  },
  formatted: {
    gold22k: '6,742',
    gold24k: '7,355',
    gold18k: '5,516',
    silver1g: '94.50',
    silver999: '102.16',
    change: '+ ₹32',
    isUp: true,
    lastUpdated: formatTimestampIST(Date.now())
  },
  meta: {
    provider: 'Showroom Benchmark (Indicative Baseline)',
    currency: 'INR',
    unit: 'gram',
    goldPurity: '22K (91.6% BIS Hallmark Jewellery Standard)',
    goldFinePurity: '24K (99.9% Benchmark Bullion)',
    silverPurity: '92.5% Sterling Silver'
  }
};

/**
 * Fetches precious metal rates from provider or returns cached/fallback data.
 * @param {object} env Environment variables object
 * @param {boolean} forceRefresh If true, bypasses cache TTL
 * @returns {Promise<object>}
 */
export async function getPreciousRates(env = process.env, forceRefresh = false) {
  const apiKey = env.GOLD_API_KEY || env.GOLDAPI_KEY || env.METALS_API_KEY;
  const ttlMinutes = parseInt(env.RATE_CACHE_TTL_MINUTES || '10', 10);
  const cacheTtlMs = (isNaN(ttlMinutes) ? 10 : ttlMinutes) * 60 * 1000;
  const now = Date.now();

  // 1. Return fresh in-memory cached data if within TTL
  if (!forceRefresh && rateCache.data && (now - rateCache.timestamp < cacheTtlMs)) {
    return {
      success: true,
      status: rateCache.isLive ? 'live_cached' : 'indicative_cached',
      rates: rateCache.data,
      isLive: rateCache.isLive,
      isCached: true,
      cacheAgeSeconds: Math.round((now - rateCache.timestamp) / 1000),
      expiresInSeconds: Math.max(0, Math.round((rateCache.timestamp + cacheTtlMs - now) / 1000)),
      disclaimer: 'Market benchmark rates are indicative and exclude local making charges & GST.'
    };
  }

  // 2. If API Key is unconfigured, return baseline indicative data with clear unconfigured status
  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GOLDAPI_KEY_HERE') {
    const indicativeData = {
      ...DEFAULT_INDICATIVE_RATES,
      formatted: {
        ...DEFAULT_INDICATIVE_RATES.formatted,
        lastUpdated: formatTimestampIST(now)
      }
    };

    rateCache = {
      data: indicativeData,
      timestamp: now,
      isLive: false,
      error: null
    };

    return {
      success: true,
      status: 'unconfigured_indicative',
      isLive: false,
      isCached: false,
      rates: indicativeData,
      note: 'Live provider API key (GOLD_API_KEY) is not configured in .env. Displaying showroom baseline benchmark rates.',
      setupGuide: 'To enable automatic live rates from GoldAPI.io, add GOLD_API_KEY=<your_free_key> to .env file.',
      disclaimer: 'Indicative market benchmark rates. Final billing rate determined at showroom counter.'
    };
  }

  // 3. Attempt live fetch from GoldAPI.io
  try {
    const goldHeaders = {
      'x-access-token': apiKey.trim(),
      'Content-Type': 'application/json'
    };

    // Parallel fetch for Gold and Silver
    const [goldRes, silverRes] = await Promise.all([
      fetch('https://www.goldapi.io/api/XAU/INR', { headers: goldHeaders }),
      fetch('https://www.goldapi.io/api/XAG/INR', { headers: goldHeaders })
    ]);

    if (!goldRes.ok) {
      const errorText = await goldRes.text().catch(() => '');
      throw new Error(`GoldAPI HTTP Error ${goldRes.status}: ${errorText.substring(0, 100)}`);
    }

    const goldData = await goldRes.json();
    let silverData = null;
    if (silverRes.ok) {
      silverData = await silverRes.json().catch(() => null);
    }

    const parsedRates = parseGoldApiResponse(goldData, silverData);

    // Save to cache
    rateCache = {
      data: parsedRates,
      timestamp: now,
      isLive: true,
      error: null
    };

    return {
      success: true,
      status: 'live',
      isLive: true,
      isCached: false,
      rates: parsedRates,
      cacheAgeSeconds: 0,
      disclaimer: 'Live spot market rates in INR per gram. Excludes local making charges and GST.'
    };

  } catch (err) {
    // Safe error logging without revealing API keys
    console.error('[RateService Error]', err.message || 'Failed to fetch precious rates');

    // If we have previously cached data, return it as stale fallback
    if (rateCache.data) {
      return {
        success: true,
        status: 'stale_fallback',
        isLive: false,
        isCached: true,
        isStale: true,
        rates: rateCache.data,
        cacheAgeSeconds: Math.round((now - rateCache.timestamp) / 1000),
        warning: 'Live rate update currently unreachable. Serving last successfully cached rates.',
        disclaimer: 'Stale benchmark rates. Verify with showroom before transacting.'
      };
    }

    // Otherwise return default indicative fallback
    const fallbackData = {
      ...DEFAULT_INDICATIVE_RATES,
      formatted: {
        ...DEFAULT_INDICATIVE_RATES.formatted,
        lastUpdated: formatTimestampIST(now)
      }
    };

    return {
      success: true,
      status: 'error_fallback',
      isLive: false,
      isCached: false,
      isStale: true,
      rates: fallbackData,
      error: 'Unable to reach live rates provider. Displaying baseline indicative rates.',
      disclaimer: 'Indicative showroom benchmark rates.'
    };
  }
}

/**
 * Resets cache for testing purposes
 */
export function _resetRateCache() {
  rateCache = {
    data: null,
    timestamp: 0,
    isLive: false,
    error: null
  };
}
