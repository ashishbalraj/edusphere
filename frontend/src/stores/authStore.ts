import { create } from 'zustand';
import type { User } from '@/types';
import authService from '@/services/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { access_token, refresh_token } = await authService.login({ email, password });
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      const user = await authService.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (email, password, fullName, role) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register({
        email,
        password,
        full_name: fullName,
        role: role as User['role'],
      });
      // Auto-login after successful registration
      const { access_token, refresh_token } = await authService.login({ email, password });
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      const user = await authService.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    if (!authService.isAuthenticated()) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    set({ isLoading: true });
    try {
      const user = await authService.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  clearError: () => set({ error: null }),
}));
