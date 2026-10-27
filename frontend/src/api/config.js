/**
 * Centralized API Configuration for Vedha Radha Storefront & Admin Portal
 * All frontend requests use this module to resolve backend endpoints from .env
 */

// Reads VITE_API_BASE_URL or VITE_API_URL from frontend/.env
const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim();

// Strip trailing slashes for clean URL concatenation
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

/**
 * Builds a fully qualified API endpoint URL using .env configuration.
 * If VITE_API_BASE_URL is "http://127.0.0.1:8000":
 *   buildApiUrl('/api/products') -> "http://127.0.0.1:8000/api/products"
 * If VITE_API_BASE_URL is empty:
 *   buildApiUrl('/api/products') -> "/api/products" (proxied via Vite)
 *
 * @param {string} endpoint - Relative path (e.g. "/api/products" or "api/auth/login")
 * @returns {string} Fully qualified URL
 */
export function buildApiUrl(endpoint) {
  if (!endpoint) return API_BASE_URL || '';
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

export default {
  API_BASE_URL,
  buildApiUrl,
};
