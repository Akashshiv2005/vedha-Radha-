import { authClient } from './authClient';
import { buildApiUrl } from './config.js';

/**
 * Typed API client for Veda Radha Admin Product Inventory
 */
export const productsClient = {
  getAuthHeaders() {
    const token = authClient.getToken();
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  },

  /**
   * Fetch paginated and filtered products from FastAPI PostgreSQL backend
   */
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page);
    if (params.pageSize || params.page_size) query.set('page_size', params.pageSize || params.page_size);
    if (params.search) query.set('search', params.search);
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.status && params.status !== 'all') query.set('status', params.status);
    if (params.item_type && params.item_type !== 'all') query.set('item_type', params.item_type);
    if (params.availability && params.availability !== 'all') query.set('availability', params.availability);
    if (params.sort_by) query.set('sort_by', params.sort_by);
    if (params.sort_order) query.set('sort_order', params.sort_order);

    const queryString = query.toString();
    const url = buildApiUrl(`/api/admin/products${queryString ? `?${queryString}` : ''}`);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          items: data.items || [],
          total: data.total ?? (data.items || []).length,
          page: data.page || 1,
          pageSize: data.page_size || 50,
          totalPages: data.total_pages || 1
        };
      }

      // If unauthorized (401/403) e.g. token expired, synchronize from public catalogue
      if (response.status === 401 || response.status === 403) {
        const publicUrl = buildApiUrl(`/api/products${queryString ? `?${queryString}` : ''}`);
        const pubResp = await fetch(publicUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        if (pubResp.ok) {
          const pubData = await pubResp.json();
          return {
            success: true,
            items: pubData.items || [],
            total: pubData.total ?? (pubData.items || []).length,
            page: pubData.page || 1,
            pageSize: pubData.page_size || 50,
            totalPages: pubData.total_pages || 1,
            isPublicFallback: true
          };
        }
      }

      return {
        success: false,
        error: `Server returned status ${response.status}`,
        items: [],
        total: 0
      };
    } catch (err) {
      console.warn('Failed to fetch products from backend:', err);
      // Fallback query to public catalogue if admin endpoint is unreachable
      try {
        const publicUrl = buildApiUrl(`/api/products${queryString ? `?${queryString}` : ''}`);
        const pubResp = await fetch(publicUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        if (pubResp.ok) {
          const pubData = await pubResp.json();
          return {
            success: true,
            items: pubData.items || [],
            total: pubData.total ?? (pubData.items || []).length,
            page: pubData.page || 1,
            pageSize: pubData.page_size || 50,
            totalPages: pubData.total_pages || 1,
            isPublicFallback: true
          };
        }
      } catch {}

      return {
        success: false,
        error: 'Network connection error',
        items: [],
        total: 0
      };
    }
  },

  /**
   * Fetch single product by UUID or SKU
   */
  async getProduct(idOrSku) {
    try {
      const response = await fetch(buildApiUrl(`/api/admin/products/${encodeURIComponent(idOrSku)}`), {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  },

  /**
   * Helper to normalize product fields before sending to API
   */
  _cleanProductPayload(payload) {
    if (!payload || typeof payload !== 'object') return payload;
    const clean = { ...payload };

    // Clean price
    if (clean.price !== undefined && clean.price !== null) {
      if (typeof clean.price === 'string') {
        const num = parseFloat(clean.price.replace(/[^\d.]/g, ''));
        clean.price = isNaN(num) ? 0 : num;
      }
    }
    if (clean.numericPrice !== undefined && clean.numericPrice !== null) {
      if (typeof clean.numericPrice === 'string') {
        const num = parseInt(clean.numericPrice.replace(/[^\d]/g, ''), 10);
        clean.numericPrice = isNaN(num) ? 0 : num;
      }
    }
    return clean;
  },

  /**
   * Helper to extract human-readable error from FastAPI response
   */
  _extractErrorMessage(data, status) {
    if (status === 401 || status === 403) {
      return 'Administrator authentication required. Please sign in.';
    }
    if (!data) return `Request failed (HTTP ${status})`;
    if (data.error) return data.error;
    if (data.detail) {
      if (typeof data.detail === 'string') return data.detail;
      if (data.detail.error) return data.detail.error;
      if (Array.isArray(data.detail)) {
        return data.detail.map(d => d.msg || `${d.loc?.join('.')}: invalid`).join(', ');
      }
    }
    if (data.message) return data.message;
    return `Server error (${status})`;
  },

  /**
   * Create a new product in PostgreSQL
   */
  async createProduct(productData) {
    try {
      const cleanData = this._cleanProductPayload(productData);
      const response = await fetch(buildApiUrl('/api/admin/products'), {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(cleanData)
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return { 
          success: false, 
          error: this._extractErrorMessage(data, response.status) 
        };
      }

      return { success: true, product: data };
    } catch {
      return { success: false, error: 'Network connection error' };
    }
  },

  /**
   * Update an existing product
   */
  async updateProduct(idOrSku, updatedFields) {
    try {
      const cleanData = this._cleanProductPayload(updatedFields);
      const response = await fetch(buildApiUrl(`/api/admin/products/${encodeURIComponent(idOrSku)}`), {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(cleanData)
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return { 
          success: false, 
          error: this._extractErrorMessage(data, response.status) 
        };
      }

      return { success: true, product: data };
    } catch {
      return { success: false, error: 'Network connection error' };
    }
  },

  /**
   * Soft-deactivate or delete a product
   */
  async deleteProduct(idOrSku, hard = false) {
    try {
      const url = buildApiUrl(`/api/admin/products/${encodeURIComponent(idOrSku)}${hard ? '?hard=true' : ''}`);
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return { 
          success: false, 
          error: this._extractErrorMessage(data, response.status) 
        };
      }

      return { 
        success: true, 
        message: data?.message || 'Product removed successfully', 
        data 
      };
    } catch {
      return { success: false, error: 'Network connection error' };
    }
  },

  /**
   * Import products from CSV or XLSX
   */
  async importProducts(file, dryRun = false) {
    const token = authClient.getToken();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dry_run', String(dryRun));

    try {
      const response = await fetch(buildApiUrl('/api/admin/products/import'), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return {
          success: false,
          error: data?.error || data?.detail?.error || 'Import failed',
          details: data
        };
      }

      return data;
    } catch (err) {
      return { success: false, error: 'Network error during file upload' };
    }
  },

  /**
   * Upload product image to MinIO via FastAPI
   */
  async uploadImage(file) {
    const token = authClient.getToken();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(buildApiUrl('/api/admin/products/upload-image'), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return {
          success: false,
          error: data?.error || data?.detail?.error || data?.detail || 'Failed to upload image'
        };
      }

      return {
        success: true,
        objectKey: data.object_key,
        imageUrl: data.image_url,
        data
      };
    } catch (err) {
      return { success: false, error: 'Network error during image upload' };
    }
  }
};
