import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { customerAuthClient } from '../api/customerAuthClient';

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => customerAuthClient.getStoredCustomer());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshCustomer = useCallback(async () => {
    try {
      const result = await customerAuthClient.getProfile();
      if (result.success && result.customer) {
        setCustomer(result.customer);
      } else {
        setCustomer(null);
      }
    } catch {
      setCustomer(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function checkExistingSession() {
      try {
        const result = await customerAuthClient.getProfile();
        if (isMounted) {
          if (result.success && result.customer) {
            setCustomer(result.customer);
          } else {
            setCustomer(null);
          }
        }
      } catch {
        if (isMounted) setCustomer(null);
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
    setError(null);
    const result = await customerAuthClient.login(credentials);
    if (result.success) {
      setCustomer(result.customer);
      return { success: true, customer: result.customer };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  };

  const register = async (data) => {
    setError(null);
    const result = await customerAuthClient.register(data);
    return result;
  };

  const updateProfile = async (profileData) => {
    setError(null);
    const result = await customerAuthClient.updateProfile(profileData);
    if (result.success && result.customer) {
      setCustomer(result.customer);
    }
    return result;
  };

  const changePassword = async (passwords) => {
    return await customerAuthClient.changePassword(passwords);
  };

  const logout = async () => {
    await customerAuthClient.logout();
    setCustomer(null);
    setError(null);
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
        isLoading,
        error,
        setError,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        refreshCustomer
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}

