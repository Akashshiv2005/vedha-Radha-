import { cartClient } from './cartClient.js';
import { customerAuthClient } from './customerAuthClient.js';
import { buildApiUrl } from './config.js';

/**
 * Frontend client for Vedha Radha Checkout, Payment Gateways & Order Fulfillment
 */
export const checkoutClient = {
  getHeaders(orderToken = null) {
    const cartToken = cartClient.getToken();
    const customerToken = customerAuthClient.getToken();

    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(cartToken ? { 'X-Cart-Token': cartToken } : {}),
      ...(orderToken ? { 'X-Order-Token': orderToken } : {}),
      ...(customerToken ? { 'Authorization': `Bearer ${customerToken}` } : {})
    };
  },

  _extractErrorMessage(data, status) {
    if (!data) return `Request failed (${status})`;
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
   * Fetch authoritative checkout quote from PostgreSQL
   */
  async getQuote() {
    try {
      const response = await fetch(buildApiUrl('/api/checkout/quote'), {
        method: 'POST',
        headers: this.getHeaders()
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return { success: false, error: this._extractErrorMessage(data, response.status) };
      }
      return { success: true, quote: data };
    } catch {
      return { success: false, error: 'Network error communicating with checkout service' };
    }
  },

  /**
   * Validate stock and constraints on cart
   */
  async validateCart() {
    try {
      const response = await fetch(buildApiUrl('/api/checkout/validate'), {
        method: 'POST',
        headers: this.getHeaders()
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return { success: false, error: this._extractErrorMessage(data, response.status) };
      }
      return { success: true, quote: data };
    } catch {
      return { success: false, error: 'Network error validating cart' };
    }
  },

  /**
   * Place an official customer order
   */
  async placeOrder(payload) {
    try {
      const response = await fetch(buildApiUrl('/api/checkout/create-order'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return { success: false, error: this._extractErrorMessage(data, response.status) };
      }
      return { success: true, order: data };
    } catch {
      return { success: false, error: 'Network error placing order' };
    }
  },

  /**
   * Initialize online payment with gateway
   */
  async createPayment(orderNumber) {
    try {
      const response = await fetch(buildApiUrl('/api/payments/create'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ order_number: orderNumber })
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return { success: false, error: this._extractErrorMessage(data, response.status) };
      }
      return { success: true, payment: data };
    } catch {
      return { success: false, error: 'Network error initializing payment gateway' };
    }
  },

  /**
   * Verify online payment response
   */
  async verifyPayment(payload) {
    try {
      const response = await fetch(buildApiUrl('/api/payments/verify'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return { success: false, error: this._extractErrorMessage(data, response.status) };
      }
      return { success: true, result: data };
    } catch {
      return { success: false, error: 'Network error verifying payment' };
    }
  },

  /**
   * Retrieve order details with secure guest token or customer account
   */
  async getOrder(orderNumber, orderToken = null) {
    try {
      const response = await fetch(buildApiUrl(`/api/orders/${orderNumber}`), {
        method: 'GET',
        headers: this.getHeaders(orderToken)
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return { success: false, error: this._extractErrorMessage(data, response.status) };
      }
      return { success: true, order: data };
    } catch {
      return { success: false, error: 'Network error retrieving order details' };
    }
  },

  /**
   * Retrieve customer's past orders
   */
  async getMyOrders() {
    try {
      const response = await fetch(buildApiUrl('/api/orders'), {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return { success: false, error: this._extractErrorMessage(data, response.status), orders: [] };
      }
      return { success: true, orders: Array.isArray(data) ? data : [] };
    } catch {
      return { success: false, error: 'Network error fetching orders', orders: [] };
    }
  }
};
