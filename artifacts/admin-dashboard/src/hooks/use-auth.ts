import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'callverify_admin_password';

interface AuthContextValue {
  password: string | null;
  isAuthenticated: boolean;
  login: (pwd: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  password: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthState(): AuthContextValue {
  const [password, setPassword] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY),
  );

  // Keep in sync if another tab logs out
  useEffect(() => {
    const handler = () =>
      setPassword(localStorage.getItem(STORAGE_KEY));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const login = (pwd: string) => {
    localStorage.setItem(STORAGE_KEY, pwd);
    setPassword(pwd);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPassword(null);
  };

  return { password, isAuthenticated: !!password, login, logout };
}
