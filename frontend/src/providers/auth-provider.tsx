'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { api, setAccessToken } from '@/lib/api';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!stored) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setAccessToken(stored);
      const { data } = await api.get('/users/me');
      setUser(data.data);
    } catch {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('accessToken');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAccessToken(data.data.accessToken);
      localStorage.setItem('accessToken', data.data.accessToken);
      setUser(data.data.user);
      return data.data.user as User;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error('Backend is offline. Double-click START-TECHLOOM.bat in the techloom folder.');
        }
        throw new Error(error.response.data?.message || 'Invalid email or password');
      }
      throw error;
    }
  };

  const register = async (formData: { name: string; email: string; password: string }) => {
    const { data } = await api.post('/auth/register', formData);
    setAccessToken(data.data.accessToken);
    localStorage.setItem('accessToken', data.data.accessToken);
    setUser(data.data.user);
    return data.data.user as User;
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}