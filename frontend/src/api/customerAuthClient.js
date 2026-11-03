import { buildApiUrl } from './config.js';

const CUSTOMER_AUTH_TOKEN_KEY = 'VR_CUSTOMER_AUTH_TOKEN';
const CUSTOMER_USER_KEY = 'VR_CUSTOMER_AUTH_USER';

export const customerAuthClient = {
  getToken() {
    try {
      return localStorage.getItem(CUSTOMER_AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  getStoredCustomer() {
    try {
      const raw = localStorage.getItem(CUSTOMER_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setSession(token, customer) {
    try {
      if (token) localStorage.setItem(CUSTOMER_AUTH_TOKEN_KEY, token);
      if (customer) localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(customer));
    } catch (e) {
      console.warn('Failed to persist customer session:', e);
    }
  },

  clearSession() {
    try {
      localStorage.removeItem(CUSTOMER_AUTH_TOKEN_KEY);
      localStorage.removeItem(CUSTOMER_USER_KEY);
    } catch (e) {
      console.warn('Failed to clear customer session:', e);
    }
  },

  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  },

  /**
   * Register a new customer
   */
  async register({
    customer_name,
    mobile_number,
    alternative_mobile_number,
    full_address,
    pin_code,
    password,
    confirm_password
  }) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(buildApiUrl('/api/customer/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          customer_name: customer_name?.trim(),
          mobile_number: mobile_number?.trim(),
          alternative_mobile_number: alternative_mobile_number?.trim() || null,
          full_address: full_address?.trim(),
          pin_code: pin_code?.trim(),
          password,
          confirm_password
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        return {
          success: false,
          error: data?.detail || data?.error || 'Registration failed. Please check your details.'
        };
      }

      return {
        success: true,
        message: data.message || 'Registration successful.',
        customer: data.customer
      };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { success: false, error: 'Registration request timed out. Please try again.' };
      }
      return { success: false, error: 'Unable to connect to registration service.' };
    }
  },

  /**
   * Log in customer using mobile number & password
   */
  async login({ mobile_number, password }) {
    if (!mobile_number || !password) {
      return {
        success: false,
        error: 'Please enter both mobile number and password.'
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(buildApiUrl('/api/customer/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          mobile_number: mobile_number.trim(),
          password
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        return {
          success: false,
          error: data?.detail || data?.error || 'Unable to sign in. Check your credentials.'
        };
      }

      this.setSession(data.token, data.customer);

      return {
        success: true,
        customer: data.customer,
        token: data.token
      };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { success: false, error: 'Login request timed out. Please try again.' };
      }
      return { success: false, error: 'Unable to connect to authentication service.' };
    }
  },

  /**
   * Fetch current customer profile from /api/customer/auth/me
   */
  async getProfile() {
    const token = this.getToken();
    if (!token) {
      return { success: false, customer: null };
    }

    try {
      const response = await fetch(buildApiUrl('/api/customer/auth/me'), {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        this.clearSession();
        return { success: false, customer: null };
      }

      const data = await response.json();
      if (data?.success && data?.customer) {
        this.setSession(token, data.customer);
        return { success: true, customer: data.customer };
      }

      this.clearSession();
      return { success: false, customer: null };
    } catch {
      const stored = this.getStoredCustomer();
      return { success: !!stored, customer: stored };
    }
  },

  /**
   * Update customer profile details
   */
  async updateProfile(profileData) {
    const token = this.getToken();
    if (!token) return { success: false, error: 'Not authenticated' };

    try {
      const response = await fetch(buildApiUrl('/api/customer/profile'), {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        return {
          success: false,
          error: data?.detail || data?.error || 'Failed to update profile.'
        };
      }

      this.setSession(token, data.customer);
      return { success: true, customer: data.customer, message: data.message };
    } catch {
      return { success: false, error: 'Network error updating profile.' };
    }
  },

  /**
   * Change customer password
   */
  async changePassword({ current_password, new_password, confirm_password }) {
    const token = this.getToken();
    if (!token) return { success: false, error: 'Not authenticated' };

    try {
      const response = await fetch(buildApiUrl('/api/customer/auth/change-password'), {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          current_password,
          new_password,
          confirm_password
        })
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        return {
          success: false,
          error: data?.detail || data?.error || 'Failed to change password.'
        };
      }

      return { success: true, message: data.message };
    } catch {
      return { success: false, error: 'Network error changing password.' };
    }
  },

  /**
   * Step 1 of Forgot Password: Request OTP
   */
  async forgotPassword(mobile_number) {
    try {
      const response = await fetch(buildApiUrl('/api/customer/auth/forgot-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ mobile_number: mobile_number?.trim() })
      });

      const data = await response.json().catch(() => null);

      if (response.status === 503) {
        return {
          success: false,
          isSmsUnconfigured: true,
          error: data?.detail || 'SMS OTP service is currently being configured. Please contact our showroom concierge for account recovery.'
        };
      }

      if (!response.ok || !data?.success) {
        return {
          success: false,
          error: data?.detail || data?.error || 'Unable to process password reset request.'
        };
      }

      return {
        success: true,
        message: data.message,
        dev_otp: data.dev_otp
      };
    } catch {
      return { success: false, error: 'Network error connecting to recovery service.' };
    }
  },

  /**
   * Step 2 of Forgot Password: Verify OTP
   */
  async verifyOTP({ mobile_number, otp_code }) {
    try {
      const response = await fetch(buildApiUrl('/api/customer/auth/verify-otp'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          mobile_number: mobile_number?.trim(),
          otp_code: otp_code?.trim()
        })
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        return {
          success: false,
          error: data?.detail || data?.error || 'Invalid or expired OTP code.'
        };
      }

      return {
        success: true,
        reset_token: data.reset_token,
        message: data.message
      };
    } catch {
      return { success: false, error: 'Network error during OTP verification.' };
    }
  },

  /**
   * Step 3 of Forgot Password: Reset Password
   */
  async resetPassword({ reset_token, new_password, confirm_password }) {
    try {
      const response = await fetch(buildApiUrl('/api/customer/auth/reset-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          reset_token,
          new_password,
          confirm_password
        })
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        return {
          success: false,
          error: data?.detail || data?.error || 'Failed to reset password.'
        };
      }

      return {
        success: true,
        message: data.message
      };
    } catch {
      return { success: false, error: 'Network error resetting password.' };
    }
  },

  /**
   * Fetch customer order history
   */
  async getOrderHistory() {
    const token = this.getToken();
    if (!token) return { success: false, orders: [] };

    try {
      const response = await fetch(buildApiUrl('/api/customer/orders'), {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        return { success: false, orders: [], error: data?.detail || 'Failed to load orders.' };
      }

      return { success: true, orders: data.orders || [] };
    } catch {
      return { success: false, orders: [], error: 'Network error loading orders.' };
    }
  },

  /**
   * Log out customer
   */
  async logout() {
    const token = this.getToken();
    this.clearSession();

    if (token) {
      try {
        await fetch(buildApiUrl('/api/customer/auth/logout'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      } catch {
        // Ignore network errors on logout
      }
    }

    return { success: true };
  }
};

