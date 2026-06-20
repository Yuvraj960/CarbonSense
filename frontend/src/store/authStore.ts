import { create } from 'zustand';
import type { User } from '../types';
import { authApi } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('carbonsense_token'),
  isAuthenticated: !!localStorage.getItem('carbonsense_token'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    const res = await authApi.login({ email, password });
    const { token, user } = res.data;
    localStorage.setItem('carbonsense_token', token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    const res = await authApi.register({ name, email, password });
    const { token, user } = res.data;
    localStorage.setItem('carbonsense_token', token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('carbonsense_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    try {
      const res = await authApi.getMe();
      set({ user: res.data.user, isAuthenticated: true });
    } catch {
      get().logout();
    }
  },

  updateUser: (updates) => {
    const current = get().user;
    if (current) set({ user: { ...current, ...updates } });
  },
}));
