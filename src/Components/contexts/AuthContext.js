import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const decodeJWT = (token) => {
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('JWT decoding error:', e);
    return null;
  }
};

const isTokenExpired = (decodedToken) => {
  return !decodedToken || (decodedToken.exp && decodedToken.exp < Date.now() / 1000);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  }, [navigate]);

  const login = useCallback(async (credentials) => {
    try {
      const response = await fetch('https://alvins.pythonanywhere.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      
      if (!data.token) {
        throw new Error('No token received');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      
      // If user data is included in the response, use it
      if (data.user) {
        setUser(data.user);
      } else {
        // Otherwise fetch user data separately
        const decoded = decodeJWT(data.token);
        if (decoded?.user_id) {
          const userRes = await fetch(`https://alvins.pythonanywhere.com/api/users/${decoded.user_id}`, {
            headers: { 'Authorization': `Bearer ${data.token}` }
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData);
          }
        }
      }

      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      };
    }
  }, []);

  // Initialize auth state on mount and token changes
  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      const decoded = decodeJWT(token);
      if (isTokenExpired(decoded)) {
        logout();
        return;
      }

      try {
        const userRes = await fetch(`https://alvins.pythonanywhere.com/api/users/${decoded.user_id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!userRes.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userRes.json();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token, logout]);

  // Auto-logout when token expires
  useEffect(() => {
    if (!token) return;

    const decoded = decodeJWT(token);
    if (!decoded?.exp) return;

    const expiresIn = (decoded.exp * 1000) - Date.now();
    if (expiresIn <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => {
      logout();
    }, expiresIn);

    return () => clearTimeout(timer);
  }, [token, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        setUser
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};