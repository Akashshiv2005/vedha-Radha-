import { authClient } from './authClient';
import { buildApiUrl } from './config.js';

/**
 * API client for Veda Radha Admin Orders and Reservations
 */
export const ordersClient = {
  getAuthHeaders() {
    const token = authClient.getToken();
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  },

  _extractErrorMessage(data, status) {
    if (!data) return `Request failed with status ${status}`;
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail)) {
      return data.detail.map(d => {
        const field = Array.isArray(d.loc) && d.loc.length > 0 ? d.loc[d.loc.length - 1] : '';
        const fieldName = field && field !== 'body' ? `${field.replace(/_/g, ' ')}: ` : '';
        return `${fieldName}${d.msg || d.message || 'Validation error'}`;
      }).join(', ');
    }
    if (data.detail && typeof data.detail === 'object') {
      return data.detail.error || data.detail.message || JSON.stringify(data.detail);
    }
    return data.error || data.message || `Request failed (${status})`;
  },

  /**
   * Fetch all orders from PostgreSQL database
   */
  async getOrders() {
    try {
      const response = await fetch(buildApiUrl('/api/admin/orders'), {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return { success: false, error: this._extractErrorMessage(data, response.status), data: [] };
      }
      return { success: true, data: Array.isArray(data) ? data : [] };
    } catch {
      return { success: false, error: 'Network connection error', data: [] };
    }
  },

  /**
   * Create a new customer order in the database with authoritative pricing
   */
  async createOrder(payload) {
    try {
      const response = await fetch(buildApiUrl('/api/admin/orders'), {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return { success: false, error: this._extractErrorMessage(data, response.status) };
      }
      return { success: true, data };
    } catch {
      return { success: false, error: 'Network connection error' };
    }
  },

  /**
   * Update the status of an existing customer order in the database
   */
  async updateOrderStatus(idOrNumber, newStatus, notes = null) {
    try {
      const response = await fetch(buildApiUrl(`/api/admin/orders/${idOrNumber}/status`), {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status: newStatus, notes })
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return { success: false, error: this._extractErrorMessage(data, response.status) };
      }
      return { success: true, data };
    } catch {
      return { success: false, error: 'Network connection error' };
    }
  }
};
