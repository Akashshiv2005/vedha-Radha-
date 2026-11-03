import { buildApiUrl } from './config.js';

const GUEST_CART_TOKEN_KEY = 'VR_GUEST_CART_TOKEN';

export const cartClient = {
  getToken() {
    try {
      return localStorage.getItem(GUEST_CART_TOKEN_KEY) || null;
    } catch {
      return null;
    }
  },

  setToken(token) {
    try {
      if (token) {
        localStorage.setItem(GUEST_CART_TOKEN_KEY, token);
      }
    } catch (e) {
      console.warn('Failed to persist cart token in localStorage:', e);
    }
  },

  clearToken() {
    try {
      localStorage.removeItem(GUEST_CART_TOKEN_KEY);
    } catch (e) {
      console.warn('Failed to clear cart token:', e);
    }
  },

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['X-Cart-Token'] = token;
    }
    return headers;
  },

  saveTokenFromResponse(response, data) {
    // 1. Check response header
    const headerToken = response?.headers?.get?.('X-Cart-Token');
    if (headerToken) {
      this.setToken(headerToken);
      return headerToken;
    }
    // 2. Check JSON payload
    if (data?.cart_token) {
      this.setToken(data.cart_token);
      return data.cart_token;
    }
    return null;
  },

  normalizeCartItem(item) {
    if (!item) return null;
    const numPrice = Number(item.current_price || item.unit_price_snapshot || 0);
    return {
      id: item.id,
      productId: item.product_id,
      name: item.name || 'Jewellery Piece',
      sku: item.sku || '',
      price: `₹ ${numPrice.toLocaleString('en-IN')}`,
      numericPrice: numPrice,
      unitPriceSnapshot: Number(item.unit_price_snapshot || 0),
      priceChanged: Boolean(item.price_changed),
      priceChangeDiff: Number(item.price_change_diff || 0),
      quantity: Number(item.quantity || 1),
      itemSubtotal: Number(item.item_subtotal || numPrice * Number(item.quantity || 1)),
      image: item.image_url || '/images/neutral_product_placeholder.svg',
      details: item.details || `SKU: ${item.sku || ''} • Qty: ${item.quantity || 1}`,
      isUnique: Boolean(item.is_unique),
      isAvailable: Boolean(item.is_available),
      stockQuantity: Number(item.stock_quantity || 1),
    };
  },

  formatCartResponse(data, response) {
    if (response && data) {
      this.saveTokenFromResponse(response, data);
    }
    const items = Array.isArray(data?.items)
      ? data.items.map((i) => this.normalizeCartItem(i))
      : [];

    const subtotal = Number(data?.subtotal ?? (data?.cart_total || 0));
    const couponDiscount = Number(data?.coupon_discount || 0);
    const tax = Number(data?.tax || 0);
    const deliveryCharge = Number(data?.delivery_charge || 0);
    const cartTotal = Number(data?.cart_total ?? (subtotal - couponDiscount));
    const totalPayable = Math.max(0, subtotal - couponDiscount + tax + deliveryCharge);

    return {
      success: true,
      cartToken: data?.cart_token || this.getToken(),
      items,
      itemCount: Number(data?.item_count || items.length),
      subtotal,
      appliedCouponCode: data?.applied_coupon_code || null,
      couponDiscount,
      couponDetails: data?.coupon_details || null,
      tax,
      deliveryCharge,
      cartTotal,
      totalPayable,
      totalAmount: totalPayable,
      hasPriceChanges: Boolean(data?.has_price_changes),
      hasUnavailableItems: Boolean(data?.has_unavailable_items),
    };
  },

  /**
   * Retrieve guest cart
   */
  async getCart() {
    try {
      const response = await fetch(buildApiUrl('/api/cart'), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data) {
        return {
          success: false,
          items: [],
          itemCount: 0,
          totalAmount: 0,
          subtotal: 0,
          couponDiscount: 0,
          tax: 0,
          deliveryCharge: 0,
          appliedCouponCode: null,
        };
      }

      return this.formatCartResponse(data, response);
    } catch (err) {
      console.warn('Network error fetching cart:', err);
      return {
        success: false,
        items: [],
        itemCount: 0,
        totalAmount: 0,
        subtotal: 0,
        couponDiscount: 0,
        tax: 0,
        deliveryCharge: 0,
        appliedCouponCode: null,
      };
    }
  },

  /**
   * Add a product to the cart
   */
  async addItem(productId, quantity = 1) {
    if (!productId) {
      return { success: false, error: 'Product ID is required.' };
    }

    try {
      const response = await fetch(buildApiUrl('/api/cart/items'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          product_id: String(productId),
          quantity: Math.max(1, Number(quantity) || 1),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        return {
          success: false,
          error: data?.detail || data?.error || 'Failed to add item to bag.',
        };
      }

      return this.formatCartResponse(data, response);
    } catch (err) {
      return { success: false, error: 'Network error adding piece to bag.' };
    }
  },

  /**
   * Update quantity of a cart item
   */
  async updateQuantity(itemId, quantity) {
    if (!itemId || quantity < 1) {
      return { success: false, error: 'Invalid item or quantity.' };
    }

    try {
      const response = await fetch(buildApiUrl(`/api/cart/items/${itemId}`), {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ quantity: Number(quantity) }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        return {
          success: false,
          error: data?.detail || data?.error || 'Failed to update quantity.',
        };
      }

      return this.formatCartResponse(data, response);
    } catch {
      return { success: false, error: 'Network error updating quantity.' };
    }
  },

  /**
   * Remove single item from cart
   */
  async removeItem(itemId) {
    if (!itemId) {
      return { success: false, error: 'Item ID is required.' };
    }

    try {
      const response = await fetch(buildApiUrl(`/api/cart/items/${itemId}`), {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        return {
          success: false,
          error: data?.detail || data?.error || 'Failed to remove item.',
        };
      }

      return this.formatCartResponse(data, response);
    } catch {
      return { success: false, error: 'Network error removing item from bag.' };
    }
  },

  /**
   * Apply promotional coupon code
   */
  async applyCoupon(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, error: 'Please enter a valid coupon code.' };
    }

    try {
      const response = await fetch(buildApiUrl('/api/cart/coupon/apply'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ code: cleanCode }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        return {
          success: false,
          error: data?.detail || data?.error || 'Failed to apply coupon.',
        };
      }

      return this.formatCartResponse(data, response);
    } catch {
      return { success: false, error: 'Network error applying coupon code.' };
    }
  },

  /**
   * Remove applied coupon
   */
  async removeCoupon() {
    try {
      const response = await fetch(buildApiUrl('/api/cart/coupon'), {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        return {
          success: false,
          error: data?.detail || data?.error || 'Failed to remove coupon.',
        };
      }

      return this.formatCartResponse(data, response);
    } catch {
      return { success: false, error: 'Network error removing coupon.' };
    }
  },

  /**
   * Clear entire cart
   */
  async clearCart() {
    try {
      const response = await fetch(buildApiUrl('/api/cart'), {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        return { success: false, error: 'Failed to clear cart.' };
      }

      this.saveTokenFromResponse(response, data);

      return {
        success: true,
        items: [],
        itemCount: 0,
        totalAmount: 0,
      };
    } catch {
      return { success: false, error: 'Network error clearing bag.' };
    }
  },

  /**
   * Get cart summary
   */
  async getSummary() {
    try {
      const response = await fetch(buildApiUrl('/api/cart/summary'), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        return { success: false, itemCount: 0, totalAmount: 0, isAvailable: true };
      }

      return {
        success: true,
        itemCount: Number(data.item_count || 0),
        totalAmount: Number(data.cart_total || data.subtotal || 0),
        isAvailable: Boolean(data.is_available),
        itemSummaries: data.item_summaries || [],
      };
    } catch {
      return { success: false, itemCount: 0, totalAmount: 0, isAvailable: true };
    }
  },
};

