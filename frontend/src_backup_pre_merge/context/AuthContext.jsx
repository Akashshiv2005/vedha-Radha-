import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { authClient } from '../api/authClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authClient.getStoredUser());
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function checkExistingSession() {
      try {
        const result = await authClient.getProfile();
        if (isMounted) {
          if (result.success && result.user) {
            setUser(result.user);
          } else {
            setUser(null);
          }
        }
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    checkExistingSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    setAuthError(null);
    const result = await authClient.login(credentials);
    if (result.success) {
      setUser(result.user);
      return { success: true, user: result.user };
    } else {
      setAuthError(result.error);
      return { success: false, error: result.error };
    }
  };

  const logout = async () => {
    await authClient.logout();
    setUser(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authError,
        setAuthError,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Route Guard to protect admin routes from unauthorized access
 */
export function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center font-admin-body">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#651F2B] border-t-transparent animate-spin" />
          <p className="text-[14px] font-admin-heading text-[#651F2B] tracking-wide font-semibold">
            Verifying staff credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to /admin/login with returnUrl
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/admin/login?returnUrl=${returnUrl}`} replace />;
  }

  return children;
}
