/**
 * Typed API client for Veda Radha Admin Authentication
 */

const AUTH_STORAGE_KEY = 'VR_ADMIN_AUTH_TOKEN';
const USER_STORAGE_KEY = 'VR_ADMIN_AUTH_USER';

export const authClient = {
  getToken() {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEY);
    } catch {
      return null;
    }
  },

  getStoredUser() {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setSession(token, user) {
    try {
      if (token) localStorage.setItem(AUTH_STORAGE_KEY, token);
      if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to persist auth session:', e);
    }
  },

  clearSession() {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear auth session:', e);
    }
  },

  /**
   * Submit credentials to login endpoint
   * @param {{ username: string, password: string }} credentials
   */
  async login({ username, password }) {
    if (!username || !password) {
      return {
        success: false,
        error: 'Please enter both username/email and password.'
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // If the server returns HTML it means the backend API isn't running
      // (Nginx serving the SPA index.html as a fallback for /api/* routes)
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        console.error('[authClient] /api/auth/login returned non-JSON response. Backend server may not be running. Status:', response.status);
        return {
          success: false,
          error: 'Authentication service is unavailable. Please contact the system administrator.'
        };
      }

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        return {
          success: false,
          error: data?.error || 'Unable to sign in. Check your details and try again.'
        };
      }

      this.setSession(data.token, data.user);

      return {
        success: true,
        user: data.user,
        token: data.token
      };
    } catch (err) {
      if (err.name === 'AbortError') {
        return {
          success: false,
          error: 'Sign-in request timed out. Please check your network and try again.'
        };
      }
      return {
        success: false,
        error: 'Unable to connect to authentication service. Please try again.'
      };
    }
  },

  /**
   * Verify active session
   */
  async getProfile() {
    const token = this.getToken();
    if (!token) {
      return { success: false, user: null };
    }

    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        this.clearSession();
        return { success: false, user: null };
      }

      const data = await response.json();
      if (data?.success && data?.user) {
        this.setSession(token, data.user);
        return { success: true, user: data.user };
      }

      this.clearSession();
      return { success: false, user: null };
    } catch {
      // If network fails offline, keep cached user if present
      const stored = this.getStoredUser();
      return { success: !!stored, user: stored };
    }
  },

  /**
   * Terminate session
   */
  async logout() {
    const token = this.getToken();
    this.clearSession();

    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
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
