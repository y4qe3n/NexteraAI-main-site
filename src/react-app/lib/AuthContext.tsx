import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeRole(role?: string | null): string {
  if (!role) return 'admin';
  if (role === 'org-employee') return 'employee';
  if (role === 'org-manager' || role === 'org-owner') return 'admin';
  return role;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch('/api/users/me', {
          credentials: 'include',
        });

        if (!res.ok) {
          setAdmin(null);
          return;
        }

        const data = await res.json();
        const sessionUser = {
          id: data.id,
          email: data.email,
          name: data.google_user_data?.name || data.name || data.username || data.email,
          role: normalizeRole(data.role),
        };

        setAdmin(sessionUser);
      } catch {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/email-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Login failed: ${res.status}`);
    }

    const me = await fetch('/api/users/me', {
      credentials: 'include',
    });

    if (!me.ok) {
      throw new Error('Login succeeded but session could not be loaded');
    }

    const sessionData = await me.json();
    const sessionUser = {
      id: sessionData.id,
      email: sessionData.email,
      name: sessionData.google_user_data?.name || sessionData.name || sessionData.username || sessionData.email,
      role: normalizeRole(sessionData.role),
    };

    setAdmin(sessionUser);
  };

  const logout = async () => {
    await fetch('/api/logout', {
      credentials: 'include',
    }).catch(() => undefined);

    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token: null, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
