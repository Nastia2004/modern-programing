import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createApiClient } from '../api/client.js';

const TOKEN_KEY = 'lab3_auth_token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(token));
  const [error, setError] = useState('');

  useEffect(() => {
    let ignored = false;

    async function restoreSession() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const api = createApiClient(token);
        const data = await api.me();

        if (!ignored) {
          setUser(data.user);
          setError('');
        }
      } catch (requestError) {
        if (!ignored) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
          setError('Saved session expired. Please log in again.');
        }
      } finally {
        if (!ignored) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      ignored = true;
    };
  }, [token]);

  async function login(credentials) {
    setError('');
    const api = createApiClient();
    const data = await api.login(credentials);

    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);

    return data.user;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setError('');
  }

  const value = useMemo(
    () => ({
      token,
      user,
      error,
      login,
      logout,
      isLoading,
      isAuthenticated: Boolean(token && user)
    }),
    [token, user, error, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
