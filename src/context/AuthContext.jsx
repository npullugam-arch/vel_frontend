import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "veltrixix_admin_auth";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn("Saved sign-in could not be restored; public access remains available.");
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* Public pages must work without storage. */ }
      return null;
    }
  });

  const login = (payload) => {
    setAuth(payload);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch { /* Keep this session in memory. */ }
  };

  const logout = () => {
    setAuth(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be blocked. */ }
  };

  const value = useMemo(
    () => ({
      auth,
      token: auth?.token || "",
      user: auth || null,
      isAuthenticated: !!auth?.token,
      login,
      logout,
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}