import { useState, useEffect, useCallback, useRef } from 'react';

const LOCAL_STORAGE_KEY = 'vedha_radha_rates_cache_v1';
const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

const FALLBACK_INITIAL_RATES = {
  gold22k: '6,742',
  gold24k: '7,355',
  gold18k: '5,516',
  silver1g: '94.50',
  silver999: '102.16',
  change: '+ ₹32',
  isUp: true,
  lastUpdated: 'Today, Indicative Benchmark'
};

export function usePreciousRates() {
  const [rates, setRates] = useState(FALLBACK_INITIAL_RATES);
  const [status, setStatus] = useState('loading'); // 'loading' | 'live' | 'live_cached' | 'unconfigured_indicative' | 'stale_fallback'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);
  const [disclaimer, setDisclaimer] = useState('');
  const isMountedRef = useRef(true);

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
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = `/api/rates${force ? '?force=true' : ''}`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Rates API returned status ${response.status}`);
      }

      const data = await response.json();

      if (!isMountedRef.current) return;

      if (data && data.success && data.rates && data.rates.formatted) {
        setRates(data.rates.formatted);
        setStatus(data.status || 'live');
        setMeta(data.rates.meta || null);
        setDisclaimer(data.disclaimer || 'Market benchmark rates are indicative.');
        saveLocalCache(data);
      } else {
        throw new Error(data.error || 'Invalid rate payload received');
      }

    } catch (err) {
      if (!isMountedRef.current) return;

      // Check local cache on failure
      const localCache = loadLocalCache();
      if (localCache && localCache.rates && localCache.rates.formatted) {
        setRates(localCache.rates.formatted);
        setStatus('stale_fallback');
        setMeta(localCache.rates.meta || null);
        setDisclaimer('Network offline. Displaying last cached benchmark rates.');
        setError('Live rate fetch failed. Showing cached data.');
      } else {
        setStatus('error_fallback');
        setError('Unable to fetch live rates. Using baseline showroom benchmark.');
      }
    } finally {
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
