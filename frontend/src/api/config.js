/**
 * Centralized API Configuration for Vedha Radha Storefront & Admin Portal
 * All frontend requests use this module to resolve backend endpoints from .env
 */

// Reads VITE_API_BASE_URL, VITE_BACKEND_URL, or VITE_API_URL from frontend/.env
const rawBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  ''
).trim();

// Strip trailing slashes for clean URL concatenation
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

/**
 * Builds an API endpoint URL strictly using .env configuration.
 * When VITE_API_BASE_URL is set in .env (e.g. custom domain, IP, or port):
 *   buildApiUrl('/api/products') -> `${VITE_API_BASE_URL}/api/products`
 * When VITE_API_BASE_URL is empty:
 *   buildApiUrl('/api/products') -> "/api/products" (relative path)
 *
 * @param {string} endpoint - Relative path (e.g. "/api/products" or "api/auth/login")
 * @returns {string} Fully qualified or relative URL
 */
export function buildApiUrl(endpoint) {
  if (!endpoint) return API_BASE_URL || '';
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return API_BASE_URL ? `${API_BASE_URL}${cleanEndpoint}` : cleanEndpoint;
}

export default {
  API_BASE_URL,
  buildApiUrl,
};
