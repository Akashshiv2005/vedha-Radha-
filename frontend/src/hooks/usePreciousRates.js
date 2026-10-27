import { useState, useEffect, useCallback, useRef } from 'react';
import { buildApiUrl } from '../api/config';

const LOCAL_STORAGE_KEY = 'vedha_radha_rates_cache_v2';
const REFRESH_INTERVAL_MS = 300 * 1000; // 300 seconds (5 minutes)

const FALLBACK_INITIAL_RATES = {
  gold22k: '13,085',
  gold24k: '14,275',
  gold18k: '10,705',
  gold14k: '8,550',
  silver1g: '220.00',
  silver999: '237.60',
  change: '+ ₹15',
  isUp: true,
  lastUpdated: 'The Jewellers Association Benchmark'
};

export function usePreciousRates() {
  const [rates, setRates] = useState(FALLBACK_INITIAL_RATES);
  const [status, setStatus] = useState('loading'); // 'loading' | 'live' | 'live_cached' | 'unconfigured_indicative' | 'stale_fallback'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);
  const [disclaimer, setDisclaimer] = useState('');
  const isMountedRef = useRef(true);
  const isFetchingRef = useRef(false);

  // Helper to load cache from localStorage
  const loadLocalCache = useCallback(() => {
    try {
      const cachedStr = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cachedStr) {
        const parsed = JSON.parse(cachedStr);
        if (parsed && parsed.rates) {
          return parsed;
        }
      }
    } catch {
      // Ignore localStorage read errors
    }
    return null;
  }, []);

  // Save to localStorage
  const saveLocalCache = useCallback((ratePayload) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        ...ratePayload,
        savedAt: Date.now()
      }));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const fetchRates = useCallback(async (force = false) => {
    // Prevent overlapping requests
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // Call primary live endpoint with fallback to prices/gold-silver
      let response = await fetch(buildApiUrl(`/api/gold-rates/live${force ? '?force=true' : ''}`));
      if (!response.ok) {
        response = await fetch(buildApiUrl(`/api/prices/gold-silver${force ? '?force=true' : ''}`));
      }

      if (!response.ok) {
        throw new Error(`Rates API returned status ${response.status}`);
      }

      const data = await response.json();

      if (!isMountedRef.current) return;

      if (data && data.success && data.rates && data.rates.formatted) {
        setRates(data.rates.formatted);
        setStatus(data.status || (data.is_stale ? 'stale_fallback' : 'live'));
        setMeta(data.rates.meta || null);
        setDisclaimer(data.disclaimer || 'Live spot benchmark rates from OroPocket.');
        saveLocalCache(data);
      } else {
        throw new Error(data.error || 'Invalid rate payload received');
      }

    } catch (err) {
      if (!isMountedRef.current) return;

      // Preserve last valid displayed price if refresh temporarily fails
      const localCache = loadLocalCache();
      if (localCache && localCache.rates && localCache.rates.formatted) {
        setRates(localCache.rates.formatted);
        setStatus('stale_fallback');
        setMeta(localCache.rates.meta || null);
        setDisclaimer('Network offline. Displaying last cached benchmark rates.');
        setError('Live rate fetch failed. Showing cached data.');
      } else {
        setStatus('stale_fallback');
        setError('Unable to fetch live rates. Using baseline showroom benchmark.');
      }
    } finally {
      isFetchingRef.current = false;
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [loadLocalCache, saveLocalCache]);

  // Initial fetch and timer-based interval refresh
  useEffect(() => {
    isMountedRef.current = true;

    // Load local cache immediately for instantaneous render
    const local = loadLocalCache();
    if (local && local.rates && local.rates.formatted) {
      setRates(local.rates.formatted);
      setStatus(local.status || 'live_cached');
    }

    // Perform fetch
    fetchRates(false);

    // Refresh every 10 minutes
    const intervalId = setInterval(() => {
      fetchRates(false);
    }, REFRESH_INTERVAL_MS);

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [fetchRates, loadLocalCache]);

  // Manual rate override (for showroom staff)
  const updateManualRates = useCallback((newRates) => {
    setRates(prev => ({
      ...prev,
      ...newRates,
      lastUpdated: 'Updated by Showroom Staff'
    }));
    setStatus('manual_override');
  }, []);

  return {
    rates,
    status,
    isLoading,
    isLive: status === 'live' || status === 'live_cached',
    isCached: status === 'live_cached' || status === 'indicative_cached' || status === 'stale_fallback',
    isStale: status === 'stale_fallback',
    isUnconfigured: status === 'unconfigured_indicative',
    error,
    meta,
    disclaimer,
    refreshRates: () => fetchRates(true),
    updateManualRates
  };
}
