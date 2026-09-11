import React, { createContext, useContext, useEffect, useState } from 'react';
import { getBackendUrl } from '@/lib/backend-config';

interface User {
  id: number;
  email: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const response = await fetch(`${getBackendUrl()}/auth/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  // Resolve the session on mount (replaces onAuthStateChanged).
  useEffect(() => {
    let isMounted = true;

    const boot = async () => {
      try {
        const response = await fetch(`${getBackendUrl()}/auth/me`, {
          credentials: 'include',
        });
        if (isMounted) {
          if (response.ok) {
            const data = await response.json();
            setUser(data.user ?? null);
          } else {
            setUser(null);
          }
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    boot();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${getBackendUrl()}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const err = new Error(data.error || 'Email sau parolă incorectă') as Error & { code?: string };
      err.code = data.error ? undefined : 'auth/invalid-credential';
      throw err;
    }

    setUser(data.user ?? null);
  };

  const logout = async () => {
    try {
      await fetch(`${getBackendUrl()}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setUser(null);
    }
  };

  const signup = async (email: string, password: string) => {
    const response = await fetch(`${getBackendUrl()}/auth/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const err = new Error(data.error || 'A apărut o eroare la înregistrare.') as Error & { code?: string };
      err.code = data.error ? undefined : 'auth/unknown';
      throw err;
    }

    setUser(data.user ?? null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    refresh,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
