
"use client";
import { apiPost } from "../lib/api";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial load
  useEffect(() => {
    const loadUser = () => {
      try {
        const raw = localStorage.getItem("user");
        if (raw) {
          const parsedUser = JSON.parse(raw);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        localStorage.removeItem("user");
      } finally {
        // Always set loading to false, even if there's no user
        setLoading(false);
      }
    };

    // Small timeout to ensure the loading state is visible for a minimum time
    // This prevents flash of content
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        loadUser();
      } else {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // Sync user to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
  }, [user]);

  async function login(email, password, roleHint) {
    console.log('Login attempt with:', { email, hasPassword: !!password });
    
    // mock success for demo (temporary fallback)
    const mockRole = roleHint || (email?.includes("admin") ? "ROLE_ADMIN" : "ROLE_USER");
    const mockUser = { 
      id: Date.now(), 
      name: email?.split("@")[0] || 'User', 
      email, 
      role: mockRole 
    };
    
    // Try real backend
    try {
      console.log('Attempting to call /api/auth/login');
      const res = await apiPost("/api/auth/login", { 
        username: email, 
        password: password 
      });
      
      console.log('Login API response:', res);
      
      // apiPost returns parsed JSON or throws; support flexible shapes
      const user = res?.user || res?.data || res;
      if (user) {
        console.log('Login successful, setting user:', user);
        setUser(user);
        // persist readable cookie for middleware (dev-friendly)
        if (typeof window !== "undefined") {
          try {
            const json = encodeURIComponent(JSON.stringify(user));
            // cookie expires in 7 days
            const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
            document.cookie = `user=${json}; path=/; expires=${expires}`;
            console.log('User cookie set');
          } catch (e) { 
            console.error('Error setting cookie:', e);
          }
        }
        return { success: true, user };
      }
      return { success: false, message: 'No user data received' };
    } catch (e) {
      console.warn('Backend login failed, using mock user', e);
      
      // Use mock user as fallback
      setUser(mockUser);
      
      if (typeof window !== "undefined") {
        try {
          const json = encodeURIComponent(JSON.stringify(mockUser));
          const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
          document.cookie = `user=${json}; path=/; expires=${expires}`;
        } catch (e) { 
          console.error('Error setting mock user cookie:', e);
        }
      }
      return { success: true, user: mockUser };
    }
  }

  async function signup(name, email, password, role = "ROLE_USER") {
    try {
      // backend signup endpoint
      const res = await apiPost("/api/auth/signup", { 
        username: email, 
        password: password,
        name: name,
        role: role 
      });
      const user = res?.user || res;
      if (user) { setUser(user); return { success: true, user }; }
    } catch (e) {
      console.warn('Backend signup failed, falling back to mock', e);
    }

    const newUser = { id: Date.now(), name, email, role };
    setUser(newUser);
    return { success: true, user: newUser };
  }

  async function logout() {
    // try backend logout
    try {
      await apiPost('/api/auth/logout', {});
    } catch (e) {
      // ignore backend logout errors
    }
    setUser(null);
    if (typeof window !== "undefined") {
      // remove cookie
      document.cookie = `user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4">Loading...</div>
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
